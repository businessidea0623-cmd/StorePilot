import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Search,
  Filter,
  Download,
  Plus,
  X,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Send,
  MapPin,
  CreditCard,
  Store,
} from 'lucide-react';
import type { Order, OrderStatus } from '../../types/index.ts';
import { formatPKR, formatPKDate, formatPKDateTime } from '../../utils/formatters.ts';

export const OrdersView: React.FC = () => {
  const {
    orders,
    products,
    createOrder,
    updateOrder,
    selectedOrderForModal,
    setSelectedOrderForModal,
    showToast,
    setCurrentRoute,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_transit' | 'fulfilled' | 'cod'>('all');

  // New Order Form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCity, setNewCity] = useState('Lahore, Punjab');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'Credit Card' | 'COD'>('COD');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter orders
  let filteredOrders = [...orders];

  if (activeTab === 'pending') {
    filteredOrders = filteredOrders.filter((o) => o.status === 'pending' || o.status === 'processing');
  } else if (activeTab === 'in_transit') {
    filteredOrders = filteredOrders.filter((o) => o.status === 'in_transit');
  } else if (activeTab === 'fulfilled') {
    filteredOrders = filteredOrders.filter((o) => o.status === 'fulfilled');
  } else if (activeTab === 'cod') {
    filteredOrders = filteredOrders.filter((o) => o.paymentMethod === 'COD');
  }

  if (statusFilter !== 'all') {
    filteredOrders = filteredOrders.filter((o) => o.status === statusFilter);
  }
  if (storeFilter !== 'all') {
    filteredOrders = filteredOrders.filter((o) => o.storeId === storeFilter);
  }
  if (search) {
    const q = search.toLowerCase();
    filteredOrders = filteredOrders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
    );
  }

  const exportCSV = () => {
    const headers = ['Order #', 'Customer', 'Email', 'Status', 'Payment', 'Total (PKR)', 'Date (PKT)'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerEmail,
      o.status,
      o.paymentStatus,
      `"Rs. ${o.totalAmount.toFixed(2)}"`,
      `"${formatPKDate(o.createdAt)}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `storepilot_orders_pkr_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredOrders.length} orders in PKR to CSV`);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) {
      showToast('Please provide a customer name', 'error');
      return;
    }

    const targetProduct = products.find((p) => p.id === selectedProductId) || products[0];

    setIsSubmitting(true);
    await createOrder({
      customerName: newCustomerName,
      customerEmail: newCustomerEmail || 'customer@example.com',
      paymentMethod: newPaymentMethod,
      shippingAddress: {
        name: newCustomerName,
        street: '123 E-Commerce Way',
        city: newCity.split(',')[0] || 'San Francisco',
        state: newCity.split(',')[1]?.trim() || 'CA',
        zip: '94105',
        country: 'United States',
      },
      items: [
        {
          title: targetProduct?.title || 'Selected Product',
          sku: targetProduct?.sku || 'SKU-DEMO',
          unitPrice: targetProduct?.price || 65,
          quantity: selectedQty,
        },
      ],
      internalNotes: 'Created via StorePilot Order Desk',
    });
    setIsSubmitting(false);
    setIsCreateModalOpen(false);
    setNewCustomerName('');
    setNewCustomerEmail('');
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrder(orderId, { status: newStatus });
    if (selectedOrderForModal) {
      setSelectedOrderForModal({
        ...selectedOrderForModal,
        status: newStatus,
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
            Order Management Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#455A64]">
            Manage, filter, and dispatch orders across all synchronized channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentRoute('shopify')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Store size={14} className="text-emerald-400" />
            Shopify Live & Video
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#37474F] hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold transition-all shadow-sm shadow-red-500/20"
          >
            <Plus size={15} /> Create Order
          </button>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Quick Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-gray-600">
            {[
              { id: 'all', label: `All (${orders.length})` },
              { id: 'pending', label: `Pending (${orders.filter((o) => o.status === 'pending' || o.status === 'processing').length})` },
              { id: 'in_transit', label: `In Transit (${orders.filter((o) => o.status === 'in_transit').length})` },
              { id: 'fulfilled', label: `Fulfilled (${orders.filter((o) => o.status === 'fulfilled').length})` },
              { id: 'cod', label: `COD (${orders.filter((o) => o.paymentMethod === 'COD').length})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === t.id ? 'bg-white text-[#37474F] shadow-xs' : 'hover:text-[#37474F]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, customer..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#E10600]"
            />
          </div>

        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Order Details</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => setSelectedOrderForModal(ord)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-[#37474F] text-sm">{ord.orderNumber}</div>
                      <div className="text-[11px] text-gray-400">
                        {formatPKDate(ord.createdAt)} &bull; {ord.items.length} items
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#37474F]">{ord.customerName}</div>
                      <div className="text-[11px] text-gray-400">{ord.shippingAddress?.city || 'Pakistan'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[#37474F] font-semibold text-[10px]">
                          {ord.storeName}
                        </span>
                        {ord.source === 'shopify_live' ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Shopify Live
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-gray-100 text-gray-500">
                            Demo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        ord.status === 'fulfilled' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        ord.status === 'in_transit' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        ord.status === 'returned' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        ord.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ord.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#37474F]">{ord.paymentMethod}</div>
                      <div className={`text-[10px] font-semibold ${
                        ord.paymentStatus === 'paid' ? 'text-emerald-600' :
                        ord.paymentStatus === 'cod_pending' ? 'text-amber-600' :
                        ord.paymentStatus === 'refunded' ? 'text-purple-600' : 'text-gray-500'
                      }`}>
                        {ord.paymentStatus.replace('_', ' ').toUpperCase()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-sm text-[#37474F]">
                      {formatPKR(ord.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrderForModal(ord);
                        }}
                        className="p-1 rounded-lg text-gray-400 hover:text-[#E10600] transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-xs">
                    No orders matching your active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer / Modal */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-slideLeft overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-base font-extrabold text-[#37474F]">
                    {selectedOrderForModal.orderNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-[#E10600]">
                    {selectedOrderForModal.status}
                  </span>
                  {selectedOrderForModal.source === 'shopify_live' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Shopify Live
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                      Sample Demo
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Placed on {formatPKDateTime(selectedOrderForModal.createdAt)} via {selectedOrderForModal.storeName}
                  {selectedOrderForModal.shopifyId && (
                    <span className="ml-2 font-mono text-[11px] text-gray-400">
                      ({selectedOrderForModal.shopifyId})
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Quick Status Action Buttons */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-[#37474F]">Workflow Actions:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedOrderForModal.status !== 'in_transit' && selectedOrderForModal.status !== 'fulfilled' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrderForModal.id, 'in_transit')}
                      className="px-3 py-1.5 rounded-lg bg-[#168BCE] text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Truck size={13} /> Dispatch with Courier
                    </button>
                  )}
                  {selectedOrderForModal.status !== 'fulfilled' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrderForModal.id, 'fulfilled')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={13} /> Mark Fulfilled
                    </button>
                  )}
                  {selectedOrderForModal.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrderForModal.id, 'cancelled')}
                      className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase text-gray-500 tracking-wider">Line Items</div>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  {selectedOrderForModal.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between text-xs bg-white">
                      <div>
                        <div className="font-bold text-[#37474F]">{item.title}</div>
                        <div className="text-gray-400 font-mono text-[10px]">SKU: {item.sku} &bull; Qty: {item.quantity}</div>
                      </div>
                      <div className="font-extrabold text-[#37474F] text-sm">
                        {formatPKR(item.totalPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Cost Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPKR(selectedOrderForModal.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span>{formatPKR(selectedOrderForModal.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span>{formatPKR(selectedOrderForModal.tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-1.5 flex justify-between font-extrabold text-sm text-[#37474F]">
                  <span>Total Amount</span>
                  <span className="text-[#E10600]">{formatPKR(selectedOrderForModal.totalAmount)}</span>
                </div>
              </div>

              {/* Customer & Address */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-1 text-xs">
                  <div className="text-[10px] font-bold uppercase text-gray-400">Customer</div>
                  <div className="font-bold text-[#37474F]">{selectedOrderForModal.customerName}</div>
                  <div className="text-gray-500 truncate">{selectedOrderForModal.customerEmail}</div>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-1 text-xs">
                  <div className="text-[10px] font-bold uppercase text-gray-400">Shipping Address</div>
                  <div className="text-gray-600 line-clamp-2">
                    {selectedOrderForModal.shippingAddress.street}, {selectedOrderForModal.shippingAddress.city},{' '}
                    {selectedOrderForModal.shippingAddress.state} {selectedOrderForModal.shippingAddress.zip}
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase text-gray-500 tracking-wider">Order Timeline (PKT)</div>
                <div className="space-y-2 border-l-2 border-gray-200 pl-4 ml-2">
                  {selectedOrderForModal.timeline?.map((event, idx) => (
                    <div key={idx} className="relative pb-3">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#E10600]"></div>
                      <div className="text-xs font-bold text-[#37474F]">{event.title}</div>
                      <div className="text-[11px] text-gray-500">{event.description}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {formatPKDateTime(event.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#37474F]">Create New Demo Order</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#37474F] mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="e.g. Liam Taylor"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#E10600]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#37474F] mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="liam@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#E10600]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">Select Catalog Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#E10600] bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({formatPKR(p.price)} &bull; {p.stock} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#37474F] mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={selectedQty}
                    onChange={(e) => setSelectedQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#E10600]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#37474F] mb-1">Payment Method</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#E10600] bg-white"
                  >
                    <option value="Credit Card">Credit Card (Prepaid)</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">Shipping Destination City</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="Austin, TX"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#E10600]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold"
                >
                  {isSubmitting ? 'Creating Order...' : 'Confirm & Save Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
