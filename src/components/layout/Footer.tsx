import React from 'react';
import { Logo } from '../common/Logo.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { ShieldCheck, Sparkles, Heart, Globe, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentRoute } = useApp();

  return (
    <footer className="bg-[#1E293B] text-slate-300 border-t border-slate-700/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-700/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-2 rounded-xl inline-block">
              <Logo size="md" />
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              StorePilot is the unified multi-channel e-commerce command center. Manage orders, products, inventory, payments, returns and multi-carrier courier tracking from one lightning-fast workspace.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Official Shopify Partner API
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950/60 text-blue-400 border border-blue-800 text-xs font-semibold">
                <ShieldCheck size={13} />
                SOC-2 & GDPR Ready
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentRoute('features')} className="hover:text-white transition-colors">
                  Order Orchestration
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('features')} className="hover:text-white transition-colors">
                  Inventory & Stock Alerts
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('features')} className="hover:text-white transition-colors">
                  COD Reconciliation
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('features')} className="hover:text-white transition-colors">
                  Multi-Carrier Tracking
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('features')} className="hover:text-white transition-colors">
                  Returns & Refunds Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Integrations</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentRoute('features')} className="hover:text-white transition-colors flex items-center gap-1">
                  Shopify GraphQL <ArrowUpRight size={13} />
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('features')} className="hover:text-white transition-colors">
                  WooCommerce
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('features')} className="hover:text-white transition-colors">
                  Amazon Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('features')} className="hover:text-white transition-colors">
                  Blue Dart & Shiprocket
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('features')} className="hover:text-white transition-colors">
                  FedEx & DHL Express
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('features')} className="hover:text-white transition-colors">
                  Stripe & Razorpay
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentRoute('about')} className="hover:text-white transition-colors">
                  About StorePilot
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('blog')} className="hover:text-white transition-colors">
                  E-Com Insights Blog
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('contact')} className="hover:text-white transition-colors">
                  Contact Sales & Support
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute('login')} className="hover:text-white transition-colors">
                  Customer Portal
                </button>
              </li>
              <li>
                <span className="text-xs text-slate-400 block pt-1">
                  Status: <span className="text-emerald-400 font-medium">All Systems Operational</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with required brand credit */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} StorePilot Technologies Inc. All rights reserved.
          </div>

          {/* CRITICAL BRAND CREDIT */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-medium shadow-sm">
            <span>Crafted with precision</span>
            <span className="text-slate-500">•</span>
            <span className="text-white font-bold tracking-wide">
              Design by <span className="text-[#E10600]">Hanzala04</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button onClick={() => setCurrentRoute('about')} className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setCurrentRoute('about')} className="hover:text-slate-200 transition-colors">
              Terms of Service
            </button>
            <button onClick={() => setCurrentRoute('contact')} className="hover:text-slate-200 transition-colors">
              Security
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
