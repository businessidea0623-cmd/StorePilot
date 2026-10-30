import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Clock,
  X,
} from 'lucide-react';
import type { PaymentRecord } from '../../types/index.ts';
import { formatPKR } from '../../utils/formatters.ts';

export const PaymentsView: React.FC = () => {
  const { payments, reconcilePayment, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'cod' | 'prepaid' | 'unreconciled'>('all');
  const [search, setSearch] = useState('');
  const [reconcilingPayment, setReconcilingPayment] = useState<PaymentRecord | null>(null);
  const [remittanceRef, setRemittanceRef] = useState('');
  const [courierName, setCourierName] = useState('TCS Express');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSettled = payments
    .filter((p) => p.status === 'settled')
    .reduce((sum, p) => sum + p.amount, 0);

  const codPendingAmount = payments
    .filter((p) => p.type === 'cod' && (p.codStatus === 'uncollected' || p.codStatus === 'remitted_by_courier'))
    .reduce((sum, p) => sum + p.amount, 0);

  const codReconciledAmount = payments
    .filter((p) => p.type === 'cod' && p.codStatus === 'reconciled')
    .reduce((sum, p) => sum + p.amount, 0);

  let filtered = [...payments];
  if (activeTab === 'cod') {
    filtered = filtered.filter((p) => p.type === 'cod');
  } else if (activeTab === 'prepaid') {
    filtered = filtered.filter((p) => p.type === 'prepaid');
  } else if (activeTab === 'unreconciled') {
    filtered = filtered.filter((p) => p.type === 'cod' && p.codStatus !== 'reconciled');
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.orderNumber.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.method.toLowerCase().includes(q)
    );
  }

  const handleConfirmReconciliation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reconcilingPayment) return;

    setIsSubmitting(true);
    await reconcilePayment(reconcilingPayment.id, remittanceRef, courierName);
    setIsSubmitting(false);
    setReconcilingPayment(null);
    setRemittanceRef('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
          Payments & COD Reconciliation
        </h1>
        <p className="text-xs sm:text-sm text-[#455A64]">
          Audit gateway settlements, track courier Cash On Delivery remittances, and prevent cash leakage.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Settled Revenue</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#16A34A] mt-1">
            {formatPKR(totalSettled)}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">Cleared in merchant account</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">COD Uncollected / Pending</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#E10600] mt-1">
            {formatPKR(codPendingAmount)}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-0.5">With courier delivery fleet</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">COD Reconciled in Bank</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#168BCE] mt-1">
            {formatPKR(codReconciledAmount)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Matched with remittance slips</div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-gray-600">
          {[
            { id: 'all', label: `All Transactions (${payments.length})` },
            { id: 'cod', label: `COD Records (${payments.filter((p) => p.type === 'cod').length})` },
            { id: 'unreconciled', label: `Unreconciled COD (${payments.filter((p) => p.type === 'cod' && p.codStatus !== 'reconciled').length})` },
            { id: 'prepaid', label: `Prepaid Gateways (${payments.filter((p) => p.type === 'prepaid').length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === t.id ? 'bg-white text-[#37474F] shadow-xs' : 'hover:text-[#37474F]'
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
            placeholder="Search by order or customer..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#E10600]"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method & Channel</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Settlement Status</th>
                <th className="py-3 px-4">COD Courier Audit</th>
                <th className="py-3 px-4 text-right">Reconcile Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#37474F]">
                    {pay.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#37474F]">
                    {pay.customerName}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-700">{pay.method}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-mono">{pay.type}</div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-sm text-[#37474F]">
                    {formatPKR(pay.amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      pay.status === 'settled' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      pay.status === 'refunded' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {pay.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    {pay.type === 'cod' ? (
                      pay.codStatus === 'reconciled' ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                          <CheckCircle2 size={14} />
                          <span>Reconciled ({pay.remittanceRef || 'Ref Verified'})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                          <Clock size={14} />
                          <span>Pending ({pay.courierName || 'Assigned Courier'})</span>
                        </div>
                      )
                    ) : (
                      <span className="text-gray-400">Direct Gateway Deposition</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {pay.type === 'cod' && pay.codStatus !== 'reconciled' ? (
                      <button
                        onClick={() => {
                          setReconcilingPayment(pay);
                          setRemittanceRef(`REMIT-${Date.now().toString().slice(-6)}`);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#E10600] hover:bg-[#B80500] text-white font-bold text-[11px] transition-all"
                      >
                        Reconcile COD
                      </button>
                    ) : (
                      <span className="text-gray-400 text-[11px]">Matched & Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reconcile Modal */}
      {reconcilingPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#37474F]">
                Reconcile COD Remittance ({reconcilingPayment.orderNumber})
              </h3>
              <button onClick={() => setReconcilingPayment(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#455A64]">
              Match the courier payout reference number against your bank statement to settle the cash collection for <strong>{reconcilingPayment.customerName}</strong> ({formatPKR(reconcilingPayment.amount)}).
            </p>

            <form onSubmit={handleConfirmReconciliation} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">Courier Carrier</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] bg-white"
                >
                  <option value="TCS Express">TCS Express Pakistan</option>
                  <option value="Leopards Courier">Leopards Courier COD</option>
                  <option value="Trax Logistics">Trax Logistics COD</option>
                  <option value="PostEx">PostEx Express Payout</option>
                  <option value="M&P Express">M&P Express Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">Courier Remittance Reference #</label>
                <input
                  type="text"
                  value={remittanceRef}
                  onChange={(e) => setRemittanceRef(e.target.value)}
                  placeholder="e.g. REMIT-TCS-994821"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReconcilingPayment(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  {isSubmitting ? 'Verifying...' : 'Confirm Bank Remittance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
