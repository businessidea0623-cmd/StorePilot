import React, { useState } from 'react';
import { Logo } from '../common/Logo.tsx';
import { useApp } from '../../context/AppContext.tsx';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Store,
  Sparkles,
  Layers,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setCurrentRoute } = useApp();
  const [email, setEmail] = useState('alex@storepilot.io');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    await login('alex@storepilot.io', 'demo');
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] bg-dots-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#37474F]">Welcome Back</h2>
          <p className="text-xs text-gray-500">Sign in to manage your orders, inventory & logistics</p>
        </div>

        {/* 1-Click Quick Demo Button */}
        <div className="p-3 rounded-xl bg-red-50/70 border border-red-200 flex items-center justify-between">
          <div className="text-left">
            <div className="text-xs font-bold text-[#E10600]">Quick Evaluation Access</div>
            <div className="text-[11px] text-gray-600">Pre-seeded with Shopify demo store data</div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-[#E10600] text-white text-xs font-bold hover:bg-[#B80500] transition-colors"
          >
            Demo Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#37474F] mb-1.5">Work Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#E10600]/30 focus:border-[#E10600]"
                placeholder="you@store.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#37474F]">Password</label>
              <button
                type="button"
                onClick={() => setCurrentRoute('forgot-password')}
                className="text-xs font-semibold text-[#168BCE] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#E10600]/30 focus:border-[#E10600]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#37474F] hover:bg-[#263238] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Workspace'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-500">
          Don't have a workspace yet?{' '}
          <button
            onClick={() => setCurrentRoute('signup')}
            className="font-bold text-[#E10600] hover:underline"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const { signup, setCurrentRoute } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signup(name, email, workspaceName);
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] bg-dots-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#37474F]">Create StorePilot Account</h2>
          <p className="text-xs text-gray-500">Launch your multi-channel e-commerce operations hub</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#37474F] mb-1.5">Your Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#E10600]/30 focus:border-[#E10600]"
                placeholder="Alex Morgan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#37474F] mb-1.5">Business Work Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#E10600]/30 focus:border-[#E10600]"
                placeholder="alex@brandstore.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#37474F] mb-1.5">Workspace / Brand Name</label>
            <div className="relative">
              <Store size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#E10600]/30 focus:border-[#E10600]"
                placeholder="Apex Apparel Co."
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-gray-200 text-[11px] text-gray-500 flex items-start gap-2">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <span>Includes 14-day full feature trial and instant demo sandbox. Zero credit card needed.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white font-bold text-sm transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating Workspace...' : 'Proceed to Onboarding'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentRoute('login')}
            className="font-bold text-[#37474F] hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { setCurrentRoute, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast(`Password reset link dispatched to ${email}`);
  };

  return (
    <div className="min-h-[85vh] bg-dots-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#37474F]">Reset Your Password</h2>
          <p className="text-xs text-gray-500">Enter your email and we'll send recovery instructions</p>
        </div>

        {sent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-sm text-gray-600">
              Reset email dispatched to <strong>{email}</strong>. Please check your spam folder if it doesn't arrive within 2 minutes.
            </p>
            <button
              onClick={() => setCurrentRoute('login')}
              className="text-xs font-bold text-[#E10600] hover:underline"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1.5">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#E10600]/30 focus:border-[#E10600]"
                placeholder="you@store.com"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#37474F] hover:bg-[#263238] text-white font-bold text-sm transition-all"
            >
              Send Reset Instructions
            </button>
            <div className="text-center text-xs">
              <button
                type="button"
                onClick={() => setCurrentRoute('login')}
                className="text-gray-500 hover:text-[#37474F] font-semibold"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const OnboardingWizard: React.FC = () => {
  const { setCurrentRoute, user, workspace, connectShopify, showToast } = useApp();
  const [step, setStep] = useState<number>(1);
  const [modeChoice, setModeChoice] = useState<'demo' | 'shopify'>('demo');
  const [shopifyDomain, setShopifyDomain] = useState('apex-fashion-demo.myshopify.com');
  const [connecting, setConnecting] = useState(false);

  const handleFinish = async () => {
    if (modeChoice === 'shopify' && shopifyDomain) {
      setConnecting(true);
      await connectShopify(shopifyDomain);
      setConnecting(false);
    } else {
      showToast('Workspace initialized in Demo Mode with rich sample data!');
    }
    setCurrentRoute('dashboard');
  };

  return (
    <div className="min-h-[85vh] bg-[#F8FAFC] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        
        {/* Progress Bar */}
        <div className="bg-[#37474F] text-white p-6 sm:p-8">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            <span>StorePilot Onboarding</span>
            <span>Step {step} of 3</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#E10600] h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-4">
            {step === 1 && `Welcome, ${user?.name || 'Store Operator'}!`}
            {step === 2 && 'Choose Your Initial Operations Mode'}
            {step === 3 && 'Confirmation & Ready to Launch'}
          </h2>
        </div>

        {/* Step Contents */}
        <div className="p-6 sm:p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-[#455A64] leading-relaxed">
                Your workspace <strong className="text-[#37474F]">"{workspace?.name || 'My E-Com Store'}"</strong> has been created with multi-channel capabilities.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
                <div className="text-xs font-bold uppercase text-gray-500">Workspace Details</div>
                <div className="text-sm font-bold text-[#37474F]">Assigned Role: <span className="text-[#E10600]">Workspace Owner</span></div>
                <div className="text-xs text-gray-500">Base Currency: USD ($) • Multi-Carrier Support: Active</div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-sm font-bold flex items-center gap-2"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <p className="text-sm text-[#455A64]">
                You can start immediately with pre-loaded demo orders and products to evaluate the platform, or enter your Shopify store domain.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setModeChoice('demo')}
                  className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${
                    modeChoice === 'demo'
                      ? 'border-[#E10600] bg-red-50/20 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-lg bg-red-100 text-[#E10600]">
                      <Sparkles size={20} />
                    </span>
                    <input
                      type="radio"
                      checked={modeChoice === 'demo'}
                      onChange={() => setModeChoice('demo')}
                    />
                  </div>
                  <h4 className="text-base font-bold text-[#37474F]">Demo Mode (Recommended)</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Instantly populates realistic apparel & electronics orders, COD remittances, courier shipments, and returns.
                  </p>
                </div>

                <div
                  onClick={() => setModeChoice('shopify')}
                  className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${
                    modeChoice === 'shopify'
                      ? 'border-[#168BCE] bg-blue-50/20 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-lg bg-blue-100 text-[#168BCE]">
                      <ShoppingBag size={20} />
                    </span>
                    <input
                      type="radio"
                      checked={modeChoice === 'shopify'}
                      onChange={() => setModeChoice('shopify')}
                    />
                  </div>
                  <h4 className="text-base font-bold text-[#37474F]">Live Shopify Connection</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Connect your real store using Shopify Admin GraphQL API with read/write orders & inventory permissions.
                  </p>
                </div>
              </div>

              {modeChoice === 'shopify' && (
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                  <label className="block text-xs font-bold text-[#37474F]">Shopify Store Domain</label>
                  <input
                    type="text"
                    value={shopifyDomain}
                    onChange={(e) => setShopifyDomain(e.target.value)}
                    placeholder="your-store.myshopify.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#168BCE]/30 focus:border-[#168BCE]"
                  />
                  <p className="text-[11px] text-gray-500">
                    Will request read_orders, write_orders, read_products, and write_inventory scopes via secure OAuth.
                  </p>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-800"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-sm font-bold flex items-center gap-2"
                >
                  Next Step <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>

              <h3 className="text-2xl font-extrabold text-[#37474F]">Setup Complete!</h3>
              <p className="text-sm text-[#455A64] max-w-md mx-auto">
                Your workspace is ready. You can toggle between demo data and live integrations anytime from your dashboard header.
              </p>

              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  onClick={handleFinish}
                  disabled={connecting}
                  className="px-8 py-3.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white font-bold text-sm shadow-lg shadow-red-500/25 flex items-center gap-2"
                >
                  {connecting ? 'Connecting Store...' : 'Launch StorePilot Dashboard'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
