import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { UserCheck, Plus, Mail, Shield, Check, X, ShieldCheck } from 'lucide-react';
import type { Role } from '../../types/index.ts';

export const TeamView: React.FC = () => {
  const { team, showToast, refreshData } = useApp();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('manager');
  const [submitting, setSubmitting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Invitation dispatched to ${email}!`);
        await refreshData();
        setIsInviteModalOpen(false);
        setName('');
        setEmail('');
      } else {
        showToast(data.error || 'Failed to invite', 'error');
      }
    } catch (err) {
      showToast('Error sending invite', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const permissionMatrix = [
    { permission: 'View Orders, Products & Dashboard', owner: true, admin: true, manager: true, viewer: true },
    { permission: 'Dispatch Shipments & Generate Tracking', owner: true, admin: true, manager: true, viewer: false },
    { permission: 'Adjust Inventory & Warehouse Stock', owner: true, admin: true, manager: true, viewer: false },
    { permission: 'Approve Returns & Issue Refunds', owner: true, admin: true, manager: false, viewer: false },
    { permission: 'Reconcile COD Courier Remittances', owner: true, admin: true, manager: false, viewer: false },
    { permission: 'Manage Shopify & API Integrations', owner: true, admin: true, manager: false, viewer: false },
    { permission: 'Workspace Settings & Team Invitations', owner: true, admin: false, manager: false, viewer: false },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
            Team Members & Access Control (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-[#455A64]">
            Enforce least-privilege security roles across warehouse staff, support agents, and finance managers.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold transition-all shadow-sm shadow-red-500/20"
        >
          <Plus size={15} /> Invite Member
        </button>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#37474F]">Active Workspace Members ({team.length})</h3>
          <span className="text-xs text-gray-500">Security: Enforced on all backend routes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#37474F]">{m.name}</td>
                  <td className="py-3.5 px-4 text-gray-600">{m.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      m.role === 'owner' ? 'bg-red-50 text-[#E10600] border border-red-200' :
                      m.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      m.role === 'manager' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-slate-100 text-gray-700'
                    }`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-400">
                    {new Date(m.joinedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-[#37474F]">Role Permission Matrix</h3>
          <p className="text-xs text-gray-500">Strictly enforced at the database and API authorization layer</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Capability</th>
                <th className="py-3 px-4 text-center">Owner</th>
                <th className="py-3 px-4 text-center">Admin</th>
                <th className="py-3 px-4 text-center">Manager</th>
                <th className="py-3 px-4 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {permissionMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-semibold text-[#37474F]">{row.permission}</td>
                  <td className="py-3 px-4 text-center">
                    {row.owner ? <Check size={16} className="text-[#16A34A] inline" /> : <X size={16} className="text-gray-300 inline" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.admin ? <Check size={16} className="text-[#16A34A] inline" /> : <X size={16} className="text-gray-300 inline" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.manager ? <Check size={16} className="text-[#16A34A] inline" /> : <X size={16} className="text-gray-300 inline" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.viewer ? <Check size={16} className="text-[#16A34A] inline" /> : <X size={16} className="text-gray-300 inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#37474F]">Invite Team Colleague</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rachel@brandstore.com"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#37474F] mb-1">Role & Permissions</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#E10600] focus:outline-none bg-white font-semibold"
                >
                  <option value="admin">Admin (Full operations except billing)</option>
                  <option value="manager">Manager (Orders, inventory & dispatches)</option>
                  <option value="viewer">Viewer (Read-only reports)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#B80500] text-white text-xs font-bold"
                >
                  {submitting ? 'Inviting...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
