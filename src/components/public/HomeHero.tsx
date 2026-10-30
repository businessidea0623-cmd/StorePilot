import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ArrowRight,
  TrendingUp,
  Package,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  ShoppingBag,
  Clock,
  ExternalLink,
} from 'lucide-react';

import { formatPKR } from '../../utils/formatters.ts';

export const HomeHero: React.FC = () => {
  const { setCurrentRoute, metrics, orders, products } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');

  const totalSalesFormatted = metrics ? formatPKR(metrics.totalSales) : 'Rs. 98,450.00';
  const totalOrdersCount = metrics ? metrics.totalOrders : 28;
  const fulfilledCount = metrics ? metrics.fulfilledOrders : 18;
  const lowStockCount = metrics ? metrics.lowStockCount : 3;

  return (
    <section className="relative overflow-hidden bg-white border-b border-[#E5E7EB]">
      {/* Subtle pale-pink dotted pattern background per design spec */}
      <div className="absolute inset-0 bg-dots-pattern opacity-80 pointer-events-none" />

      {/* Ambient gradient glow */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-red-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-[#E10600]">
              <span className="flex h-2 w-2 rounded-full bg-[#E10600] animate-pulse"></span>
              MULTI-CHANNEL E-COMMERCE SUITE
            </div>

            {/* Suggested uppercase hero heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#37474F] tracking-tight leading-[1.1] uppercase">
              MANAGE YOUR ENTIRE <span className="text-[#E10600]">E-COMMERCE</span> BUSINESS FROM ONE PLACE
            </h1>

            {/* Supporting paragraph */}
            <p className="text-lg sm:text-xl text-[#455A64] font-normal leading-relaxed max-w-xl">
              Manage orders, products, inventory, payments, returns and shipping through one powerful workspace built for modern online businesses.
            </p>

            {/* Two CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => setCurrentRoute('signup')}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-base font-bold tracking-wide transition-all shadow-md shadow-red-500/25 active:scale-[0.98]"
              >
                GET STARTED
                <ArrowRight size={19} />
              </button>

              <button
                onClick={() => setCurrentRoute('features')}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-[#37474F] hover:text-[#168BCE] border-2 border-[#E5E7EB] hover:border-[#168BCE]/40 text-base font-bold transition-all"
              >
                EXPLORE FEATURES
              </button>
            </div>

            {/* Key trust bullets */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-[#455A64]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#16A34A]" />
                <span>Shopify GraphQL Synced</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#16A34A]" />
                <span>COD Reconciliation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#16A34A]" />
                <span>Instant Demo Mode</span>
              </div>
            </div>
          </div>

          {/* Right Column: Professional Dashboard Preview (Inspired by reference screenshot) */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-xl lg:max-w-none rounded-2xl bg-white p-3 sm:p-5 shadow-2xl border border-[#E5E7EB] ring-1 ring-black/5">
              
              {/* Window controls bar */}
              <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="ml-2 text-xs font-bold text-gray-500">StorePilot Control Panel • v2.4</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Live Syncing
                </div>
              </div>

              {/* Interactive preview tabs */}
              <div className="flex items-center gap-2 mb-4 bg-gray-50 p-1 rounded-lg text-xs font-bold text-gray-600">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-1.5 rounded-md transition-all ${
                    activeTab === 'overview' ? 'bg-white text-[#37474F] shadow-sm' : 'hover:text-[#37474F]'
                  }`}
                >
                  Operations KPI
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 py-1.5 rounded-md transition-all ${
                    activeTab === 'orders' ? 'bg-white text-[#37474F] shadow-sm' : 'hover:text-[#37474F]'
                  }`}
                >
                  Live Orders ({totalOrdersCount})
                </button>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`flex-1 py-1.5 rounded-md transition-all ${
                    activeTab === 'inventory' ? 'bg-white text-[#37474F] shadow-sm' : 'hover:text-[#37474F]'
                  }`}
                >
                  Low Stock ({lowStockCount})
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100">
                      <div className="text-[11px] font-semibold text-gray-500">Gross Sales</div>
                      <div className="text-xl font-extrabold text-[#37474F] mt-0.5">{totalSalesFormatted}</div>
                      <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                        <TrendingUp size={11} /> +18.4% this wk
                      </div>
                    </div>

                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100">
                      <div className="text-[11px] font-semibold text-gray-500">Fulfilled Rate</div>
                      <div className="text-xl font-extrabold text-[#168BCE] mt-0.5">
                        {Math.round((fulfilledCount / Math.max(1, totalOrdersCount)) * 100)}%
                      </div>
                      <div className="text-[10px] font-medium text-gray-500 mt-1">
                        {fulfilledCount} dispatched
                      </div>
                    </div>

                    <div className="bg-red-50/60 p-3 rounded-xl border border-red-100">
                      <div className="text-[11px] font-semibold text-red-800">COD Unsettled</div>
                      <div className="text-xl font-extrabold text-[#E10600] mt-0.5">
                        {metrics ? formatPKR(metrics.codPendingAmount) : 'Rs. 6,514.00'}
                      </div>
                      <div className="text-[10px] font-semibold text-red-600 mt-1">
                        Trax / TCS pending
                      </div>
                    </div>
                  </div>

                  {/* Micro Visual Chart Mockup */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200/80">
                    <div className="flex items-center justify-between text-xs font-bold text-[#37474F] mb-2.5">
                      <span>Weekly Sales Velocity (PKR)</span>
                      <span className="text-[#168BCE] text-[11px]">Asia/Karachi PKT Feed</span>
                    </div>
                    {/* SVG Curve */}
                    <div className="h-20 w-full flex items-end gap-1.5 pt-2">
                      {[42, 65, 50, 78, 62, 85, 94, 82, 98, 115, 110, 128].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-t transition-all ${
                              idx >= 8 ? 'bg-[#E10600]' : 'bg-slate-300'
                            }`}
                            style={{ height: `${(val / 130) * 60}px` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                      <span className="font-bold text-[#E10600]">Today</span>
                    </div>
                  </div>

                  {/* Recent Order Item strip */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <Truck size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#37474F]">Order SP-1002 In Transit (Leopards)</div>
                        <div className="text-[11px] text-gray-500">Destination: Lahore, Punjab &bull; Rs. 21,006.00</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                      On Schedule
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Orders */}
              {activeTab === 'orders' && (
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {orders.slice(0, 4).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl bg-gray-50 hover:bg-red-50/40 border border-gray-200 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#37474F]">{ord.orderNumber}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            ord.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                            ord.status === 'returned' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {ord.customerName} &bull; {ord.items[0]?.title || 'Item'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-[#37474F]">{formatPKR(ord.totalAmount)}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{ord.paymentMethod}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Inventory */}
              {activeTab === 'inventory' && (
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {products.slice(0, 4).map((prod) => (
                    <div
                      key={prod.id}
                      className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#37474F] line-clamp-1">{prod.title}</div>
                          <div className="text-[10px] font-mono text-gray-500">{prod.sku}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          prod.stock === 0 ? 'bg-red-100 text-red-700' :
                          prod.stock <= prod.lowStockThreshold ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} in stock`}
                        </span>
                        <div className="text-[10px] font-bold text-gray-600 mt-0.5">{formatPKR(prod.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer action inside preview */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">Ready to explore with real or demo store data?</span>
                <button
                  onClick={() => setCurrentRoute('dashboard')}
                  className="font-bold text-[#E10600] hover:text-[#B80500] flex items-center gap-1 transition-colors"
                >
                  Launch Applet Demo <ExternalLink size={12} />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
