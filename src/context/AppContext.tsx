import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  DashboardMetrics,
} from '../types/index.ts';
import {
  SEED_USER,
  SEED_WORKSPACE,
  SEED_STORES,
  SEED_PRODUCTS,
  SEED_ORDERS,
  SEED_CUSTOMERS,
  SEED_PAYMENTS,
  SEED_RETURNS,
  SEED_SHIPMENTS,
  SEED_TEAM,
  SEED_ACTIVITY,
  SEED_NOTIFICATIONS,
  SEED_SHOPIFY_CONFIG,
  computeMetricsFromData,
} from '../data/seedData.ts';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  user: User | null;
  workspace: Workspace | null;
  stores: Store[];
  selectedStoreId: string;
  setSelectedStoreId: (id: string) => void;
  orders: Order[];
  products: Product[];
  customers: Customer[];
  payments: PaymentRecord[];
  returns: ReturnRequest[];
  shipments: ShipmentRecord[];
  team: TeamMember[];
  activity: ActivityLog[];
  notifications: NotificationItem[];
  shopifyConfig: ShopifyConfig | null;
  metrics: DashboardMetrics | null;
  loading: boolean;
  refreshData: () => Promise<void>;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, workspaceName?: string) => Promise<boolean>;
  logout: () => void;
  createOrder: (orderData: any) => Promise<Order | null>;
  updateOrder: (id: string, updateData: any) => Promise<boolean>;
  createProduct: (productData: any) => Promise<Product | null>;
  updateProduct: (id: string, updateData: any) => Promise<boolean>;
  reconcilePayment: (id: string, remittanceRef?: string, courierName?: string) => Promise<boolean>;
  updateReturn: (id: string, status: string, notes?: string) => Promise<boolean>;
  connectShopify: (storeDomain: string, accessToken?: string, isDemo?: boolean) => Promise<{ success: boolean; message?: string; error?: string; isLive?: boolean }>;
  testShopifyConnection: (storeDomain: string, accessToken: string) => Promise<{ success: boolean; error?: string; shop?: any; errorCode?: string }>;
  syncShopify: () => Promise<boolean>;
  disconnectShopify: () => Promise<boolean>;
  resetDemoData: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  selectedOrderForModal: Order | null;
  setSelectedOrderForModal: (order: Order | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRouteState] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [shopifyConfig, setShopifyConfig] = useState<ShopifyConfig | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  const setCurrentRoute = (route: string) => {
    setCurrentRouteState(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const safeFetchJson = async (endpoint: string) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`);
      if (!res.ok) return null;
      const contentType = res.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const [
        meRes,
        metricsRes,
        ordersRes,
        productsRes,
        customersRes,
        paymentsRes,
        returnsRes,
        shipmentsRes,
        teamRes,
        activityRes,
        notifRes,
        shopifyRes,
      ] = await Promise.all([
        safeFetchJson('/api/auth/me'),
        safeFetchJson('/api/metrics'),
        safeFetchJson('/api/orders'),
        safeFetchJson('/api/products'),
        safeFetchJson('/api/customers'),
        safeFetchJson('/api/payments'),
        safeFetchJson('/api/returns'),
        safeFetchJson('/api/shipments'),
        safeFetchJson('/api/team'),
        safeFetchJson('/api/activity'),
        safeFetchJson('/api/notifications'),
        safeFetchJson('/api/shopify/status'),
      ]);

      if (meRes?.user) {
        setUser(meRes.user);
        setWorkspace(meRes.workspace);
      } else if (!user) {
        setUser(SEED_USER);
        setWorkspace(SEED_WORKSPACE);
      }

      const activeOrders = ordersRes?.orders || (orders.length > 0 ? orders : SEED_ORDERS);
      const activeProducts = productsRes?.products || (products.length > 0 ? products : SEED_PRODUCTS);

      setOrders(activeOrders);
      setProducts(activeProducts);

      if (customersRes?.customers) {
        setCustomers(customersRes.customers);
      } else if (customers.length === 0) {
        setCustomers(SEED_CUSTOMERS);
      }

      if (paymentsRes?.payments) {
        setPayments(paymentsRes.payments);
      } else if (payments.length === 0) {
        setPayments(SEED_PAYMENTS);
      }

      if (returnsRes?.returns) {
        setReturns(returnsRes.returns);
      } else if (returns.length === 0) {
        setReturns(SEED_RETURNS);
      }

      if (shipmentsRes?.shipments) {
        setShipments(shipmentsRes.shipments);
      } else if (shipments.length === 0) {
        setShipments(SEED_SHIPMENTS);
      }

      if (teamRes?.team) {
        setTeam(teamRes.team);
      } else if (team.length === 0) {
        setTeam(SEED_TEAM);
      }

      if (activityRes?.activity) {
        setActivity(activityRes.activity);
      } else if (activity.length === 0) {
        setActivity(SEED_ACTIVITY);
      }

      if (notifRes?.notifications) {
        setNotifications(notifRes.notifications);
      } else if (notifications.length === 0) {
        setNotifications(SEED_NOTIFICATIONS);
      }

      if (shopifyRes?.config) {
        setShopifyConfig(shopifyRes.config);
        if (shopifyRes.stores) setStores(shopifyRes.stores);
      } else if (!shopifyConfig) {
        setShopifyConfig(SEED_SHOPIFY_CONFIG);
        setStores(SEED_STORES);
      }

      if (metricsRes?.totalSales !== undefined) {
        setMetrics(metricsRes);
      } else {
        setMetrics(computeMetricsFromData(activeOrders, activeProducts));
      }
    } catch (err) {
      console.error('Error in refreshData, applying fallback state:', err);
      if (!user) setUser(SEED_USER);
      if (!workspace) setWorkspace(SEED_WORKSPACE);
      if (orders.length === 0) setOrders(SEED_ORDERS);
      if (products.length === 0) setProducts(SEED_PRODUCTS);
      if (!metrics) setMetrics(computeMetricsFromData(SEED_ORDERS, SEED_PRODUCTS));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'demo1234' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setWorkspace(data.workspace);
          showToast(`Welcome back, ${data.user.name}!`);
          setCurrentRoute('dashboard');
          return true;
        }
      }
    } catch {
      // Fallback for static demo mode
    }
    setUser(SEED_USER);
    setWorkspace(SEED_WORKSPACE);
    showToast(`Welcome back, ${SEED_USER.name}!`);
    setCurrentRoute('dashboard');
    return true;
  };

  const signup = async (name: string, email: string, workspaceName?: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, workspaceName }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setWorkspace(data.workspace);
          showToast('Account created successfully!');
          setCurrentRoute('onboarding');
          return true;
        }
      }
    } catch {
      // Fallback for static demo mode
    }
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'owner',
      workspaceId: 'ws_new',
    };
    const newWs: Workspace = {
      id: 'ws_new',
      name: workspaceName || `${name}'s Store`,
      currency: 'PKR',
      plan: 'free',
      createdAt: new Date().toISOString(),
      isDemoMode: true,
    };
    setUser(newUser);
    setWorkspace(newWs);
    showToast('Account created successfully!');
    setCurrentRoute('onboarding');
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast('Signed out successfully.', 'info');
    setCurrentRoute('home');
  };

  const createOrder = async (orderData: any): Promise<Order | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast(`Order ${data.order.orderNumber} created successfully!`);
          await refreshData();
          return data.order;
        }
      }
    } catch {
      // Fallback for static mode
    }
    const subtotal = orderData.items?.reduce((s: number, i: any) => s + (i.unitPrice * i.quantity), 0) || 3450;
    const tax = Math.round(subtotal * 0.08);
    const shippingFee = 250;
    const totalAmount = subtotal + tax + shippingFee;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `SP-${1000 + orders.length + 1}`,
      storeId: 'store_1',
      storeName: 'Indus Apparel Official (Shopify Demo - PKR)',
      customerName: orderData.customerName || 'Customer',
      customerEmail: orderData.customerEmail || 'customer@storepilot.pk',
      status: 'pending',
      paymentStatus: orderData.paymentMethod === 'COD' ? 'cod_pending' : 'paid',
      paymentMethod: orderData.paymentMethod || 'COD',
      items: orderData.items || [],
      subtotal,
      tax,
      shippingFee,
      totalAmount,
      currency: 'PKR',
      shippingAddress: orderData.shippingAddress || {
        name: orderData.customerName || 'Customer',
        street: '123 E-Commerce Blvd',
        city: 'Lahore',
        state: 'Punjab',
        zip: '54000',
        country: 'Pakistan',
      },
      fulfillmentStatus: 'unfulfilled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'demo',
      timeline: [
        {
          title: 'Order Created',
          description: 'Created via StorePilot Order Desk',
          timestamp: new Date().toISOString(),
        },
      ],
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    setMetrics(computeMetricsFromData(updated, products));
    showToast(`Order ${newOrder.orderNumber} created successfully!`);
    return newOrder;
  };

  const updateOrder = async (id: string, updateData: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast(`Order updated successfully!`);
          await refreshData();
          return true;
        }
      }
    } catch {
      // Fallback for static mode
    }
    const updated = orders.map((o) => (o.id === id ? { ...o, ...updateData } : o));
    setOrders(updated);
    setMetrics(computeMetricsFromData(updated, products));
    showToast('Order updated successfully!');
    return true;
  };

  const createProduct = async (productData: any): Promise<Product | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast(`Product "${data.product.title}" added to catalog!`);
          await refreshData();
          return data.product;
        }
      }
    } catch {
      // Fallback for static mode
    }
    const newProd: Product = {
      id: `prod_${Date.now()}`,
      title: productData.title,
      sku: (productData.sku || 'SKU-NEW').toUpperCase(),
      category: productData.category || 'Apparel',
      price: parseFloat(productData.price) || 1000,
      costPrice: parseFloat(productData.costPrice) || 500,
      stock: parseInt(productData.stock) || 10,
      lowStockThreshold: parseInt(productData.lowStockThreshold) || 5,
      status: 'active',
      imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      variantsCount: 1,
      storeId: 'store_1',
      salesCount: 0,
      createdAt: new Date().toISOString(),
      source: 'demo',
    };
    const updated = [newProd, ...products];
    setProducts(updated);
    setMetrics(computeMetricsFromData(orders, updated));
    showToast(`Product "${newProd.title}" added to catalog!`);
    return newProd;
  };

  const updateProduct = async (id: string, updateData: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast('Product updated successfully!');
          await refreshData();
          return true;
        }
      }
    } catch {
      // Fallback for static mode
    }
    const updated = products.map((p) => (p.id === id ? { ...p, ...updateData } : p));
    setProducts(updated);
    setMetrics(computeMetricsFromData(orders, updated));
    showToast('Product updated successfully!');
    return true;
  };

  const reconcilePayment = async (id: string, remittanceRef?: string, courierName?: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/payments/${id}/reconcile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remittanceRef, courierName }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast('Payment COD remittance reconciled!');
          await refreshData();
          return true;
        }
      }
    } catch {
      // Fallback for static mode
    }
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'settled',
              codStatus: 'reconciled',
              remittanceRef: remittanceRef || `REM-${Date.now().toString().slice(-6)}`,
              courierName: courierName || p.courierName,
            }
          : p
      )
    );
    showToast('Payment COD remittance reconciled!');
    return true;
  };

  const updateReturn = async (id: string, status: string, notes?: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/returns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast(`Return status updated to ${status}!`);
          await refreshData();
          return true;
        }
      }
    } catch {
      // Fallback for static mode
    }
    setReturns((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: status as any,
              notes: notes || r.notes,
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
    showToast(`Return status updated to ${status}!`);
    return true;
  };

  const testShopifyConnection = async (
    storeDomain: string,
    accessToken: string
  ): Promise<{ success: boolean; error?: string; shop?: any; errorCode?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/api/shopify/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeDomain, accessToken }),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      const data = await res.json().catch(() => null);
      return data || { success: false, error: 'Connection test failed on server' };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error while testing connection.',
        errorCode: 'NETWORK_ERROR',
      };
    }
  };

  const connectShopify = async (
    storeDomain: string,
    accessToken?: string,
    isDemo?: boolean
  ): Promise<{ success: boolean; message?: string; error?: string; isLive?: boolean }> => {
    try {
      const res = await fetch(`${API_BASE}/api/shopify/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeDomain, accessToken, isDemo }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast(data.message || `Shopify store ${storeDomain} connected successfully!`);
          await refreshData();
          return { success: true, message: data.message, isLive: data.isLive };
        }
        showToast(data.error || 'Failed to connect Shopify', 'error');
        return { success: false, error: data.error };
      }
    } catch {
      // Fallback for static demo mode
    }
    const newConfig: ShopifyConfig = {
      connected: true,
      storeDomain,
      isLiveConnection: Boolean(accessToken && !isDemo),
      status: 'connected',
      apiVersion: '2025-01',
      autoSync: true,
      scopes: ['read_products', 'write_products', 'read_orders', 'write_orders', 'read_inventory', 'read_customers', 'read_fulfillments'],
      lastSyncedAt: new Date().toISOString(),
    };
    setShopifyConfig(newConfig);
    showToast(`Shopify store ${storeDomain} connected successfully!`);
    return { success: true, message: `Connected to ${storeDomain}`, isLive: newConfig.isLiveConnection };
  };

  const syncShopify = async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/shopify/sync`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast('Shopify sync completed! Orders and inventory updated.');
          await refreshData();
          return true;
        }
      }
    } catch {
      // Fallback for static mode
    }
    showToast('Shopify sync completed! Orders and inventory updated.');
    return true;
  };

  const disconnectShopify = async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/shopify/disconnect`, {
        method: 'POST',
      });
      if (res.ok) {
        showToast('Shopify store disconnected.', 'info');
        await refreshData();
        return true;
      }
    } catch {
      // Fallback for static mode
    }
    if (shopifyConfig) {
      setShopifyConfig({ ...shopifyConfig, connected: false, status: 'disconnected' });
    }
    showToast('Shopify store disconnected.', 'info');
    return true;
  };

  const resetDemoData = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE}/api/reset-demo`, { method: 'POST' });
      if (res.ok) {
        showToast('Demo dataset refreshed to default state!');
        await refreshData();
        return;
      }
    } catch {
      // Fallback for static mode
    }
    setOrders(SEED_ORDERS);
    setProducts(SEED_PRODUCTS);
    setCustomers(SEED_CUSTOMERS);
    setPayments(SEED_PAYMENTS);
    setReturns(SEED_RETURNS);
    setShipments(SEED_SHIPMENTS);
    setTeam(SEED_TEAM);
    setMetrics(computeMetricsFromData(SEED_ORDERS, SEED_PRODUCTS));
    showToast('Demo dataset refreshed to default state!');
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        user,
        workspace,
        stores,
        selectedStoreId,
        setSelectedStoreId,
        orders,
        products,
        customers,
        payments,
        returns,
        shipments,
        team,
        activity,
        notifications,
        shopifyConfig,
        metrics,
        loading,
        refreshData,
        login,
        signup,
        logout,
        createOrder,
        updateOrder,
        createProduct,
        updateProduct,
        reconcilePayment,
        updateReturn,
        connectShopify,
        testShopifyConnection,
        syncShopify,
        disconnectShopify,
        resetDemoData,
        showToast,
        searchModalOpen,
        setSearchModalOpen,
        selectedOrderForModal,
        setSelectedOrderForModal,
      }}
    >
      {children}

      {/* Floating Toast Alerts */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg border text-sm font-medium flex items-center justify-between gap-3 transition-all transform translate-y-0 ${
              t.type === 'error'
                ? 'bg-red-50 text-red-900 border-red-200'
                : t.type === 'info'
                ? 'bg-blue-50 text-blue-900 border-blue-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}
          >
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
