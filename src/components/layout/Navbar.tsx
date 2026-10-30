import React, { useState } from 'react';
import { Logo } from '../common/Logo.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { Menu, X, ArrowRight, LayoutDashboard, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentRoute, setCurrentRoute, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', route: 'features' },
    { label: 'Shopify & Video Tutorial', route: 'shopify-guide' },
    { label: 'About Us', route: 'about' },
    { label: 'Blog', route: 'blog' },
    { label: 'Contact', route: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setCurrentRoute('home')}
          className="focus:outline-none hover:opacity-95 transition-opacity"
        >
          <Logo size="md" showSubtitle={false} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentRoute(link.route)}
              className={`text-[15px] font-semibold transition-colors ${
                currentRoute === link.route
                  ? 'text-[#E10600]'
                  : 'text-[#455A64] hover:text-[#37474F]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3.5">
          {user ? (
            <button
              onClick={() => setCurrentRoute('dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#37474F] text-white text-sm font-bold hover:bg-[#263238] transition-all shadow-sm"
            >
              <LayoutDashboard size={16} />
              Open Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => setCurrentRoute('login')}
                className="px-4 py-2.5 text-[15px] font-bold text-[#37474F] hover:text-[#E10600] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentRoute('signup')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E10600] hover:bg-[#B80500] text-white text-[15px] font-bold transition-all shadow-sm shadow-red-500/20 active:scale-[0.99]"
              >
                GET STARTED
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <button
              onClick={() => setCurrentRoute('dashboard')}
              className="p-2 rounded-lg bg-gray-100 text-[#37474F]"
            >
              <LayoutDashboard size={18} />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#37474F] hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentRoute(link.route);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2.5 px-3 rounded-lg text-base font-semibold ${
                currentRoute === link.route
                  ? 'bg-red-50 text-[#E10600]'
                  : 'text-[#455A64] hover:bg-gray-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
            {user ? (
              <button
                onClick={() => {
                  setCurrentRoute('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#37474F] text-white font-bold"
              >
                <LayoutDashboard size={18} />
                Open Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setCurrentRoute('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-[#37474F]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setCurrentRoute('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-lg bg-[#E10600] text-white text-sm font-bold flex items-center justify-center gap-2"
                >
                  GET STARTED <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
