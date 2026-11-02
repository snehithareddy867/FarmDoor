import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const PaymentManagementPage = () => {
  const { admin } = useAdminAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Refund Modal
  const [refundTarget, setRefundTarget] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [feedback, setFeedback] = useState(null);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await api.getAllPaymentsAdmin();
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleOpenRefund = (pay) => {
    setRefundTarget(pay);
    setRefundAmount(pay.amount);
    setRefundReason('Dispute resolution / policy refund approved by administrator');
  };

  const handleProcessRefund = async () => {
    if (!refundAmount || Number(refundAmount) <= 0) {
      alert('Please enter a valid refund amount.');
      return;
    }
    if (!refundReason.trim()) {
      alert('Please enter authorization reason for this refund.');
      return;
    }

    try {
      const res = await api.adminProcessRefund(refundTarget.orderId, {
        refundAmount: Number(refundAmount),
        reason: refundReason,
        actor: `${admin?.name} (${admin?.role})`
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Refund of ₹${refundAmount} successfully executed via gateway. Txn: ${res.refundTransactionId}`
        });
        setRefundTarget(null);
        loadPayments();
      } else {
        alert(res.message || 'Refund processing failed');
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Error executing refund.' });
    }
  };

  const filteredPayments = payments.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (p.orderId || '').toLowerCase().includes(term) ||
      (p.transactionId || '').toLowerCase().includes(term) ||
      (p.customerName || '').toLowerCase().includes(term) ||
      (p.paymentMethod || '').toLowerCase().includes(term);

    let matchesStatus = true;
    if (statusFilter !== 'All') {
      matchesStatus = (p.status || '').toLowerCase() === statusFilter.toLowerCase();
    }

    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments.filter((p) => p.status === 'Refunded').reduce((sum, p) => sum + (p.refundAmount || p.amount), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            Payment Settlements & Gateway Refunds
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reconcile UPI, Card, NetBanking, and Doorstep COD collections with gateway transaction auditing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Volume:</span>
          <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            ₹{totalCollected.toLocaleString('en-IN')} Settled
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

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Settled Transactions</p>
          <div className="text-xl font-bold text-white mt-1">₹{totalCollected.toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-emerald-400 mt-1">{payments.filter((p) => p.status === 'Paid').length} paid orders</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Disbursed Refunds</p>
          <div className="text-xl font-bold text-teal-400 mt-1">₹{totalRefunded.toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-teal-400/80 mt-1">{payments.filter((p) => p.status === 'Refunded').length} refunded orders</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform Retention (10%)</p>
          <div className="text-xl font-bold text-emerald-400 mt-1">₹{Math.round(totalCollected * 0.1).toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-slate-500 mt-1">Operating revenue share</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by transaction ID, Order ID, customer or method..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['All', 'Paid', 'Refunded', 'Pending', 'Failed'].map((status) => (
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

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Gateway Transaction ID</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Method & Gateway</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No transactions match filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isPaid = p.status === 'Paid';
                  const isRefunded = p.status === 'Refunded';

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white">#{p.orderId}</div>
                        <div className="text-[10px] text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-emerald-400 font-semibold">{p.transactionId}</div>
                        {p.refundTransactionId && (
                          <div className="text-[10px] text-teal-400 font-mono">
                            Ref: {p.refundTransactionId}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{p.customerName}</div>
                        <div className="text-[10px] text-slate-500">{p.customerPhone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-300">{p.paymentMethod}</div>
                        <div className="text-[10px] text-slate-500">{p.gateway}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white text-sm">₹{p.amount}</div>
                        <div className="text-[10px] text-slate-500">
                          Fee: ₹{p.commissionFee} &bull; Payout: ₹{p.farmerPayout}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            isPaid
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : isRefunded
                              ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          {isPaid && <CheckCircle2 className="w-3 h-3" />}
                          {isRefunded && <RotateCcw className="w-3 h-3" />}
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isPaid && (
                          <button
                            onClick={() => handleOpenRefund(p)}
                            className="px-2.5 py-1 rounded-lg bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white font-semibold text-[10px] transition"
                          >
                            Process Refund
                          </button>
                        )}
                        {isRefunded && (
                          <span className="text-[10px] text-slate-500 font-mono italic">
                            Refund Disbursed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REFUND MODAL */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">Execute Gateway Refund</h3>
            <p className="text-xs text-slate-400 mb-4">
              Disburse authorized credit to <span className="text-white font-medium">{refundTarget.customerName}</span> for Order #{refundTarget.orderId}.
            </p>

            <div className="space-y-3 mb-5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Refund Amount (₹)</label>
                <input
                  type="number"
                  max={refundTarget.amount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-teal-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Maximum refundable: ₹{refundTarget.amount}</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Audit Justification</label>
                <textarea
                  rows="3"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Reason for refund approval..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRefundTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-teal-950/40"
              >
                Disburse Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

