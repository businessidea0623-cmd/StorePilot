import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ShoppingBag,
  Layers,
  Truck,
  RotateCcw,
  CreditCard,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe2,
  Lock,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const HomeFeatures: React.FC = () => {
  const { setCurrentRoute } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const integrations = [
    { name: 'Shopify Admin GraphQL', tag: 'Native OAuth', color: 'from-emerald-500 to-green-600' },
    { name: 'WooCommerce API', tag: 'REST v3', color: 'from-purple-500 to-indigo-600' },
    { name: 'Amazon Marketplace', tag: 'SP-API', color: 'from-amber-500 to-yellow-600' },
    { name: 'FedEx Express', tag: 'Direct Tracking', color: 'from-purple-600 to-orange-500' },
    { name: 'DHL Global', tag: 'Express Courier', color: 'from-yellow-500 to-red-600' },
    { name: 'Blue Dart & Delhivery', tag: 'COD Courier', color: 'from-blue-500 to-cyan-600' },
    { name: 'Shiprocket', tag: 'Aggregator API', color: 'from-indigo-500 to-blue-500' },
    { name: 'Stripe & Razorpay', tag: 'Auto Settlements', color: 'from-blue-600 to-sky-500' },
  ];

  const features = [
    {
      icon: ShoppingBag,
      title: 'Order Orchestration',
      description: 'Aggregate orders from Shopify, Amazon, and offline channels into a single unified queue with instant fulfillment triggers.',
      accent: '#E10600',
    },
    {
      icon: Layers,
      title: 'Real-Time Inventory Sync',
      description: 'Prevent overselling with automatic bi-directional stock synchronization, low-stock alerts, and warehouse thresholds.',
      accent: '#168BCE',
    },
    {
      icon: CreditCard,
      title: 'COD & Payment Reconciliation',
      description: 'Track cash on delivery collected by couriers, identify unpaid remittances, and reconcile bank payouts automatically.',
      accent: '#16A34A',
    },
    {
      icon: Truck,
      title: 'Multi-Carrier Tracking',
      description: 'Generate shipping labels, track parcels across FedEx, DHL, Blue Dart, and notify buyers at every milestone.',
      accent: '#37474F',
    },
    {
      icon: RotateCcw,
      title: 'Returns & Refund Portal',
      description: 'Structured return requests, inspection workflows, automated restock into inventory, and tracked customer refunds.',
      accent: '#F59E0B',
    },
    {
      icon: BarChart3,
      title: 'Multi-Channel Analytics',
      description: 'Accurate profit margins, net revenue after returns, SKU velocity analysis, and downloadable financial reports.',
      accent: '#8B5CF6',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Connect Your Store',
      description: 'Link your Shopify store via secure OAuth in 60 seconds, or activate Demo Mode to test with pre-seeded data.',
    },
    {
      step: '02',
      title: 'Unified Order Hub',
      description: 'All customer purchases, shipping details, and inventory deducts sync into a unified, lightning-fast dashboard.',
    },
    {
      step: '03',
      title: 'Courier Dispatch',
      description: 'Assign couriers, print compliant labels, and sync tracking IDs directly back to Shopify customer notifications.',
    },
    {
      step: '04',
      title: 'Audit & Reconciliation',
      description: 'Automatically match courier COD remittances and payment gateway deposits against actual shipped orders.',
    },
  ];

  const faqs = [
    {
      q: 'Does StorePilot work with real Shopify stores?',
      a: 'Yes. StorePilot integrates with the official Shopify GraphQL Admin API. You can connect your live store domain via OAuth or test all modules immediately using the pre-seeded Demo Mode.',
    },
    {
      q: 'How does Cash on Delivery (COD) reconciliation work?',
      a: 'StorePilot tags COD orders, logs courier tracking numbers, and matches courier remittance sheets (e.g. from Shiprocket, Blue Dart, or Delhivery) with orders to ensure zero uncollected cash leaks.',
    },
    {
      q: 'Can I manage multiple e-commerce stores from one account?',
      a: 'Yes! StorePilot is multi-store and multi-tenant by design. You can switch between your primary Shopify store, marketplace channels, or view aggregated cross-store metrics.',
    },
    {
      q: 'Are my customer records and API keys secure?',
      a: 'Absolutely. All sensitive credentials and tokens are stored securely in backend server variables and never exposed to the frontend client. Authorization checks are enforced on every endpoint.',
    },
    {
      q: 'Can my warehouse and support team have different permissions?',
      a: 'Yes, StorePilot includes Role-Based Access Control (RBAC) supporting Owner, Admin, Manager, and Viewer permissions with granular access boundaries.',
    },
    {
      q: 'Is StorePilot completely free to use?',
      a: 'Yes! StorePilot is 100% free with all features unlocked. There are no mandatory paid subscriptions, no monthly fees, and no credit card requirements to access the full operational dashboard.',
    },
  ];

  return (
    <div className="space-y-24 py-16">
      
      {/* Integrations Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E10600]">
            Ecosystem Connectivity
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] mt-1">
            Built for Modern E-Commerce Channels
          </h2>
          <p className="text-sm text-[#455A64] mt-2">
            Seamlessly sync orders, inventory, tracking, and payments across your favorite platforms.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {integrations.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 bg-white hover:border-[#168BCE]/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} text-white flex items-center justify-center font-bold text-xs`}>
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {item.tag}
                </span>
              </div>
              <div className="text-sm font-bold text-[#37474F]">{item.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E10600]">
            Core Modules
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#37474F] mt-1">
            Everything You Need to Run E-Commerce at Scale
          </h2>
          <p className="text-base text-[#455A64] mt-2">
            Eliminate fragmented spreadsheets and 5 different browser tabs. StorePilot orchestrates your entire online fulfillment lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-2xl bg-white border border-[#E5E7EB] hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-13 h-13 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${feat.accent}15`, color: feat.accent }}
                  >
                    <Icon size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-[#37474F] mb-3">{feat.title}</h3>
                  <p className="text-sm text-[#455A64] leading-relaxed">{feat.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-bold text-[#37474F] group-hover:text-[#E10600] transition-colors">
                  <span>Explore module workflow</span>
                  <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workflow Explanation */}
      <section className="bg-[#F8FAFC] py-20 border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#168BCE]">
              Operational Velocity
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#37474F] mt-1">
              How StorePilot Streamlines Your Store
            </h2>
            <p className="text-base text-[#455A64] mt-2">
              From the moment an order arrives to final courier remittance in your bank account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between"
              >
                <div className="text-3xl font-extrabold text-slate-200 font-mono mb-4">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#37474F] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#455A64] leading-relaxed">{step.description}</p>
                </div>
                <div className="mt-6 w-8 h-1 bg-[#E10600] rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Comparison / Value Prop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#37474F] to-[#263238] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold uppercase tracking-wide">
                Built For Scaling Brands
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Stop Losing Up To 12% Of Revenue To COD Shortfalls & Stockout Errors
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Online stores running on manual sheets routinely experience delayed courier remittances, overselling during flash sales, and mismanaged return packages. StorePilot automates the entire loop with zero guesswork.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-sm font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span>3.2x Faster COD Settlement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span>99.4% Stock Sync Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span>48% Less Fulfillment Time</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">100% Free</div>
              <div className="text-xs font-bold text-red-300 uppercase tracking-wider mb-2">
                All Capabilities Unlocked
              </div>
              <p className="text-xs text-slate-300 mb-6 max-w-xs">
                Manage your orders, inventory, courier tracking, and COD reconciliation with zero subscription fees and no credit card required.
              </p>
              <button
                onClick={() => setCurrentRoute('signup')}
                className="w-full py-3.5 px-6 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white font-bold text-sm transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
              >
                Launch Free Workspace <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need. Completely Free. Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-50 border border-[#E5E7EB] p-8 sm:p-14 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-[#16A34A]" />
              Zero Subscriptions &bull; Zero Hidden Costs
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#37474F] tracking-tight">
              Everything You Need. Completely Free.
            </h2>
            <p className="text-base sm:text-lg text-[#455A64] max-w-2xl mx-auto leading-relaxed">
              Manage your e-commerce operations from one place with StorePilot.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-7 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 text-[#E10600] flex items-center justify-center font-bold">
                  <ShoppingBag size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#37474F]">Full Operational Workspace</h3>
                <p className="text-xs text-[#455A64] leading-relaxed">
                  Access multi-channel order management, SKU catalog inventory tracking, automated GST tax calculations, and customer profiles with zero restrictions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={16} /> All Core Modules Included
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#168BCE] flex items-center justify-center font-bold">
                  <CreditCard size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#37474F]">COD Reconciliation & Logistics</h3>
                <p className="text-xs text-[#455A64] leading-relaxed">
                  Audit cash collections with TCS Express, Leopards, Trax Logistics, PostEx, and M&P. Reconcile courier payout slips directly into your bank balances without any paywalls.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={16} /> Unlimited Courier Remittances
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold">
                  <Truck size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#37474F]">Shopify & Multi-Store Sync</h3>
                <p className="text-xs text-[#455A64] leading-relaxed">
                  Connect your live Shopify Admin GraphQL store and synchronize products, orders, and real-time inventory balances without paying for costly third-party connector apps.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={16} /> Direct API Connectors
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentRoute('signup')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white font-bold text-sm transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setCurrentRoute('features')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#37474F] border border-gray-300 font-bold text-sm transition-all"
            >
              Explore Capabilities
            </button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E10600]">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-[#37474F] mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-base text-[#37474F] flex items-center justify-between hover:text-[#E10600] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform duration-200 ${
                    activeFaq === idx ? 'rotate-180 text-[#E10600]' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-sm text-[#455A64] leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#E10600] to-[#B80500] text-white p-10 sm:p-16 text-center shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready To Supercharge Your Store Operations?
            </h2>
            <p className="text-white/90 text-base sm:text-lg">
              Join forward-thinking e-commerce brands managing orders, couriers, and inventory with StorePilot.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCurrentRoute('signup')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-[#E10600] font-extrabold text-base hover:bg-slate-100 transition-all shadow-lg active:scale-95"
              >
                CREATE FREE ACCOUNT
              </button>
              <button
                onClick={() => setCurrentRoute('contact')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-white/40 hover:border-white text-white font-bold text-base transition-all"
              >
                SCHEDULE DEMO
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
