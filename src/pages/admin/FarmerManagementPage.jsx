import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Tractor,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
  ShieldCheck,
  Ban,
  RotateCcw,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const FarmerManagementPage = () => {
  const { admin } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'All';

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);

  // Modals state
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [viewDocsFarmer, setViewDocsFarmer] = useState(null);
  const [rejectModalFarmer, setRejectModalFarmer] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [suspendModalFarmer, setSuspendModalFarmer] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const loadFarmers = async () => {
    setLoading(true);
    try {
      const data = await api.getAllFarmersAdmin();
      setFarmers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  const handleApprove = async (farmer) => {
    try {
      const notes = prompt('Enter accreditation notes or verification approval remarks:', 'All land and organic audit documents validated.');
      if (notes === null) return; // user cancelled

      const res = await api.adminApproveFarmer(farmer.id, notes, `${admin?.name} (${admin?.role})`);
      if (res.success) {
        setFeedbackMessage({ type: 'success', text: `Farmer ${farmer.fullName} has been officially approved & verified.` });
        loadFarmers();
      }
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: 'Failed to approve farmer.' });
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please specify reason for rejecting this verification.');
      return;
    }
    try {
      const res = await api.adminRejectFarmer(rejectModalFarmer.id, rejectReason, `${admin?.name} (${admin?.role})`);
      if (res.success) {
        setFeedbackMessage({ type: 'success', text: `Verification rejected for ${rejectModalFarmer.fullName}. Resubmission notice dispatched.` });
        setRejectModalFarmer(null);
        setRejectReason('');
        loadFarmers();
      }
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: 'Action failed.' });
    }
  };

  const handleConfirmSuspendToggle = async () => {
    const isSuspending = suspendModalFarmer.status !== 'Suspended';
    if (isSuspending && !suspendReason.trim()) {
      alert('Please provide justification for account suspension.');
      return;
    }

    try {
      const res = await api.adminToggleFarmerSuspension(
        suspendModalFarmer.id,
        suspendReason || 'Reactivated by platform administrator',
        `${admin?.name} (${admin?.role})`
      );
      if (res.success) {
        setFeedbackMessage({
          type: 'success',
          text: `Farmer ${suspendModalFarmer.fullName} has been ${res.newStatus === 'Suspended' ? 'suspended' : 'reactivated'}.`
        });
        setSuspendModalFarmer(null);
        setSuspendReason('');
        loadFarmers();
      }
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: 'Failed to update farmer status.' });
    }
  };

  // Filtering
  const filteredFarmers = farmers.filter((f) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (f.fullName || '').toLowerCase().includes(term) ||
      (f.farmName || '').toLowerCase().includes(term) ||
      (f.email || '').toLowerCase().includes(term) ||
      (f.district || '').toLowerCase().includes(term);

    let matchesFilter = true;
    if (statusFilter === 'Pending') {
      matchesFilter = f.verificationStatus === 'Pending' || !f.verificationStatus;
    } else if (statusFilter === 'Approved') {
      matchesFilter = f.verificationStatus === 'Approved' && f.status !== 'Suspended';
    } else if (statusFilter === 'Rejected') {
      matchesFilter = f.verificationStatus === 'Rejected';
    } else if (statusFilter === 'Suspended') {
      matchesFilter = f.status === 'Suspended';
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Tractor className="w-6 h-6 text-emerald-400" />
            Farmer & Producer Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review land records, KYC documents, manage accreditation, and oversee farm sales listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Enrolled:</span>
          <span className="font-mono text-xs font-bold text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {farmers.length} Producers
          </span>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button onClick={() => setFeedbackMessage(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search and Status Filters */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by farmer name, farm title, email or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['All', 'Pending', 'Approved', 'Rejected', 'Suspended'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setSearchParams(status === 'All' ? {} : { filter: status });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {status}
              {status === 'Pending' && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                  {farmers.filter((f) => f.verificationStatus === 'Pending' || !f.verificationStatus).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Farmers Grid / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Producer / Farm</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Crops & Types</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Catalog / Revenue</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No farmer records matched the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredFarmers.map((f) => {
                  const isPending = f.verificationStatus === 'Pending' || !f.verificationStatus;
                  const isApproved = f.verificationStatus === 'Approved';
                  const isRejected = f.verificationStatus === 'Rejected';
                  const isSuspended = f.status === 'Suspended';

                  return (
                    <tr key={f.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{f.farmName || f.fullName}</div>
                        <div className="text-[11px] text-emerald-400/90">{f.fullName}</div>
                        <div className="text-[10px] font-mono text-slate-500">{f.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200">{f.village || f.district || 'Pune'}</div>
                        <div className="text-[10px] text-slate-500">{f.state || 'Maharashtra'} - {f.pincode || '411001'}</div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 mb-1">
                          {f.farmType || 'Organic Agro'}
                        </span>
                        <div className="text-[10px] text-slate-400 truncate">
                          {Array.isArray(f.productsGrown) ? f.productsGrown.join(', ') : (f.productsGrown || 'Seasonal Vegetables')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            isApproved
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : isRejected
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          {isApproved && <CheckCircle2 className="w-3 h-3" />}
                          {isRejected && <XCircle className="w-3 h-3" />}
                          {isPending && <AlertTriangle className="w-3 h-3" />}
                          {f.verificationStatus || 'Pending Review'}
                        </span>
                        {f.verificationBadge && (
                          <div className="text-[9px] text-emerald-400 font-medium mt-0.5">
                            {f.verificationBadge}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{f.productsCount || 0} listings</div>
                        <div className="text-[10px] text-slate-400">
                          {f.ordersCount || 0} orders &bull; <span className="text-emerald-400 font-mono">₹{f.totalRevenue || 0}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isSuspended
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}
                        >
                          {f.status || 'Active'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect profile */}
                          <button
                            onClick={() => setSelectedFarmer(f)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Inspect Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Inspect Documents */}
                          <button
                            onClick={() => setViewDocsFarmer(f)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition"
                            title="Review Land & KYC Documents"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Approve Action */}
                          {isPending && (
                            <button
                              onClick={() => handleApprove(f)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] transition"
                            >
                              Approve
                            </button>
                          )}

                          {/* Reject Action */}
                          {isPending && (
                            <button
                              onClick={() => {
                                setRejectModalFarmer(f);
                                setRejectReason('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-semibold text-[10px] transition"
                            >
                              Reject
                            </button>
                          )}

                          {/* Suspend / Reactivate Action */}
                          <button
                            onClick={() => {
                              setSuspendModalFarmer(f);
                              setSuspendReason('');
                            }}
                            className={`p-1.5 rounded-lg text-[10px] transition ${
                              isSuspended
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300'
                                : 'bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400'
                            }`}
                            title={isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                          >
                            {isSuspended ? <RotateCcw className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                          </button>
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

      {/* MODAL 1: Farmer Profile Details */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Tractor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedFarmer.farmName || selectedFarmer.fullName}</h3>
                  <p className="text-xs text-slate-400">{selectedFarmer.fullName} &bull; ID: {selectedFarmer.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedFarmer(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Contact Email</span>
                  <span className="font-mono text-slate-200">{selectedFarmer.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Mobile Phone</span>
                  <span className="font-mono text-slate-200">{selectedFarmer.mobile || '+91 98220 12345'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Location</span>
                  <span className="text-slate-200">{selectedFarmer.village || 'Khed'}, {selectedFarmer.district || 'Pune'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Acreage & Soil</span>
                  <span className="text-slate-200">{selectedFarmer.farmSize || '12 Acres'} &bull; Black Loam</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Crops & Production Focus:</span>
                <p className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                  {selectedFarmer.farmDescription || 'Generational regenerative farm dedicated to unpolished native grains, leafy greens, and hand-tended orchard fruits.'}
                </p>
              </div>

              {selectedFarmer.adminFeedback && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <span className="text-amber-400 font-bold block text-[11px] mb-0.5">Admin Record Notes:</span>
                  <p className="text-amber-200 text-[11px]">{selectedFarmer.adminFeedback}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedFarmer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Review Verification Documents */}
      {viewDocsFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Verification Documents: {viewDocsFarmer.farmName}</h3>
              </div>
              <button onClick={() => setViewDocsFarmer(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">7/12 Land Title Extract</p>
                  <p className="text-[10px] text-slate-500">Government revenue land ownership certificate</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                  Land_7-12_Extract.pdf
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Aadhaar / Identity Proof</p>
                  <p className="text-[10px] text-slate-500">National UID verified identity card</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                  Aadhaar_KYC_Verified.pdf
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">NPOP / PGS Organic Certificate</p>
                  <p className="text-[10px] text-slate-500">Zero synthetic chemical test certification</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 text-[10px] font-semibold border border-teal-500/30">
                  NPOP_Organic_2026.pdf
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Soil Health & Heavy Metal Report</p>
                  <p className="text-[10px] text-slate-500">Laboratory soil assay report</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold border border-cyan-500/30">
                  Soil_Health_Card.pdf
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[11px] text-slate-500">Audited under AGMARK & NPOP guidelines</span>
              <button
                onClick={() => setViewDocsFarmer(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Rejection Reason Dialog */}
      {rejectModalFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Reject Verification</h3>
            <p className="text-xs text-slate-400 mb-4">
              Specify the compliance issue so <span className="text-white font-medium">{rejectModalFarmer.fullName}</span> can correct and resubmit their documents.
            </p>

            <textarea
              rows="3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Land record extract is outdated (older than 6 months); please upload current 7/12 extract."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalFarmer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Suspend / Reactivate Dialog */}
      {suspendModalFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <h3 className="text-base font-bold text-white mb-2">
              {suspendModalFarmer.status === 'Suspended' ? 'Reactivate Farmer Account' : 'Suspend Farmer Account'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {suspendModalFarmer.status === 'Suspended'
                ? `Restoring access will allow ${suspendModalFarmer.fullName} to accept orders and list products again.`
                : `Suspending ${suspendModalFarmer.fullName} will instantly hide their listings and restrict order acceptance.`}
            </p>

            {suspendModalFarmer.status !== 'Suspended' && (
              <textarea
                rows="3"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Reason for suspension (e.g. repeated customer complaints about expired delivery)..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 mb-4"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSuspendModalFarmer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSuspendToggle}
                className={`px-4 py-2 text-white rounded-xl text-xs font-semibold ${
                  suspendModalFarmer.status === 'Suspended'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {suspendModalFarmer.status === 'Suspended' ? 'Confirm Reactivation' : 'Confirm Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

