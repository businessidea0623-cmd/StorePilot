import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { DashboardLayout } from './components/layout/DashboardLayout.tsx';

// Public Views
import { HomeHero } from './components/public/HomeHero.tsx';
import { HomeFeatures } from './components/public/HomeFeatures.tsx';
import { FeaturesPage } from './components/public/FeaturesPage.tsx';
import { AboutPage } from './components/public/AboutPage.tsx';
import { PricingPage } from './components/public/PricingPage.tsx';
import { BlogPage } from './components/public/BlogPage.tsx';
import { ContactPage } from './components/public/ContactPage.tsx';

// Auth Views
import { LoginPage, SignupPage, ForgotPasswordPage, OnboardingWizard } from './components/auth/AuthPages.tsx';

// Dashboard Views
import { OverviewView } from './components/dashboard/OverviewView.tsx';
import { OrdersView } from './components/dashboard/OrdersView.tsx';
import { ProductsView } from './components/dashboard/ProductsView.tsx';
import { InventoryView } from './components/dashboard/InventoryView.tsx';
import { CustomersView } from './components/dashboard/CustomersView.tsx';
import { PaymentsView } from './components/dashboard/PaymentsView.tsx';
import { ReturnsView } from './components/dashboard/ReturnsView.tsx';
import { ShippingView } from './components/dashboard/ShippingView.tsx';
import { AnalyticsView } from './components/dashboard/AnalyticsView.tsx';
import { IntegrationsView } from './components/dashboard/IntegrationsView.tsx';
import { TeamView } from './components/dashboard/TeamView.tsx';
import { SettingsView } from './components/dashboard/SettingsView.tsx';
import { HelpView } from './components/dashboard/HelpView.tsx';
import { ShopifyConnectView } from './components/dashboard/ShopifyConnectView.tsx';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();

  // Public marketing pages
  if (currentRoute === 'home') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <HomeHero />
          <HomeFeatures />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentRoute === 'features') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <FeaturesPage />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentRoute === 'about') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <AboutPage />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentRoute === 'pricing') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <PricingPage />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentRoute === 'blog') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <BlogPage />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentRoute === 'contact') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <ContactPage />
        </main>
        <Footer />
      </div>
    );
  }

  // Authentication pages
  if (currentRoute === 'login') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <LoginPage />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentRoute === 'signup') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <SignupPage />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentRoute === 'forgot-password') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <ForgotPasswordPage />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentRoute === 'onboarding') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <OnboardingWizard />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentRoute === 'shopify-guide') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <ShopifyConnectView />
        </main>
        <Footer />
      </div>
    );
  }

  // Authenticated Dashboard Views
  return (
    <DashboardLayout>
      {currentRoute === 'dashboard' && <OverviewView />}
      {currentRoute === 'orders' && <OrdersView />}
      {currentRoute === 'products' && <ProductsView />}
      {currentRoute === 'inventory' && <InventoryView />}
      {currentRoute === 'customers' && <CustomersView />}
      {currentRoute === 'payments' && <PaymentsView />}
      {currentRoute === 'returns' && <ReturnsView />}
      {currentRoute === 'shipping' && <ShippingView />}
      {currentRoute === 'analytics' && <AnalyticsView />}
      {currentRoute === 'integrations' && <IntegrationsView />}
      {(currentRoute === 'shopify' || currentRoute === 'shopify-connect') && <ShopifyConnectView />}
      {currentRoute === 'team' && <TeamView />}
      {currentRoute === 'settings' && <SettingsView />}
      {currentRoute === 'help' && <HelpView />}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
