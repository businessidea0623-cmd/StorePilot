import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Search, Download, Users, Mail, Phone, MapPin, ChevronRight, X, ShoppingBag } from 'lucide-react';
import type { Customer } from '../../types/index.ts';
import { formatPKR, formatPKDate } from '../../utils/formatters.ts';

export const CustomersView: React.FC = () => {
  const { customers, orders, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  const customerOrders = selectedCustomer
    ? orders.filter(
        (o) =>
          o.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase() ||
          o.customerName.toLowerCase() === selectedCustomer.name.toLowerCase()
      )
    : [];

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'City', 'Total Orders', 'Total Spent (PKR)', 'Last Order Date (PKT)'];
    const rows = filtered.map((c) => [
      `"${c.name}"`,
      c.email,
      c.phone,
      `"${c.city}"`,
      c.totalOrders,
      c.totalSpent.toFixed(2),
      c.lastOrderDate ? formatPKDate(c.lastOrderDate) : 'N/A',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `storepilot_customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filtered.length} customers to CSV`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
            Customer Directory & LTV
          </h1>
          <p className="text-xs sm:text-sm text-[#455A64]">
            Unified customer purchase histories, repeat purchase velocity, and address records.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#37474F] hover:bg-slate-50 transition-colors shadow-xs"
        >
          <Download size={14} /> Export Customers
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#E10600]"
          />
        </div>
        <span className="text-xs text-gray-500 font-semibold">{filtered.length} profiles</span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Lifetime Orders</th>
                <th className="py-3 px-4">Total Spending</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#37474F] text-sm">{c.name}</div>
                    <div className="text-gray-400 text-[11px]">Since {new Date(c.createdAt).getFullYear()}</div>
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="text-gray-700">{c.email}</div>
                    <div className="text-gray-400 text-[10px]">{c.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 font-medium">{c.city}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-700">{c.totalOrders} order(s)</td>
                  <td className="py-3.5 px-4 font-extrabold text-sm text-[#37474F]">
                    {formatPKR(c.totalSpent)}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">
                    {c.notes || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <ChevronRight size={16} className="text-gray-400 inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-[#37474F]">{selectedCustomer.name}</h3>
                <div className="text-xs text-gray-400">{selectedCustomer.email} &bull; {selectedCustomer.phone}</div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200">
                <div className="text-[10px] font-bold uppercase text-gray-400">Total Lifetime Value</div>
                <div className="text-2xl font-extrabold text-[#E10600] mt-1">{formatPKR(selectedCustomer.totalSpent)}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200">
                <div className="text-[10px] font-bold uppercase text-gray-400">Lifetime Order Count</div>
                <div className="text-2xl font-extrabold text-[#37474F] mt-1">{selectedCustomer.totalOrders}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-gray-500 tracking-wider">Purchase History</div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {customerOrders.length > 0 ? (
                  customerOrders.map((ord) => (
                    <div key={ord.id} className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#37474F] mr-2">{ord.orderNumber}</span>
                        <span className="text-gray-500">{formatPKDate(ord.createdAt)}</span>
                      </div>
                      <span className="font-bold text-[#37474F]">{formatPKR(ord.totalAmount)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 text-center py-4">No order records linked.</div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-[#37474F] text-white text-xs font-bold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
