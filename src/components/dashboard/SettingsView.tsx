import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Settings, ShieldCheck, RefreshCw, Bell, Globe, Save, AlertTriangle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { workspace, resetDemoData, showToast } = useApp();
  const [storeName, setStoreName] = useState(workspace?.name || 'Indus Apparel Official');
  const [currency, setCurrency] = useState(workspace?.currency || 'PKR');
  const [taxRate, setTaxRate] = useState('8.0');
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [codAlerts, setCodAlerts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Settings saved successfully!');
    }, 600);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset the demo dataset to initial seed state?')) {
      setResetting(true);
      await resetDemoData();
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
          Workspace Settings & Configuration
        </h1>
        <p className="text-xs sm:text-sm text-[#455A64]">
          Manage your organizational preferences, currency formatting, and operational alerts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General Store Profile */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#37474F] flex items-center gap-2">
            <Globe size={18} className="text-[#E10600]" /> General Store Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1">Workspace / Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none bg-white font-medium"
              >
                <option value="PKR">PKR (Rs.) - Pakistani Rupee (Default)</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="AED">AED (AED) - UAE Dirham</option>
                <option value="SAR">SAR (SAR) - Saudi Riyal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1">Standard Sales Tax Rate (%)</label>
              <input
                type="text"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1">Default Order Origin Timezone</label>
              <select className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none bg-white font-medium">
                <option>UTC+05:00 Asia/Karachi (PKT - Pakistan Standard Time)</option>
                <option>UTC+04:00 Asia/Dubai (Gulf Standard Time)</option>
                <option>UTC+00:00 Western Europe (London)</option>
                <option>UTC-05:00 Eastern Time (US & Canada)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#37474F] flex items-center gap-2">
            <Bell size={18} className="text-[#168BCE]" /> Alert & Automation Rules
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-gray-100 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-[#37474F]">Low Stock Warning Notifications</div>
                <div className="text-[11px] text-gray-500">Trigger alerts when any SKU drops below defined threshold</div>
              </div>
              <input
                type="checkbox"
                checked={lowStockAlerts}
                onChange={(e) => setLowStockAlerts(e.target.checked)}
                className="w-4 h-4 text-[#E10600] rounded focus:ring-[#E10600]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-gray-100 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-[#37474F]">COD Remittance Reconciliation Alerts</div>
                <div className="text-[11px] text-gray-500">Notify operations team if courier remittance is delayed past 5 business days</div>
              </div>
              <input
                type="checkbox"
                checked={codAlerts}
                onChange={(e) => setCodAlerts(e.target.checked)}
                className="w-4 h-4 text-[#E10600] rounded focus:ring-[#E10600]"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold transition-all shadow-sm shadow-red-500/20 flex items-center gap-2"
          >
            <Save size={15} /> {saving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>

      </form>

      {/* Free Cloudflare Pages Export & Deployment Pack */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-2xl border border-amber-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
              CF
            </span>
            <span>Cloudflare Pages 100% Free Public Deployment</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
            $0 / mo &bull; No Card Required
          </span>
        </div>

        <p className="text-xs text-amber-950 leading-relaxed">
          Your production build is compiled and verified in the <code className="px-1.5 py-0.5 rounded bg-amber-100 font-mono text-amber-900">/dist</code> folder with relative paths, SPA redirects, and offline state engine. You can download the production package and upload it directly to Cloudflare Pages for a free <code className="font-mono text-amber-900">*.pages.dev</code> address.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href="/api/export/dist"
            download="storepilot-production-dist.tar.gz"
            className="px-4 py-2.5 rounded-xl bg-[#37474F] hover:bg-[#263238] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <span>Download Production Build (.tar.gz)</span>
          </a>
          <a
            href="/api/export/source"
            download="storepilot-source.tar.gz"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#37474F] border border-gray-300 text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <span>Download Full Source (.tar.gz)</span>
          </a>
          <a
            href="https://dash.cloudflare.com/sign-up"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Open Cloudflare Dashboard &rarr;</span>
          </a>
        </div>
      </div>

      {/* Demo Sandbox Management */}
      <div className="bg-red-50/60 p-6 rounded-2xl border border-red-200 space-y-4">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle size={18} />
          <h3 className="text-base font-bold">Demo Sandbox Reset</h3>
        </div>
        <p className="text-xs text-red-900 leading-relaxed">
          Need a fresh testing environment? You can reset the persistent database back to the pristine default seed data containing sample orders, apparel & electronics products, COD records, and tracking shipments.
        </p>

        <button
          onClick={handleReset}
          disabled={resetting}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
        >
          <RefreshCw size={14} className={resetting ? 'animate-spin' : ''} />
          <span>{resetting ? 'Resetting Sandbox...' : 'Reset Demo Dataset Now'}</span>
        </button>
      </div>

    </div>
  );
};
