import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  User,
  Workspace,
  Store,
  Order,
  Product,
  Customer,
  PaymentRecord,
  ReturnRequest,
  ShipmentRecord,
  TeamMember,
  ActivityLog,
  NotificationItem,
  ShopifyConfig,
} from '../types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'storepilot_db.json');

export interface DatabaseSchema {
  users: User[];
  workspaces: Workspace[];
  stores: Store[];
  orders: Order[];
  products: Product[];
  customers: Customer[];
  payments: PaymentRecord[];
  returns: ReturnRequest[];
  shipments: ShipmentRecord[];
  team: TeamMember[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
  shopifyConfig: ShopifyConfig & {
    accessToken?: string;
  };
  contactMessages: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    inquiryType: string;
    createdAt: string;
  }[];
}

function getInitialSeedData(): DatabaseSchema {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();
  const threeDaysAgo = new Date(Date.now() - 259200000).toISOString();

  const user: User = {
    id: 'usr_demo_1',
    name: 'Hamza Malik',
    email: 'hamza@storepilot.io',
    role: 'owner',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    workspaceId: 'ws_demo_1',
  };

  const workspace: Workspace = {
    id: 'ws_demo_1',
    name: 'Indus Retail Group (Pakistan)',
    currency: 'PKR',
    plan: 'free',
    createdAt: threeDaysAgo,
    isDemoMode: true,
  };

  const stores: Store[] = [
    {
      id: 'store_1',
      name: 'Indus Apparel Official (Shopify Demo - PKR)',
      platform: 'shopify',
      domain: 'indus-apparel-pk.myshopify.com',
      status: 'connected',
      lastSyncedAt: now,
      totalOrdersCount: 28,
    },
    {
      id: 'store_2',
      name: 'Daraz / Marketplace Store',
      platform: 'manual',
      domain: 'marketplace.sellerhub.pk/indus',
      status: 'connected',
      lastSyncedAt: yesterday,
      totalOrdersCount: 12,
    },
  ];

  // Authentic Pakistani E-Commerce Catalog Pricing in PKR (Rs.)
  const products: Product[] = [
    {
      id: 'prod_1',
      title: 'Minimalist Oxford Cotton Kurta & Shirt',
      sku: 'SHIRT-OXF-001',
      category: 'Apparel',
      price: 3450.00,
      costPrice: 1550.00,
      stock: 45,
      lowStockThreshold: 15,
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
      variantsCount: 4,
      storeId: 'store_1',
      salesCount: 142,
      createdAt: threeDaysAgo,
    },
    {
      id: 'prod_2',
      title: 'Slim-Fit Raw Selvedge Denim',
      sku: 'JEAN-SLIM-002',
      category: 'Apparel',
      price: 5800.00,
      costPrice: 2600.00,
      stock: 6,
      lowStockThreshold: 10,
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=400&q=80',
      variantsCount: 6,
      storeId: 'store_1',
      salesCount: 210,
      createdAt: threeDaysAgo,
    },
    {
      id: 'prod_3',
      title: 'All-Weather Waterproof Explorer Parka Jacket',
      sku: 'JACK-EXP-003',
      category: 'Outerwear',
      price: 14500.00,
      costPrice: 6800.00,
      stock: 18,
      lowStockThreshold: 8,
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=400&q=80',
      variantsCount: 3,
      storeId: 'store_1',
      salesCount: 89,
      createdAt: threeDaysAgo,
    },
    {
      id: 'prod_4',
      title: 'Fine Merino Wool Crewneck Pullover',
      sku: 'SWTR-WOOL-004',
      category: 'Apparel',
      price: 4950.00,
      costPrice: 2200.00,
      stock: 3,
      lowStockThreshold: 12,
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=400&q=80',
      variantsCount: 5,
      storeId: 'store_1',
      salesCount: 124,
      createdAt: threeDaysAgo,
    },
    {
      id: 'prod_5',
      title: 'Handcrafted Vegetable-Tanned Leather Weekend Tote',
      sku: 'BAG-TOTE-005',
      category: 'Accessories',
      price: 8900.00,
      costPrice: 3900.00,
      stock: 24,
      lowStockThreshold: 6,
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80',
      variantsCount: 2,
      storeId: 'store_1',
      salesCount: 95,
      createdAt: threeDaysAgo,
    },
    {
      id: 'prod_6',
      title: 'Everyday Canvas Court Sneakers - Off-White',
      sku: 'SHOE-CANV-006',
      category: 'Footwear',
      price: 6200.00,
      costPrice: 2700.00,
      stock: 0,
      lowStockThreshold: 10,
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=80',
      variantsCount: 7,
      storeId: 'store_1',
      salesCount: 180,
      createdAt: threeDaysAgo,
    },
    {
      id: 'prod_7',
      title: 'Polarized Matte Sunglasses UV400',
      sku: 'ACC-SUN-007',
      category: 'Accessories',
      price: 2750.00,
      costPrice: 950.00,
      stock: 62,
      lowStockThreshold: 20,
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80',
      variantsCount: 2,
      storeId: 'store_1',
      salesCount: 77,
      createdAt: threeDaysAgo,
    },
    {
      id: 'prod_8',
      title: 'Stainless Steel Minimalist Chronograph Watch',
      sku: 'ACC-WTCH-008',
      category: 'Accessories',
      price: 12900.00,
      costPrice: 5100.00,
      stock: 14,
      lowStockThreshold: 5,
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80',
      variantsCount: 3,
      storeId: 'store_1',
      salesCount: 110,
      createdAt: threeDaysAgo,
    },
  ];

  // Customers in Pakistani Metropolitan Hubs
  const customers: Customer[] = [
    {
      id: 'cust_1',
      name: 'Ayesha Siddiqui',
      email: 'ayesha.s@example.pk',
      phone: '+92 300 2348901',
      city: 'Karachi, Sindh',
      totalOrders: 4,
      totalSpent: 26800.00,
      currency: 'PKR',
      lastOrderDate: yesterday,
      notes: 'VIP customer. Prefers TCS Express delivery in DHA Phase 6.',
      createdAt: threeDaysAgo,
    },
    {
      id: 'cust_2',
      name: 'Bilal Farooq',
      email: 'bilal.f@example.pk',
      phone: '+92 321 3456789',
      city: 'Lahore, Punjab',
      totalOrders: 2,
      totalSpent: 19450.00,
      currency: 'PKR',
      lastOrderDate: now,
      createdAt: threeDaysAgo,
    },
    {
      id: 'cust_3',
      name: 'Zainab Qureshi',
      email: 'zainab.q@example.pk',
      phone: '+92 333 6781234',
      city: 'Islamabad, ICT',
      totalOrders: 3,
      totalSpent: 21600.00,
      currency: 'PKR',
      lastOrderDate: twoDaysAgo,
      createdAt: threeDaysAgo,
    },
    {
      id: 'cust_4',
      name: 'Usman Tariq',
      email: 'usman.t@example.pk',
      phone: '+92 345 8904321',
      city: 'Rawalpindi, Punjab',
      totalOrders: 1,
      totalSpent: 5800.00,
      currency: 'PKR',
      lastOrderDate: yesterday,
      notes: 'Cash on Delivery customer verified via phone OTP.',
      createdAt: threeDaysAgo,
    },
    {
      id: 'cust_5',
      name: 'Fatima Noor',
      email: 'fatima.n@example.pk',
      phone: '+92 301 4328765',
      city: 'Faisalabad, Punjab',
      totalOrders: 5,
      totalSpent: 38400.00,
      currency: 'PKR',
      lastOrderDate: now,
      notes: 'Requested return on Order #SP-1006 (size swap on denim).',
      createdAt: threeDaysAgo,
    },
  ];

  // Orders in PKR with Pakistani Courier Tracking & Addresses
  const orders: Order[] = [
    {
      id: 'ord_1001',
      orderNumber: 'SP-1001',
      storeId: 'store_1',
      storeName: 'Indus Apparel (Shopify Demo - PKR)',
      customerName: 'Ayesha Siddiqui',
      customerEmail: 'ayesha.s@example.pk',
      status: 'fulfilled',
      paymentStatus: 'paid',
      fulfillmentStatus: 'delivered',
      paymentMethod: 'Credit Card',
      currency: 'PKR',
      subtotal: 6900.00,
      shippingFee: 250.00,
      tax: 552.00,
      totalAmount: 7702.00,
      carrier: 'TCS Express',
      trackingNumber: 'TCS-771928301',
      shippingAddress: {
        name: 'Ayesha Siddiqui',
        street: 'Bungalow 42-B, Khayaban-e-Seher, DHA Phase 6',
        city: 'Karachi',
        state: 'Sindh',
        zip: '75500',
        country: 'Pakistan',
      },
      items: [
        {
          id: 'item_1',
          title: 'Minimalist Oxford Cotton Kurta & Shirt (M)',
          sku: 'SHIRT-OXF-001',
          quantity: 2,
          unitPrice: 3450.00,
          totalPrice: 6900.00,
        },
      ],
      internalNotes: 'Dispatched via TCS Overnight Express. Handed over to recipient.',
      timeline: [
        { title: 'Order Placed', description: 'Order confirmed by customer via Shopify storefront', timestamp: threeDaysAgo },
        { title: 'Payment Captured', description: 'Authorized and captured via PayFast (Rs. 7,702.00)', timestamp: threeDaysAgo },
        { title: 'Fulfilled & Dispatched', description: 'Label generated. Tracking # TCS-771928301', timestamp: twoDaysAgo },
        { title: 'Delivered', description: 'Signed and received in DHA Phase 6, Karachi', timestamp: yesterday },
      ],
      createdAt: threeDaysAgo,
      updatedAt: yesterday,
    },
    {
      id: 'ord_1002',
      orderNumber: 'SP-1002',
      storeId: 'store_1',
      storeName: 'Indus Apparel (Shopify Demo - PKR)',
      customerName: 'Bilal Farooq',
      customerEmail: 'bilal.f@example.pk',
      status: 'in_transit',
      paymentStatus: 'paid',
      fulfillmentStatus: 'shipped',
      paymentMethod: 'Credit Card',
      currency: 'PKR',
      subtotal: 19450.00,
      shippingFee: 0.00,
      tax: 1556.00,
      totalAmount: 21006.00,
      carrier: 'Leopards Courier',
      trackingNumber: 'LEO-982019482',
      shippingAddress: {
        name: 'Bilal Farooq',
        street: 'House 18, Block J, Gulberg III',
        city: 'Lahore',
        state: 'Punjab',
        zip: '54000',
        country: 'Pakistan',
      },
      items: [
        {
          id: 'item_2',
          title: 'All-Weather Waterproof Explorer Parka (L)',
          sku: 'JACK-EXP-003',
          quantity: 1,
          unitPrice: 14500.00,
          totalPrice: 14500.00,
        },
        {
          id: 'item_3',
          title: 'Fine Merino Wool Crewneck Pullover (L)',
          sku: 'SWTR-WOOL-004',
          quantity: 1,
          unitPrice: 4950.00,
          totalPrice: 4950.00,
        },
      ],
      internalNotes: 'Customer requested double-layer moisture protection packaging.',
      timeline: [
        { title: 'Order Placed', description: 'Order confirmed online', timestamp: yesterday },
        { title: 'Payment Confirmed', description: 'Payment of Rs. 21,006.00 verified via Card', timestamp: yesterday },
        { title: 'In Transit', description: 'Sorted at Leopards Hub, Thokar Niaz Baig, Lahore', timestamp: now },
      ],
      createdAt: yesterday,
      updatedAt: now,
    },
    {
      id: 'ord_1003',
      orderNumber: 'SP-1003',
      storeId: 'store_1',
      storeName: 'Indus Apparel (Shopify Demo - PKR)',
      customerName: 'Usman Tariq',
      customerEmail: 'usman.t@example.pk',
      status: 'processing',
      paymentStatus: 'cod_pending',
      fulfillmentStatus: 'unfulfilled',
      paymentMethod: 'COD',
      currency: 'PKR',
      subtotal: 5800.00,
      shippingFee: 250.00,
      tax: 464.00,
      totalAmount: 6514.00,
      carrier: 'Trax Express',
      trackingNumber: 'TRX-55102948',
      shippingAddress: {
        name: 'Usman Tariq',
        street: 'Street 9, Sector F-10/3',
        city: 'Islamabad',
        state: 'ICT',
        zip: '44000',
        country: 'Pakistan',
      },
      items: [
        {
          id: 'item_4',
          title: 'Slim-Fit Raw Selvedge Denim (32/32)',
          sku: 'JEAN-SLIM-002',
          quantity: 1,
          unitPrice: 5800.00,
          totalPrice: 5800.00,
        },
      ],
      internalNotes: 'Cash On Delivery verification call complete. Awaiting warehouse dispatch.',
      timeline: [
        { title: 'Order Created', description: 'COD order initiated (Rs. 6,514.00 cash on arrival)', timestamp: now },
        { title: 'Verification', description: 'Buyer verified via automated SMS OTP prompt', timestamp: now },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ord_1004',
      orderNumber: 'SP-1004',
      storeId: 'store_1',
      storeName: 'Indus Apparel (Shopify Demo - PKR)',
      customerName: 'Zainab Qureshi',
      customerEmail: 'zainab.q@example.pk',
      status: 'pending',
      paymentStatus: 'pending',
      fulfillmentStatus: 'unfulfilled',
      paymentMethod: 'Bank Transfer',
      currency: 'PKR',
      subtotal: 8900.00,
      shippingFee: 0.00,
      tax: 712.00,
      totalAmount: 9612.00,
      shippingAddress: {
        name: 'Zainab Qureshi',
        street: 'House 44, Street 12, Bahria Town Phase 4',
        city: 'Rawalpindi',
        state: 'Punjab',
        zip: '46000',
        country: 'Pakistan',
      },
      items: [
        {
          id: 'item_5',
          title: 'Handcrafted Vegetable-Tanned Leather Weekend Tote',
          sku: 'BAG-TOTE-005',
          quantity: 1,
          unitPrice: 8900.00,
          totalPrice: 8900.00,
        },
      ],
      internalNotes: 'Awaiting Meezan Bank 1-Link IBFT reference confirmation.',
      timeline: [
        { title: 'Order Placed', description: 'Awaiting IBFT clearance', timestamp: now },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ord_1005',
      orderNumber: 'SP-1005',
      storeId: 'store_2',
      storeName: 'Daraz / Marketplace Store',
      customerName: 'Tariq Mehmood',
      customerEmail: 'tariq.m@example.pk',
      status: 'fulfilled',
      paymentStatus: 'paid',
      fulfillmentStatus: 'delivered',
      paymentMethod: 'Credit Card',
      currency: 'PKR',
      subtotal: 12900.00,
      shippingFee: 0.00,
      tax: 1032.00,
      totalAmount: 13932.00,
      carrier: 'TCS Express',
      trackingNumber: 'TCS-381920491',
      shippingAddress: {
        name: 'Tariq Mehmood',
        street: 'Flat 301, Clifton Block 4',
        city: 'Karachi',
        state: 'Sindh',
        zip: '75600',
        country: 'Pakistan',
      },
      items: [
        {
          id: 'item_6',
          title: 'Stainless Steel Minimalist Chronograph Watch',
          sku: 'ACC-WTCH-008',
          quantity: 1,
          unitPrice: 12900.00,
          totalPrice: 12900.00,
        },
      ],
      timeline: [
        { title: 'Marketplace Sync', description: 'Synced via Seller Central connector', timestamp: twoDaysAgo },
        { title: 'Delivered', description: 'Delivered to recipient', timestamp: yesterday },
      ],
      createdAt: twoDaysAgo,
      updatedAt: yesterday,
    },
    {
      id: 'ord_1006',
      orderNumber: 'SP-1006',
      storeId: 'store_1',
      storeName: 'Indus Apparel (Shopify Demo - PKR)',
      customerName: 'Fatima Noor',
      customerEmail: 'fatima.n@example.pk',
      status: 'returned',
      paymentStatus: 'refunded',
      fulfillmentStatus: 'returned',
      paymentMethod: 'Credit Card',
      currency: 'PKR',
      subtotal: 5800.00,
      shippingFee: 0.00,
      tax: 464.00,
      totalAmount: 6264.00,
      shippingAddress: {
        name: 'Fatima Noor',
        street: 'Madina Town, Main Jaranwala Road',
        city: 'Faisalabad',
        state: 'Punjab',
        zip: '38000',
        country: 'Pakistan',
      },
      items: [
        {
          id: 'item_7',
          title: 'Slim-Fit Raw Selvedge Denim (28/30)',
          sku: 'JEAN-SLIM-002',
          quantity: 1,
          unitPrice: 5800.00,
          totalPrice: 5800.00,
        },
      ],
      internalNotes: 'Customer returned due to waist size preference. Restocked at Karachi Hub.',
      timeline: [
        { title: 'Return Received', description: 'Package inspected and item found in original condition', timestamp: yesterday },
        { title: 'Refund Completed', description: 'Credit of Rs. 6,264.00 returned to customer card', timestamp: now },
      ],
      createdAt: threeDaysAgo,
      updatedAt: now,
    },
  ];

  // Payments in PKR
  const payments: PaymentRecord[] = [
    {
      id: 'pay_1',
      orderId: 'ord_1001',
      orderNumber: 'SP-1001',
      customerName: 'Ayesha Siddiqui',
      amount: 7702.00,
      currency: 'PKR',
      method: 'Online Card / PayFast',
      type: 'prepaid',
      status: 'settled',
      date: threeDaysAgo,
    },
    {
      id: 'pay_2',
      orderId: 'ord_1002',
      orderNumber: 'SP-1002',
      customerName: 'Bilal Farooq',
      amount: 21006.00,
      currency: 'PKR',
      method: 'Online Card / PayFast',
      type: 'prepaid',
      status: 'settled',
      date: yesterday,
    },
    {
      id: 'pay_3',
      orderId: 'ord_1003',
      orderNumber: 'SP-1003',
      customerName: 'Usman Tariq',
      amount: 6514.00,
      currency: 'PKR',
      method: 'Cash On Delivery (COD)',
      type: 'cod',
      status: 'pending',
      codStatus: 'uncollected',
      courierName: 'Trax Express',
      date: now,
    },
    {
      id: 'pay_4',
      orderId: 'ord_1005',
      orderNumber: 'SP-1005',
      customerName: 'Tariq Mehmood',
      amount: 13932.00,
      currency: 'PKR',
      method: 'Daraz Wallet / Card',
      type: 'prepaid',
      status: 'settled',
      date: twoDaysAgo,
    },
    {
      id: 'pay_5',
      orderId: 'ord_1006',
      orderNumber: 'SP-1006',
      customerName: 'Fatima Noor',
      amount: 6264.00,
      currency: 'PKR',
      method: 'Online Card / PayFast',
      type: 'prepaid',
      status: 'refunded',
      date: now,
    },
    {
      id: 'pay_6',
      orderId: 'ord_past_09',
      orderNumber: 'SP-0994',
      customerName: 'Ahmed Raza',
      amount: 14250.00,
      currency: 'PKR',
      method: 'Cash On Delivery (COD)',
      type: 'cod',
      status: 'settled',
      codStatus: 'reconciled',
      courierName: 'TCS COD Remittance',
      remittanceRef: 'REMIT-TCS-PK-994821',
      date: twoDaysAgo,
    },
  ];

  // Returns in PKR
  const returns: ReturnRequest[] = [
    {
      id: 'ret_1',
      returnNumber: 'RET-001',
      orderId: 'ord_1006',
      orderNumber: 'SP-1006',
      customerName: 'Fatima Noor',
      customerEmail: 'fatima.n@example.pk',
      itemsCount: 1,
      reason: 'size_mismatch',
      status: 'refunded',
      refundAmount: 6264.00,
      currency: 'PKR',
      carrier: 'Leopards Return',
      trackingNumber: 'LEO-RET-994112',
      notes: 'Customer reordered size 30/30. Return package inspected & restocked.',
      createdAt: yesterday,
      updatedAt: now,
    },
    {
      id: 'ret_2',
      returnNumber: 'RET-002',
      orderId: 'ord_1001',
      orderNumber: 'SP-1001',
      customerName: 'Ayesha Siddiqui',
      customerEmail: 'ayesha.s@example.pk',
      itemsCount: 1,
      reason: 'defective',
      status: 'pending_review',
      refundAmount: 3450.00,
      currency: 'PKR',
      notes: 'Customer reports missing top cuff button on Oxford shirt.',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // Courier Shipments in Pakistan
  const shipments: ShipmentRecord[] = [
    {
      id: 'shp_1',
      trackingNumber: 'TCS-771928301',
      orderNumber: 'SP-1001',
      customerName: 'Ayesha Siddiqui',
      carrier: 'TCS Express' as any,
      status: 'delivered',
      origin: 'Korangi Industrial Hub, Karachi',
      destination: 'DHA Phase 6, Karachi',
      dispatchDate: twoDaysAgo,
      estimatedDelivery: yesterday,
      currentLocation: 'Delivered (Signed by Customer)',
      events: [
        { status: 'Shipping Label Created', location: 'Karachi Hub, Sindh', timestamp: twoDaysAgo, details: 'Shipment manifest logged into TCS system' },
        { status: 'Picked Up by Rider', location: 'Karachi, Sindh', timestamp: twoDaysAgo, details: 'In TCS Express possession' },
        { status: 'Arrived at Local Facility', location: 'Clifton Station, Karachi', timestamp: yesterday, details: 'Dispatched for morning delivery' },
        { status: 'Delivered', location: 'DHA Phase 6, Karachi', timestamp: yesterday, details: 'Signed and handed over to recipient' },
      ],
    },
    {
      id: 'shp_2',
      trackingNumber: 'LEO-982019482',
      orderNumber: 'SP-1002',
      customerName: 'Bilal Farooq',
      carrier: 'Leopards Courier' as any,
      status: 'in_transit',
      origin: 'Korangi Logistics Zone, Karachi',
      destination: 'Gulberg III, Lahore',
      dispatchDate: yesterday,
      estimatedDelivery: new Date(Date.now() + 86400000).toISOString(),
      currentLocation: 'Thokar Niaz Baig Hub, Lahore',
      events: [
        { status: 'Shipment Booked', location: 'Karachi, Sindh', timestamp: yesterday, details: 'Package processed at express hub' },
        { status: 'Inter-City Transit', location: 'En route to Lahore', timestamp: yesterday, details: 'Cargo flight dispatched to Allama Iqbal Airport' },
        { status: 'Arrived at Regional Sort Facility', location: 'Lahore, Punjab', timestamp: now, details: 'Scheduled for morning van route' },
      ],
    },
    {
      id: 'shp_3',
      trackingNumber: 'TRX-55102948',
      orderNumber: 'SP-1003',
      customerName: 'Usman Tariq',
      carrier: 'Trax Express' as any,
      status: 'label_created',
      origin: 'I-9 Industrial Area, Islamabad',
      destination: 'Sector F-10/3, Islamabad',
      dispatchDate: now,
      estimatedDelivery: new Date(Date.now() + 172800000).toISOString(),
      currentLocation: 'Awaiting Courier Pickup',
      events: [
        { status: 'COD Manifest Generated', location: 'Islamabad Station', timestamp: now, details: 'Rider assigned for package pickup' },
      ],
    },
  ];

  const team: TeamMember[] = [
    {
      id: 'tm_1',
      name: 'Hamza Malik',
      email: 'hamza@storepilot.io',
      role: 'owner',
      status: 'active',
      joinedAt: threeDaysAgo,
    },
    {
      id: 'tm_2',
      name: 'Hanzala Designer',
      email: 'hanzala@storepilot.io',
      role: 'admin',
      status: 'active',
      joinedAt: threeDaysAgo,
    },
    {
      id: 'tm_3',
      name: 'Omer Farooq',
      email: 'omer.ops@storepilot.io',
      role: 'manager',
      status: 'active',
      joinedAt: twoDaysAgo,
    },
    {
      id: 'tm_4',
      name: 'Amina Sheikh',
      email: 'amina.support@storepilot.io',
      role: 'viewer',
      status: 'active',
      joinedAt: yesterday,
    },
  ];

  const activityLogs: ActivityLog[] = [
    {
      id: 'act_1',
      userName: 'Hamza Malik',
      action: 'Updated Order Status',
      entityType: 'order',
      entityId: 'ord_1001',
      details: 'Marked order SP-1001 as fulfilled with tracking TCS-771928301',
      timestamp: yesterday,
    },
    {
      id: 'act_2',
      userName: 'Hamza Malik',
      action: 'Processed Refund',
      entityType: 'return',
      entityId: 'ret_1',
      details: 'Approved return RET-001 (Rs. 6,264.00) and restocked inventory',
      timestamp: now,
    },
    {
      id: 'act_3',
      userName: 'System Worker',
      action: 'Catalog Sync',
      entityType: 'store',
      entityId: 'store_1',
      details: 'Sync completed: 8 products and 28 orders indexed in PKR',
      timestamp: now,
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif_1',
      title: 'Low Stock Alert',
      message: 'Fine Merino Wool Crewneck Pullover has only 3 units remaining.',
      type: 'inventory',
      read: false,
      createdAt: now,
    },
    {
      id: 'notif_2',
      title: 'New Return Request',
      message: 'Return RET-002 requested by Ayesha Siddiqui for Order #SP-1001.',
      type: 'return',
      read: false,
      createdAt: now,
    },
    {
      id: 'notif_3',
      title: 'COD Remittance Available',
      message: 'TCS COD Remittance slip #REMIT-TCS-PK-994821 ready for reconciliation.',
      type: 'order',
      read: true,
      createdAt: yesterday,
    },
  ];

  const shopifyConfig: ShopifyConfig & { accessToken?: string } = {
    connected: true,
    storeDomain: 'indus-apparel-pk.myshopify.com',
    shopName: 'Indus Apparel Official (Shopify Demo - PKR)',
    shopEmail: 'admin@indus-apparel.pk',
    currency: 'PKR',
    ianaTimezone: 'Asia/Karachi',
    apiVersion: '2025-01',
    lastSyncedAt: now,
    totalSyncedOrders: 28,
    totalSyncedProducts: 8,
    totalSyncedCustomers: 6,
    webhookCount: 6,
    autoSync: true,
    status: 'connected',
    scopes: [
      'read_products',
      'write_products',
      'read_orders',
      'write_orders',
      'read_inventory',
      'read_customers',
      'read_fulfillments',
    ],
    isLiveConnection: false,
  };

  return {
    users: [user],
    workspaces: [workspace],
    stores,
    orders,
    products,
    customers,
    payments,
    returns,
    shipments,
    team,
    activityLogs,
    notifications,
    shopifyConfig,
    contactMessages: [],
  };
}

class StorePilotDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDirectory();
    this.data = this.readOrCreate();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private readOrCreate(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Ensure currency is PKR if not set
        if (parsed.workspaces && parsed.workspaces[0] && parsed.workspaces[0].currency !== 'PKR') {
          parsed.workspaces[0].currency = 'PKR';
        }
        return parsed;
      }
    } catch (err) {
      console.warn('Could not read existing database file, falling back to seed data:', err);
    }

    const seed = getInitialSeedData();
    this.persist(seed);
    return seed;
  }

  private persist(data: DatabaseSchema) {
    try {
      this.ensureDataDirectory();
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to write StorePilot database:', err);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public update(updater: (data: DatabaseSchema) => void): DatabaseSchema {
    updater(this.data);
    this.persist(this.data);
    return this.data;
  }

  public resetDemo(): DatabaseSchema {
    this.data = getInitialSeedData();
    this.persist(this.data);
    return this.data;
  }
}

export const db = new StorePilotDatabase();
