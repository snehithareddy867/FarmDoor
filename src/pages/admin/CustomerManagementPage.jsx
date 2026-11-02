import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Ban,
  RotateCcw,
  ShoppingBag,
  Eye,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  X,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const CustomerManagementPage = () => {
  const { admin } = useAdminAuth();
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [suspendModalCustomer, setSuspendModalCustomer] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [feedback, setFeedback] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const custList = await api.getCustomers();
      setCustomers(custList);
      const orderList = await api.getAllOrdersAdmin();
      setOrders(orderList);
      const compList = await api.getAllComplaints();
      setComplaints(compList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSuspend = async () => {
    const isSuspending = suspendModalCustomer.status !== 'Suspended';
    if (isSuspending && !suspendReason.trim()) {
      alert('Please specify why this customer account is being suspended.');
      return;
    }

    try {
      const res = await api.adminToggleCustomerSuspension(
        suspendModalCustomer.id,
        suspendReason || 'Reactivated by platform administrator',
        `${admin?.name} (${admin?.role})`
      );
      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Customer ${suspendModalCustomer.fullName} account has been ${res.newStatus === 'Suspended' ? 'suspended' : 'reactivated'}.`
        });
        setSuspendModalCustomer(null);
        setSuspendReason('');
        loadData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Action failed.' });
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (c.fullName || '').toLowerCase().includes(term) ||
      (c.email || '').toLowerCase().includes(term) ||
      (c.mobile || '').toLowerCase().includes(term) ||
      (c.city || '').toLowerCase().includes(term);

    let matchesFilter = true;
    if (statusFilter === 'Active') matchesFilter = c.status !== 'Suspended';
    else if (statusFilter === 'Suspended') matchesFilter = c.status === 'Suspended';

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-emerald-400" />
            Customer Accounts & Order History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Oversee buyer profiles, purchase records, account health status, and dispute records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Registered:</span>
          <span className="font-mono text-xs font-bold text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {customers.length} Buyers
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
            placeholder="Search by customer name, email, phone or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['All', 'Active', 'Suspended'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
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

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Default City</th>
                <th className="py-3.5 px-4">Orders & Spend</th>
                <th className="py-3.5 px-4">Member Since</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No customer accounts match your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const isSuspended = c.status === 'Suspended';
                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{c.fullName}</div>
                        <div className="text-[10px] font-mono text-slate-500">ID: {c.id}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-300">{c.email}</div>
                        <div className="text-[10px] text-slate-500">{c.mobile}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200">{c.city}, {c.state}</div>
                        <div className="text-[10px] text-slate-500">{c.pincode}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{c.ordersCount || 0} orders</div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          ₹{c.totalSpent || 0} total spent
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">{c.joinedDate || '2025'}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isSuspended
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}
                        >
                          {c.status || 'Active'}
                        </span>
                        {isSuspended && c.suspensionReason && (
                          <div className="text-[9px] text-rose-400/80 truncate max-w-xs mt-0.5" title={c.suspensionReason}>
                            {c.suspensionReason}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCustomer(c)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="View Customer Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setSuspendModalCustomer(c);
                              setSuspendReason('');
                            }}
                            className={`p-1.5 rounded-lg text-[10px] transition ${
                              isSuspended
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300'
                                : 'bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400'
                            }`}
                            title={isSuspended ? 'Reactivate Account' : 'Suspend Customer'}
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

      {/* Customer Profile Inspection Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedCustomer.fullName}</h3>
                  <p className="text-xs text-slate-400">{selectedCustomer.email} &bull; Member Since {selectedCustomer.joinedDate}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Delivery Address Details */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Primary Delivery Address
                </span>
                <p className="text-slate-200">
                  {selectedCustomer.deliveryAddress || 'Flat 402, Green Woods Residency, Baner Road, Pune, Maharashtra 411045'}
                </p>
                <p className="text-slate-400 mt-1">Phone: {selectedCustomer.mobile}</p>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Completed Orders</span>
                  <span className="text-lg font-bold text-white mt-1 block">{selectedCustomer.ordersCount || 0}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Lifetime Value</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">₹{selectedCustomer.totalSpent || 0}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Avg Rating Given</span>
                  <span className="text-lg font-bold text-amber-400 mt-1 block">★ {selectedCustomer.avgRatingGiven || '5.0'}</span>
                </div>
              </div>

              {/* Associated Platform Orders */}
              <div>
                <h4 className="font-bold text-slate-300 text-xs mb-2 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  Recent Orders Placed by {selectedCustomer.fullName}
                </h4>
                <div className="space-y-2">
                  {orders
                    .filter((o) => o.shippingAddress?.fullName === selectedCustomer.fullName || o.shippingAddress?.email === selectedCustomer.email)
                    .map((o) => (
                      <div key={o.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="font-mono font-medium text-white">Order #{o.id}</div>
                          <div className="text-[10px] text-slate-500">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent'} &bull; {o.items?.length || 1} items</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-emerald-400">₹{o.finalAmount || o.pricing?.total}</div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                            {o.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Associated Complaints */}
              <div>
                <h4 className="font-bold text-slate-300 text-xs mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                  Support Tickets & Escalations
                </h4>
                <div className="space-y-2">
                  {complaints
                    .filter((c) => c.userName === selectedCustomer.fullName || c.customerName === selectedCustomer.fullName)
                    .map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{c.subject}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">{c.status}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{c.description}</p>
                      </div>
                    ))}
                  {complaints.filter((c) => c.userName === selectedCustomer.fullName || c.customerName === selectedCustomer.fullName).length === 0 && (
                    <p className="text-[11px] text-slate-500 italic p-3 bg-slate-950 rounded-xl border border-slate-800">
                      No customer complaints recorded. Account maintains clean dispute history.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {suspendModalCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <h3 className="text-base font-bold text-white mb-2">
              {suspendModalCustomer.status === 'Suspended' ? 'Reactivate Customer Account' : 'Suspend Customer Account'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {suspendModalCustomer.status === 'Suspended'
                ? `Reactivating ${suspendModalCustomer.fullName} will restore their cart, checkout, and ordering capabilities.`
                : `Suspending ${suspendModalCustomer.fullName} prevents them from placing orders or initiating cash-on-delivery checkouts.`}
            </p>

            {suspendModalCustomer.status !== 'Suspended' && (
              <textarea
                rows="3"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Reason for suspension (e.g. repeated fraudulent chargebacks or COD gate refusal)..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 mb-4"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSuspendModalCustomer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleSuspend}
                className={`px-4 py-2 text-white rounded-xl text-xs font-semibold ${
                  suspendModalCustomer.status === 'Suspended'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {suspendModalCustomer.status === 'Suspended' ? 'Confirm Reactivation' : 'Confirm Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

