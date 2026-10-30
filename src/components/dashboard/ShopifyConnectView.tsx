import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Lock,
  Play,
  Pause,
  Maximize2,
  Copy,
  Check,
  HelpCircle,
  ArrowRight,
  Layers,
  Sparkles,
  Key,
  Globe,
  Radio,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sliders,
  Store,
  DollarSign,
  Package,
} from 'lucide-react';
import { formatPKR, formatPKDate, formatPKTime } from '../../utils/formatters.ts';

export const ShopifyConnectView: React.FC = () => {
  const {
    shopifyConfig,
    connectShopify,
    testShopifyConnection,
    syncShopify,
    disconnectShopify,
    showToast,
    products,
    orders,
    customers,
  } = useApp();

  // Connection Form State
  const [storeDomain, setStoreDomain] = useState(shopifyConfig?.storeDomain || 'indus-apparel-pk.myshopify.com');
  const [accessToken, setAccessToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    error?: string;
    shop?: any;
    errorCode?: string;
  } | null>(null);

  // Active Tab: 'guide' | 'connect' | 'live-data'
  const [activeTab, setActiveTab] = useState<'connect' | 'guide' | 'live-data'>('connect');

  // Video Tutorial State
  const [activeVideoId, setActiveVideoId] = useState<'video1' | 'video2'>('video1');
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [copiedScope, setCopiedScope] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Default verified tutorial videos (Shopify Admin API & App Setup)
  const videoCatalog = {
    video1: {
      title: 'Tutorial 1: How to Create a Shopify Custom App & Get Admin API Token',
      description: 'Step-by-step walkthrough in the Shopify Admin to generate your private Admin API Access Token (shpat_).',
      embedUrl: 'https://www.youtube-nocookie.com/embed/Q0P_pQjI8pI',
      youtubeWatchUrl: 'https://www.youtube.com/watch?v=Q0P_pQjI8pI',
      duration: '4 mins 20 secs',
    },
    video2: {
      title: 'Tutorial 2: Managing Products, Orders & Real-Time Sync in StorePilot',
      description: 'Learn how StorePilot synchronizes inventory variants, processes Cash on Delivery, and dispatches courier tracking.',
      embedUrl: 'https://www.youtube-nocookie.com/embed/1fR3r8B1N7U',
      youtubeWatchUrl: 'https://www.youtube.com/watch?v=1fR3r8B1N7U',
      duration: '5 mins 15 secs',
    },
  };

  const handleTestConnection = async () => {
    if (!storeDomain.trim()) {
      showToast('Please enter your Shopify store domain', 'error');
      return;
    }
    if (!accessToken.trim()) {
      showToast('Please enter your Admin API Access Token to test live access', 'error');
      return;
    }

    setTesting(true);
    setTestResult(null);
    try {
      const res = await testShopifyConnection(storeDomain, accessToken);
      setTestResult(res);
      if (res.success) {
        showToast(`Verification Successful! Connected to ${res.shop?.name || storeDomain}`);
      } else {
        showToast(res.error || 'Verification failed', 'error');
      }
    } finally {
      setTesting(false);
    }
  };

  const handleConnectStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeDomain.trim()) {
      showToast('Please enter your Shopify store domain', 'error');
      return;
    }

    setConnecting(true);
    try {
      const res = await connectShopify(storeDomain, accessToken);
      if (res.success) {
        setAccessToken('');
        setTestResult(null);
        setActiveTab('live-data');
      }
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectDemo = async () => {
    setConnecting(true);
    try {
      const res = await connectShopify('indus-apparel-pk.myshopify.com', undefined, true);
      if (res.success) {
        setStoreDomain('indus-apparel-pk.myshopify.com');
        setAccessToken('');
        setTestResult(null);
      }
    } finally {
      setConnecting(false);
    }
  };

  const handleSyncCatalog = async () => {
    setSyncing(true);
    try {
      await syncShopify();
    } finally {
      setSyncing(false);
    }
  };

  const copyScopesToClipboard = () => {
    const scopes = 'read_products, write_products, read_orders, write_orders, read_inventory, read_customers, read_fulfillments';
    navigator.clipboard.writeText(scopes);
    setCopiedScope(true);
    showToast('Shopify Admin API scopes copied to clipboard!');
    setTimeout(() => setCopiedScope(false), 2500);
  };

  const liveProducts = products.filter((p) => p.source === 'shopify_live');
  const liveOrders = orders.filter((o) => o.source === 'shopify_live');
  const demoProducts = products.filter((p) => p.source !== 'shopify_live');
  const demoOrders = orders.filter((o) => o.source !== 'shopify_live');

  return (
    <div className="space-y-8 pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Admin GraphQL API 2025-01
            </span>
            <span className="text-xs text-gray-400 font-mono">StorePilot Connector</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight flex items-center gap-3">
            Shopify Live Store Integration
          </h1>
          <p className="text-xs sm:text-sm text-[#455A64] mt-1">
            Connect your live Shopify storefront to synchronize products, real-time customer orders, inventory levels, and courier fulfillment.
          </p>
        </div>

        {/* Status Pill & Disconnect */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${
            shopifyConfig?.connected
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-red-50 text-red-800 border-red-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${shopifyConfig?.connected ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
            <span>
              {shopifyConfig?.connected
                ? `Connected (${shopifyConfig.isLiveConnection ? 'Live Store' : 'Demo Store'})`
                : 'Disconnected'}
            </span>
          </div>

          {shopifyConfig?.connected && (
            <button
              onClick={handleSyncCatalog}
              disabled={syncing}
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-[#37474F] text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin text-[#E10600]' : ''} />
              <span>{syncing ? 'Syncing...' : 'Sync Catalog'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('connect')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'connect'
              ? 'border-[#E10600] text-[#E10600]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Lock size={16} />
          <span>Connect & Authorize Store</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'guide'
              ? 'border-[#E10600] text-[#E10600]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Play size={16} />
          <span>Video Tutorials & Written Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('live-data')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'live-data'
              ? 'border-[#E10600] text-[#E10600]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Radio size={16} />
          <span>Live Store Data ({shopifyConfig?.isLiveConnection ? liveOrders.length : orders.length} Orders)</span>
        </button>
      </div>

      {/* TAB 1: CONNECT & AUTHORIZE */}
      {activeTab === 'connect' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Connection Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                    S
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#37474F] text-base">Shopify Store Credentials</h3>
                    <p className="text-xs text-[#455A64]">Direct Admin API integration with server-side token encryption</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('guide')}
                  className="text-xs font-bold text-[#168BCE] hover:text-[#0e5c8a] flex items-center gap-1"
                >
                  Need help? Watch Tutorial &rarr;
                </button>
              </div>

              <form onSubmit={handleConnectStore} className="space-y-5">
                {/* Store Domain */}
                <div>
                  <label className="block text-xs font-bold text-[#37474F] mb-1.5">
                    Shopify Store Domain <span className="text-[#E10600]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={storeDomain}
                      onChange={(e) => setStoreDomain(e.target.value)}
                      placeholder="e.g. your-store.myshopify.com"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#E10600] focus:border-[#E10600] outline-none"
                    />
                    <div className="absolute right-3 top-2.5 text-xs text-gray-400 font-sans pointer-events-none">
                      .myshopify.com
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Enter your canonical Shopify subdomain. Custom domains (e.g. yourbrand.com) are automatically resolved to their .myshopify.com address.
                  </p>
                </div>

                {/* Admin API Access Token */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#37474F]">
                      Admin API Access Token <span className="text-[#E10600]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="text-[11px] text-[#168BCE] hover:underline font-semibold"
                    >
                      {showToken ? 'Hide Token' : 'Show Token'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#E10600] focus:border-[#E10600] outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-700 font-medium">
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                    <span>Tokens are stored strictly server-side and never exposed to the frontend browser bundle.</span>
                  </div>
                </div>

                {/* Test Result Feedback Box */}
                {testResult && (
                  <div className={`p-4 rounded-xl text-xs border ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-red-50 text-red-900 border-red-200'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      {testResult.success ? (
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold">
                          {testResult.success ? 'Verification Successful!' : 'Verification Failed'}
                        </div>
                        <div className="mt-0.5">
                          {testResult.success
                            ? `Store Name: "${testResult.shop?.name}", Currency: ${testResult.shop?.currencyCode}, Timezone: ${testResult.shop?.ianaTimezone}`
                            : testResult.error}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testing || !accessToken.trim()}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 hover:border-gray-400 bg-white text-[#37474F] text-xs font-bold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} className={testing ? 'animate-spin text-[#E10600]' : 'text-emerald-600'} />
                    <span>{testing ? 'Testing Live Store...' : 'Test Connection (Dry Run)'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={connecting}
                    className="px-6 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all shadow-red-500/20 disabled:opacity-50"
                  >
                    <Lock size={14} />
                    <span>{connecting ? 'Authorizing...' : 'Connect Shopify Store'}</span>
                  </button>

                  {shopifyConfig?.connected && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to disconnect this Shopify store? Catalog sync will stop.')) {
                          await disconnectShopify();
                        }
                      }}
                      className="ml-auto text-xs font-bold text-red-600 hover:text-red-800 hover:underline"
                    >
                      Disconnect Store
                    </button>
                  )}
                </div>
              </form>

              {/* Demo Mode Fallback Callout */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50 p-4 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-[#37474F]">Testing without a real Shopify store?</div>
                  <div className="text-[11px] text-gray-500">You can load our pre-configured Pakistan sample dataset (Indus Apparel) with PKR pricing.</div>
                </div>
                <button
                  type="button"
                  onClick={handleConnectDemo}
                  disabled={connecting}
                  className="px-3.5 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold whitespace-nowrap transition-all"
                >
                  Load Demo Store
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Scopes & Verification Status (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Active Store Card */}
            <div className="bg-gradient-to-br from-[#37474F] to-[#263238] rounded-2xl text-white p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  {shopifyConfig?.connected ? 'Store Attached' : 'Awaiting Connection'}
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">
                  {shopifyConfig?.apiVersion || '2025-01'}
                </span>
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">
                  {shopifyConfig?.shopName || 'No Store Connected'}
                </h4>
                <div className="text-xs text-gray-300 font-mono mt-0.5">
                  {shopifyConfig?.storeDomain || 'your-store.myshopify.com'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
                <div>
                  <div className="text-gray-400 text-[10px] uppercase font-bold">Store Currency</div>
                  <div className="font-extrabold text-emerald-300 mt-0.5">{shopifyConfig?.currency || 'PKR (Rs.)'}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[10px] uppercase font-bold">Timezone</div>
                  <div className="font-medium text-white mt-0.5">{shopifyConfig?.ianaTimezone || 'Asia/Karachi'}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[10px] uppercase font-bold">Total Products</div>
                  <div className="font-extrabold text-white mt-0.5">{shopifyConfig?.totalSyncedProducts || products.length}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[10px] uppercase font-bold">Total Orders</div>
                  <div className="font-extrabold text-white mt-0.5">{shopifyConfig?.totalSyncedOrders || orders.length}</div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-gray-300">
                Last synchronized:{' '}
                <strong>
                  {shopifyConfig?.lastSyncedAt ? formatPKTime(shopifyConfig.lastSyncedAt) : 'Never'}
                </strong>
              </div>
            </div>

            {/* Required Scopes Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#E10600]" />
                  <h4 className="font-bold text-[#37474F] text-sm">Required Admin API Scopes</h4>
                </div>
                <button
                  type="button"
                  onClick={copyScopesToClipboard}
                  className="text-xs text-[#168BCE] hover:underline font-bold flex items-center gap-1"
                >
                  {copiedScope ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedScope ? 'Copied!' : 'Copy Scopes'}</span>
                </button>
              </div>

              <p className="text-xs text-[#455A64]">
                StorePilot adheres to the principle of least privilege. Only grant these 7 scopes inside your Shopify Admin Custom App:
              </p>

              <div className="space-y-2">
                {[
                  { scope: 'read_products', desc: 'Read product catalog, titles, variants & images' },
                  { scope: 'write_products', desc: 'Sync SKU modifications & price adjustments' },
                  { scope: 'read_orders', desc: 'Ingest customer orders & fulfillment statuses' },
                  { scope: 'write_orders', desc: 'Update order tracking numbers & tags' },
                  { scope: 'read_inventory', desc: 'Monitor multi-location inventory counts' },
                  { scope: 'read_customers', desc: 'Access delivery address and contact info' },
                  { scope: 'read_fulfillments', desc: 'Inspect shipping labels and tracking data' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                    <div>
                      <code className="font-mono text-[#E10600] font-bold">{item.scope}</code>
                      <div className="text-[11px] text-gray-500 mt-0.5">{item.desc}</div>
                    </div>
                    <CheckCircle2 size={14} className="text-emerald-600 mt-1 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VIDEO TUTORIALS & WRITTEN GUIDE */}
      {activeTab === 'guide' && (
        <div className="space-y-8">
          {/* Video Section Header & Switcher */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#37474F] flex items-center gap-2">
                  <Play size={20} className="text-[#E10600]" />
                  Official Video Tutorials
                </h3>
                <p className="text-xs sm:text-sm text-[#455A64] mt-0.5">
                  Watch our step-by-step video guides to configure your Shopify custom app and manage live operations.
                </p>
              </div>

              {/* Video Switcher Buttons */}
              <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl">
                <button
                  onClick={() => setActiveVideoId('video1')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeVideoId === 'video1'
                      ? 'bg-white text-[#37474F] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tutorial 1: App Setup
                </button>
                <button
                  onClick={() => setActiveVideoId('video2')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeVideoId === 'video2'
                      ? 'bg-white text-[#37474F] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tutorial 2: StorePilot Ops
                </button>
              </div>
            </div>

            {/* Embedded Video Player Container */}
            <div className="space-y-3">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-gray-300 shadow-lg">
                <iframe
                  src={customVideoUrl.trim() || videoCatalog[activeVideoId].embedUrl}
                  title={videoCatalog[activeVideoId].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                ></iframe>
              </div>

              {/* Video Details & Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2">
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#37474F]">
                    {videoCatalog[activeVideoId].title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {videoCatalog[activeVideoId].description} &bull; Duration: {videoCatalog[activeVideoId].duration}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={videoCatalog[activeVideoId].youtubeWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#168BCE] hover:underline flex items-center gap-1"
                  >
                    <span>Open on YouTube</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Custom Video URL Override Input */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="text-xs font-bold text-[#37474F] whitespace-nowrap">
                  Custom Video Player URL:
                </div>
                <input
                  type="text"
                  value={customVideoUrl}
                  onChange={(e) => setCustomVideoUrl(e.target.value)}
                  placeholder="Paste your own YouTube embed or video URL (optional)"
                  className="flex-1 w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono focus:ring-1 focus:ring-[#E10600] outline-none"
                />
                {customVideoUrl && (
                  <button
                    onClick={() => setCustomVideoUrl('')}
                    className="text-xs text-gray-500 hover:text-red-600 font-bold whitespace-nowrap"
                  >
                    Reset to Default
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Written Step-by-Step Instructions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-8 shadow-sm">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E10600] bg-red-50 px-2.5 py-0.5 rounded">
                Complete Setup Guide
              </span>
              <h3 className="text-2xl font-extrabold text-[#37474F] mt-2">
                How to Connect Your Shopify Store in 5 Steps
              </h3>
              <p className="text-xs sm:text-sm text-[#455A64] mt-1">
                Follow this guide to generate your private Admin API Access Token. No Shopify partner approval or payment required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                {
                  step: '01',
                  title: 'Open Shopify Admin',
                  desc: 'Log in to your store at admin.shopify.com. Click Settings in the bottom-left corner of your dashboard.',
                },
                {
                  step: '02',
                  title: 'Apps & Sales Channels',
                  desc: 'Select Apps and sales channels, then click the Develop apps button in the top right to enable custom apps.',
                },
                {
                  step: '03',
                  title: 'Create StorePilot App',
                  desc: 'Click "Create an app". Name it "StorePilot Integration" and select your developer email address.',
                },
                {
                  step: '04',
                  title: 'Configure Scopes',
                  desc: 'Under "Configuration", click "Configure Admin API integration". Check the 7 required read & write scopes.',
                },
                {
                  step: '05',
                  title: 'Install & Copy Token',
                  desc: 'Click "Install app". Reveal the Admin API access token (starts with shpat_). Paste it into StorePilot!',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-2xl font-black text-[#E10600] font-mono">{item.step}</span>
                    <h4 className="font-extrabold text-[#37474F] text-sm mt-2">{item.title}</h4>
                    <p className="text-xs text-[#455A64] mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Link */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setActiveTab('connect')}
                className="px-6 py-3 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-red-500/20"
              >
                <span>Ready to Connect? Enter Store Domain Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Troubleshooting Error Matrix */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="text-lg font-extrabold text-[#37474F] flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Troubleshooting Common Shopify API Errors
            </h3>
            <p className="text-xs text-[#455A64]">
              If you encounter an error during connection or verification, refer to the verified resolution steps below:
            </p>

            <div className="space-y-3 pt-2">
              {[
                {
                  code: 'HTTP 401 Unauthorized',
                  cause: 'Invalid or revoked Admin API Access Token.',
                  solution: 'Shopify tokens start with "shpat_". Make sure you copied the Access Token (not the API key or secret key). If in doubt, uninstall and reinstall the custom app in Shopify Admin to generate a fresh token.',
                },
                {
                  code: 'HTTP 403 Forbidden',
                  cause: 'Missing requested Admin API scope permissions.',
                  solution: 'In your custom app configuration, ensure read_products, read_orders, and read_inventory are checked. If you edit scopes in Shopify, you must click "Save" and install the update.',
                },
                {
                  code: 'HTTP 404 Store Not Found',
                  cause: 'Store domain does not exist or has a typo.',
                  solution: 'Verify that your store domain ends in .myshopify.com. Do not enter "admin.shopify.com" or a custom domain that hasn\'t been mapped.',
                },
                {
                  code: 'HTTP 429 Rate Limit',
                  cause: 'Shopify API Leaky Bucket capacity (40/40) reached.',
                  solution: 'Shopify restricts Admin API calls to 2 requests/second. StorePilot automatically pauses and retries with exponential backoff. Wait 10 seconds before syncing again.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left text-xs font-bold text-[#37474F]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-100 text-[#E10600] font-mono text-[10px]">
                        {faq.code}
                      </span>
                      <span>{faq.cause}</span>
                    </span>
                    {expandedFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {expandedFaq === idx && (
                    <div className="p-4 bg-white text-xs text-[#455A64] border-t border-gray-200 leading-relaxed">
                      <strong>Resolution:</strong> {faq.solution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE STORE DATA */}
      {activeTab === 'live-data' && (
        <div className="space-y-6">
          {/* Data Banner */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  shopifyConfig?.isLiveConnection
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {shopifyConfig?.isLiveConnection ? 'Shopify Live API Connected' : 'Sample Demo Store Active'}
                </span>
                <span className="text-xs text-gray-400">
                  Store: <strong className="text-[#37474F]">{shopifyConfig?.storeDomain || 'indus-apparel-pk.myshopify.com'}</strong>
                </span>
              </div>
              <p className="text-xs text-[#455A64] mt-1">
                {shopifyConfig?.isLiveConnection
                  ? 'All records below are ingested directly from your live Shopify Admin GraphQL API.'
                  : 'Displaying authentic sample Pakistani e-commerce catalog in PKR. Connect a live token to see real store orders.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncCatalog}
                disabled={syncing}
                className="px-4 py-2 rounded-xl bg-[#37474F] hover:bg-[#263238] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
              >
                <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                <span>{syncing ? 'Refreshing...' : 'Refresh Live Data'}</span>
              </button>
            </div>
          </div>

          {/* Products from Shopify */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[#37474F] text-base flex items-center gap-2">
                  <Package size={18} className="text-[#E10600]" />
                  Synchronized Products & Inventory
                </h3>
                <p className="text-xs text-gray-500">Live SKUs, variants, prices, and warehouse availability</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                {products.length} Products
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Data Source</th>
                    <th className="py-3 px-4">Price (PKR)</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.slice(0, 8).map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.title}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                          <div>
                            <div className="font-bold text-[#37474F] line-clamp-1">{prod.title}</div>
                            <div className="text-[10px] text-gray-400">{prod.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-gray-700">{prod.sku}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.source === 'shopify_live'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {prod.source === 'shopify_live' ? 'Shopify Live' : 'Sample Demo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#37474F]">
                        {formatPKR(prod.price)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${prod.stock <= prod.lowStockThreshold ? 'text-red-600' : 'text-emerald-700'}`}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {prod.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Orders from Shopify */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[#37474F] text-base flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#E10600]" />
                  Synchronized Orders & Cash On Delivery
                </h3>
                <p className="text-xs text-gray-500">Real-time orders, payment types, and courier routing</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                {orders.length} Orders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Fulfillment</th>
                    <th className="py-3 px-4">Date (Asia/Karachi)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.slice(0, 8).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#E10600]">{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#37474F]">{order.customerName}</div>
                        <div className="text-[10px] text-gray-400">{order.customerEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.source === 'shopify_live'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {order.source === 'shopify_live' ? 'Shopify Live' : 'Sample Demo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.paymentMethod === 'COD'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#37474F]">
                        {formatPKR(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {order.fulfillmentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {formatPKDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
