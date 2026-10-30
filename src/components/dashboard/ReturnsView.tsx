import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  AlertTriangle,
  ArrowRight,
  Package,
  DollarSign,
  X,
} from 'lucide-react';
import type { ReturnRequest } from '../../types/index.ts';
import { formatPKR } from '../../utils/formatters.ts';

export const ReturnsView: React.FC = () => {
  const { returns, updateReturn, showToast } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | 'refunded'>('approved');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  let filtered = [...returns];
  if (filter !== 'all') {
    filtered = filtered.filter((r) => r.status === filter);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.returnNumber.toLowerCase().includes(q) ||
        r.orderNumber.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q)
    );
  }

  const handleProcessReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturn) return;

    setSubmitting(true);
    await updateReturn(selectedReturn.id, reviewAction, notes);
    setSubmitting(false);
    setReviewModalOpen(false);
    setSelectedReturn(null);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
          Returns & Reverse Logistics
        </h1>
        <p className="text-xs sm:text-sm text-[#455A64]">
          Inspect return packages, approve exchanges, restock catalog inventory, and process customer refunds.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Return Requests</div>
          <div className="text-2xl font-extrabold text-[#37474F] mt-1">{returns.length}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Logged across stores</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Pending Warehouse Review</div>
          <div className="text-2xl font-extrabold text-[#E10600] mt-1">
            {returns.filter((r) => r.status === 'pending_review').length}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-0.5">Awaiting QA scan</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Refunds Processed</div>
          <div className="text-2xl font-extrabold text-[#168BCE] mt-1">
            {returns.filter((r) => r.status === 'refunded').length}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">Returned to gateway</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Refunded Amount</div>
          <div className="text-2xl font-extrabold text-purple-700 mt-1">
            {formatPKR(
              returns
                .filter((r) => r.status === 'refunded')
                .reduce((sum, r) => sum + r.refundAmount, 0)
            )}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">Restocked to warehouse</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-gray-600">
          {[
            { id: 'all', label: 'All Returns' },
            { id: 'pending_review', label: 'Pending Review' },
            { id: 'approved', label: 'Approved' },
            { id: 'refunded', label: 'Refunded' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === t.id ? 'bg-white text-[#37474F] shadow-xs' : 'hover:text-[#37474F]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search return # or customer..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#E10600]"
          />
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Return #</th>
                <th className="py-3 px-4">Original Order</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Return Reason</th>
                <th className="py-3 px-4">Refund Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((ret) => (
                <tr key={ret.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#37474F]">
                    {ret.returnNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-600">
                    {ret.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#37474F]">{ret.customerName}</div>
                    <div className="text-[10px] text-gray-400">{ret.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#37474F] font-semibold text-[10px] capitalize">
                      {ret.reason.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-sm text-[#37474F]">
                    {formatPKR(ret.refundAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ret.status === 'refunded' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      ret.status === 'approved' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      ret.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {ret.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedReturn(ret);
                        setReviewModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-[#37474F] hover:text-white text-gray-700 font-bold text-[11px] transition-colors"
                    >
                      Process & Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#37474F]">
                Process Return ({selectedReturn.returnNumber})
              </h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-gray-200 space-y-1 text-xs">
              <div className="text-gray-500">Customer: <strong className="text-[#37474F]">{selectedReturn.customerName}</strong></div>
              <div className="text-gray-500">Linked Order: <strong className="text-[#37474F] font-mono">{selectedReturn.orderNumber}</strong></div>
              <div className="text-gray-500">Claimed Reason: <strong className="text-[#E10600] capitalize">{selectedReturn.reason.replace('_', ' ')}</strong></div>
              <div className="text-gray-500">Refund Value: <strong className="text-[#16A34A]">{formatPKR(selectedReturn.refundAmount)}</strong></div>
            </div>

            <form onSubmit={handleProcessReturn} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">Select Action Decision</label>
                <select
                  value={reviewAction}
                  onChange={(e) => setReviewAction(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] bg-white font-semibold"
                >
                  <option value="approved">Approve Return & Issue Pre-Paid Label</option>
                  <option value="refunded">Item Inspected: Restock & Issue Gateway Refund</option>
                  <option value="rejected">Reject Return (Violates 30-Day Policy)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">Inspection / Internal Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record package condition, restocking notes, or reason for decision..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold"
                >
                  {submitting ? 'Updating...' : 'Confirm Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
