import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { HelpCircle, BookOpen, Send, CheckCircle2, MessageSquare, ExternalLink, LifeBuoy } from 'lucide-react';

export const HelpView: React.FC = () => {
  const { showToast } = useApp();
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Logistics & Couriers');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showToast('Subject and message are required', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Support ticket #TCK-8821 dispatched to engineering');
  };

  const guides = [
    {
      title: 'Connecting Shopify via GraphQL Admin API',
      category: 'Storefront Setup',
      readTime: '3 min read',
      snippet: 'How StorePilot configures bi-directional order & inventory webhooks with rate limit protection.',
    },
    {
      title: 'Best Practices for Cash on Delivery (COD) Audit',
      category: 'Finance & Remittance',
      readTime: '5 min read',
      snippet: 'Reconciling Blue Dart, Delhivery, and Shiprocket remittance slips without manual errors.',
    },
    {
      title: 'Automated Multi-Carrier Dispatch',
      category: 'Fulfillment',
      readTime: '4 min read',
      snippet: 'Assigning tracking numbers and pushing fulfillment notifications directly to shoppers.',
    },
    {
      title: 'Handling Returns, QA Restock, and Gateway Refunds',
      category: 'Reverse Logistics',
      readTime: '4 min read',
      snippet: 'Inspecting customer returns and issuing instant store credit or payment gateway returns.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
          Help Desk & Documentation
        </h1>
        <p className="text-xs sm:text-sm text-[#455A64]">
          Operational playbooks, technical guides, and direct engineering ticket submission.
        </p>
      </div>

      {/* System Status Banner */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <div>
            <div className="text-xs font-bold text-[#37474F]">All StorePilot Cloud Services Operational</div>
            <div className="text-[11px] text-gray-500">Shopify API Webhooks: 100% &bull; Courier Tracking: 100%</div>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          Latency: 18ms
        </span>
      </div>

      {/* Guides Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[#37474F] flex items-center gap-2">
          <BookOpen size={18} className="text-[#E10600]" /> Operational Guides
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((g, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xs transition-all space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#168BCE] uppercase">{g.category}</span>
                <span className="text-gray-400">{g.readTime}</span>
              </div>
              <h4 className="font-bold text-sm text-[#37474F] group-hover:text-[#E10600] transition-colors">
                {g.title}
              </h4>
              <p className="text-xs text-[#455A64] leading-relaxed">{g.snippet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Ticket Submission */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#37474F] flex items-center gap-2">
          <MessageSquare size={18} className="text-[#168BCE]" /> Submit Technical Support Ticket
        </h3>

        {submitted ? (
          <div className="p-6 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
            <div className="font-bold text-base">Ticket Submitted!</div>
            <p className="text-xs max-w-sm mx-auto text-emerald-800">
              Your ticket regarding "{ticketSubject}" has been assigned to operations engineer #04. Typical response time is under 15 minutes.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setTicketSubject('');
                setTicketMessage('');
              }}
              className="mt-3 text-xs font-bold text-emerald-700 underline"
            >
              Submit Another Ticket
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">Issue Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none bg-white font-medium"
                >
                  <option>Logistics & Couriers</option>
                  <option>Shopify Webhook Sync</option>
                  <option>COD Reconciliation</option>
                  <option>Inventory Discrepancy</option>
                  <option>API & Webhook Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">Ticket Subject</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Blue Dart tracking webhook timeout"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1">Detailed Description</label>
              <textarea
                rows={4}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Include order numbers, tracking IDs, or unexpected behavior..."
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none font-medium"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold transition-all shadow-sm shadow-red-500/20 flex items-center gap-2"
              >
                <Send size={14} /> Submit Support Ticket
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
