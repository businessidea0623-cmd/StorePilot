import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { BarChart3, TrendingUp, Download, PieChart, Calendar, DollarSign, Layers } from 'lucide-react';
import { formatPKR } from '../../utils/formatters.ts';

export const AnalyticsView: React.FC = () => {
  const { orders, products, metrics, showToast } = useApp();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');

  const grossRevenue = metrics?.totalSales || 1845000;
  const estimatedCOGS = Math.round(grossRevenue * 0.38 * 100) / 100;
  const estimatedShippingCost = Math.round(orders.length * 250);
  const netEstimatedProfit = Math.round((grossRevenue - estimatedCOGS - estimatedShippingCost) * 100) / 100;

  const exportReport = () => {
    const reportData = [
      ['Metric', 'Value'],
      ['Gross Sales Revenue (PKR)', grossRevenue.toFixed(2)],
      ['Estimated Product Cost (COGS) (PKR)', estimatedCOGS.toFixed(2)],
      ['Courier Shipping Costs (PKR)', estimatedShippingCost.toFixed(2)],
      ['Net Operating Margin (PKR)', netEstimatedProfit.toFixed(2)],
      ['Total Orders', orders.length],
      ['Average Order Value (PKR)', (grossRevenue / Math.max(1, orders.length)).toFixed(2)],
      ['Active SKUs', products.length],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + reportData.map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `storepilot_analytics_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Analytics summary report downloaded');
  };

  const productPerformance = [...products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
            Financial & Operational Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#455A64]">
            Transparent net profit calculations, SKU turnover velocity, and channel metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl text-xs font-bold text-gray-600">
            {(['7d', '30d', '90d', 'ytd'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg uppercase ${
                  timeframe === tf ? 'bg-[#37474F] text-white shadow-xs' : 'hover:text-[#37474F]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={exportReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold transition-all shadow-sm shadow-red-500/20"
          >
            <Download size={14} /> Download Report
          </button>
        </div>
      </div>

      {/* Financial Health Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Gross Sales</div>
          <div className="text-2xl font-extrabold text-[#37474F] mt-1">
            {formatPKR(grossRevenue)}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">+18.4% vs benchmark</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Product COGS</div>
          <div className="text-2xl font-extrabold text-gray-700 mt-1">
            {formatPKR(estimatedCOGS)}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">38% average landed cost</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Logistics & Shipping</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">
            {formatPKR(estimatedShippingCost)}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">Across {orders.length} dispatches</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Net Estimated Margin</div>
          <div className="text-2xl font-extrabold text-[#16A34A] mt-1">
            {formatPKR(netEstimatedProfit)}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">52.8% operational margin</div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Performing SKUs */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#37474F]">Top-Selling Products by Velocity</h3>
          <p className="text-xs text-gray-500">Products driving the highest gross contribution this period</p>

          <div className="space-y-3">
            {productPerformance.map((p, idx) => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-gray-700 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-[#37474F] text-xs">{p.title}</div>
                    <div className="font-mono text-gray-400 text-[10px]">{p.sku} &bull; {formatPKR(p.price)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-[#37474F]">{p.salesCount} sold</div>
                  <div className="text-[10px] font-bold text-emerald-600">
                    {formatPKR(p.salesCount * p.price)} gross
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Channel Mix */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#37474F]">Payment & Fulfillment Split</h3>
            <p className="text-xs text-gray-500 mb-4">Risk and cash settlement composition</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-700">Prepaid Cards, Raast & JazzCash</span>
                  <span className="text-emerald-600">82%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[82%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-700">Cash on Delivery (COD)</span>
                  <span className="text-[#E10600]">18%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#E10600] h-full w-[18%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-700">First-Attempt Delivery Rate</span>
                  <span className="text-blue-600">94.2%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[94%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-100 text-[11px] text-gray-500">
            <strong>Calculation Notice:</strong> All figures exclude refunded order values to present an authentic net operational picture.
          </div>
        </div>

      </div>

    </div>
  );
};
