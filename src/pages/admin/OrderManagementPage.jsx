import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  XCircle,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  User,
  X,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const OrderManagementPage = () => {
  const { admin } = useAdminAuth();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [processRefund, setProcessRefund] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAllOrdersAdmin();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Please specify reason for administrative order cancellation.');
      return;
    }

    try {
      const res = await api.adminCancelOrder(cancelModalOrder.id, {
        reason: cancelReason,
        processRefund,
        actor: `${admin?.name} (${admin?.role})`
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Order #${cancelModalOrder.id} has been cancelled.${processRefund ? ' Refund registered successfully.' : ''}`
        });
        setCancelModalOrder(null);
        setCancelReason('');
        loadOrders();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to cancel order.' });
    }
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (o.id || '').toLowerCase().includes(term) ||
      (o.orderNumber || '').toLowerCase().includes(term) ||
      (o.shippingAddress?.fullName || '').toLowerCase().includes(term) ||
      (o.shippingAddress?.city || '').toLowerCase().includes(term) ||
      (o.assignedCourier?.name || '').toLowerCase().includes(term);

    let matchesStatus = true;
    if (statusFilter !== 'All') {
      matchesStatus = (o.orderStatus || '').toLowerCase() === statusFilter.toLowerCase();
    }

    let matchesMethod = true;
    if (methodFilter !== 'All') {
      matchesMethod = o.deliveryMethod === methodFilter;
    }

    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            Central Order Management & Fulfillment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of customer purchases, dispatch channels, courier assignments, and administrative interventions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Recorded:</span>
          <span className="font-mono text-xs font-bold text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {orders.length} Orders
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, courier, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Method filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="All">All Dispatch Types</option>
            <option value="platform">Platform Courier</option>
            <option value="farmer">Farmer Self-Run</option>
          </select>

          {/* Status buttons */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {['All', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
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
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Fulfillment Mode</th>
                <th className="py-3.5 px-4">Courier Assigned</th>
                <th className="py-3.5 px-4">Bill Amount</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const total = o.finalAmount || o.pricing?.total || 0;
                  const isDelivered = o.orderStatus === 'Delivered';
                  const isCancelled = o.orderStatus === 'Cancelled';
                  const isPlatform = o.deliveryMethod === 'platform';

                  return (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white">#{o.id}</div>
                        <div className="text-[10px] text-slate-400">
                          {o.createdAt ? new Date(o.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recent'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{o.shippingAddress?.fullName || 'Customer'}</div>
                        <div className="text-[10px] text-slate-400">{o.shippingAddress?.city || 'Pune'} &bull; {o.shippingAddress?.phone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold border ${
                            isPlatform
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                          }`}
                        >
                          {isPlatform ? 'Platform Courier' : 'Farmer Self-Dispatch'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {o.assignedCourier ? (
                          <div>
                            <div className="text-white font-medium">{o.assignedCourier.name}</div>
                            <div className="text-[10px] text-emerald-400 font-mono">{o.assignedCourier.phone}</div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">
                            {isPlatform ? 'Awaiting Courier' : 'Farmer Run'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white">₹{total}</div>
                        <div className="text-[10px] text-slate-400">
                          {o.paymentMethod === 'cash_on_delivery' ? 'COD Doorstep' : 'Prepaid UPI'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            isDelivered
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : isCancelled
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          {isDelivered && <CheckCircle2 className="w-3 h-3" />}
                          {isCancelled && <XCircle className="w-3 h-3" />}
                          {!isDelivered && !isCancelled && <Clock className="w-3 h-3" />}
                          {o.orderStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Inspect Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {!isCancelled && !isDelivered && (
                            <button
                              onClick={() => {
                                setCancelModalOrder(o);
                                setCancelReason('');
                                setProcessRefund(o.paymentMethod !== 'cash_on_delivery');
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-semibold text-[10px] transition"
                              title="Administrative Cancellation"
                            >
                              Cancel
                            </button>
                          )}
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

      {/* MODAL 1: Full Order Details Inspection */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Order #{selectedOrder.id}</h3>
                  <p className="text-xs text-slate-400">
                    Status: <span className="text-emerald-400 font-semibold">{selectedOrder.orderStatus}</span> &bull; {selectedOrder.deliveryMethod === 'platform' ? 'Platform Delivery' : 'Farmer Self-Dispatch'}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Customer & Address */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Customer & Shipping Destination
                </span>
                <p className="text-white font-semibold">{selectedOrder.shippingAddress?.fullName}</p>
                <p className="text-slate-300">{selectedOrder.shippingAddress?.streetAddress || selectedOrder.shippingAddress?.addressLine1}</p>
                <p className="text-slate-400">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                </p>
                <p className="text-emerald-400 font-mono mt-1">Phone: {selectedOrder.shippingAddress?.phone}</p>
              </div>

              {/* Items Breakdown */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Produce Items ({selectedOrder.items?.length || 1})
                </span>
                <div className="space-y-2">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.quantity} {item.unit || 'kg'} &bull; Farm: {item.farmerName || 'Verified Farm'}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-white">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Produce Subtotal:</span>
                  <span>₹{selectedOrder.pricing?.subtotal || (selectedOrder.finalAmount ? selectedOrder.finalAmount - 40 : 0)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Logistics Fee:</span>
                  <span>₹{selectedOrder.pricing?.deliveryFee || 40}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-slate-800 text-sm">
                  <span>Grand Total:</span>
                  <span>₹{selectedOrder.finalAmount || selectedOrder.pricing?.total}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Payment Gateway Status:</span>
                  <span className="text-slate-300 uppercase">{selectedOrder.paymentStatus || 'Paid'}</span>
                </div>
                {selectedOrder.refundTransactionId && (
                  <div className="flex justify-between text-[11px] text-teal-400 pt-1">
                    <span>Refund Disbursed:</span>
                    <span>Ref: {selectedOrder.refundTransactionId}</span>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {selectedOrder.trackingTimeline && selectedOrder.trackingTimeline.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Fulfillment Milestones
                  </span>
                  <div className="space-y-2">
                    {selectedOrder.trackingTimeline.map((step, idx) => (
                      <div key={idx} className="text-xs p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-white">{step.status}</div>
                          <div className="text-[10px] text-slate-400">{step.note}</div>
                          <div className="text-[9px] text-slate-500 mt-0.5">{new Date(step.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Administrative Cancellation */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">Cancel Order #{cancelModalOrder.id}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Administrative cancellation halts delivery dispatch and records audit tracking notes.
            </p>

            <div className="space-y-3 mb-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason for Cancellation</label>
                <textarea
                  rows="3"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Courier vehicle breakdown; customer requested cancellation; farm frost crop damage..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="refundCheck"
                  checked={processRefund}
                  onChange={(e) => setProcessRefund(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="refundCheck" className="text-slate-300 font-medium cursor-pointer">
                  Initiate full refund of ₹{cancelModalOrder.finalAmount || cancelModalOrder.pricing?.total} to customer
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

