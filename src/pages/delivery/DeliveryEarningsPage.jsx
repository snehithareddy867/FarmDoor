import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  Download, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Building2, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';
import { api } from '../../services/api';

export default function DeliveryEarningsPage() {
  const { partner } = useDeliveryAuth();
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const partnerIdentifier = partner?.partnerId || partner?.id || partner?._id;

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!partnerIdentifier) return;
      setLoading(true);
      const data = await api.getDeliveryPartnerEarnings(partnerIdentifier);
      setEarningsData(data);
      setLoading(false);
    };
    fetchEarnings();
  }, [partnerIdentifier]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-black font-outfit text-[#081c15]">
            Courier Earnings & Direct Bank Payouts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            100% transparent fee structure: Base fare + Distance pay + Eco-Fleet EV incentive + Customer tips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200">
            Next Settlement: Tuesday, 6:00 PM IST
          </span>
        </div>
      </div>

      {/* Main Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Total */}
        <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Today's Earnings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-[#081c15]">
            ₹{earningsData?.todayEarnings || 165}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">
            +100% credited to active balance
          </p>
        </div>

        {/* This Week */}
        <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">This Week Total</span>
            <div className="w-8 h-8 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-[#081c15]">
            ₹{earningsData?.weeklyEarnings || 625}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            Across {earningsData?.completedTripsCount || 4} successful runs
          </p>
        </div>

        {/* Pending Settlement Balance */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#52b788]/60 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2d6a4f]">Pending Payout</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-[#081c15] flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-[#2d6a4f]">
            ₹{earningsData?.pendingPayoutBalance || 485}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            Auto-settling to linked HDFC Bank
          </p>
        </div>

        {/* Total Gross Lifetime */}
        <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Lifetime Earnings</span>
            <div className="w-8 h-8 rounded-xl bg-[#081c15] text-[#52b788] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-[#081c15]">
            ₹{((earningsData?.totalGrossEarnings || 0) + 12800).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            {partner?.totalDeliveries || 184} total trips completed
          </p>
        </div>
      </div>

      {/* Fare Breakdown & Bank Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fare Breakdown Breakdown Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm">
          <h2 className="text-base font-bold text-[#081c15] mb-4">
            Component Breakdown (This Cycle)
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#faf8f2] flex items-center justify-between border border-[#2d6a4f]/15">
              <div>
                <p className="font-bold text-[#081c15]">Base Fare per Trip</p>
                <p className="text-[11px] text-gray-500">Fixed ₹60 guaranteed per platform pickup</p>
              </div>
              <span className="font-mono font-bold text-sm text-[#081c15]">
                ₹{earningsData?.breakdown?.basePay || 240}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#faf8f2] flex items-center justify-between border border-[#2d6a4f]/15">
              <div>
                <p className="font-bold text-[#081c15]">Distance Pay</p>
                <p className="text-[11px] text-gray-500">Calculated at ₹8-10 / km traveled</p>
              </div>
              <span className="font-mono font-bold text-sm text-[#081c15]">
                ₹{earningsData?.breakdown?.distancePay || 255}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#faf8f2] flex items-center justify-between border border-[#2d6a4f]/15">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-[#081c15]">🌱 Green Eco-Vehicle Bonus</p>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 font-bold">
                    EV Fleet
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">+₹25 bonus for every zero-emission delivery</p>
              </div>
              <span className="font-mono font-bold text-sm text-emerald-700">
                +₹{earningsData?.breakdown?.ecoIncentives || 100}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#faf8f2] flex items-center justify-between border border-[#2d6a4f]/15">
              <div>
                <p className="font-bold text-[#081c15]">Customer Tips</p>
                <p className="text-[11px] text-gray-500">100% of customer tips passed to rider</p>
              </div>
              <span className="font-mono font-bold text-sm text-[#081c15]">
                ₹{earningsData?.breakdown?.tips || 30}
              </span>
            </div>
          </div>
        </div>

        {/* Linked Bank Account Card */}
        <div className="bg-gradient-to-br from-[#081c15] to-[#1b4332] text-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/40 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#52b788]/20 text-[#74c69d] border border-[#52b788]/30">
                Verified Bank Mandate
              </span>
              <ShieldCheck className="w-5 h-5 text-[#52b788]" />
            </div>

            <h3 className="text-lg font-bold font-outfit text-white">
              {partner?.bankDetails?.bankName || 'HDFC Bank, Kothrud Branch'}
            </h3>
            <p className="text-xl font-mono tracking-widest text-[#52b788] font-bold mt-2">
              {partner?.bankDetails?.accountNumber || '•••• •••• 4412'}
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs mt-4 pt-4 border-t border-white/10 text-gray-300">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Account Holder</span>
                <span className="font-semibold text-white">{partner?.bankDetails?.accountHolder || partner?.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">IFSC Code</span>
                <span className="font-semibold text-white font-mono">{partner?.bankDetails?.ifsc || 'HDFC0001824'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span>Direct IMPS / NEFT Deposits</span>
            <span className="text-[#52b788] font-bold">Automatic Settlement</span>
          </div>
        </div>
      </div>

      {/* Payout Settlement History Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#081c15]">
            Past Bank Settlement Batches
          </h2>
          <button className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d6a4f] hover:underline">
            <Download className="w-3.5 h-3.5" />
            <span>Download Tax Form 16A</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-bold">Settlement ID</th>
                <th className="pb-3 font-bold">Processed Date</th>
                <th className="pb-3 font-bold">Trips Included</th>
                <th className="pb-3 font-bold">Net Deposited</th>
                <th className="pb-3 font-bold">Bank Reference #</th>
                <th className="pb-3 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {earningsData?.payoutHistory?.map((payout) => (
                <tr key={payout.id} className="hover:bg-[#faf8f2]/60 transition">
                  <td className="py-3 font-mono font-bold text-[#081c15]">{payout.id}</td>
                  <td className="py-3 text-gray-600">{payout.date}</td>
                  <td className="py-3 text-gray-600">{payout.tripsCount} trips</td>
                  <td className="py-3 font-bold text-emerald-700 text-sm">₹{payout.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 font-mono text-gray-500 text-[11px]">{payout.refNumber}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{payout.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

