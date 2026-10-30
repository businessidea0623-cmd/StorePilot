import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  Layers,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { setCurrentRoute } = useApp();

  const coreModules = [
    {
      icon: ShoppingBag,
      title: 'Multi-Channel Order Hub',
      description: 'Streamline orders from Shopify, Amazon, and offline channels into one unified pipeline without restrictions.',
    },
    {
      icon: Layers,
      title: 'Real-Time Inventory Control',
      description: 'Synchronize stock levels across digital storefronts and physical warehouses with automatic safety buffers.',
    },
    {
      icon: CreditCard,
      title: 'COD Reconciliation & Audit',
      description: 'Reconcile Cash on Delivery remittances from TCS, Leopards, Trax, PostEx, and M&P without courier margins.',
    },
    {
      icon: Truck,
      title: 'Carrier Tracking & Dispatches',
      description: 'Generate shipping labels, track courier milestones, and send real-time alerts to customers across Pakistan.',
    },
    {
      icon: RotateCcw,
      title: 'Returns & Reverse Logistics',
      description: 'Quality inspection checklists, exchange routing, and gateway refunds with automated catalog restocking.',
    },
    {
      icon: BarChart3,
      title: 'Financial & Operational Reports',
      description: 'Gross sales, product COGS calculations, courier fee analysis, and net operating margin reports in PKR.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-dots-pattern border-b border-[#E5E7EB] py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-[#16A34A]" />
            100% Free Forever &bull; Zero Subscriptions
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#37474F] tracking-tight">
            Everything You Need. Completely Free.
          </h1>
          <p className="text-lg sm:text-xl text-[#455A64] max-w-2xl mx-auto leading-relaxed">
            Manage your e-commerce operations from one place with StorePilot.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentRoute('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white font-extrabold text-sm transition-all shadow-md shadow-red-500/25 flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setCurrentRoute('dashboard')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-[#37474F] border-2 border-gray-300 font-bold text-sm transition-all"
            >
              Open Live Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Showcase (No Pricing Cards or Tiers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#37474F]">
            All Platform Capabilities Included At Zero Cost
          </h2>
          <p className="text-sm text-[#455A64] mt-2">
            No tiered lockouts, no upgrade blockers, and no credit card required. StorePilot provides an enterprise-grade toolkit for every merchant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreModules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-gray-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-[#E10600] flex items-center justify-center font-bold">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[#37474F]">{item.title}</h3>
                  <p className="text-xs text-[#455A64] leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <CheckCircle2 size={16} /> Full Access Included
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparent Guarantee Callout */}
        <div className="mt-16 p-6 rounded-2xl bg-slate-50 border border-gray-200 max-w-3xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-[#37474F] font-bold text-sm">
            <ShieldCheck size={18} className="text-[#16A34A]" />
            Free & Open Operational Hub
          </div>
          <p className="text-xs text-[#455A64] leading-relaxed">
            StorePilot requires no credit card, debit card, or billing account. All dashboard modules, Shopify GraphQL synchronization, Pakistani Rupee (PKR) currency handling, and Asia/Karachi timezone features are completely available to use.
          </p>
        </div>
      </section>
    </div>
  );
};
