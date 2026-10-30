import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Plug,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Truck,
  CreditCard,
  Lock,
  X,
} from 'lucide-react';
import { formatPKTime } from '../../utils/formatters.ts';

export const IntegrationsView: React.FC = () => {
  const {
    shopifyConfig,
    connectShopify,
    syncShopify,
    disconnectShopify,
    showToast,
    setCurrentRoute,
  } = useApp();

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [storeDomain, setStoreDomain] = useState(shopifyConfig?.storeDomain || 'indus-apparel-pk.myshopify.com');
  const [apiKey, setApiKey] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeDomain.trim()) {
      showToast('Please enter your Shopify store domain', 'error');
      return;
    }
    setConnecting(true);
    const res = await connectShopify(storeDomain, apiKey);
    setConnecting(false);
    if (res.success) {
      setIsConnectModalOpen(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    await syncShopify();
    setSyncing(false);
  };

  const integrations = [
    {
      id: 'shopify',
      name: 'Shopify Admin GraphQL',
      category: 'E-Commerce Storefront',
      connected: shopifyConfig?.connected ?? true,
      description: 'Bi-directional sync of customer orders, SKU inventory levels, and customer tracking notifications.',
      iconColor: 'bg-emerald-500',
      actionText: shopifyConfig?.connected ? 'Manage Sync' : 'Connect Store',
    },
    {
      id: 'amazon',
      name: 'Amazon Marketplace SP-API',
      category: 'Marketplace',
      connected: true,
      description: 'Ingest Seller Central orders, sync FBA/FBM inventory balances, and auto-dispatch tracking codes.',
      iconColor: 'bg-amber-500',
      actionText: 'Connected (Sync Active)',
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce REST v3',
      category: 'WordPress Storefront',
      connected: false,
      description: 'Connect self-hosted WordPress/WooCommerce shops via consumer key & secret.',
      iconColor: 'bg-purple-600',
      actionText: 'Connect Channel',
    },
    {
      id: 'shiprocket',
      name: 'Shiprocket Logistics Engine',
      category: 'Courier Aggregator',
      connected: true,
      description: 'Multi-courier rate shopping, automated AWB generation, and daily COD remittance reconciliation.',
      iconColor: 'bg-blue-600',
      actionText: 'Connected & Verified',
    },
    {
      id: 'fedex',
      name: 'FedEx Web Services API',
      category: 'Express Carrier',
      connected: true,
      description: 'Generate commercial invoices, priority shipping labels, and real-time tracking webhooks.',
      iconColor: 'bg-purple-700',
      actionText: 'Carrier Active',
    },
    {
      id: 'stripe',
      name: 'Stripe Gateway & Radar',
      category: 'Payment Processor',
      connected: true,
      description: 'Prepaid card capture, automated customer dispute alerts, and instant webhook event listening.',
      iconColor: 'bg-indigo-600',
      actionText: 'Gateway Active',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
          Integrations & API Connectors
        </h1>
        <p className="text-xs sm:text-sm text-[#455A64]">
          Connect external storefronts, shipping aggregators, payment gateways, and warehouse systems.
        </p>
      </div>

      {/* Primary Shopify Featured Box */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#37474F] to-[#263238] text-white shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                Official GraphQL Admin Connector
              </span>
              <span className="text-xs text-slate-300">API Version 2025-01</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Shopify Bi-Directional Synchronizer
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Sync orders, products, inventory variants, and shipping status. Rate limit bucket management (40/40 leak rate) is handled with automatic retry backoff.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                Store: <strong className="text-white">{shopifyConfig?.storeDomain || 'apex-fashion-demo.myshopify.com'}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                Status: <strong className="text-emerald-400">{shopifyConfig?.connected ? 'Connected' : 'Disconnected'}</strong>
              </span>
              <span className="text-slate-400">
                Last Synced: {shopifyConfig?.lastSyncedAt ? formatPKTime(shopifyConfig.lastSyncedAt) : 'Just now'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setCurrentRoute('shopify')}
              className="px-5 py-3 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-red-500/30"
            >
              <ExternalLink size={14} />
              <span>Shopify Live & Video Guide</span>
            </button>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-5 py-3 rounded-xl bg-white text-[#37474F] hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin text-[#E10600]' : ''} />
              <span>{syncing ? 'Syncing...' : 'Sync Catalog Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white p-6 border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${item.iconColor} text-white flex items-center justify-center font-extrabold text-xs`}>
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#37474F] text-sm">{item.name}</h3>
                    <div className="text-[10px] text-gray-400">{item.category}</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.connected
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-gray-500'
                }`}>
                  {item.connected ? 'Active' : 'Not Connected'}
                </span>
              </div>

              <p className="pt-3 text-xs text-[#455A64] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-gray-400">
                {item.connected ? 'Bi-Directional API' : 'Setup Required'}
              </span>
              <button
                onClick={() => {
                  if (item.id === 'shopify') {
                    setIsConnectModalOpen(true);
                  } else {
                    showToast(`${item.name} connector credentials managed via secure server environment.`);
                  }
                }}
                className={`font-bold ${
                  item.connected ? 'text-gray-700 hover:text-[#E10600]' : 'text-[#168BCE] hover:underline'
                }`}
              >
                {item.actionText} &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shopify Connection Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#37474F]">Connect Shopify Store</h3>
              <button onClick={() => setIsConnectModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#455A64]">
              Enter your official myshopify.com domain. StorePilot requests <code>read_orders</code>, <code>write_orders</code>, <code>read_products</code>, and <code>write_inventory</code> scopes.
            </p>

            <form onSubmit={handleConnect} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">
                  Shopify Store Domain <span className="text-[#E10600]">*</span>
                </label>
                <input
                  type="text"
                  value={storeDomain}
                  onChange={(e) => setStoreDomain(e.target.value)}
                  placeholder="your-brand.myshopify.com"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">
                  Custom Admin API Access Token (Optional for Private Apps)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="shpat_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Leave blank to use pre-authorized demo or standard OAuth redirection.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {shopifyConfig?.connected && (
                  <button
                    type="button"
                    onClick={async () => {
                      await disconnectShopify();
                      setIsConnectModalOpen(false);
                    }}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Disconnect Store
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsConnectModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={connecting}
                    className="px-5 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold"
                  >
                    {connecting ? 'Validating...' : 'Authorize & Connect'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
