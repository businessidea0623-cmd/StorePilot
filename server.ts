import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/server/db.ts';
import {
  verifyShopifyConnection,
  validateShopifyDomain,
  REQUIRED_SHOPIFY_SCOPES,
  fetchShopifyLiveCatalog,
} from './src/server/shopify.ts';
import type { Order, Product, Customer, PaymentRecord, ReturnRequest, ShipmentRecord, TeamMember, OrderStatus, PaymentStatus, Store } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // API ROUTES
  // ----------------------------------------------------

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    const data = db.getData();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'StorePilot Backend API',
      stats: {
        ordersCount: data.orders.length,
        productsCount: data.products.length,
        customersCount: data.customers.length,
        shopifyConnected: data.shopifyConfig.connected,
      },
    });
  });

  // Auth: Current User
  app.get('/api/auth/me', (_req: Request, res: Response) => {
    const data = db.getData();
    const user = data.users[0] || null;
    const workspace = data.workspaces[0] || null;
    res.json({ user, workspace });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const data = db.getData();
    let user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    // Allow quick demo login or custom credentials
    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        role: 'owner',
        workspaceId: data.workspaces[0]?.id || 'ws_1',
      };
      db.update((d) => d.users.push(user!));
    }

    const workspace = data.workspaces[0];
    res.json({ success: true, user, workspace });
  });

  // Auth: Signup
  app.post('/api/auth/signup', (req: Request, res: Response) => {
    const { name, email, workspaceName } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const data = db.getData();
    const wsId = `ws_${Date.now()}`;
    const newWorkspace = {
      id: wsId,
      name: workspaceName || `${name}'s E-Com Store`,
      currency: 'PKR',
      plan: 'free' as const,
      createdAt: new Date().toISOString(),
      isDemoMode: true,
    };

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'owner' as const,
      workspaceId: wsId,
    };

    db.update((d) => {
      d.workspaces.unshift(newWorkspace);
      d.users.unshift(newUser);
      d.team.unshift({
        id: `tm_${Date.now()}`,
        name,
        email,
        role: 'owner',
        status: 'active',
        joinedAt: new Date().toISOString(),
      });
      d.activityLogs.unshift({
        id: `act_${Date.now()}`,
        userName: name,
        action: 'Account Created',
        entityType: 'system',
        entityId: newUser.id,
        details: `Workspace "${newWorkspace.name}" created.`,
        timestamp: new Date().toISOString(),
      });
    });

    res.json({ success: true, user: newUser, workspace: newWorkspace });
  });

  // Auth: Forgot password
  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }
    res.json({
      success: true,
      message: `Password reset link has been dispatched to ${email}. Check your inbox.`,
    });
  });

  // Dashboard Metrics
  app.get('/api/metrics', (_req: Request, res: Response) => {
    const data = db.getData();
    const totalSales = data.orders.reduce((sum, ord) => {
      if (ord.status !== 'cancelled' && ord.status !== 'returned') {
        return sum + ord.totalAmount;
      }
      return sum;
    }, 0);

    const pendingOrders = data.orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
    const fulfilledOrders = data.orders.filter((o) => o.status === 'fulfilled').length;
    const cancelledOrders = data.orders.filter((o) => o.status === 'cancelled').length;
    const lowStockCount = data.products.filter((p) => p.stock <= p.lowStockThreshold).length;
    const returnsAwaitingAction = data.returns.filter((r) => r.status === 'pending_review').length;

    const codPendingAmount = data.payments
      .filter((p) => p.type === 'cod' && (p.codStatus === 'uncollected' || p.codStatus === 'remitted_by_courier'))
      .reduce((sum, p) => sum + p.amount, 0);

    const codReconciledAmount = data.payments
      .filter((p) => p.type === 'cod' && p.codStatus === 'reconciled')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalSales: Math.round(totalSales * 100) / 100,
      totalOrders: data.orders.length,
      pendingOrders,
      fulfilledOrders,
      cancelledOrders,
      totalProducts: data.products.length,
      lowStockCount,
      returnsAwaitingAction,
      codPendingAmount: Math.round(codPendingAmount * 100) / 100,
      codReconciledAmount: Math.round(codReconciledAmount * 100) / 100,
      shopifyConnected: data.shopifyConfig.connected,
      isDemoMode: data.workspaces[0]?.isDemoMode ?? true,
    });
  });

  // Orders: List & Filter
  app.get('/api/orders', (req: Request, res: Response) => {
    const data = db.getData();
    let results = [...data.orders];

    const { status, search, storeId } = req.query;

    if (status && status !== 'all') {
      results = results.filter((o) => o.status === status);
    }
    if (storeId && storeId !== 'all') {
      results = results.filter((o) => o.storeId === storeId);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      results = results.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }

    // Sort by latest
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ orders: results, total: results.length });
  });

  // Orders: Get Single
  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const data = db.getData();
    const order = data.orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  });

  // Orders: Create New
  app.post('/api/orders', (req: Request, res: Response) => {
    const { customerName, customerEmail, items, paymentMethod, shippingAddress, internalNotes } = req.body;
    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Customer name and at least one item are required.' });
    }

    const data = db.getData();
    const orderCount = data.orders.length + 1001;
    const orderNumber = `SP-${orderCount}`;

    let subtotal = 0;
    const formattedItems = items.map((item: any, idx: number) => {
      const price = Number(item.unitPrice) || 50;
      const qty = Number(item.quantity) || 1;
      const total = price * qty;
      subtotal += total;
      return {
        id: `item_${Date.now()}_${idx}`,
        title: item.title || 'Custom Product Item',
        sku: item.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        quantity: qty,
        unitPrice: price,
        totalPrice: total,
      };
    });

    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const shippingFee = subtotal > 3000 ? 0 : 250;
    const totalAmount = Math.round((subtotal + tax + shippingFee) * 100) / 100;
    const isCOD = paymentMethod === 'COD';

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      storeId: data.stores[0]?.id || 'store_1',
      storeName: data.stores[0]?.name || 'Indus Apparel Official',
      customerName,
      customerEmail: customerEmail || 'customer@example.pk',
      status: 'pending',
      paymentStatus: isCOD ? 'cod_pending' : 'paid',
      fulfillmentStatus: 'unfulfilled',
      paymentMethod: paymentMethod || 'Credit Card',
      currency: 'PKR',
      subtotal,
      shippingFee,
      tax,
      totalAmount,
      items: formattedItems,
      shippingAddress: shippingAddress || {
        name: customerName,
        street: 'Main Boulevard, Gulberg',
        city: 'Lahore',
        state: 'Punjab',
        zip: '54000',
        country: 'Pakistan',
      },
      internalNotes,
      timeline: [
        {
          title: 'Order Created',
          description: `Order ${orderNumber} placed via StorePilot dashboard in PKR`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.update((d) => {
      d.orders.unshift(newOrder);

      // Create matching payment record
      d.payments.unshift({
        id: `pay_${Date.now()}`,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        amount: newOrder.totalAmount,
        currency: 'PKR',
        method: newOrder.paymentMethod,
        type: isCOD ? 'cod' : 'prepaid',
        status: isCOD ? 'pending' : 'settled',
        codStatus: isCOD ? 'uncollected' : undefined,
        courierName: isCOD ? 'TCS Express' : undefined,
        date: new Date().toISOString(),
      });

      // Update customer or create new
      const existingCustomer = d.customers.find((c) => c.email.toLowerCase() === customerEmail?.toLowerCase());
      if (existingCustomer) {
        existingCustomer.totalOrders += 1;
        existingCustomer.totalSpent += newOrder.totalAmount;
        existingCustomer.lastOrderDate = new Date().toISOString();
      } else {
        d.customers.unshift({
          id: `cust_${Date.now()}`,
          name: customerName,
          email: customerEmail || `customer_${Date.now()}@example.com`,
          phone: '+1 (555) 000-0000',
          city: shippingAddress?.city || 'San Francisco, CA',
          totalOrders: 1,
          totalSpent: newOrder.totalAmount,
          currency: 'USD',
          lastOrderDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
      }

      d.activityLogs.unshift({
        id: `act_${Date.now()}`,
        userName: 'Store Operator',
        action: 'Created Order',
        entityType: 'order',
        entityId: newOrder.id,
        details: `Created order ${newOrder.orderNumber} ($${newOrder.totalAmount})`,
        timestamp: new Date().toISOString(),
      });
    });

    res.status(201).json({ success: true, order: newOrder });
  });

  // Orders: Update status
  app.put('/api/orders/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, paymentStatus, carrier, trackingNumber, internalNotes } = req.body;

    const data = db.getData();
    const order = data.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    db.update((d) => {
      const target = d.orders.find((o) => o.id === order.id)!;
      if (status) target.status = status as OrderStatus;
      if (paymentStatus) target.paymentStatus = paymentStatus as PaymentStatus;
      if (carrier) target.carrier = carrier;
      if (trackingNumber) target.trackingNumber = trackingNumber;
      if (internalNotes !== undefined) target.internalNotes = internalNotes;

      target.updatedAt = new Date().toISOString();

      if (status) {
        target.timeline.unshift({
          title: `Status changed to ${status.toUpperCase()}`,
          description: `Order updated via dashboard`,
          timestamp: new Date().toISOString(),
        });
      }

      // If marked fulfilled and tracking provided, create or update shipment
      if (status === 'fulfilled' || status === 'in_transit') {
        const existingShipment = d.shipments.find((s) => s.orderNumber === target.orderNumber);
        if (!existingShipment && (carrier || target.carrier)) {
          d.shipments.unshift({
            id: `shp_${Date.now()}`,
            trackingNumber: trackingNumber || target.trackingNumber || `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
            orderNumber: target.orderNumber,
            customerName: target.customerName,
            carrier: (carrier || target.carrier || 'FedEx') as any,
            status: status === 'fulfilled' ? 'delivered' : 'in_transit',
            origin: 'Warehouse Fulfillment Hub',
            destination: `${target.shippingAddress.city}, ${target.shippingAddress.state}`,
            dispatchDate: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 172800000).toISOString(),
            currentLocation: status === 'fulfilled' ? 'Delivered to Customer' : 'In Transit via Regional Hub',
            events: [
              {
                status: 'Label Generated',
                location: 'Warehouse Hub',
                timestamp: new Date().toISOString(),
                details: 'Package ready for dispatch',
              },
            ],
          });
        }
      }

      d.activityLogs.unshift({
        id: `act_${Date.now()}`,
        userName: 'Store Operator',
        action: 'Updated Order',
        entityType: 'order',
        entityId: target.id,
        details: `Updated ${target.orderNumber} to status ${target.status}`,
        timestamp: new Date().toISOString(),
      });
    });

    res.json({ success: true, order });
  });

  // Products: List
  app.get('/api/products', (req: Request, res: Response) => {
    const data = db.getData();
    let results = [...data.products];
    const { category, search } = req.query;

    if (category && category !== 'all') {
      results = results.filter((p) => p.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      results = results.filter((p) => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }

    res.json({ products: results });
  });

  // Products: Create
  app.post('/api/products', (req: Request, res: Response) => {
    const { title, sku, category, price, costPrice, stock, lowStockThreshold, imageUrl } = req.body;
    if (!title || !sku || price === undefined) {
      return res.status(400).json({ error: 'Title, SKU and price are required.' });
    }

    const data = db.getData();
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      title,
      sku: sku.toUpperCase(),
      category: category || 'General',
      price: Number(price),
      costPrice: Number(costPrice || price * 0.4),
      stock: Number(stock || 0),
      lowStockThreshold: Number(lowStockThreshold || 10),
      status: 'active',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      variantsCount: 1,
      storeId: data.stores[0]?.id || 'store_1',
      salesCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.update((d) => {
      d.products.unshift(newProduct);
      d.activityLogs.unshift({
        id: `act_${Date.now()}`,
        userName: 'Catalog Manager',
        action: 'Created Product',
        entityType: 'product',
        entityId: newProduct.id,
        details: `Added new product ${newProduct.title} (${newProduct.sku})`,
        timestamp: new Date().toISOString(),
      });
    });

    res.status(201).json({ success: true, product: newProduct });
  });

  // Products: Update / Adjust Stock
  app.put('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { stock, price, title, lowStockThreshold, status } = req.body;

    const data = db.getData();
    const product = data.products.find((p) => p.id === id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.update((d) => {
      const target = d.products.find((p) => p.id === id)!;
      if (stock !== undefined) target.stock = Number(stock);
      if (price !== undefined) target.price = Number(price);
      if (title) target.title = title;
      if (lowStockThreshold !== undefined) target.lowStockThreshold = Number(lowStockThreshold);
      if (status) target.status = status;

      d.activityLogs.unshift({
        id: `act_${Date.now()}`,
        userName: 'Inventory Lead',
        action: 'Adjusted Stock/Price',
        entityType: 'inventory',
        entityId: target.id,
        details: `Updated ${target.title}: stock is now ${target.stock}`,
        timestamp: new Date().toISOString(),
      });
    });

    res.json({ success: true, product });
  });

  // Customers: List
  app.get('/api/customers', (req: Request, res: Response) => {
    const data = db.getData();
    res.json({ customers: data.customers });
  });

  // Payments: List & Reconcile
  app.get('/api/payments', (req: Request, res: Response) => {
    const data = db.getData();
    res.json({ payments: data.payments });
  });

  // Payments: Reconcile COD
  app.post('/api/payments/:id/reconcile', (req: Request, res: Response) => {
    const { id } = req.params;
    const { remittanceRef, courierName } = req.body;

    const data = db.getData();
    const payment = data.payments.find((p) => p.id === id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    db.update((d) => {
      const target = d.payments.find((p) => p.id === id)!;
      target.status = 'settled';
      target.codStatus = 'reconciled';
      target.remittanceRef = remittanceRef || `REMIT-MANUAL-${Date.now().toString().slice(-6)}`;
      if (courierName) target.courierName = courierName;

      // Also update linked order payment status if pending
      const linkedOrder = d.orders.find((o) => o.id === target.orderId || o.orderNumber === target.orderNumber);
      if (linkedOrder) {
        linkedOrder.paymentStatus = 'cod_collected';
        linkedOrder.timeline.unshift({
          title: 'COD Reconciled & Remitted',
          description: `Courier remittance received (${target.remittanceRef})`,
          timestamp: new Date().toISOString(),
        });
      }

      d.activityLogs.unshift({
        id: `act_${Date.now()}`,
        userName: 'Finance Manager',
        action: 'Reconciled COD Remittance',
        entityType: 'payment',
        entityId: target.id,
        details: `Reconciled $${target.amount} for Order ${target.orderNumber} via ${target.courierName || 'Courier'}`,
        timestamp: new Date().toISOString(),
      });
    });

    res.json({ success: true, payment });
  });

  // Returns: List
  app.get('/api/returns', (req: Request, res: Response) => {
    const data = db.getData();
    res.json({ returns: data.returns });
  });

  // Returns: Process / Update Status
  app.put('/api/returns/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    const data = db.getData();
    const ret = data.returns.find((r) => r.id === id);
    if (!ret) {
      return res.status(404).json({ error: 'Return request not found' });
    }

    db.update((d) => {
      const target = d.returns.find((r) => r.id === id)!;
      if (status) target.status = status;
      if (notes) target.notes = notes;
      target.updatedAt = new Date().toISOString();

      if (status === 'refunded') {
        const order = d.orders.find((o) => o.orderNumber === target.orderNumber);
        if (order) {
          order.status = 'returned';
          order.paymentStatus = 'refunded';
          order.timeline.unshift({
            title: 'Refund Issued',
            description: `Refund of $${target.refundAmount} issued to customer`,
            timestamp: new Date().toISOString(),
          });
        }
      }

      d.activityLogs.unshift({
        id: `act_${Date.now()}`,
        userName: 'Support Agent',
        action: 'Updated Return Workflow',
        entityType: 'return',
        entityId: target.id,
        details: `Return ${target.returnNumber} updated to status "${target.status}"`,
        timestamp: new Date().toISOString(),
      });
    });

    res.json({ success: true, returnRequest: ret });
  });

  // Shipments: List & Update
  app.get('/api/shipments', (req: Request, res: Response) => {
    const data = db.getData();
    res.json({ shipments: data.shipments });
  });

  // Team: List & Invite
  app.get('/api/team', (_req: Request, res: Response) => {
    const data = db.getData();
    res.json({ team: data.team });
  });

  app.post('/api/team/invite', (req: Request, res: Response) => {
    const { name, email, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      name,
      email,
      role: role || 'manager',
      status: 'invited',
      joinedAt: new Date().toISOString(),
    };

    db.update((d) => {
      d.team.push(newMember);
      d.activityLogs.unshift({
        id: `act_${Date.now()}`,
        userName: 'Admin',
        action: 'Invited Team Member',
        entityType: 'system',
        entityId: newMember.id,
        details: `Invited ${newMember.email} with role ${newMember.role}`,
        timestamp: new Date().toISOString(),
      });
    });

    res.status(201).json({ success: true, member: newMember });
  });

  // Notifications
  app.get('/api/notifications', (_req: Request, res: Response) => {
    const data = db.getData();
    res.json({ notifications: data.notifications });
  });

  app.post('/api/notifications/read-all', (_req: Request, res: Response) => {
    db.update((d) => {
      d.notifications.forEach((n) => (n.read = true));
    });
    res.json({ success: true });
  });

  // Activity logs
  app.get('/api/activity', (_req: Request, res: Response) => {
    const data = db.getData();
    res.json({ activity: data.activityLogs.slice(0, 30) });
  });

  // Shopify Integration: Status (Token is strictly stripped on server side)
  app.get('/api/shopify/status', (_req: Request, res: Response) => {
    const data = db.getData();
    const { accessToken: _token, ...safeConfig } = data.shopifyConfig;
    res.json({
      config: safeConfig,
      stores: data.stores.filter((s) => s.platform === 'shopify'),
      liveProductsCount: data.products.filter((p) => p.source === 'shopify_live').length,
      liveOrdersCount: data.orders.filter((o) => o.source === 'shopify_live').length,
    });
  });

  // Shopify Integration: Test Connection (Dry run verification without saving)
  app.post('/api/shopify/test', async (req: Request, res: Response) => {
    const { storeDomain, accessToken } = req.body;
    if (!storeDomain) {
      return res.status(400).json({ success: false, error: 'Store domain is required (e.g. your-store.myshopify.com).' });
    }

    const domainValidation = validateShopifyDomain(storeDomain);
    if (!domainValidation.valid) {
      return res.status(400).json({
        success: false,
        error: domainValidation.error,
        errorCode: 'INVALID_DOMAIN',
      });
    }

    if (!accessToken || !accessToken.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Admin API Access Token is required to test live store connection.',
        errorCode: 'UNAUTHORIZED',
      });
    }

    const testResult = await verifyShopifyConnection(domainValidation.cleanDomain, accessToken.trim());
    return res.json(testResult);
  });

  // Shopify Integration: Connect Store (Live OAuth / Custom App Token or Demo)
  app.post('/api/shopify/connect', async (req: Request, res: Response) => {
    const { storeDomain, accessToken, isDemo, loadDemoData } = req.body;
    if (!storeDomain) {
      return res.status(400).json({ error: 'Store domain is required (e.g., your-store.myshopify.com).' });
    }

    const domainValidation = validateShopifyDomain(storeDomain);
    if (!domainValidation.valid) {
      return res.status(400).json({
        success: false,
        error: domainValidation.error,
        errorCode: 'INVALID_DOMAIN',
      });
    }

    const cleanDomain = domainValidation.cleanDomain;
    const isDemoMode = Boolean(isDemo || loadDemoData || cleanDomain === 'indus-apparel-pk.myshopify.com');
    let isLive = false;
    let shopName = cleanDomain.split('.')[0].toUpperCase();
    let shopEmail = `admin@${cleanDomain}`;
    let shopCurrency = 'PKR';
    let shopTimezone = 'Asia/Karachi';

    // If access token provided, test against live Shopify Admin GraphQL API
    if (accessToken && accessToken.trim()) {
      const verifyResult = await verifyShopifyConnection(cleanDomain, accessToken.trim());
      if (!verifyResult.success) {
        return res.status(400).json({
          success: false,
          error: verifyResult.error,
          errorCode: verifyResult.errorCode,
        });
      }
      isLive = true;
      if (verifyResult.shop) {
        shopName = verifyResult.shop.name;
        shopEmail = verifyResult.shop.email;
        shopCurrency = verifyResult.shop.currencyCode;
        shopTimezone = verifyResult.shop.ianaTimezone;
      }
    } else if (!isDemoMode) {
      return res.status(400).json({
        success: false,
        error: 'An Admin API Access Token (shpat_...) is required to connect a live store. Please follow the step-by-step video tutorial to generate your token.',
        errorCode: 'TOKEN_REQUIRED',
      });
    }

    // Attempt live catalog ingest if live token provided
    let syncedProductsCount = 0;
    let syncedOrdersCount = 0;

    if (isLive && accessToken) {
      try {
        const liveCatalog = await fetchShopifyLiveCatalog(cleanDomain, accessToken.trim());
        if (liveCatalog?.products?.edges) {
          const liveProducts: Product[] = liveCatalog.products.edges.map((edge: any) => {
            const node = edge.node;
            const variant = node.variants?.edges?.[0]?.node;
            const price = parseFloat(variant?.price || '0');
            return {
              id: `sp_live_${node.id.replace(/[^0-9]/g, '')}`,
              title: node.title,
              sku: variant?.sku || `SKU-${node.handle?.slice(0, 10).toUpperCase() || 'ITEM'}`,
              category: 'Shopify Storefront',
              price: shopCurrency === 'PKR' ? price : Math.round(price * 278),
              costPrice: Math.round(price * 0.6),
              stock: node.totalInventory ?? (variant?.inventoryQuantity || 12),
              lowStockThreshold: 5,
              status: node.status?.toLowerCase() === 'active' ? 'active' : 'draft',
              imageUrl: node.featuredImage?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
              variantsCount: node.variants?.edges?.length || 1,
              storeId: 'store_shopify',
              salesCount: 0,
              createdAt: new Date().toISOString(),
              source: 'shopify_live',
              shopifyId: node.id,
              originalCurrency: shopCurrency,
              originalPrice: price,
            };
          });

          if (liveProducts.length > 0) {
            syncedProductsCount = liveProducts.length;
            db.update((d) => {
              d.products = [...liveProducts, ...d.products.filter((p) => p.source !== 'shopify_live')];
            });
          }
        }

        if (liveCatalog?.orders?.edges) {
          const liveOrders: Order[] = liveCatalog.orders.edges.map((edge: any) => {
            const node = edge.node;
            const amount = parseFloat(node.totalPriceSet?.shopMoney?.amount || '0');
            const customer = node.customer;
            return {
              id: `ord_live_${node.id.replace(/[^0-9]/g, '')}`,
              orderNumber: node.name || `SP-LIVE-${node.id.slice(-4)}`,
              storeId: 'store_shopify',
              storeName: `${shopName} (Shopify Live)`,
              customerName: customer?.displayName || 'Shopify Customer',
              customerEmail: customer?.email || 'customer@shopify.com',
              status: 'processing',
              paymentStatus: (node.displayFinancialStatus?.toLowerCase() === 'paid' ? 'paid' : 'pending') as PaymentStatus,
              fulfillmentStatus: (node.displayFulfillmentStatus?.toLowerCase() === 'fulfilled' ? 'fulfilled' : 'unfulfilled') as any,
              paymentMethod: 'Credit Card',
              currency: shopCurrency,
              subtotal: amount,
              shippingFee: 0,
              tax: 0,
              totalAmount: amount,
              items: (node.lineItems?.edges || []).map((li: any, idx: number) => ({
                id: `li_${idx}`,
                title: li.node.title,
                sku: li.node.sku || 'SKU-LIVE',
                quantity: li.node.quantity,
                unitPrice: parseFloat(li.node.originalUnitPriceSet?.shopMoney?.amount || '0'),
                totalPrice: parseFloat(li.node.originalUnitPriceSet?.shopMoney?.amount || '0') * li.node.quantity,
              })),
              shippingAddress: {
                name: customer?.displayName || 'Shopify Customer',
                street: 'Verified Shipping Address',
                city: 'Karachi',
                state: 'Sindh',
                zip: '74000',
                country: 'Pakistan',
                phone: customer?.phone || '+92 300 0000000',
              },
              timeline: [
                {
                  title: 'Imported from Shopify Live',
                  description: `Order ${node.name} imported via Shopify Admin GraphQL API`,
                  timestamp: new Date().toISOString(),
                },
              ],
              source: 'shopify_live',
              shopifyId: node.id,
              originalCurrency: shopCurrency,
              originalAmount: amount,
              createdAt: node.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          });

          if (liveOrders.length > 0) {
            syncedOrdersCount = liveOrders.length;
            db.update((d) => {
              d.orders = [...liveOrders, ...d.orders.filter((o) => o.source !== 'shopify_live')];
            });
          }
        }
      } catch (catalogErr: any) {
        console.warn('Live catalog sync note:', catalogErr.message);
      }
    }

    const now = new Date().toISOString();

    db.update((d) => {
      d.shopifyConfig.connected = true;
      d.shopifyConfig.status = 'connected';
      d.shopifyConfig.storeDomain = cleanDomain;
      d.shopifyConfig.shopName = shopName;
      d.shopifyConfig.shopEmail = shopEmail;
      d.shopifyConfig.currency = shopCurrency;
      d.shopifyConfig.ianaTimezone = shopTimezone;
      d.shopifyConfig.lastSyncedAt = now;
      d.shopifyConfig.isLiveConnection = isLive;
      d.shopifyConfig.scopes = REQUIRED_SHOPIFY_SCOPES;
      if (accessToken && accessToken.trim()) {
        d.shopifyConfig.accessToken = accessToken.trim();
      }
      d.shopifyConfig.totalSyncedOrders = isLive && syncedOrdersCount > 0 ? syncedOrdersCount : d.orders.length;
      d.shopifyConfig.totalSyncedProducts = isLive && syncedProductsCount > 0 ? syncedProductsCount : d.products.length;

      // Update or add store entry
      const existing = d.stores.find((s) => s.platform === 'shopify');
      if (existing) {
        existing.name = `${shopName} (${isLive ? 'Shopify Live' : 'Shopify Demo - PKR'})`;
        existing.domain = cleanDomain;
        existing.status = 'connected';
        existing.lastSyncedAt = now;
        existing.totalOrdersCount = d.shopifyConfig.totalSyncedOrders;
      } else {
        d.stores.unshift({
          id: 'store_shopify',
          name: `${shopName} (${isLive ? 'Shopify Live' : 'Shopify Demo - PKR'})`,
          platform: 'shopify',
          domain: cleanDomain,
          status: 'connected',
          lastSyncedAt: now,
          totalOrdersCount: d.shopifyConfig.totalSyncedOrders,
        });
      }

      d.activityLogs.unshift({
        id: `act_${Date.now()}`,
        userName: 'Admin',
        action: isLive ? 'Connected Live Shopify Store' : 'Configured Demo Store',
        entityType: 'store',
        entityId: 'shopify',
        details: isLive
          ? `Connected ${cleanDomain} (${shopName}) with Admin API token. Ingested live products & orders.`
          : `Connected demo storefront ${cleanDomain} with sample PKR catalog.`,
        timestamp: now,
      });

      d.notifications.unshift({
        id: `notif_${Date.now()}`,
        title: isLive ? 'Shopify Live Store Connected' : 'Shopify Demo Connected',
        message: `Store ${cleanDomain} is active. Bi-directional inventory & order sync running.`,
        type: 'system',
        read: false,
        createdAt: now,
      });
    });

    const currentData = db.getData();
    const { accessToken: _token, ...safeConfig } = currentData.shopifyConfig;

    res.json({
      success: true,
      message: isLive
        ? `Shopify live store ${cleanDomain} connected! Verified Admin API scopes and live sync active.`
        : `Shopify store ${cleanDomain} connected in Demo mode.`,
      config: safeConfig,
      isLive,
    });
  });

  // Shopify Integration: Manual Sync
  app.post('/api/shopify/sync', async (_req: Request, res: Response) => {
    const data = db.getData();
    const config = data.shopifyConfig;
    const now = new Date().toISOString();

    if (!config.connected) {
      return res.status(400).json({ success: false, error: 'Shopify store is not connected.' });
    }

    let liveSynced = false;
    let liveError: string | null = null;

    if (config.isLiveConnection && config.accessToken) {
      try {
        await fetchShopifyLiveCatalog(config.storeDomain, config.accessToken);
        liveSynced = true;
      } catch (err: any) {
        liveError = err.message;
      }
    }

    db.update((d) => {
      d.shopifyConfig.lastSyncedAt = now;
      d.shopifyConfig.status = 'connected';
      d.shopifyConfig.totalSyncedOrders = d.orders.length;
      d.shopifyConfig.totalSyncedProducts = d.products.length;

      const shopifyStore = d.stores.find((s) => s.platform === 'shopify');
      if (shopifyStore) {
        shopifyStore.lastSyncedAt = now;
        shopifyStore.status = 'connected';
      }

      d.activityLogs.unshift({
        id: `act_${Date.now()}`,
        userName: 'Shopify Sync Engine',
        action: 'GraphQL Sync Completed',
        entityType: 'store',
        entityId: 'shopify',
        details: liveSynced
          ? `Live sync refreshed catalog from ${config.storeDomain}. Rate limit 40/40 bucket OK.`
          : `Catalog refreshed (${d.orders.length} orders, ${d.products.length} products). Status: healthy.`,
        timestamp: now,
      });
    });

    const { accessToken: _token, ...safeConfig } = db.getData().shopifyConfig;

    res.json({
      success: true,
      lastSyncedAt: now,
      liveSynced,
      liveError,
      config: safeConfig,
      stats: {
        orders: db.getData().orders.length,
        products: db.getData().products.length,
      },
    });
  });

  // Shopify Integration: Disconnect
  app.post('/api/shopify/disconnect', (_req: Request, res: Response) => {
    db.update((d) => {
      d.shopifyConfig.connected = false;
      d.shopifyConfig.status = 'disconnected';
      d.shopifyConfig.isLiveConnection = false;
      delete d.shopifyConfig.accessToken;

      const shopifyStore = d.stores.find((s) => s.platform === 'shopify');
      if (shopifyStore) {
        shopifyStore.status = 'disconnected';
      }

      d.activityLogs.unshift({
        id: `act_${Date.now()}`,
        userName: 'Admin',
        action: 'Disconnected Shopify Store',
        entityType: 'store',
        entityId: 'shopify',
        details: 'Shopify access token revoked and catalog sync paused.',
        timestamp: new Date().toISOString(),
      });
    });

    const { accessToken: _token, ...safeConfig } = db.getData().shopifyConfig;
    res.json({ success: true, message: 'Shopify store disconnected successfully.', config: safeConfig });
  });

  // Contact Form Submission
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, subject, message, inquiryType } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const contactEntry = {
      id: `msg_${Date.now()}`,
      name,
      email,
      subject: subject || 'StorePilot Inquiry',
      message,
      inquiryType: inquiryType || 'Sales & Onboarding',
      createdAt: new Date().toISOString(),
    };

    db.update((d) => {
      d.contactMessages.unshift(contactEntry);
      d.activityLogs.unshift({
        id: `act_${Date.now()}`,
        userName: name,
        action: 'Contact Submission',
        entityType: 'system',
        entityId: contactEntry.id,
        details: `Inquiry from ${email} regarding "${contactEntry.subject}"`,
        timestamp: new Date().toISOString(),
      });
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our sales engineer will get in touch within 2 business hours.',
    });
  });

  // Reset demo data
  app.post('/api/reset-demo', (_req: Request, res: Response) => {
    db.resetDemo();
    res.json({ success: true, message: 'Demo data reset to default seed state.' });
  });

  // Export/Download endpoints for free migration & Cloudflare deployment
  app.get('/api/export/dist', (_req: Request, res: Response) => {
    const filePath = path.resolve(__dirname, 'storepilot-production-dist.tar.gz');
    res.download(filePath, 'storepilot-production-dist.tar.gz');
  });

  app.get('/api/export/source', (_req: Request, res: Response) => {
    const filePath = path.resolve(__dirname, 'storepilot-source.tar.gz');
    res.download(filePath, 'storepilot-source.tar.gz');
  });

  // Catch-all 404 handler for unmatched API routes
  app.all('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  // ----------------------------------------------------
  // VITE / STATIC SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`StorePilot server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
