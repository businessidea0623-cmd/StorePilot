import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Layers,
  Truck,
  RotateCcw,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { formatPKR, formatPKDate, formatPKDateTime } from '../../utils/formatters.ts';

export const OverviewView: React.FC = () => {
  const {
    metrics,
    orders,
    products,
    shipments,
    returns,
    payments,
    setCurrentRoute,
    setSelectedOrderForModal,
    syncShopify,
  } = useApp();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await syncShopify();
    setSyncing(false);
  };

  const chartData = dateRange === '7d'
    ? [
        { label: 'Mon', sales: 48500, orders: 4 },
        { label: 'Tue', sales: 62400, orders: 7 },
        { label: 'Wed', sales: 54200, orders: 5 },
        { label: 'Thu', sales: 78900, orders: 8 },
        { label: 'Fri', sales: 94500, orders: 11 },
        { label: 'Sat', sales: 138000, orders: 14 },
        { label: 'Sun', sales: 112500, orders: 12 },
      ]
    : dateRange === '30d'
    ? [
        { label: 'Wk 1', sales: 320000, orders: 28 },
        { label: 'Wk 2', sales: 410000, orders: 36 },
        { label: 'Wk 3', sales: 495000, orders: 44 },
        { label: 'Wk 4', sales: 580000, orders: 52 },
      ]
    : [
        { label: 'Month 1', sales: 1540000, orders: 140 },
        { label: 'Month 2', sales: 1980000, orders: 185 },
        { label: 'Month 3', sales: 2390000, orders: 220 },
      ];

  const maxSale = Math.max(...chartData.map((d) => d.sales));

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
            Operations Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#455A64]">
            Unified metrics across Shopify, marketplaces, and active courier dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentRoute('orders')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold transition-all shadow-sm shadow-red-500/20"
          >
            <Plus size={15} /> New Order
          </button>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:bg-slate-50 text-xs font-bold text-[#37474F] transition-colors"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin text-[#E10600]' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync Data'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Sales */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="p-2 rounded-xl bg-red-50 text-[#E10600]">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#37474F]">
              {formatPKR(metrics?.totalSales)}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
              <span>+18.4%</span>
              <span className="text-gray-400 font-normal">vs last week (PKT)</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-blue-50 text-[#168BCE]">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#37474F]">
              {metrics?.totalOrders || orders.length}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
              <span className="text-amber-600 font-bold">{metrics?.pendingOrders || 0} pending</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">{metrics?.fulfilledOrders || 0} fulfilled</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Warnings</span>
            <div className="p-2 rounded-xl bg-amber-50 text-[#F59E0B]">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F59E0B]">
              {metrics?.lowStockCount || 0}
            </div>
            <button
              onClick={() => setCurrentRoute('inventory')}
              className="text-[11px] font-bold text-[#168BCE] hover:underline mt-1 block"
            >
              Inspect Stock Thresholds &rarr;
            </button>
          </div>
        </div>

        {/* COD Uncollected / Remittances */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">COD Uncollected (PKR)</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-[#16A34A]">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#E10600]">
              {formatPKR(metrics?.codPendingAmount)}
            </div>
            <div className="text-[11px] font-medium text-gray-500 mt-1">
              {formatPKR(metrics?.codReconciledAmount)} reconciled in bank
            </div>
          </div>
        </div>

      </div>

      {/* Main Interactive Sales Trend & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales Trend Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#37474F]">Net Sales & Order Velocity</h3>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-gray-600">
                  Asia/Karachi PKT
                </span>
              </div>
              <p className="text-xs text-gray-500">Real-time revenue in PKR across Pakistani store channels</p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-bold">
              {(['7d', '30d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    dateRange === r ? 'bg-white text-[#37474F] shadow-xs' : 'text-gray-500'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-56 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-gray-100">
            {chartData.map((d, idx) => {
              const heightPct = Math.max(12, Math.round((d.sales / maxSale) * 100));
              const isLatest = idx === chartData.length - 1;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#37474F] text-white text-[11px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 shadow-md">
                    {formatPKR(d.sales)} ({d.orders} orders)
                  </div>
                  
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isLatest
                        ? 'bg-gradient-to-t from-[#B80500] to-[#E10600]'
                        : 'bg-slate-200 group-hover:bg-[#168BCE]'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[11px] font-semibold text-gray-500 group-hover:text-[#37474F]">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E10600]"></span> Current Period Sales (PKR)
            </span>
            <button
              onClick={() => setCurrentRoute('analytics')}
              className="text-[#168BCE] font-bold hover:underline"
            >
              View Full Analytics Report &rarr;
            </button>
          </div>
        </div>

        {/* Channels & Operational Status */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#37474F]">Channel Distribution</h3>
            <p className="text-xs text-gray-500 mb-4">Volume by connected digital storefront</p>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#37474F] mb-1">
                  <span>Indus Apparel (Shopify PKR)</span>
                  <span className="text-[#E10600]">74% (Rs. 62,800)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#E10600] h-full w-[74%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#37474F] mb-1">
                  <span>Daraz Marketplace</span>
                  <span className="text-[#168BCE]">20% (Rs. 18,200)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#168BCE] h-full w-[20%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#37474F] mb-1">
                  <span>Direct WhatsApp / Manual COD</span>
                  <span className="text-slate-500">6% (Rs. 5,100)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full w-[6%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">TCS / Leopards SLA</span>
              <span className="font-bold text-emerald-600">97.2% On-Time</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">COD Return-to-Origin (RTO)</span>
              <span className="font-bold text-[#37474F]">2.8% (Exceptional)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Two Column Grid: Recent Orders & Active Shipments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#37474F]">Recent Customer Orders (PKR)</h3>
              <p className="text-xs text-gray-500">Click any row to open the complete fulfillment drawer</p>
            </div>
            <button
              onClick={() => setCurrentRoute('orders')}
              className="text-xs font-bold text-[#E10600] hover:underline"
            >
              View All ({orders.length}) &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-500 font-bold uppercase border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Total (PKR)</th>
                  <th className="py-2.5 px-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => {
                      setSelectedOrderForModal(ord);
                      setCurrentRoute('orders');
                    }}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-[#37474F]">{ord.orderNumber}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#37474F]">{ord.customerName}</div>
                      <div className="text-[10px] text-gray-400">{ord.storeName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === 'fulfilled' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        ord.status === 'in_transit' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        ord.status === 'returned' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ord.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-[#37474F]">
                      {formatPKR(ord.totalAmount)}
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      {ord.paymentMethod}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Courier & Shipping Timeline Activity */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#37474F]">Active Dispatches</h3>
              <button
                onClick={() => setCurrentRoute('shipping')}
                className="text-xs font-bold text-[#168BCE] hover:underline"
              >
                Track All &rarr;
              </button>
            </div>

            <div className="space-y-4">
              {shipments.slice(0, 3).map((shp) => (
                <div key={shp.id} className="p-3 rounded-xl bg-slate-50 border border-gray-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#37474F]">{shp.trackingNumber}</span>
                    <span className="font-semibold text-gray-500">{shp.carrier}</span>
                  </div>
                  <div className="text-gray-600 text-[11px]">
                    Order {shp.orderNumber} &bull; Destination: {shp.destination}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 pt-1">
                    <CheckCircle2 size={13} />
                    <span>{shp.currentLocation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Returns Pending:</span>
            <span className="font-bold text-[#E10600]">
              {returns.filter((r) => r.status === 'pending_review').length} awaiting inspection
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
