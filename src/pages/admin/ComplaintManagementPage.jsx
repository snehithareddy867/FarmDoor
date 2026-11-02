import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LifeBuoy,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Eye,
  X,
  MessageSquare,
  ShieldCheck,
  User,
  Truck,
  Tractor
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const ComplaintManagementPage = () => {
  const { admin } = useAdminAuth();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'All';

  const [complaints, setComplaints] = useState([]);
  const [adminStaff, setAdminStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [roleFilter, setRoleFilter] = useState('All');

  // Modals
  const [resolveTarget, setResolveTarget] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [assignTarget, setAssignTarget] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [feedback, setFeedback] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAllComplaints();
      setComplaints(data);
      const admins = await api.getAdminAccounts();
      setAdminStaff(admins);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAssign = (comp) => {
    setAssignTarget(comp);
    setSelectedStaff(adminStaff[0]?.name || 'Meera Iyer (Support Lead)');
  };

  const handleConfirmAssign = async () => {
    try {
      const res = await api.adminAssignComplaint(
        assignTarget.id,
        selectedStaff,
        `${admin?.name} (${admin?.role})`
      );
      if (res.success) {
        setFeedback({ type: 'success', text: `Ticket #${assignTarget.id} assigned to ${selectedStaff}.` });
        setAssignTarget(null);
        loadData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Assignment failed.' });
    }
  };

  const handleConfirmResolve = async () => {
    if (!resolutionNotes.trim()) {
      alert('Please enter resolution notes describing the resolution provided to the stakeholder.');
      return;
    }

    try {
      const res = await api.adminResolveComplaint(resolveTarget.id, {
        resolution: resolutionNotes,
        actor: `${admin?.name} (${admin?.role})`
      });

      if (res.success) {
        setFeedback({ type: 'success', text: `Ticket #${resolveTarget.id} successfully marked as Resolved.` });
        setResolveTarget(null);
        setResolutionNotes('');
        loadData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to resolve ticket.' });
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (c.id || '').toLowerCase().includes(term) ||
      (c.subject || '').toLowerCase().includes(term) ||
      (c.userName || '').toLowerCase().includes(term) ||
      (c.orderId || '').toLowerCase().includes(term);

    let matchesStatus = true;
    if (statusFilter !== 'All') {
      matchesStatus = (c.status || '').toLowerCase() === statusFilter.toLowerCase();
    }

    let matchesRole = true;
    if (roleFilter !== 'All') {
      matchesRole = (c.userRole || c.ticketType || '').toLowerCase().includes(roleFilter.toLowerCase());
    }

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <LifeBuoy className="w-6 h-6 text-emerald-400" />
            Support Helpdesk & Dispute Resolution
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Triaged customer claims, farmer settlement disputes, and field courier transit tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Open Tickets:</span>
          <span className="font-mono text-xs font-bold text-amber-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {complaints.filter((c) => c.status === 'Open' || c.status === 'Pending').length} Pending Action
          </span>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ticket ID, subject, claimant, or order reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All User Roles</option>
            <option value="customer">Customers</option>
            <option value="farmer">Farmers</option>
            <option value="delivery">Couriers / Riders</option>
          </select>

          <div className="flex items-center gap-1 overflow-x-auto">
            {['All', 'Open', 'In Progress', 'Resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === status
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Stakeholder</th>
                <th className="py-3.5 px-4">Category & Subject</th>
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Assigned Officer</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No support tickets match criteria.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  const isResolved = c.status === 'Resolved';
                  const isCustomer = (c.userRole || c.ticketType || '').toLowerCase().includes('customer');
                  const isFarmer = (c.userRole || c.ticketType || '').toLowerCase().includes('farmer');
                  const isCourier = (c.userRole || c.ticketType || '').toLowerCase().includes('delivery') || (c.ticketType || '').toLowerCase().includes('courier');

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white">#{c.id}</div>
                        <div className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{c.userName || 'Claimant'}</div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          {isCustomer && <User className="w-3 h-3 text-cyan-400" />}
                          {isFarmer && <Tractor className="w-3 h-3 text-emerald-400" />}
                          {isCourier && <Truck className="w-3 h-3 text-amber-400" />}
                          <span className="capitalize">{c.ticketType || c.userRole || 'Customer'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-white truncate">{c.subject}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{c.description}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {c.orderId && c.orderId !== 'N/A' ? `#${c.orderId}` : '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-300 font-medium">
                          {c.assignedTo || 'Unassigned'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            isResolved
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : c.status === 'In Progress'
                              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          {isResolved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {c.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isResolved && (
                            <button
                              onClick={() => handleOpenAssign(c)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition"
                            >
                              Assign
                            </button>
                          )}

                          {!isResolved && (
                            <button
                              onClick={() => {
                                setResolveTarget(c);
                                setResolutionNotes('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] transition"
                            >
                              Resolve
                            </button>
                          )}

                          {isResolved && (
                            <span className="text-[10px] text-slate-500 italic">Resolved</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN MODAL */}
      {assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <h3 className="text-base font-bold text-white mb-1">Assign Complaint Ticket</h3>
            <p className="text-xs text-slate-400 mb-4">
              Select an administrator or support officer to own resolution for #{assignTarget.id}:
            </p>

            <div className="space-y-3 mb-5 text-xs">
              <label className="block text-slate-300 font-semibold">Support Officer</label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                {adminStaff.map((staff) => (
                  <option key={staff.id} value={`${staff.name} (${staff.role})`}>
                    {staff.name} &bull; {staff.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAssignTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Ownership
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESOLVE MODAL */}
      {resolveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">Resolve Ticket: {resolveTarget.subject}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter formal resolution remarks communicated to <span className="text-white font-medium">{resolveTarget.userName}</span>:
            </p>

            <textarea
              rows="3"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Courier investigated and verified doorstep dropoff; partial courtesy coupon ₹100 issued to customer."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setResolveTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

