import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ShieldCheck, Heart, Sparkles, Server, Zap, ArrowRight, Award, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentRoute } = useApp();

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-dots-pattern border-b border-[#E5E7EB] py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-red-50 text-[#E10600] border border-red-200 text-xs font-bold uppercase tracking-wider">
            Our Purpose & Mission
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#37474F] tracking-tight">
            Empowering Modern Merchants to Master E-Commerce Logistics
          </h1>
          <p className="text-lg text-[#455A64] leading-relaxed max-w-2xl mx-auto">
            StorePilot was built on a simple conviction: online merchants should spend their time delighting customers and crafting great products, not wrestling with broken spreadsheets, untracked courier remittances, and stockout panics.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-[#E10600] uppercase tracking-wider">The StorePilot Story</span>
            <h2 className="text-3xl font-extrabold text-[#37474F]">
              Designed From the Ground Up for Real-World Retail
            </h2>
            <p className="text-base text-[#455A64] leading-relaxed">
              When an online store starts growing from 20 orders a day to 2,000, operational friction multiplies exponentially. Stock that was sold on Shopify is simultaneously purchased on Amazon. Couriers collect cash on delivery, but verifying whether those funds ever land in the merchant’s bank account takes weeks of stressful cross-checking.
            </p>
            <p className="text-base text-[#455A64] leading-relaxed">
              StorePilot unifies every moving part — orders, stock thresholds, couriers, return requests, and COD reconciliation — into one single, transparent, and responsive cockpit.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-gray-200">
                <div className="text-2xl font-extrabold text-[#37474F]">500K+</div>
                <div className="text-xs text-gray-500 mt-1">Orders Orchestrated Monthly</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-gray-200">
                <div className="text-2xl font-extrabold text-[#E10600]">99.98%</div>
                <div className="text-xs text-gray-500 mt-1">Platform Ingestion Uptime</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl p-8 bg-gradient-to-br from-[#37474F] to-[#263238] text-white shadow-xl space-y-6">
              <h3 className="text-2xl font-bold">Our Core Commitments</h3>
              
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20 text-red-400 mt-0.5">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Zero Data Fabrication</h4>
                    <p className="text-xs text-slate-400 mt-0.5">We clearly distinguish live authenticated store data from demo test data. Sample metrics are never disguised as real.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
                    <Server size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Server-Side Security First</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Shopify API secrets, OAuth access tokens, and private customer information are guarded strictly on secure server environments.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Speed & Accessibility</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Built on modern responsive web standards for seamless desktop and mobile warehouse scanner usage.</p>
                  </div>
                </div>
              </div>

              {/* Brand Credit Mention */}
              <div className="pt-4 border-t border-slate-700/80 text-xs text-slate-400 flex items-center justify-between">
                <span>Product Architecture & Brand Identity</span>
                <span className="font-bold text-white">Design by <span className="text-[#E10600]">Hanzala04</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F8FAFC] py-16 border-t border-[#E5E7EB] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-[#37474F]">Ready to explore the StorePilot workspace?</h3>
          <p className="text-sm text-[#455A64] mt-2 mb-6">
            Jump directly into our demo store or connect your Shopify credentials.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentRoute('dashboard')}
              className="px-6 py-3 rounded-xl bg-[#37474F] hover:bg-[#263238] text-white text-sm font-bold transition-all"
            >
              Open Live Demo
            </button>
            <button
              onClick={() => setCurrentRoute('signup')}
              className="px-6 py-3 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-sm font-bold transition-all"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
