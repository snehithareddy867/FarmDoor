import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Truck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
  RotateCcw,
  Ban,
  X,
  Zap,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { handleAvatarError, AVATAR_FALLBACKS } from '../../utils/imageFallback';

export const DeliveryPartnerManagementPage = () => {
  const { admin } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'All';

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);

  // Modals
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [viewDocsPartner, setViewDocsPartner] = useState(null);
  const [rejectModalPartner, setRejectModalPartner] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [suspendModalPartner, setSuspendModalPartner] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [feedback, setFeedback] = useState(null);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const data = await api.getAllDeliveryPartnersAdmin();
      setPartners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleApprove = async (partner) => {
    const notes = prompt('Enter remarks for courier approval:', 'Valid driving license, active insurance, and background verified.');
    if (notes === null) return;

    try {
      const res = await api.adminApproveDeliveryPartner(partner.id, notes, `${admin?.name} (${admin?.role})`);
      if (res.success) {
        setFeedback({ type: 'success', text: `Delivery partner ${partner.fullName} successfully approved for platform runs.` });
        loadPartners();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Approval failed.' });
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please state why this application is being rejected.');
      return;
    }
    try {
      const res = await api.adminRejectDeliveryPartner(rejectModalPartner.id, rejectReason, `${admin?.name} (${admin?.role})`);
      if (res.success) {
        setFeedback({ type: 'success', text: `Onboarding rejected for ${rejectModalPartner.fullName}. Notice sent.` });
        setRejectModalPartner(null);
        setRejectReason('');
        loadPartners();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Rejection failed.' });
    }
  };

  const handleConfirmSuspendToggle = async () => {
    const isSuspending = suspendModalPartner.status !== 'Suspended';
    if (isSuspending && !suspendReason.trim()) {
      alert('Please provide justification for courier suspension.');
      return;
    }

    try {
      const res = await api.adminTogglePartnerSuspension(
        suspendModalPartner.id,
        suspendReason || 'Reactivated by platform administrator',
        `${admin?.name} (${admin?.role})`
      );
      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Courier ${suspendModalPartner.fullName} has been ${res.newStatus === 'Suspended' ? 'suspended' : 'reactivated'}.`
        });
        setSuspendModalPartner(null);
        setSuspendReason('');
        loadPartners();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Action failed.' });
    }
  };

  const filteredPartners = partners.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (p.fullName || '').toLowerCase().includes(term) ||
      (p.email || '').toLowerCase().includes(term) ||
      (p.mobile || '').toLowerCase().includes(term) ||
      (p.vehicleNumber || '').toLowerCase().includes(term) ||
      (p.city || '').toLowerCase().includes(term);

    let matchesFilter = true;
    if (statusFilter === 'Pending') {
      matchesFilter = p.verificationStatus === 'Pending';
    } else if (statusFilter === 'Approved') {
      matchesFilter = p.verificationStatus === 'Approved' && p.status !== 'Suspended';
    } else if (statusFilter === 'Online') {
      matchesFilter = p.isOnline && p.status !== 'Suspended';
    } else if (statusFilter === 'Suspended') {
      matchesFilter = p.status === 'Suspended';
    } else if (statusFilter === 'Rejected') {
      matchesFilter = p.verificationStatus === 'Rejected';
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-emerald-400" />
            Delivery Fleet & Courier Partner Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review driver onboarding, verify vehicle registrations, monitor live courier availability, and manage trip compensations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Enrolled Fleet:</span>
          <span className="font-mono text-xs font-bold text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {partners.length} Riders
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

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by rider name, vehicle registration number, phone or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['All', 'Pending', 'Approved', 'Online', 'Rejected', 'Suspended'].map((status) => (
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
                  {partners.filter((p) => p.verificationStatus === 'Pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Courier Partner</th>
                <th className="py-3.5 px-4">Vehicle & Eco Fleet</th>
                <th className="py-3.5 px-4">Location & Base</th>
                <th className="py-3.5 px-4">KYC Verification</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4">Completed Runs</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No delivery partners match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredPartners.map((p) => {
                  const isApproved = p.verificationStatus === 'Approved';
                  const isPending = p.verificationStatus === 'Pending';
                  const isRejected = p.verificationStatus === 'Rejected';
                  const isSuspended = p.status === 'Suspended';
                  const isEco = (p.vehicleType || '').toLowerCase().includes('electric') || (p.vehicleType || '').toLowerCase().includes('ev');

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {p.fullName}
                          {isEco && <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="Eco-Fleet Certified" />}
                        </div>
                        <div className="text-[10px] text-slate-400">{p.mobile} &bull; {p.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-200 mb-0.5">
                          {p.vehicleType || 'Motorcycle'}
                        </span>
                        <div className="font-mono text-[10px] text-slate-400 uppercase">
                          {p.vehicleNumber || 'MH-12-AB-1234'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200">{p.city || 'Pune'}</div>
                        <div className="text-[10px] text-slate-500">{p.state || 'Maharashtra'} - {p.pincode}</div>
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
                          {p.verificationStatus || 'Pending'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${p.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                          <span className={`text-[11px] font-medium ${p.isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {p.isOnline ? 'Online Ready' : 'Offline'}
                          </span>
                        </div>
                        {p.activeJobsCount > 0 && (
                          <div className="text-[10px] text-amber-400 mt-0.5">
                            {p.activeJobsCount} live run in progress
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{p.completedDeliveries || 0} deliveries</div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          ₹{p.totalEarnings || 0} earned
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPartner(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Inspect Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setViewDocsPartner(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition"
                            title="Review Driving & Vehicle Documents"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {isPending && (
                            <button
                              onClick={() => handleApprove(p)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] transition"
                            >
                              Approve
                            </button>
                          )}

                          {isPending && (
                            <button
                              onClick={() => {
                                setRejectModalPartner(p);
                                setRejectReason('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-semibold text-[10px] transition"
                            >
                              Reject
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSuspendModalPartner(p);
                              setSuspendReason('');
                            }}
                            className={`p-1.5 rounded-lg text-[10px] transition ${
                              isSuspended
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300'
                                : 'bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400'
                            }`}
                            title={isSuspended ? 'Reactivate Courier' : 'Suspend Courier'}
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

      {/* MODAL 1: Profile Inspection */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPartner.profilePhoto || AVATAR_FALLBACKS.delivery}
                  alt={selectedPartner.fullName}
                  loading="lazy"
                  onError={(e) => handleAvatarError(e, 'delivery')}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedPartner.fullName}</h3>
                  <p className="text-xs text-slate-400">ID: {selectedPartner.id} &bull; {selectedPartner.city}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPartner(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Contact Email</span>
                  <span className="font-mono text-slate-200">{selectedPartner.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Mobile Phone</span>
                  <span className="font-mono text-slate-200">{selectedPartner.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Vehicle Specification</span>
                  <span className="text-slate-200">{selectedPartner.vehicleType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Registration Number</span>
                  <span className="font-mono text-emerald-400 font-bold uppercase">{selectedPartner.vehicleNumber || 'MH-12-EV-9821'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Completed Trips</span>
                  <span className="text-lg font-bold text-white mt-1 block">{selectedPartner.completedDeliveries || 0}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Total Disbursed Pay</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">₹{selectedPartner.totalEarnings || 0}</span>
                </div>
              </div>

              {selectedPartner.adminFeedback && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <span className="text-amber-400 font-bold block text-[11px] mb-0.5">Admin Record Notes:</span>
                  <p className="text-amber-200 text-[11px]">{selectedPartner.adminFeedback}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedPartner(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Review Documents */}
      {viewDocsPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Credentials: {viewDocsPartner.fullName}</h3>
              </div>
              <button onClick={() => setViewDocsPartner(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Commercial Driving License (DL)</p>
                  <p className="text-[10px] text-slate-500">Transport authorization & validity check</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                  Driving_License_Scan.pdf
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Vehicle Registration Certificate (RC Book)</p>
                  <p className="text-[10px] text-slate-500">RTO ownership & fitness verification</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                  Vehicle_RC_Book.pdf
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Vehicle Insurance & Pollution (PUC)</p>
                  <p className="text-[10px] text-slate-500">Comprehensive third-party cover valid through 2027</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 text-[10px] font-semibold border border-teal-500/30">
                  Insurance_Policy.pdf
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Aadhaar / National ID</p>
                  <p className="text-[10px] text-slate-500">UID biometric KYC identity file</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold border border-cyan-500/30">
                  Aadhaar_Document.pdf
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[11px] text-slate-500">Verified via Digilocker & Vahan database</span>
              <button
                onClick={() => setViewDocsPartner(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Rejection Dialog */}
      {rejectModalPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <h3 className="text-base font-bold text-white mb-1">Reject Courier Application</h3>
            <p className="text-xs text-slate-400 mb-4">
              State the rejection justification for <span className="text-white font-medium">{rejectModalPartner.fullName}</span>:
            </p>

            <textarea
              rows="3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Scanned Driving License document is blurred or expired; please re-upload clear copy."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalPartner(null)}
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
      {suspendModalPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <h3 className="text-base font-bold text-white mb-2">
              {suspendModalPartner.status === 'Suspended' ? 'Reactivate Delivery Partner' : 'Suspend Delivery Partner'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {suspendModalPartner.status === 'Suspended'
                ? `Reactivating will permit ${suspendModalPartner.fullName} to switch online and receive trip assignments.`
                : `Suspending will instantly force ${suspendModalPartner.fullName} offline and block new route requests.`}
            </p>

            {suspendModalPartner.status !== 'Suspended' && (
              <textarea
                rows="3"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Reason for suspension (e.g. repeated order damage or customer disputes)..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 mb-4"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSuspendModalPartner(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSuspendToggle}
                className={`px-4 py-2 text-white rounded-xl text-xs font-semibold ${
                  suspendModalPartner.status === 'Suspended'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {suspendModalPartner.status === 'Suspended' ? 'Confirm Reactivation' : 'Confirm Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

