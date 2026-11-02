import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation, 
  Compass, 
  Clock, 
  Coins, 
  ArrowRight, 
  Store, 
  Home, 
  ShieldCheck, 
  X, 
  Camera, 
  KeyRound, 
  FileCheck2,
  AlertCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';
import { api } from '../../services/api';
import DeliveryRouteMap from '../../components/delivery/DeliveryRouteMap';

export default function ActiveDeliveriesPage() {
  const { partner } = useDeliveryAuth();
  const navigate = useNavigate();

  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  // Modals state
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [failureModalOpen, setFailureModalOpen] = useState(false);

  // Pickup checklist state
  const [checklist, setChecklist] = useState([]);
  const [damageReport, setDamageReport] = useState('');

  // Delivery confirmation state
  const [otpInput, setOtpInput] = useState('');
  const [cashCollected, setCashCollected] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [modalError, setModalError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Failure modal state
  const [failReason, setFailReason] = useState('Customer phone unreachable');
  const [failNotes, setFailNotes] = useState('');
  const [returnAction, setReturnAction] = useState('Returned to Agro Cold Staging Hub');

  const fetchActiveDeliveries = async () => {
    if (!partner?.id) return;
    setLoading(true);
    const jobs = await api.getPartnerActiveDeliveries(partner.id);
    setActiveJobs(jobs || []);
    if (jobs && jobs.length > 0) {
      // Pick first active or maintain selected
      setSelectedJob((prev) => {
        if (!prev) return jobs[0];
        const match = jobs.find((j) => j.id === prev.id);
        return match || jobs[0];
      });
    } else {
      setSelectedJob(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActiveDeliveries();
  }, [partner?.id]);

  // Stepper milestones
  const WORKFLOW_STEPS = [
    { key: 'Accepted', label: 'Accepted', num: 1 },
    { key: 'Reached pickup location', label: 'At Farm Hub', num: 2 },
    { key: 'Picked up', label: 'Picked Up', num: 3 },
    { key: 'In transit', label: 'In Transit', num: 4 },
    { key: 'Out for delivery', label: 'At Customer Door', num: 5 },
    { key: 'Delivered', label: 'Delivered', num: 6 }
  ];

  const getStepIndex = (status) => {
    if (status === 'Assigned') return 0;
    if (status === 'Accepted') return 1;
    if (status === 'Reached pickup location') return 2;
    if (status === 'Picked up') return 3;
    if (status === 'In transit') return 4;
    if (status === 'Out for delivery') return 5;
    if (status === 'Delivered') return 6;
    return 1;
  };

  // Status advancement handlers
  const handleReachPickup = async () => {
    if (!selectedJob) return;
    setActionLoading(true);
    await api.updateDeliveryWorkflow(
      selectedJob.id,
      'Reached pickup location',
      'Arrived at farm staging area. Preparing crate verification.'
    );
    setActionLoading(false);
    fetchActiveDeliveries();
    setToastMessage({ type: 'success', text: 'Arrived at pickup hub! Please complete the item checklist.' });
  };

  const handleOpenPickupModal = () => {
    if (!selectedJob) return;
    setChecklist(selectedJob.items ? selectedJob.items.map(() => true) : [true, true]);
    setDamageReport('');
    setPickupModalOpen(true);
  };

  const handleConfirmPickupSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    setActionLoading(true);

    await api.confirmPickup(selectedJob.id, checklist, damageReport);
    setActionLoading(false);
    setPickupModalOpen(false);
    fetchActiveDeliveries();
    setToastMessage({
      type: 'success',
      text: 'Produce verified & secured in thermal bag! Status updated to Picked Up.'
    });
  };

  const handleStartTransit = async () => {
    if (!selectedJob) return;
    setActionLoading(true);
    await api.updateDeliveryWorkflow(
      selectedJob.id,
      'In transit',
      'Departed farm cold hub. Rider is en route to customer doorstep.'
    );
    setActionLoading(false);
    fetchActiveDeliveries();
    setToastMessage({ type: 'success', text: 'En route to customer!' });
  };

  const handleArriveAtCustomer = async () => {
    if (!selectedJob) return;
    setActionLoading(true);
    await api.updateDeliveryWorkflow(
      selectedJob.id,
      'Out for delivery',
      'Rider arrived at customer premises. Ready for OTP verification.'
    );
    setActionLoading(false);
    fetchActiveDeliveries();
    setToastMessage({ type: 'success', text: 'Arrived at customer doorstep! Please collect OTP.' });
  };

  const handleOpenDeliveryModal = () => {
    setOtpInput('');
    setCashCollected(selectedJob?.paymentMethod !== 'cod');
    setDeliveryNotes('Delivered directly to customer hands.');
    setModalError('');
    setDeliveryModalOpen(true);
  };

  const handleConfirmDeliverySubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!otpInput.trim()) {
      setModalError('Please enter the 4-digit OTP from the customer.');
      return;
    }

    if (selectedJob.paymentMethod === 'cod' && !cashCollected) {
      setModalError(`Please confirm cash collection of ₹${selectedJob.cashToCollect || 0}.`);
      return;
    }

    setActionLoading(true);
    setModalError('');

    const res = await api.confirmDelivery(selectedJob.id, {
      otpInput: otpInput.trim(),
      cashCollected,
      notes: deliveryNotes,
      photoProof: 'verified-doorstep-proof.jpg'
    });

    setActionLoading(false);

    if (res.success) {
      setDeliveryModalOpen(false);
      setToastMessage({
        type: 'success',
        text: `Trip completed! Payout of ₹${selectedJob.payout?.total || 165} credited to your earnings.`
      });
      fetchActiveDeliveries();
      setTimeout(() => {
        navigate('/delivery/earnings');
      }, 2000);
    } else {
      setModalError(res.message || 'Incorrect OTP. Ask customer for the 4-digit code in their app.');
    }
  };

  const handleReportFailureSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    setActionLoading(true);
    await api.reportDeliveryFailure(selectedJob.id, {
      reason: failReason,
      notes: failNotes,
      returnAction
    });
    setActionLoading(false);
    setFailureModalOpen(false);
    setToastMessage({
      type: 'info',
      text: 'Delivery attempt marked unsuccessful. Goods marked for return to hub.'
    });
    fetchActiveDeliveries();
  };

  const currentStepIdx = selectedJob ? getStepIndex(selectedJob.status) : 1;

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border shadow-lg ${
          toastMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : 'bg-zinc-50 text-zinc-900 border-zinc-300'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Live Delivery Center</span>
          </div>
          <h1 className="text-2xl font-black font-outfit text-[#081c15]">
            Active Trip Execution & Routing
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Follow the guided step-by-step milestones to confirm farm pickup and secure OTP customer handoff.
          </p>
        </div>

        {activeJobs.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-medium">Switch Active Trip:</span>
            <select
              value={selectedJob?.id}
              onChange={(e) => {
                const found = activeJobs.find((j) => j.id === e.target.value);
                if (found) setSelectedJob(found);
              }}
              className="px-3 py-2 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/30 text-xs font-bold text-[#081c15]"
            >
              {activeJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  Order #{j.orderId} ({j.drop?.customerName})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-gray-500 bg-white rounded-3xl border border-gray-100">
          <div className="w-8 h-8 border-3 border-[#2d6a4f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p>Loading active deliveries...</p>
        </div>
      ) : !selectedJob ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-[#2d6a4f]/20 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#faf8f2] text-[#2d6a4f] flex items-center justify-center mx-auto mb-4 border border-[#2d6a4f]/20">
            <Truck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black font-outfit text-[#081c15]">
            No Active Deliveries Ongoing
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-6">
            You currently have no orders in progress. Go to the delivery requests board to review nearby farm pickup runs and accept available trips.
          </p>
          <Link
            to="/delivery/requests"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332] transition shadow-md"
          >
            <span>Browse Open Delivery Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        /* Active Job Workspace */
        <div className="space-y-6">
          {/* Milestone Stepper Bar */}
          <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 -z-0" />
                <div
                  className="absolute top-4 left-6 h-0.5 bg-[#2d6a4f] transition-all duration-500 -z-0"
                  style={{ width: `${Math.min(100, Math.max(0, ((currentStepIdx - 1) / (WORKFLOW_STEPS.length - 1)) * 100))}%` }}
                />

                {WORKFLOW_STEPS.map((s, idx) => {
                  const isDone = currentStepIdx >= idx + 1;
                  const isCurrent = currentStepIdx === idx + 1;
                  return (
                    <div key={s.key} className="flex flex-col items-center relative z-10 text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition shadow-sm ${
                          isDone
                            ? 'bg-[#2d6a4f] text-white ring-4 ring-emerald-100'
                            : 'bg-white text-gray-400 border border-gray-300'
                        } ${isCurrent ? 'ring-4 ring-[#52b788]/40 scale-110' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                      </div>
                      <span
                        className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                          isCurrent
                            ? 'text-[#081c15]'
                            : isDone
                            ? 'text-[#2d6a4f]'
                            : 'text-gray-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Map & Route Component (Feature K) */}
          <DeliveryRouteMap
            pickup={{
              lat: selectedJob.pickup?.lat || 18.5158,
              lng: selectedJob.pickup?.lng || 73.7802,
              name: selectedJob.pickup?.farmName,
              address: selectedJob.pickup?.address
            }}
            drop={{
              lat: selectedJob.drop?.lat || 18.5590,
              lng: selectedJob.drop?.lng || 73.7868,
              name: selectedJob.drop?.customerName,
              address: selectedJob.drop?.address
            }}
            status={selectedJob.status}
            height="340px"
          />

          {/* Action Step Bar based on current milestone */}
          <div className="bg-[#081c15] text-white rounded-3xl p-6 border border-[#2d6a4f]/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#74c69d]">
                Next Required Milestone
              </span>
              <h3 className="text-lg font-black font-outfit text-white mt-0.5">
                {selectedJob.status === 'Accepted' && 'Step 1: Arrive at Farm Staging Bay'}
                {selectedJob.status === 'Reached pickup location' && 'Step 2: Inspect Crate & Complete Checklist'}
                {selectedJob.status === 'Picked up' && 'Step 3: Depart Farm & Begin Transit'}
                {selectedJob.status === 'In transit' && 'Step 4: Arrive at Customer Premises'}
                {selectedJob.status === 'Out for delivery' && 'Step 5: Handover & Collect Customer OTP'}
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Trip Earnings: <span className="text-[#52b788] font-bold">₹{selectedJob.payout?.total}</span> • Payment:{' '}
                <span className="font-semibold text-white">
                  {selectedJob.paymentMethod === 'cod' ? `COD (Collect ₹${selectedJob.cashToCollect})` : 'Prepaid Online'}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Emergency issue report button */}
              <button
                onClick={() => setFailureModalOpen(true)}
                className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-rose-900/40 text-rose-300 font-bold text-xs transition border border-rose-500/30"
              >
                Report Issue / Failure
              </button>

              {/* Step 1 button */}
              {selectedJob.status === 'Accepted' && (
                <button
                  onClick={handleReachPickup}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-2xl bg-[#52b788] hover:bg-[#74c69d] text-[#081c15] font-black text-xs transition shadow-lg flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Arrived at Farm Hub</span>
                </button>
              )}

              {/* Step 2 button */}
              {selectedJob.status === 'Reached pickup location' && (
                <button
                  onClick={handleOpenPickupModal}
                  className="px-5 py-2.5 rounded-2xl bg-[#52b788] hover:bg-[#74c69d] text-[#081c15] font-black text-xs transition shadow-lg flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Verify Items Checklist</span>
                </button>
              )}

              {/* Step 3 button */}
              {selectedJob.status === 'Picked up' && (
                <button
                  onClick={handleStartTransit}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-2xl bg-[#52b788] hover:bg-[#74c69d] text-[#081c15] font-black text-xs transition shadow-lg flex items-center gap-1.5"
                >
                  <Truck className="w-4 h-4" />
                  <span>Start Transit to Customer</span>
                </button>
              )}

              {/* Step 4 button */}
              {selectedJob.status === 'In transit' && (
                <button
                  onClick={handleArriveAtCustomer}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-2xl bg-[#52b788] hover:bg-[#74c69d] text-[#081c15] font-black text-xs transition shadow-lg flex items-center gap-1.5"
                >
                  <Home className="w-4 h-4" />
                  <span>Arrived at Customer Door</span>
                </button>
              )}

              {/* Step 5 button */}
              {selectedJob.status === 'Out for delivery' && (
                <button
                  onClick={handleOpenDeliveryModal}
                  className="px-5 py-2.5 rounded-2xl bg-[#52b788] hover:bg-[#74c69d] text-[#081c15] font-black text-xs transition shadow-lg flex items-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Enter OTP & Complete Delivery</span>
                </button>
              )}
            </div>
          </div>

          {/* Details Grid: Farmer, Customer, Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Farmer Pickup Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#2d6a4f]" />
                    <span className="font-bold text-xs uppercase tracking-wider text-[#081c15]">Farmer Pickup Point</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Dock #3
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#081c15]">{selectedJob.pickup?.farmName}</h3>
                <p className="text-xs text-gray-600 mt-1">{selectedJob.pickup?.address}</p>
                <p className="text-xs text-gray-500 mt-0.5">{selectedJob.pickup?.city} • {selectedJob.pickup?.pincode}</p>

                <div className="mt-3 p-3 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 text-xs text-gray-700">
                  <span className="font-bold text-[#081c15]">Instructions: </span>
                  {selectedJob.pickup?.pickupInstructions || 'Report to farm staging supervisor.'}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`tel:${selectedJob.pickup?.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Farmer: {selectedJob.pickup?.phone}</span>
                </a>
              </div>
            </div>

            {/* Customer Drop Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-xs uppercase tracking-wider text-[#081c15]">Customer Delivery Destination</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    selectedJob.paymentMethod === 'cod' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedJob.paymentMethod === 'cod' ? `Collect COD: ₹${selectedJob.cashToCollect}` : 'Prepaid Online'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#081c15]">{selectedJob.drop?.customerName}</h3>
                <p className="text-xs text-gray-600 mt-1">{selectedJob.drop?.address}</p>
                <p className="text-xs text-gray-500 mt-0.5">{selectedJob.drop?.city} • {selectedJob.drop?.pincode}</p>

                <div className="mt-3 p-3 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 text-xs text-gray-700">
                  <span className="font-bold text-[#081c15]">Notes: </span>
                  {selectedJob.drop?.dropInstructions || 'Deliver to customer or front security desk.'}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`tel:${selectedJob.drop?.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Customer: {selectedJob.drop?.phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Produce Items Checklist Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm">
            <h3 className="font-bold text-sm text-[#081c15] uppercase tracking-wider mb-3">
              Organic Produce Manifest ({selectedJob.items?.length || 0} items)
            </h3>

            <div className="divide-y divide-gray-100 text-xs">
              {selectedJob.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-[#081c15]">{item.name}</p>
                      <p className="text-[11px] text-gray-500">Cultivator: {item.farmer || 'Organic Partner'}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-[#081c15]">
                      {item.quantity} {item.unit}
                    </span>
                    <p className="text-[10px] text-emerald-700 font-semibold">
                      {selectedJob.itemsChecklistVerified ? '✓ Inspected' : 'Pending Verification'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: PICKUP CHECKLIST CONFIRMATION (Feature H) */}
      {pickupModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#2d6a4f]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <h3 className="text-base font-bold text-[#081c15]">
                Verify Farm Produce at Pickup
              </h3>
              <button onClick={() => setPickupModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              Tick each item to verify quality, quantity, and seals before departing the hub.
            </p>

            <form onSubmit={handleConfirmPickupSubmit} className="space-y-4">
              <div className="space-y-2 bg-[#faf8f2] p-4 rounded-2xl border border-[#2d6a4f]/20">
                {selectedJob.items?.map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between text-xs cursor-pointer p-1.5 hover:bg-white rounded-xl transition">
                    <span className="font-semibold text-[#081c15]">
                      {item.name} ({item.quantity} {item.unit})
                    </span>
                    <input
                      type="checkbox"
                      checked={checklist[idx] || false}
                      onChange={(e) => {
                        const updated = [...checklist];
                        updated[idx] = e.target.checked;
                        setChecklist(updated);
                      }}
                      className="w-4 h-4 text-[#2d6a4f] rounded"
                    />
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Report Damaged / Missing Items (Optional)
                </label>
                <textarea
                  rows="2"
                  value={damageReport}
                  onChange={(e) => setDamageReport(e.target.value)}
                  placeholder="e.g. Tomato carton slightly squished at corner, but fruit intact."
                  className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Confirming pickup will advance status to "Picked Up" and notify the customer.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPickupModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332]"
                >
                  {actionLoading ? 'Saving...' : 'Confirm & Depart Farm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELIVERY CONFIRMATION & OTP (Feature I) */}
      {deliveryModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#2d6a4f]/20">
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <h3 className="text-base font-bold text-[#081c15]">
                Complete Customer Delivery
              </h3>
              <button onClick={() => setDeliveryModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmDeliverySubmit} className="space-y-4">
              {/* Customer OTP field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#081c15] uppercase tracking-wider">
                    Customer 4-Digit OTP *
                  </label>
                  {selectedJob.customerOtp && (
                    <span className="text-[11px] font-bold text-[#2d6a4f] bg-emerald-50 px-2 py-0.5 rounded-md">
                      Order Security OTP: {selectedJob.customerOtp}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="e.g. 4821"
                  className="w-full text-center text-lg tracking-widest font-mono font-black py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  required
                />
              </div>

              {/* COD confirmation checkbox if cash on delivery */}
              {selectedJob.paymentMethod === 'cod' && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cashCollected}
                      onChange={(e) => setCashCollected(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="text-xs font-bold text-amber-950">
                      I have collected cash of ₹{selectedJob.cashToCollect} from the customer.
                    </span>
                  </label>
                </div>
              )}

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Delivery Handover Note
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Handed to customer at door."
                  className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeliveryModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332]"
                >
                  {actionLoading ? 'Verifying OTP...' : 'Confirm Delivery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: FAILURE REPORTING (Feature J) */}
      {failureModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#2d6a4f]/20">
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <h3 className="text-base font-bold text-rose-700">
                Report Delivery Issue / Failure
              </h3>
              <button onClick={() => setFailureModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              If an order cannot be delivered, report the failure reason. The produce must be returned to the farm cold staging facility.
            </p>

            <form onSubmit={handleReportFailureSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reason for Failure</label>
                <select
                  value={failReason}
                  onChange={(e) => setFailReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
                >
                  <option value="Customer phone unreachable after 3 attempts">Customer phone unreachable after 3 attempts</option>
                  <option value="Wrong address / Customer relocated">Wrong address / Customer relocated</option>
                  <option value="Customer rejected order at doorstep">Customer rejected order at doorstep</option>
                  <option value="Security gate barred entry to premises">Security gate barred entry to premises</option>
                  <option value="Road closure / Severe flood waterlogging">Road closure / Severe weather</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Return Workflow Action</label>
                <select
                  value={returnAction}
                  onChange={(e) => setReturnAction(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
                >
                  <option value="Returned to Agro Cold Staging Hub">Return produce to Bavdhan Agro Cold Staging Hub</option>
                  <option value="Return directly to farmer tomorrow">Return directly to farmer tomorrow morning</option>
                  <option value="Customer requested afternoon re-attempt">Customer requested afternoon re-attempt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Explanation</label>
                <textarea
                  rows="2"
                  value={failNotes}
                  onChange={(e) => setFailNotes(e.target.value)}
                  placeholder="Provide any details from your conversation with the customer or guard..."
                  className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFailureModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                >
                  {actionLoading ? 'Recording...' : 'File Return & Cancel Run'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

