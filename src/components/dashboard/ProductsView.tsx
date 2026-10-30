import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Plus, Search, Filter, AlertTriangle, CheckCircle2, Edit2, X, Package } from 'lucide-react';
import type { Product } from '../../types/index.ts';
import { formatPKR } from '../../utils/formatters.ts';

export const ProductsView: React.FC = () => {
  const { products, createProduct, updateProduct, showToast, setCurrentRoute } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [price, setPrice] = useState(3450);
  const [stock, setStock] = useState(25);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  let filtered = [...products];
  if (categoryFilter !== 'all') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sku.trim()) {
      showToast('Title and SKU are required', 'error');
      return;
    }
    setSubmitting(true);
    await createProduct({
      title,
      sku,
      category,
      price,
      stock,
      lowStockThreshold,
    });
    setSubmitting(false);
    setIsAddModalOpen(false);
    setTitle('');
    setSku('');
  };

  const handleQuickStockUpdate = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    await updateProduct(product.id, { stock: newStock });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
            Product Catalog & SKUs
          </h1>
          <p className="text-xs sm:text-sm text-[#455A64]">
            Synchronized inventory catalog across your connected stores and warehouses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentRoute('shopify')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-[#37474F] text-xs font-bold transition-all shadow-xs"
          >
            <Package size={14} className="text-[#E10600]" />
            <span>Shopify Live Sync & Video</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold transition-all shadow-sm shadow-red-500/20"
          >
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['all', 'Apparel', 'Accessories', 'Outerwear', 'Footwear'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-[#37474F] text-white shadow-xs'
                  : 'bg-slate-50 text-gray-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or SKU..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#E10600]"
          />
        </div>
      </div>

      {/* Product Grid / Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Retail Price</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Sales Vol</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#37474F] text-sm">{prod.title}</span>
                        {prod.source === 'shopify_live' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Shopify Live
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400">{prod.variantsCount} variant(s) configured</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#37474F] font-semibold text-[10px]">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-gray-600">{prod.sku}</td>
                  <td className="py-3 px-4 font-extrabold text-[#37474F]">{formatPKR(prod.price)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      prod.stock === 0 ? 'bg-red-50 text-red-700 border border-red-200' :
                      prod.stock <= prod.lowStockThreshold ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {prod.stock === 0 ? 'OUT OF STOCK' : `${prod.stock} units`}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-600">{prod.salesCount} sold</td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleQuickStockUpdate(prod, -1)}
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs"
                        title="Deduct 1"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleQuickStockUpdate(prod, 5)}
                        className="px-2 h-6 rounded bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-[11px]"
                        title="Add 5"
                      >
                        +5
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#37474F]">Add Product to Catalog</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">Product Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Classic Linen Trousers"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#37474F] mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="TRSR-LIN-009"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#37474F] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none bg-white"
                  >
                    <option>Apparel</option>
                    <option>Footwear</option>
                    <option>Outerwear</option>
                    <option>Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#37474F] mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    step="50"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#37474F] mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#37474F] mb-1">Low Alert At</label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold"
                >
                  {submitting ? 'Saving...' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
