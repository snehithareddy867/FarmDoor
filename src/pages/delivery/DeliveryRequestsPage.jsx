import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PackagePlus, 
  MapPin, 
  Clock, 
  Coins, 
  Navigation, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  ShieldAlert, 
  Store, 
  Home, 
  Filter, 
  Sparkles,
  Phone,
  Info
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';
import { api } from '../../services/api';

export default function DeliveryRequestsPage() {
  const { partner, serviceArea, isApproved, verificationStatus, isOnline } = useDeliveryAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDistance, setFilterDistance] = useState('all');
  const [rejectModalJob, setRejectModalJob] = useState(null);
  const [rejectReason, setRejectReason] = useState('Outside my current zone');
  const [acceptingId, setAcceptingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchJobs = async () => {
    if (!partner?.id) return;
    setLoading(true);
    const jobs = await api.getAvailableDeliveryRequests(partner.id, serviceArea);
    setRequests(jobs || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [partner?.id, serviceArea]);

  const handleAcceptJob = async (jobId) => {
    if (!isApproved) {
      setToastMessage({
        type: 'error',
        text: 'Action Restricted: You must be an Approved Courier before accepting delivery assignments.'
      });
      return;
    }

    setAcceptingId(jobId);
    try {
      const res = await api.acceptDeliveryJob(jobId, partner.id, partner.name);
      if (res.success) {
        setToastMessage({
          type: 'success',
          text: `Delivery Job #${res.job?.orderId} accepted! Heading to active trip view...`
        });
        setTimeout(() => {
          navigate('/delivery/active');
        }, 1200);
      } else {
        // Race condition handling!
        setToastMessage({
          type: 'error',
          text: res.message || 'This delivery was just claimed by another rider.'
        });
        fetchJobs();
      }
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: 'Failed to accept job. Please try again.'
      });
    } finally {
      setAcceptingId(null);
    }
  };

  const handleRejectConfirm = async (e) => {
    e.preventDefault();
    if (!rejectModalJob) return;

    await api.rejectDeliveryJob(rejectModalJob.id, partner.id, rejectReason);
    setRejectModalJob(null);
    setToastMessage({
      type: 'info',
      text: 'Delivery request declined. Reassigned to other nearby riders.'
    });
    fetchJobs();
  };

  // Filter requests
  const filteredRequests = requests.filter((j) => {
    if (filterDistance === 'under5') return j.distanceKm < 5;
    if (filterDistance === '5to10') return j.distanceKm >= 5 && j.distanceKm <= 10;
    if (filterDistance === 'over10') return j.distanceKm > 10;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border shadow-lg ${
          toastMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : toastMessage.type === 'error'
            ? 'bg-rose-50 text-rose-900 border-rose-300'
            : 'bg-zinc-50 text-zinc-900 border-zinc-300'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-black font-outfit text-[#081c15]">
            Platform Delivery Job Board
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Displaying open pickup dispatches in <span className="font-bold text-[#081c15]">{serviceArea}</span>. Direct farm-to-door orders only.
          </p>
        </div>

        {/* Distance Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-[#2d6a4f]" />
          <select
            value={filterDistance}
            onChange={(e) => setFilterDistance(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/30 text-xs font-semibold text-[#081c15] focus:outline-none"
          >
            <option value="all">All Distances</option>
            <option value="under5">Under 5 km</option>
            <option value="5to10">5 km to 10 km</option>
            <option value="over10">Over 10 km</option>
          </select>
        </div>
      </div>

      {/* Verification Guard Alert if not approved */}
      {!isApproved && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <div>
              <p className="font-bold">Accepting delivery assignments is currently locked</p>
              <p className="text-gray-700 text-[11px] mt-0.5">
                Your compliance status is {verificationStatus}. You can browse available trips, but cannot claim them until approved by transport auditors.
              </p>
            </div>
          </div>
          <Link
            to="/delivery/verification"
            className="px-3.5 py-2 rounded-xl bg-amber-700 text-white font-bold hover:bg-amber-800 transition text-center"
          >
            Check Verification Status
          </Link>
        </div>
      )}

      {/* Available Requests Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-gray-500 bg-white rounded-3xl border border-gray-100">
          <div className="w-8 h-8 border-3 border-[#2d6a4f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p>Scanning active farm logistics hub for jobs...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#2d6a4f]/20 shadow-sm">
          <div className="w-14 h-14 rounded-3xl bg-[#faf8f2] text-[#2d6a4f] flex items-center justify-center mx-auto mb-4 border border-[#2d6a4f]/20">
            <PackagePlus className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#081c15]">No Delivery Jobs Available</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
            All orders in {serviceArea} are currently assigned. Stay online and new dispatches from organic harvests will appear here.
          </p>
          <button
            onClick={fetchJobs}
            className="mt-4 px-4 py-2 rounded-2xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332] transition"
          >
            Refresh Job Feed
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm hover:border-[#52b788] transition flex flex-col justify-between"
            >
              <div>
                {/* Header: Order ID, Payout & Badges */}
                <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Platform Eco-Run
                    </span>
                    <h3 className="text-base font-black font-outfit text-[#081c15] mt-1">
                      Order #{job.orderId}
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black font-outfit text-[#2d6a4f]">
                      ₹{job.payout?.total || 165}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Base ₹{job.payout?.base || 60} + Dist ₹{job.payout?.distancePay || 80} + Eco ₹{job.payout?.ecoIncentive || 25}
                    </p>
                  </div>
                </div>

                {/* Pickup & Drop Points */}
                <div className="space-y-3 text-xs mb-4">
                  {/* Farmer Pickup */}
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15">
                    <Store className="w-4 h-4 text-[#2d6a4f] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#081c15]">{job.pickup?.farmName}</p>
                      <p className="text-gray-600 text-[11px]">{job.pickup?.address}</p>
                      <p className="text-[#2d6a4f] font-semibold text-[10px] mt-0.5">
                        Farmer: {job.pickup?.farmerName} • {job.pickup?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Customer Drop */}
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15">
                    <Home className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#081c15]">{job.drop?.customerName}</p>
                      <p className="text-gray-600 text-[11px]">{job.drop?.address}</p>
                      <p className="text-emerald-700 font-semibold text-[10px] mt-0.5">
                        Pin: {job.drop?.pincode} • Phone: {job.drop?.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Distance, Time, and Payment Mode */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-center text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Distance</span>
                    <p className="font-bold text-[#081c15] mt-0.5">{job.distanceKm} km</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Est. Time</span>
                    <p className="font-bold text-[#081c15] mt-0.5">{job.estimatedMinutes} mins</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Payment</span>
                    <p className={`font-bold mt-0.5 ${job.paymentMethod === 'cod' ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {job.paymentMethod === 'cod' ? `COD (₹${job.cashToCollect})` : 'Prepaid'}
                    </p>
                  </div>
                </div>

                {/* Items Summary Pill */}
                <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="font-bold text-gray-500">Produce:</span>
                  {job.items?.map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                      {item.name} ({item.quantity} {item.unit})
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalJob(job)}
                  className="w-1/3 py-2.5 px-3 rounded-2xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition"
                >
                  Decline
                </button>
                <button
                  type="button"
                  disabled={!isApproved || acceptingId === job.id}
                  onClick={() => handleAcceptJob(job.id)}
                  className="w-2/3 py-2.5 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-xs transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {acceptingId === job.id ? (
                    <span>Claiming Job...</span>
                  ) : (
                    <>
                      <span>Accept Delivery (₹{job.payout?.total})</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#2d6a4f]/20">
            <h3 className="text-base font-bold text-[#081c15] mb-1">
              Decline Delivery Job #{rejectModalJob.orderId}
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Please share a quick reason. The dispatch pool will reassign this run to another active courier.
            </p>

            <form onSubmit={handleRejectConfirm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reason for Declining</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
                >
                  <option value="Outside my current zone">Outside my current zone</option>
                  <option value="Vehicle cargo capacity full">Vehicle cargo capacity full</option>
                  <option value="Taking scheduled meal break">Taking scheduled meal break</option>
                  <option value="Battery low / Charging vehicle">Battery low / Charging EV</option>
                  <option value="Heavy traffic / route closure">Heavy traffic / route closure</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalJob(null)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

