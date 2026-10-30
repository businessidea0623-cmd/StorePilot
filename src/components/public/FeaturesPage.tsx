import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ShoppingBag,
  Layers,
  CreditCard,
  Truck,
  RotateCcw,
  BarChart3,
  Plug,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  RefreshCw,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const { setCurrentRoute } = useApp();
  const [activeCategory, setActiveCategory] = useState<'all' | 'orders' | 'inventory' | 'cod' | 'shipping' | 'returns'>('all');

  const detailedFeatures = [
    {
      id: 'orders',
      icon: ShoppingBag,
      title: 'Unified Multi-Channel Order Hub',
      subtitle: 'Zero duplicate entries across Shopify, Amazon & Marketplaces',
      badge: 'Core Engine',
      description: 'Centralize every incoming customer order into a single high-velocity queue. Track order states from payment capture to final fulfillment.',
      capabilities: [
        'Real-time webhook ingestion from Shopify GraphQL Admin API',
        'Bulk fulfillment & tracking ID generation with courier carriers',
        'Customer address validation & fraud risk scoring',
        'Granular order audit timeline and internal team notes',
        'Instant CSV / Excel order export for accounting compliance',
      ],
      stats: '48% faster order processing cycle',
    },
    {
      id: 'inventory',
      icon: Layers,
      title: 'Smart Inventory & Stock Control',
      subtitle: 'Bi-directional multi-location sync to prevent overselling',
      badge: 'Warehouse Sync',
      description: 'Keep your product catalog perfectly in sync across multiple digital storefronts and physical warehouses.',
      capabilities: [
        'Automatic stock reservation on checkout',
        'Custom low-stock threshold triggers and email notifications',
        'Multi-variant management (Color, Size, Material, Bundle SKU)',
        'Stock adjustment logs with user attribution and reason audits',
        'Reorder point calculators based on 30-day velocity',
      ],
      stats: '99.4% stock accuracy across channels',
    },
    {
      id: 'cod',
      icon: CreditCard,
      title: 'Cash on Delivery (COD) & Reconciliation',
      subtitle: 'Eliminate courier leakage and delayed remittances',
      badge: 'Finance Protection',
      description: 'COD orders represent high revenue volume but high risk. StorePilot automates the verification, dispatch, and courier remittance tracking.',
      capabilities: [
        'Automated COD order tagging and buyer phone verification',
        'Courier remittance slip parser (Blue Dart, Shiprocket, Delhivery)',
        'Uncollected cash alerts after 5 business days post-delivery',
        'Net payment reconciliation directly with your bank statements',
        'COD return-to-origin (RTO) risk prediction',
      ],
      stats: '3.2x faster courier cash settlements',
    },
    {
      id: 'shipping',
      icon: Truck,
      title: 'Multi-Carrier Shipping & Live Tracking',
      subtitle: 'FedEx, DHL Express, Blue Dart, Shiprocket & Delhivery',
      badge: 'Logistics Network',
      description: 'Compare carrier transit times, generate compliant shipping manifests, and send real-time branded tracking alerts to shoppers.',
      capabilities: [
        'Direct carrier API connections or manual manifest tracking',
        'End-to-end tracking timeline: Picked Up -> In Transit -> Out for Delivery -> Delivered',
        'Failed delivery attempt alerts (NDR) with instant re-attempt triggers',
        'Return label auto-generation for reverse logistics',
        'Carrier SLA compliance scorecards',
      ],
      stats: '94% first-attempt delivery rate',
    },
    {
      id: 'returns',
      icon: RotateCcw,
      title: 'Returns & Refund Automation',
      subtitle: 'Turn returns into repeat customer opportunities',
      badge: 'Reverse Logistics',
      description: 'Manage reverse pickups, warehouse quality inspections, and issue refunds directly to payment gateways without manual friction.',
      capabilities: [
        'Structured return reasons (Defective, Size Mismatch, Wrong Item)',
        'Warehouse inspection approval workflow before refund dispatch',
        'Automatic inventory restock upon package inspection',
        'Integrated gateway refund triggers via Stripe or Store Credit',
        'Return rate analytics by product category and SKU',
      ],
      stats: '35% reduction in return processing overhead',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Executive Analytics & Margins',
      subtitle: 'Real-time profit margins, net revenue and channel breakdown',
      badge: 'Intelligence',
      description: 'Know your true net numbers. StorePilot calculates gross sales minus discounts, returns, carrier shipping fees, and taxes.',
      capabilities: [
        'Net profit calculation after factoring product COGS and courier fees',
        'Channel performance comparison (Shopify vs Amazon vs POS)',
        'Customer Lifetime Value (LTV) and repeat purchase frequency',
        'Dead stock and slow-moving SKU reports',
        'Scheduled automated PDF / CSV export to management',
      ],
      stats: '100% accurate financial visibility',
    },
  ];

  const filtered = activeCategory === 'all'
    ? detailedFeatures
    : detailedFeatures.filter((f) => f.id === activeCategory);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-dots-pattern border-b border-[#E5E7EB] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-3.5 py-1.5 rounded-full bg-red-50 text-[#E10600] border border-red-200 text-xs font-bold uppercase tracking-wider">
            Enterprise Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#37474F] mt-4 tracking-tight">
            Engineered For Frictionless E-Commerce Operations
          </h1>
          <p className="text-lg text-[#455A64] max-w-2xl mx-auto mt-4">
            Explore the comprehensive feature suite powering modern direct-to-consumer and multi-channel retailers.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Modules' },
              { id: 'orders', label: 'Order Hub' },
              { id: 'inventory', label: 'Inventory Sync' },
              { id: 'cod', label: 'COD Reconciliation' },
              { id: 'shipping', label: 'Courier Tracking' },
              { id: 'returns', label: 'Returns & Refunds' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#37474F] text-white shadow-sm'
                    : 'bg-white text-[#455A64] border border-gray-200 hover:border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Deep Dive Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        {filtered.map((item, idx) => {
          const Icon = item.icon;
          const isEven = idx % 2 === 0;
          return (
            <div
              key={item.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                !isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text Side */}
              <div className={`lg:col-span-7 space-y-5 ${!isEven ? 'lg:order-2' : ''}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E10600] flex items-center justify-center font-bold">
                    <Icon size={22} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#168BCE]">
                    {item.badge}
                  </span>
                </div>

                <h2 className="text-3xl font-extrabold text-[#37474F]">{item.title}</h2>
                <p className="text-base text-gray-500 font-medium">{item.subtitle}</p>
                <p className="text-sm text-[#455A64] leading-relaxed">{item.description}</p>

                <div className="space-y-2.5 pt-2">
                  {item.capabilities.map((cap, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2.5 text-sm text-[#37474F]">
                      <CheckCircle2 size={17} className="text-[#16A34A] shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    onClick={() => setCurrentRoute('signup')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-sm font-bold transition-all shadow-sm shadow-red-500/20"
                  >
                    Test Drive Module <ArrowRight size={15} />
                  </button>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    {item.stats}
                  </span>
                </div>
              </div>

              {/* Graphic / Mockup Card Side */}
              <div className={`lg:col-span-5 ${!isEven ? 'lg:order-1' : ''}`}>
                <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-gray-200 shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                    <span className="text-xs font-bold text-[#37474F]">Active Operations Simulation</span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <Zap size={13} /> Synchronized
                    </span>
                  </div>

                  {/* Visual card content based on feature */}
                  <div className="space-y-3">
                    <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className="text-xs font-bold text-gray-700">GraphQL Webhook Gateway</div>
                      <div className="text-[11px] text-gray-500 font-mono mt-1">orders/create & inventory_levels/update</div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#168BCE] h-full w-4/5 rounded-full"></div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#37474F]">Courier Manifest Dispatch</div>
                        <div className="text-[11px] text-gray-500">FedEx Priority & Blue Dart COD</div>
                      </div>
                      <span className="px-2 py-1 rounded bg-red-50 text-[#E10600] text-[10px] font-bold">
                        Auto-Routed
                      </span>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-600">Reconciliation Match</span>
                        <span className="text-emerald-600 font-mono">100% Verified</span>
                      </div>
                      <div className="text-[11px] text-gray-400">Zero unaccounted cash across active shipments</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA Bottom */}
      <section className="bg-[#F8FAFC] py-16 border-t border-[#E5E7EB] text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#37474F]">
            Ready to integrate StorePilot with your store?
          </h3>
          <p className="text-sm text-[#455A64] mt-2 mb-6">
            Get started in demo mode immediately or connect your live Shopify store credentials.
          </p>
          <button
            onClick={() => setCurrentRoute('signup')}
            className="px-8 py-3.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-base font-bold shadow-md shadow-red-500/20"
          >
            Launch StorePilot Today
          </button>
        </div>
      </section>
    </div>
  );
};
