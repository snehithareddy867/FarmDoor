import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Download, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Landmark,
  FileSpreadsheet
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { api } from '../../services/api';

export default function FarmerEarningsPage() {
  const { farmer } = useFarmerAuth();
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!farmer?.id) return;
      setLoading(true);
      const data = await api.getFarmerEarnings(farmer.id);
      setEarnings(data || null);
      setLoading(false);
    };
    fetchEarnings();
  }, [farmer?.id]);

  const grossSales = earnings?.totalGrossSales ?? 0;
  const platformFee = Math.round(grossSales * 0.10);
  const netEarnings = grossSales - platformFee;
  const completedEarnings = earnings?.completedEarnings ?? 0;
  const pendingSettlements = earnings?.pendingSettlements ?? 0;

  const handleDownloadCSV = () => {
    if (!earnings?.transactions || earnings.transactions.length === 0) {
      alert('No transactions available to download yet.');
      return;
    }

    const headers = ['Order ID', 'Date', 'Status', 'Gross Amount (INR)', 'Platform Fee (INR)', 'Net Payout (INR)', 'Settlement Status'];
    const rows = earnings.transactions.map((tx) => [
      `"${tx.orderId}"`,
      `"${new Date(tx.date).toLocaleDateString('en-IN')}"`,
      `"${tx.status || 'Active'}"`,
      tx.grossAmount,
      tx.platformFee,
      tx.netAmount,
      `"${tx.payoutStatus}"`
    ]);

    // Add totals row
    rows.push([]);
    rows.push(['"TOTALS"', '""', '""', grossSales, platformFee, netEarnings, '"Summary"']);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `farm_to_home_sales_settlement_${farmer?.id || 'farmer'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black font-outfit text-[#081c15]">
              Sales Revenue & Bank Settlements
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Direct Escrow Active
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Transparent revenue share: 90% direct payout to cultivator bank account, 10% platform maintenance fee.
          </p>
        </div>

        <button 
          onClick={handleDownloadCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] text-xs font-bold transition shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Download Sales Statement (CSV)</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Statement downloaded successfully to your device.</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Gross Sales */}
        <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm hover:border-[#2d6a4f]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Gross Produce Sales</span>
            <span className="p-1.5 rounded-xl bg-gray-100 text-[#081c15]">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black font-outfit text-[#081c15] mt-2">
            ₹{grossSales.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Total consumer orders fulfilled or active</p>
        </div>

        {/* Platform Fee */}
        <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm hover:border-[#2d6a4f]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Platform Fee (10%)</span>
            <span className="p-1.5 rounded-xl bg-amber-50 text-amber-700">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black font-outfit text-amber-700 mt-2">
            -₹{platformFee.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Eco-packaging crates, payment gateways & logistics</p>
        </div>

        {/* Net Farmer Earnings */}
        <div className="bg-gradient-to-br from-[#081c15] to-[#1b4332] text-white rounded-3xl p-6 border border-[#2d6a4f]/40 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#74c69d]">Net Farmer Revenue (90%)</span>
            <span className="p-1.5 rounded-xl bg-white/10 text-[#52b788]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black font-outfit text-[#52b788] mt-2">
            ₹{netEarnings.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-gray-300 mt-1">Disbursed directly via automated IMPS escrow</p>
        </div>
      </div>

      {/* Settlement Balance Highlights & Registered Bank Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Settled & Deposited</span>
            </div>
            <p className="text-2xl font-black font-outfit text-emerald-800">
              ₹{completedEarnings.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Confirmed delivered orders. Transferred to registered bank account within 24 hours.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Settlement SLA</span>
            <span className="font-bold text-[#081c15]">Daily at 6:00 PM</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-amber-700">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">In Escrow (Transit / Active)</span>
            </div>
            <p className="text-2xl font-black font-outfit text-amber-800">
              ₹{pendingSettlements.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Held safely in escrow while produce is in harvest, packing, or on-route with courier.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Escrow Protection</span>
            <span className="font-bold text-[#081c15]">100% Guaranteed</span>
          </div>
        </div>

        <div className="bg-[#faf8f2] rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#081c15]">
              <Landmark className="w-4 h-4 text-[#2d6a4f]" />
              <span className="text-xs font-bold uppercase tracking-wider">Linked Settlement Account</span>
            </div>
            <p className="text-sm font-bold text-[#081c15]">
              State Bank of India
            </p>
            <p className="text-xs font-mono text-gray-600 mt-0.5">
              A/C: ••••••••• 8192
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              IFSC: SBIN0001234 • {farmer?.name || farmer?.user?.name || 'Registered Grower'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2d6a4f]/15 flex items-center justify-between text-[11px]">
            <span className="text-gray-500">Bank Verification</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Penny Drop Verified
            </span>
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#081c15]">
              Order Payout Ledger ({earnings?.transactions?.length || 0})
            </h2>
            <p className="text-xs text-gray-500">Itemized ledger of completed and upcoming disbursements.</p>
          </div>

          {earnings?.transactions?.length > 0 && (
            <span className="text-xs text-gray-500 font-medium">
              Showing all recorded transactions
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">
            <div className="w-6 h-6 border-2 border-[#52b788] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading payout statements...
          </div>
        ) : !earnings?.transactions || earnings.transactions.length === 0 ? (
          <div className="py-12 text-center bg-[#faf8f2] rounded-2xl border border-dashed border-[#2d6a4f]/20">
            <Coins className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#081c15]">No Order Settlements Logged Yet</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              When customers place orders for your produce, your revenue and settlement entries will be displayed here in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Items Count</th>
                  <th className="pb-3 font-bold">Gross Amount</th>
                  <th className="pb-3 font-bold">Platform Fee (10%)</th>
                  <th className="pb-3 font-bold">Net Payout (90%)</th>
                  <th className="pb-3 font-bold text-right">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {earnings.transactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-[#faf8f2] transition">
                    <td className="py-3 font-mono font-bold text-[#081c15]">{tx.orderId}</td>
                    <td className="py-3 text-gray-600">{new Date(tx.date).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 text-gray-600">{tx.itemsCount || 1} crop line(s)</td>
                    <td className="py-3 font-bold text-[#081c15]">₹{tx.grossAmount}</td>
                    <td className="py-3 text-amber-700">-₹{tx.platformFee}</td>
                    <td className="py-3 font-black text-emerald-700">₹{tx.netAmount}</td>
                    <td className="py-3 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tx.payoutStatus?.includes('Settled')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {tx.payoutStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
