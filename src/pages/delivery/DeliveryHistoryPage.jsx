import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  MapPin, 
  Coins, 
  Calendar,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';
import { api } from '../../services/api';

export default function DeliveryHistoryPage() {
  const { partner } = useDeliveryAuth();
  const [historyJobs, setHistoryJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!partner?.id) return;
      setLoading(true);
      const jobs = await api.getPartnerDeliveryHistory(partner.id);
      setHistoryJobs(jobs || []);
      setLoading(false);
    };
    fetchHistory();
  }, [partner?.id]);

  const filteredJobs = historyJobs.filter((job) => {
    const matchesSearch =
      job.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.drop?.customerName && job.drop.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.pickup?.farmName && job.pickup.farmName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'delivered') return job.status === 'Delivered';
    if (statusFilter === 'failed') return job.status === 'Failed delivery';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search / Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-black font-outfit text-[#081c15]">
            Delivery Run History & Logs
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Complete audit log of all completed doorsteps, returned goods, customer ratings, and fare credits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order #, customer..."
              className="pl-8 pr-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#52b788] w-48 sm:w-60"
            />
          </div>

          {/* Status Tab Selector */}
          <div className="flex bg-[#faf8f2] p-1 rounded-2xl border border-[#2d6a4f]/20 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                statusFilter === 'all'
                  ? 'bg-[#081c15] text-[#52b788] shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              All Runs ({historyJobs.length})
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                statusFilter === 'delivered'
                  ? 'bg-[#081c15] text-[#52b788] shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setStatusFilter('failed')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                statusFilter === 'failed'
                  ? 'bg-[#081c15] text-[#52b788] shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Returned / Failed
            </button>
          </div>
        </div>
      </div>

      {/* History Cards List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-gray-500 bg-white rounded-3xl border border-gray-100">
          <div className="w-8 h-8 border-3 border-[#2d6a4f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p>Loading delivery history...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#2d6a4f]/20 shadow-sm">
          <div className="w-14 h-14 rounded-3xl bg-[#faf8f2] text-gray-400 flex items-center justify-center mx-auto mb-3">
            <PackageCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#081c15]">No Trip Records Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
            No deliveries match your current filters. Completed trips will appear here with customer reviews and payout credits.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const isDelivered = job.status === 'Delivered';
            const formattedDate = job.deliveredAt
              ? new Date(job.deliveredAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : new Date(job.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm hover:border-[#52b788] transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        isDelivered
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isDelivered ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#081c15]">
                          Order #{job.orderId}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </p>
                    </div>
                  </div>

                  {/* Payout & Distance */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Distance</span>
                      <p className="font-bold text-xs text-[#081c15]">{job.distanceKm} km</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Total Fare</span>
                      <p className="text-xl font-black font-outfit text-[#2d6a4f]">
                        ₹{job.payout?.total || 135}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Route & Details */}
                <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup</span>
                    <p className="font-bold text-[#081c15] mt-0.5">{job.pickup?.farmName}</p>
                    <p className="text-gray-600 text-[11px]">{job.pickup?.address}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer Destination</span>
                    <p className="font-bold text-[#081c15] mt-0.5">{job.drop?.customerName}</p>
                    <p className="text-gray-600 text-[11px]">{job.drop?.address}</p>
                  </div>
                </div>

                {/* Rating or Failure note */}
                {isDelivered && job.customerRating && (
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-500">
                        {[...Array(job.customerRating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="font-bold text-[#081c15]">{job.customerRating}.0</span>
                      <span className="text-gray-600 italic">"{job.customerReview}"</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800">Verified Purchaser</span>
                  </div>
                )}

                {!isDelivered && job.failureReason && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-xs text-rose-900">
                    <span className="font-bold">Failure Cause: </span>
                    <span>{job.failureReason}</span>
                    {job.returnAction && (
                      <p className="text-[11px] text-rose-700 mt-0.5 font-medium">
                        Action Taken: {job.returnAction}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

