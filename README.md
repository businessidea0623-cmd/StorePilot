# StorePilot — Multi-Channel E-Commerce & Shopify Management Platform

**Brand Identity:** StorePilot  
**Credit:** Design by Hanzala04  
**Stack:** React 19, TypeScript, Tailwind CSS, Node.js Express, Vite, Atomic File-Backed Persistent Database

---

## 🚀 Key Modules & Capabilities

1. **Public Marketing Website**
   - **Hero Section:** Inspired by modern logistics SaaS benchmarks with large uppercase headline, primary red CTA (`#E10600`), and interactive live operations control panel.
   - **Features & Solutions:** Detailed breakdowns of Order Orchestration, Inventory Control, COD Reconciliation, Courier Tracking, and Returns Management.
   - **Transparent Pricing:** Comparison across Free Demo Sandbox ($0), Growth ($49/mo), and Enterprise ($149/mo) with zero deceptive billing.
   - **Company & Insights Blog:** Real-world logistics playbooks on avoiding COD remittance leaks and Shopify GraphQL API migration.
   - **Validated Contact Form:** Server-processed inquiries with anti-spam validation.

2. **Full-Featured Authenticated SaaS Dashboard**
   - **Operations Command Center:** Real-time KPI metrics, weekly/monthly sales curves, active courier feeds, and channel distributions.
   - **Order Management:** Data table with filters by status, store, and payment method; complete order fulfillment drawer; CSV exports; and demo order creation.
   - **Product & Inventory Catalog:** SKU tracking, multi-variant support, low-stock threshold alerts, and instant stock quick-adjustments.
   - **COD & Payment Reconciliation:** Track cash collected by courier fleets, verify remittance reference IDs, and settle outstanding balances.
   - **Returns & Reverse Logistics:** Review return reasons (defective, wrong size, changed mind), warehouse QA inspection, restock, and gateway refund triggers.
   - **Shipping & Carrier Tracking:** Live event milestones for FedEx, DHL Express, Blue Dart, and Shiprocket.
   - **Role-Based Access Control (RBAC):** Owner, Admin, Manager, and Viewer permission enforcement.
   - **Shopify Official GraphQL Integration:** Connect live `.myshopify.com` domains, monitor API rate limits, and bi-directionally sync orders & inventory.
   - **Demo Mode Isolation:** Transparent separation between authenticated production store data and persistent demo test data.

---

## 🛠 Local Development & Testing

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (Express + Vite on Port 3000)
npm run dev

# 3. Run automated verification test suite
npm test

# 4. Compile production build
npm run build
```

---

## ⚙️ Environment Variables

Create `.env` using `.env.example`:
```env
PORT=3000
NODE_ENV=production
APP_URL=https://your-domain.com
```

---

## 📦 Production Deployment

1. **Build the SPA assets:**
   ```bash
   npm run build
   ```
2. **Start the Express backend:**
   ```bash
   npm run start
   ```
3. The server serves both the REST API on `/api/*` and pre-built static assets from `/dist`.

---

**Design by Hanzala04** &bull; StorePilot Technologies Inc.
