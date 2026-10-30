import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Mail, MessageSquare, Send, CheckCircle2, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    inquiryType: 'Sales & Onboarding',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        showToast('Message submitted successfully!');
      } else {
        setErrorMsg(data.error || 'Failed to submit form.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-dots-pattern border-b border-[#E5E7EB] py-16 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-red-50 text-[#E10600] border border-red-200 text-xs font-bold uppercase tracking-wider">
            Direct Communications
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#37474F] tracking-tight">
            Connect With Our Solutions Team
          </h1>
          <p className="text-lg text-[#455A64] max-w-2xl mx-auto">
            Have questions about connecting custom Shopify setups, multi-courier APIs, or high-volume enterprise onboarding? We are here to assist.
          </p>
        </div>
      </section>

      {/* Form & Info Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-extrabold text-[#37474F]">
              How Can We Help Your E-Commerce Operations?
            </h2>
            <p className="text-sm text-[#455A64] leading-relaxed">
              Whether you are an established brand auditing your COD courier remittances or migrating from legacy desktop software, our e-commerce engineers provide direct technical guidance.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-100 text-[#E10600] mt-0.5">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#37474F]">Rapid Response Guarantee</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Submissions are reviewed by solutions engineers within 2 business hours.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-[#168BCE] mt-0.5">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#37474F]">Secure & Private Handling</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Your email and store information are stored exclusively for response fulfillment.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-[#16A34A] mt-0.5">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#37474F]">In-App Support Ticket Center</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Authenticated users can also submit priority support tickets inside their dashboard.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-gray-200 shadow-xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#37474F]">Message Received!</h3>
                  <p className="text-sm text-[#455A64] max-w-md mx-auto">
                    Thank you, <strong className="text-[#37474F]">{formData.name}</strong>. Our logistics specialist will review your inquiry regarding "{formData.subject}" and respond to <strong className="text-[#37474F]">{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        inquiryType: 'Sales & Onboarding',
                        message: '',
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-[#37474F]">Send An Inquiry</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Please provide your details below.</p>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle size={15} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#37474F] mb-1.5">
                        Full Name <span className="text-[#E10600]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Jordan Smith"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E10600]/30 focus:border-[#E10600] text-sm text-[#37474F]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#37474F] mb-1.5">
                        Business Email <span className="text-[#E10600]">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jordan@yourbrand.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E10600]/30 focus:border-[#E10600] text-sm text-[#37474F]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#37474F] mb-1.5">Inquiry Type</label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E10600]/30 focus:border-[#E10600] text-sm text-[#37474F] bg-white"
                      >
                        <option>Sales & Onboarding</option>
                        <option>Shopify Integration Support</option>
                        <option>COD & Courier Reconciliation</option>
                        <option>Enterprise Multi-Warehouse</option>
                        <option>Partnership Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#37474F] mb-1.5">
                        Subject <span className="text-[#E10600]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Connecting 3 Shopify stores"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E10600]/30 focus:border-[#E10600] text-sm text-[#37474F]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#37474F] mb-1.5">
                      Message Details <span className="text-[#E10600]">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your store volume, current carriers, or specific features you need..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E10600]/30 focus:border-[#E10600] text-sm text-[#37474F]"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white font-bold text-sm transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send size={16} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
