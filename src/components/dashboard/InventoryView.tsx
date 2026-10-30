import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Layers, AlertTriangle, CheckCircle2, RefreshCw, Plus, ArrowUpRight, ShieldCheck, History } from 'lucide-react';
import { formatPKR } from '../../utils/formatters.ts';

export const InventoryView: React.FC = () => {
  const { products, updateProduct, activity, showToast } = useApp();
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValuation = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  let displayed = [...products];
  if (filter === 'low') {
    displayed = lowStockProducts;
  } else if (filter === 'out') {
    displayed = outOfStockProducts;
  }

  const handleAdjust = async (id: string, current: number, amount: number) => {
    const next = Math.max(0, current + amount);
    await updateProduct(id, { stock: next });
    showToast(`Stock updated to ${next} units`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
          Inventory & Warehouse Allocation
        </h1>
        <p className="text-xs sm:text-sm text-[#455A64]">
          Real-time stock velocity, safety buffer thresholds, and multi-location warehouse allocation.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Units in Stock</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#37474F] mt-1">{totalUnits}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Across {products.length} registered SKUs</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Inventory Valuation</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
            {formatPKR(totalValuation)}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">At retail list pricing</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Low Stock Triggers</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F59E0B] mt-1">
            {lowStockProducts.length}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-0.5">Below reorder threshold</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Stockouts</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#E10600] mt-1">
            {outOfStockProducts.length}
          </div>
          <div className="text-[11px] text-red-600 font-semibold mt-0.5">Overselling locked</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'all' ? 'bg-[#37474F] text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-600'
          }`}
        >
          All Stock ({products.length})
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'low' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white border border-gray-200 text-amber-800'
          }`}
        >
          Low Stock ({lowStockProducts.length})
        </button>
        <button
          onClick={() => setFilter('out')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'out' ? 'bg-[#E10600] text-white shadow-xs' : 'bg-white border border-gray-200 text-red-700'
          }`}
        >
          Out of Stock ({outOfStockProducts.length})
        </button>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Warehouse Status</th>
                <th className="py-3 px-4">Available Units</th>
                <th className="py-3 px-4">Reorder Safety Level</th>
                <th className="py-3 px-4">Stock Health</th>
                <th className="py-3 px-4 text-right">Adjustment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayed.map((p) => {
                const isOut = p.stock === 0;
                const isLow = !isOut && p.stock <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#37474F]">{p.title}</div>
                      <div className="font-mono text-gray-400 text-[11px]">{p.sku}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      Primary Hub (Zone A)
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-sm text-[#37474F]">
                      {p.stock}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 font-mono">
                      Threshold: &le; {p.lowStockThreshold}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isOut ? 'bg-red-50 text-red-700 border border-red-200' :
                        isLow ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isOut ? 'Depleted' : isLow ? 'Reorder Alert' : 'Healthy Buffer'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleAdjust(p.id, p.stock, -5)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-[11px]"
                          title="Deduct 5 units"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleAdjust(p.id, p.stock, 10)}
                          className="px-2 py-1 rounded bg-[#E10600]/10 hover:bg-[#E10600]/20 text-[#E10600] font-bold text-[11px]"
                          title="Restock 10 units"
                        >
                          +10 Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
