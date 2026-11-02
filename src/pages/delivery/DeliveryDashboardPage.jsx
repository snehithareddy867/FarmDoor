import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bike, 
  Power, 
  MapPin, 
  PackagePlus, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Coins, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Navigation,
  Compass,
  Phone,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';
import { api } from '../../services/api';

export default function DeliveryDashboardPage() {
  const { 
    partner, 
    isOnline, 
    toggleOnline, 
    isAvailable, 
    toggleAvailability, 
    serviceArea, 
    isApproved, 
    verificationStatus 
  } = useDeliveryAuth();

  const [availableJobs, setAvailableJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [historyJobs, setHistoryJobs] = useState([]);
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    if (!partner?.id) return;
    setLoading(true);

    const [avail, active, history, earnings] = await Promise.all([
      api.getAvailableDeliveryRequests(partner.id, serviceArea),
      api.getPartnerActiveDeliveries(partner.id),
      api.getPartnerDeliveryHistory(partner.id),
      api.getDeliveryPartnerEarnings(partner.id)
    ]);

    setAvailableJobs(avail || []);
    setActiveJobs(active || []);
    setHistoryJobs(history || []);
    setEarningsData(earnings || null);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [partner?.id, serviceArea]);

  const currentActiveJob = activeJobs.length > 0 ? activeJobs[0] : null;
  const completedJobsCount = historyJobs.filter((j) => j.status === 'Delivered').length;
  const failedJobsCount = historyJobs.filter((j) => j.status === 'Failed delivery').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Availability Card */}
      <div className="bg-gradient-to-r from-[#081c15] to-[#1b4332] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#2d6a4f]/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#52b788]/20 text-[#74c69d] border border-[#52b788]/30">
                Eco-Fleet Courier
              </span>
              <span className="text-xs text-gray-300">• {serviceArea}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-white">
              Hello, {partner?.name || 'Rider'}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Vehicle: <span className="text-[#52b788] font-bold">{partner?.vehicleModel || 'Electric Two-Wheeler'}</span> ({partner?.vehicleNumber || 'MH-12-EA-4412'})
            </p>
          </div>

          {/* Master Online/Offline & Availability Toggle Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={toggleOnline}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs transition shadow-lg ${
                isOnline
                  ? 'bg-[#52b788] text-[#081c15] hover:bg-[#74c69d]'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
              }`}
            >
              <Power className={`w-4 h-4 ${isOnline ? 'text-[#081c15]' : 'text-zinc-400'}`} />
              <span>{isOnline ? 'You Are ONLINE' : 'You Are OFFLINE'}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-950 animate-ping' : 'bg-zinc-500'}`} />
            </button>

            {isOnline && (
              <button
                onClick={toggleAvailability}
                className={`px-4 py-3 rounded-2xl font-bold text-xs border transition ${
                  isAvailable
                    ? 'bg-emerald-900/60 text-emerald-200 border-emerald-500/40'
                    : 'bg-amber-900/60 text-amber-200 border-amber-500/40'
                }`}
              >
                {isAvailable ? 'Taking Orders' : 'On Short Break'}
              </button>
            )}
          </div>
        </div>

        {/* Ambient background vector */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
          <Bike className="w-56 h-56 text-[#52b788]" />
        </div>
      </div>

      {/* KPI Summary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Requests */}
        <Link
          to="/delivery/requests"
          className="bg-white rounded-3xl p-5 border border-[#2d6a4f]/20 shadow-sm hover:border-[#52b788] hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center group-hover:scale-110 transition">
              <PackagePlus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-[#52b788] uppercase tracking-wider">Available</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black font-outfit text-[#081c15]">
            {availableJobs.length}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">Platform Delivery Jobs</p>
        </Link>

        {/* Active Deliveries */}
        <Link
          to="/delivery/active"
          className="bg-white rounded-3xl p-5 border border-[#2d6a4f]/20 shadow-sm hover:border-[#52b788] hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">In Transit</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black font-outfit text-[#081c15]">
            {activeJobs.length}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">Active Deliveries Ongoing</p>
        </Link>

        {/* Today's Earnings */}
        <Link
          to="/delivery/earnings"
          className="bg-white rounded-3xl p-5 border border-[#2d6a4f]/20 shadow-sm hover:border-[#52b788] hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Today</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black font-outfit text-[#081c15]">
            ₹{earningsData?.todayEarnings || 165}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">Daily Trips Revenue</p>
        </Link>

        {/* Completed Trips */}
        <Link
          to="/delivery/history"
          className="bg-white rounded-3xl p-5 border border-[#2d6a4f]/20 shadow-sm hover:border-[#52b788] hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#081c15]/10 text-[#081c15] flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Finished</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black font-outfit text-[#081c15]">
            {partner?.totalDeliveries || 184}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">
            {completedJobsCount} this session • {failedJobsCount} returned
          </p>
        </Link>
      </div>

      {/* Current Active Delivery Highlight Card (if any in transit) */}
      {currentActiveJob && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#52b788]/60 shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Active Delivery In Progress • {currentActiveJob.status}
                </span>
                <h3 className="text-lg font-black font-outfit text-[#081c15] mt-1">
                  Order #{currentActiveJob.orderId}
                </h3>
              </div>
            </div>

            <Link
              to="/delivery/active"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332] transition shadow-md"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open Live Workflow & Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Pickup */}
            <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/20">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Pickup (Farmer Hub)</span>
              <p className="font-bold text-[#081c15] text-sm mt-1">{currentActiveJob.pickup?.farmName}</p>
              <p className="text-gray-600 mt-0.5">{currentActiveJob.pickup?.address}</p>
              <p className="text-emerald-700 font-semibold mt-1">Contact: {currentActiveJob.pickup?.phone}</p>
            </div>

            {/* Drop */}
            <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/20">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Drop (Customer Doorstep)</span>
              <p className="font-bold text-[#081c15] text-sm mt-1">{currentActiveJob.drop?.customerName}</p>
              <p className="text-gray-600 mt-0.5">{currentActiveJob.drop?.address}</p>
              <p className="text-emerald-700 font-semibold mt-1">Contact: {currentActiveJob.drop?.phone}</p>
            </div>

            {/* Fare & Items */}
            <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/20 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Trip Payout</span>
                <p className="text-xl font-black font-outfit text-[#2d6a4f] mt-1">
                  ₹{currentActiveJob.payout?.total || 165}
                </p>
                <p className="text-gray-600 mt-0.5">
                  {currentActiveJob.distanceKm} km • {currentActiveJob.estimatedMinutes} mins est.
                </p>
              </div>
              <span className="text-[11px] font-bold text-gray-600 mt-2">
                📦 {currentActiveJob.items?.length || 2} Farm Items Packed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Available Jobs Quick Preview & Recent History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nearby Available Jobs */}
        <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-[#2d6a4f]" />
                <h3 className="font-bold text-sm text-[#081c15]">Nearby Available Requests</h3>
              </div>
              <Link to="/delivery/requests" className="text-xs font-bold text-[#2d6a4f] hover:underline">
                View All ({availableJobs.length})
              </Link>
            </div>

            {availableJobs.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-500 bg-[#faf8f2] rounded-2xl border border-dashed border-gray-200">
                <p>No new delivery requests in your zone right now.</p>
                <p className="text-[11px] text-gray-400 mt-1">Keep status ONLINE to be notified immediately.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableJobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 hover:border-[#52b788] transition text-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-[#081c15]">
                        <span>Order #{job.orderId}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          {job.distanceKm} km
                        </span>
                      </div>
                      <p className="text-gray-600 mt-0.5 truncate max-w-[240px]">
                        {job.pickup?.farmName} → {job.drop?.customerName} ({job.drop?.city})
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-sm text-[#2d6a4f]">₹{job.payout?.total || 165}</p>
                      <Link
                        to="/delivery/requests"
                        className="inline-block text-[11px] font-bold text-[#081c15] hover:underline"
                      >
                        Inspect & Accept →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Eco-vehicle green incentive included in all jobs</span>
            <Link to="/delivery/requests" className="font-bold text-[#2d6a4f]">
              Job Board →
            </Link>
          </div>
        </div>

        {/* Recent Delivery Activity */}
        <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#2d6a4f]" />
                <h3 className="font-bold text-sm text-[#081c15]">Recent Trip Activity</h3>
              </div>
              <Link to="/delivery/history" className="text-xs font-bold text-[#2d6a4f] hover:underline">
                Full History →
              </Link>
            </div>

            <div className="space-y-3">
              {historyJobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 text-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      job.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {job.status === 'Delivered' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#081c15]">Order #{job.orderId}</p>
                      <p className="text-[11px] text-gray-500">
                        {job.drop?.customerName || 'Customer'} • {job.distanceKm} km
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-xs text-[#081c15]">
                      ₹{job.payout?.total || 135}
                    </p>
                    <span className={`text-[10px] font-bold ${
                      job.status === 'Delivered' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Weekly settlement cycle: Every Tue & Fri</span>
            <Link to="/delivery/earnings" className="font-bold text-[#2d6a4f]">
              Payout Summary →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

