import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  ArrowLeft, 
  ShieldCheck, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { api } from '../../services/api';

export default function PaymentsPage() {
  const { user } = useCustomerAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await api.getPaymentHistory(user?.id);
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to fetch payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const filteredPayments = payments.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'success') return p.status === 'Success' || p.status === 'Paid';
    if (activeTab === 'refunded') return p.status === 'Refunded' || p.status === 'Refund Initiated';
    return true;
  });

  const totalSpent = payments
    .filter((p) => p.status === 'Success' || p.status === 'Paid')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <Link
            to="/customer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d6a4f] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="font-outfit text-3xl font-extrabold text-[#081c15] flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-[#2d6a4f]" />
            Payment History & Receipts
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track Razorpay online payments, refunds, and verifiable escrow transaction receipts.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#2d6a4f]' : ''}`} />
          Refresh Records
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Verified Payments</span>
          <span className="text-2xl font-black text-[#1b4332] mt-1 block">₹{totalSpent.toFixed(2)}</span>
          <span className="text-[11px] text-[#52b788] font-semibold mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> 100% Escrow Protected
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Transactions</span>
          <span className="text-2xl font-black text-[#081c15] mt-1 block">{payments.length}</span>
          <span className="text-[11px] text-gray-500 mt-1 block">Direct to Regional Organic Farms</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Payment Gateway</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-[#081c15]">Razorpay</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2d6a4f] text-white">Test Mode</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">HMAC SHA256 Signature Verified</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'all' ? 'bg-[#1b4332] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Payments ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('success')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'success' ? 'bg-[#1b4332] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Successful ({payments.filter((p) => p.status === 'Success' || p.status === 'Paid').length})
        </button>
        <button
          onClick={() => setActiveTab('refunded')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'refunded' ? 'bg-[#1b4332] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Refunds ({payments.filter((p) => p.status === 'Refunded' || p.status === 'Refund Initiated').length})
        </button>
      </div>

      {/* Payments Table / List */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center">
          <RefreshCw className="w-8 h-8 text-[#2d6a4f] animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-500">Loading payment ledger from MongoDB Atlas...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-700">No payment transactions recorded yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            When you complete an order using Razorpay online payment, your verified receipts will be archived here.
          </p>
          <Link
            to="/customer/marketplace"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Method</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((p) => {
                  const isSuccess = p.status === 'Success' || p.status === 'Paid';
                  const isRefund = p.status === 'Refunded' || p.status === 'Refund Initiated';

                  return (
                    <tr key={p._id || p.transactionId} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-[#081c15]">
                        {p.transactionId || 'pay_sample_test'}
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          to={`/customer/orders`}
                          className="font-bold text-[#2d6a4f] hover:underline"
                        >
                          {p.orderId || 'ORD-UNKNOWN'}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Recent'}
                      </td>
                      <td className="py-4 px-6 font-extrabold text-[#081c15]">
                        ₹{Number(p.amount || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <span className="inline-flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                          {p.paymentMethod || 'Razorpay Online'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {isSuccess && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Paid & Verified
                          </span>
                        )}
                        {isRefund && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" /> Refunded
                          </span>
                        )}
                        {!isSuccess && !isRefund && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-200">
                            <AlertCircle className="w-3 h-3" /> {p.status || 'Pending'}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/customer/orders`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2d6a4f] hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" /> View Order
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

