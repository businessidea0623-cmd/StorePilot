import React, { useState, useEffect } from 'react';
import { Logo } from '../common/Logo.tsx';
import { useApp } from '../../context/AppContext.tsx';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  CreditCard,
  RotateCcw,
  Truck,
  BarChart3,
  Plug,
  UserCheck,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Store as StoreIcon,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentRoute,
    setCurrentRoute,
    user,
    workspace,
    stores,
    selectedStoreId,
    setSelectedStoreId,
    notifications,
    shopifyConfig,
    logout,
    resetDemoData,
    syncShopify,
    orders,
    products,
    customers,
    searchModalOpen,
    setSearchModalOpen,
    setSelectedOrderForModal,
  } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [syncing, setSyncing] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  // Keyboard shortcut Cmd/Ctrl + K for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setNotificationsOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { label: 'Dashboard', route: 'dashboard', icon: LayoutDashboard },
    { label: 'Orders', route: 'orders', icon: ShoppingBag, badge: orders.filter((o) => o.status === 'pending').length },
    { label: 'Products', route: 'products', icon: Package },
    { label: 'Inventory', route: 'inventory', icon: Layers, badge: products.filter((p) => p.stock <= p.lowStockThreshold).length, badgeColor: 'bg-amber-100 text-amber-800' },
    { label: 'Customers', route: 'customers', icon: Users },
    { label: 'Payments & COD', route: 'payments', icon: CreditCard },
    { label: 'Returns & Refunds', route: 'returns', icon: RotateCcw },
    { label: 'Shipping & Couriers', route: 'shipping', icon: Truck },
    { label: 'Analytics & Reports', route: 'analytics', icon: BarChart3 },
    { label: 'Integrations', route: 'integrations', icon: Plug },
    {
      label: 'Shopify Live & Guide',
      route: 'shopify',
      icon: StoreIcon,
      badge: shopifyConfig?.connected ? 'Live' : 'Connect',
      badgeColor: shopifyConfig?.connected ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800',
    },
    { label: 'Team & Roles', route: 'team', icon: UserCheck },
    { label: 'Settings', route: 'settings', icon: Settings },
    { label: 'Help & Support', route: 'help', icon: HelpCircle },
  ];

  const handleSyncClick = async () => {
    setSyncing(true);
    await syncShopify();
    setSyncing(false);
  };

  // Filtered search results
  const matchingOrders = searchQuery
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const matchingProducts = searchQuery
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased">
      
      {/* Top Demo Mode Banner */}
      <div className="bg-[#37474F] text-white text-xs py-1 px-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold uppercase text-[10px] tracking-wider">
            DEMO ENVIRONMENT ACTIVE
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Sample metrics & orders are isolated. Production Shopify actions require authorized credentials.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetDemoData}
            className="text-[11px] font-bold text-red-300 hover:text-white underline transition-colors"
          >
            Reset Demo Data
          </button>
          <span className="text-slate-500">•</span>
          <button
            onClick={() => setCurrentRoute('home')}
            className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            Marketing Home <ExternalLink size={11} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-200 z-30 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#E5E7EB]">
            {!sidebarCollapsed ? (
              <button onClick={() => setCurrentRoute('dashboard')} className="focus:outline-none">
                <Logo size="sm" showSubtitle={false} />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#E10600] text-white flex items-center justify-center font-extrabold text-sm mx-auto">
                SP
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => setCurrentRoute(item.route)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-red-50 text-[#E10600] font-bold shadow-xs'
                      : 'text-[#455A64] hover:bg-slate-50 hover:text-[#37474F]'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon
                    size={19}
                    className={`shrink-0 ${isActive ? 'text-[#E10600]' : 'text-gray-400 group-hover:text-gray-600'}`}
                  />
                  {!sidebarCollapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <span className="truncate">{item.label}</span>
                      {item.badge !== undefined && (typeof item.badge === 'number' ? item.badge > 0 : Boolean(item.badge)) && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            item.badgeColor || 'bg-red-100 text-[#E10600]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer with Logout & Brand Credit */}
          <div className="p-3 border-t border-[#E5E7EB] space-y-2">
            {!sidebarCollapsed && (
              <div className="px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] text-gray-500 font-medium">
                Design by <strong className="text-[#37474F]">Hanzala04</strong>
              </div>
            )}
            <button
              onClick={logout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
              title="Sign Out"
            >
              <LogOut size={16} />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
            {/* Left: Mobile hamburger & Store selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Menu size={20} />
              </button>

              {/* Store Selector */}
              <div className="flex items-center gap-2">
                <StoreIcon size={16} className="text-[#E10600] hidden sm:block" />
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="bg-slate-50 border border-gray-200 text-xs font-bold text-[#37474F] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#E10600]"
                >
                  <option value="all">All Connected Channels (Aggregated)</option>
                  <option value="store_1">Apex Official (Shopify Demo)</option>
                  <option value="store_2">UrbanStyle Marketplace (Amazon)</option>
                </select>
              </div>

              {/* Sync Trigger button */}
              <button
                onClick={handleSyncClick}
                disabled={syncing}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-gray-200 text-[11px] font-bold text-[#455A64] transition-colors"
                title="Sync orders & inventory"
              >
                <RefreshCw size={12} className={syncing ? 'animate-spin text-[#E10600]' : ''} />
                <span>{syncing ? 'Syncing...' : 'Sync Channels'}</span>
              </button>
            </div>

            {/* Middle: Global Search bar */}
            <div className="flex-1 max-w-md hidden sm:block">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl px-3.5 py-1.5 flex items-center justify-between text-xs text-gray-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Search size={14} />
                  <span>Search orders, products, customers...</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono text-gray-500">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Notifications & User profile */}
            <div className="flex items-center gap-3">
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-slate-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E10600]"></span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#37474F]">Notifications ({notifications.length})</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Active Engine</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 text-xs hover:bg-slate-50 transition-colors">
                          <div className="font-bold text-[#37474F]">{n.title}</div>
                          <div className="text-gray-500 mt-0.5">{n.message}</div>
                          <div className="text-[10px] text-gray-400 mt-1">Just now</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#37474F] text-white flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OP'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-bold text-[#37474F] leading-tight truncate max-w-[120px]">
                      {user?.name || 'Store Owner'}
                    </div>
                    <div className="text-[10px] font-semibold text-[#E10600] uppercase">
                      {user?.role || 'Owner'}
                    </div>
                  </div>
                  <ChevronDown size={14} className="text-gray-400 hidden lg:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-xs font-bold text-[#37474F]">{user?.name}</div>
                      <div className="text-[11px] text-gray-500 truncate">{user?.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentRoute('settings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Settings size={14} /> Workspace Settings
                    </button>
                    <button
                      onClick={() => {
                        setCurrentRoute('integrations');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Plug size={14} /> Shopify Credentials
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>

            </div>
          </header>

          {/* Main Dashboard Canvas View */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>

        </div>
      </div>

      {/* Global Search Modal (Cmd+K) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by # or customer name, products by title/SKU..."
                autoFocus
                className="w-full text-sm font-medium focus:outline-none text-[#37474F]"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ESC
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {searchQuery ? (
                <>
                  {matchingOrders.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Orders</div>
                      <div className="space-y-1.5">
                        {matchingOrders.map((ord) => (
                          <div
                            key={ord.id}
                            onClick={() => {
                              setSelectedOrderForModal(ord);
                              setSearchModalOpen(false);
                              setCurrentRoute('orders');
                            }}
                            className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-gray-200 transition-all"
                          >
                            <div>
                              <span className="text-xs font-mono font-bold text-[#37474F] mr-2">{ord.orderNumber}</span>
                              <span className="text-xs text-gray-600">{ord.customerName}</span>
                            </div>
                            <span className="text-xs font-bold text-[#E10600]">${ord.totalAmount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchingProducts.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Products</div>
                      <div className="space-y-1.5">
                        {matchingProducts.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => {
                              setSearchModalOpen(false);
                              setCurrentRoute('products');
                            }}
                            className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-gray-200 transition-all"
                          >
                            <div>
                              <div className="text-xs font-bold text-[#37474F]">{prod.title}</div>
                              <span className="text-[10px] font-mono text-gray-400">{prod.sku}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-700">${prod.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchingOrders.length === 0 && matchingProducts.length === 0 && (
                    <div className="text-center py-8 text-xs text-gray-500">
                      No orders or products matching "{searchQuery}"
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-xs text-gray-400">
                  Type an order number like <strong className="text-gray-600">SP-1001</strong>, or a customer name...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 flex">
          <div className="w-72 bg-white h-full flex flex-col p-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <Logo size="sm" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => {
                      setCurrentRoute(item.route);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                      isActive ? 'bg-red-50 text-[#E10600]' : 'text-[#455A64]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (typeof item.badge === 'number' ? item.badge > 0 : Boolean(item.badge)) && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-red-100 text-[#E10600]'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 py-2 text-xs font-bold text-red-600"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

    </div>
  );
};
