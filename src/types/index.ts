export type Role = 'owner' | 'admin' | 'manager' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  workspaceId: string;
}

export interface Workspace {
  id: string;
  name: string;
  currency: string;
  plan: 'free' | 'free_demo';
  createdAt: string;
  isDemoMode: boolean;
}

export interface Store {
  id: string;
  name: string;
  platform: 'shopify' | 'woocommerce' | 'amazon' | 'manual';
  domain: string;
  status: 'connected' | 'syncing' | 'disconnected' | 'error';
  lastSyncedAt?: string;
  totalOrdersCount: number;
}

export interface OrderItem {
  id: string;
  title: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'in_transit' | 'fulfilled' | 'cancelled' | 'returned';
export type PaymentStatus = 'paid' | 'pending' | 'cod_pending' | 'cod_collected' | 'refunded' | 'failed';
export type FulfillmentStatus = 'unfulfilled' | 'partially_fulfilled' | 'fulfilled' | 'shipped' | 'delivered' | 'returned';

export interface Order {
  id: string;
  orderNumber: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentMethod: 'Credit Card' | 'COD' | 'PayPal' | 'UPI' | 'Bank Transfer';
  currency: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  carrier?: string;
  trackingNumber?: string;
  internalNotes?: string;
  timeline: {
    title: string;
    description: string;
    timestamp: string;
  }[];
  source?: 'shopify_live' | 'demo';
  shopifyId?: string;
  originalCurrency?: string;
  originalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'draft' | 'archived';
  imageUrl: string;
  variantsCount: number;
  storeId: string;
  salesCount: number;
  createdAt: string;
  source?: 'shopify_live' | 'demo';
  shopifyId?: string;
  originalCurrency?: string;
  originalPrice?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  currency: string;
  lastOrderDate: string;
  notes?: string;
  createdAt: string;
  source?: 'shopify_live' | 'demo';
  shopifyId?: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  currency: string;
  method: string;
  type: 'prepaid' | 'cod';
  status: 'settled' | 'pending' | 'failed' | 'refunded';
  codStatus?: 'uncollected' | 'remitted_by_courier' | 'reconciled';
  courierName?: string;
  remittanceRef?: string;
  date: string;
}

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  reason: 'defective' | 'wrong_item' | 'size_mismatch' | 'changed_mind' | 'delayed_delivery';
  status: 'pending_review' | 'approved' | 'item_received' | 'refunded' | 'rejected';
  refundAmount: number;
  currency: string;
  carrier?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentRecord {
  id: string;
  trackingNumber: string;
  orderNumber: string;
  customerName: string;
  carrier: 'FedEx' | 'DHL Express' | 'Blue Dart' | 'Shiprocket' | 'Delhivery' | 'USPS';
  status: 'label_created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed_attempt';
  origin: string;
  destination: string;
  dispatchDate: string;
  estimatedDelivery: string;
  currentLocation: string;
  events: {
    status: string;
    location: string;
    timestamp: string;
    details: string;
  }[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'invited';
  joinedAt: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  userName: string;
  action: string;
  entityType: 'order' | 'product' | 'inventory' | 'payment' | 'return' | 'store' | 'system';
  entityId: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'shipping' | 'return' | 'system';
  read: boolean;
  createdAt: string;
}

export interface ShopifyConfig {
  connected: boolean;
  storeDomain: string;
  shopName?: string;
  shopEmail?: string;
  currency?: string;
  ianaTimezone?: string;
  apiVersion: string;
  lastSyncedAt?: string;
  totalSyncedOrders?: number;
  totalSyncedProducts?: number;
  totalSyncedCustomers?: number;
  webhookCount?: number;
  autoSync: boolean;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  errorMessage?: string;
  scopes?: string[];
  isLiveConnection?: boolean;
}

export interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  fulfilledOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  lowStockCount: number;
  returnsAwaitingAction: number;
  codPendingAmount: number;
  codReconciledAmount: number;
}
