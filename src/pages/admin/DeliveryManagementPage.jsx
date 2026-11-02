import React, { useState, useEffect } from 'react';
import {
  Navigation,
  Search,
  Filter,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  MapPin,
  X,
  Eye,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const DeliveryManagementPage = () => {
  const { admin } = useAdminAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dispatchTypeFilter, setDispatchTypeFilter] = useState('All');

  // Reassignment Modal
  const [reassignTarget, setReassignTarget] = useState(null);
  const [selectedCourierId, setSelectedCourierId] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [inspectDelivery, setInspectDelivery] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const orders = await api.getAllOrdersAdmin();
      // Format as delivery records
      const formatted = orders.map((o) => ({
        id: o.assignmentId || `JOB-${o.id}`,
        orderId: o.id,
        orderNumber: o.orderNumber || o.id,
        deliveryMethod: o.deliveryMethod || 'platform',
        courier: o.assignedCourier,
        customerName: o.shippingAddress?.fullName || 'Customer',
        destinationCity: o.shippingAddress?.city || 'Pune',
        destinationAddress: o.shippingAddress?.streetAddress || o.shippingAddress?.addressLine1 || 'City Center',
        status: o.courierAssignmentStatus || (o.deliveryMethod === 'farmer' ? 'Farmer Self-Dispatch' : 'Unassigned'),
        orderStatus: o.orderStatus,
        createdAt: o.createdAt || new Date().toISOString(),
        timeline: o.trackingTimeline || []
      }));
      setDeliveries(formatted);

      const activeCouriers = await api.getAllDeliveryPartnersAdmin();
      setCouriers(activeCouriers.filter((c) => c.verificationStatus === 'Approved' && c.status !== 'Suspended'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenReassign = (del) => {
    setReassignTarget(del);
    setSelectedCourierId(couriers[0]?.id || '');
  };

  const handleConfirmReassign = async () => {
    if (!selectedCourierId) {
      alert('Please select an active delivery partner.');
      return;
    }

    try {
      const res = await api.adminReassignDelivery(
        reassignTarget.orderId,
        selectedCourierId,
        `${admin?.name} (${admin?.role})`
      );

      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Order #${reassignTarget.orderId} dispatch reassigned successfully.`
        });
        setReassignTarget(null);
        loadData();
      } else {
        alert(res.message || 'Failed to reassign delivery');
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Error executing courier reassignment.' });
    }
  };

  const filteredDeliveries = deliveries.filter((d) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (d.orderId || '').toLowerCase().includes(term) ||
      (d.customerName || '').toLowerCase().includes(term) ||
      (d.destinationCity || '').toLowerCase().includes(term) ||
      (d.courier?.name || '').toLowerCase().includes(term);

    let matchesStatus = true;
    if (statusFilter !== 'All') {
      matchesStatus = (d.status || '').toLowerCase().includes(statusFilter.toLowerCase());
    }

    let matchesType = true;
    if (dispatchTypeFilter !== 'All') {
      matchesType = d.deliveryMethod === dispatchTypeFilter;
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Navigation className="w-6 h-6 text-emerald-400" />
            Live Dispatch & Delivery Fleet Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of platform couriers vs farmer self-managed runs. Reassign delayed shipments seamlessly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Active Shipments:</span>
          <span className="font-mono text-xs font-bold text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {deliveries.filter((d) => !['Delivered', 'Cancelled'].includes(d.orderStatus)).length} In Motion
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by order ID, customer, courier, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dispatchTypeFilter}
            onChange={(e) => setDispatchTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Dispatch Modes</option>
            <option value="platform">Platform Couriers Only</option>
            <option value="farmer">Farmer Self-Dispatch Only</option>
          </select>

          <div className="flex items-center gap-1 overflow-x-auto">
            {['All', 'Assigned', 'In transit', 'Delivered', 'Failed'].map((status) => (
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

      {/* Deliveries Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order / Trip ID</th>
                <th className="py-3.5 px-4">Dispatch Channel</th>
                <th className="py-3.5 px-4">Customer & Dropoff</th>
                <th className="py-3.5 px-4">Assigned Partner</th>
                <th className="py-3.5 px-4">Dispatch Status</th>
                <th className="py-3.5 px-4">Order Lifecycle</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No active deliveries match filters.
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((del) => {
                  const isPlatform = del.deliveryMethod === 'platform';
                  const isDelivered = del.orderStatus === 'Delivered';

                  return (
                    <tr key={del.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white">#{del.orderId}</div>
                        <div className="text-[10px] text-slate-500">{del.id}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold border ${
                            isPlatform
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                          }`}
                        >
                          {isPlatform ? 'Platform Fleet' : 'Farmer Managed'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{del.customerName}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">
                          {del.destinationAddress}, {del.destinationCity}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {del.courier ? (
                          <div>
                            <div className="text-white font-medium flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-emerald-400" />
                              {del.courier.name}
                            </div>
                            <div className="text-[10px] text-emerald-400 font-mono">{del.courier.phone}</div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-400/90 italic flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {isPlatform ? 'Unassigned' : 'Farmer Self-Dispatch'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-medium capitalize">
                          {del.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            isDelivered
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : del.orderStatus === 'Cancelled'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          {del.orderStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectDelivery(del)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Inspect Timeline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {isPlatform && !isDelivered && del.orderStatus !== 'Cancelled' && (
                            <button
                              onClick={() => handleOpenReassign(del)}
                              className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[10px] font-semibold flex items-center gap-1 transition"
                              title="Reassign Courier"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reassign</span>
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

      {/* REASSIGN COURIER MODAL */}
      {reassignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
            <h3 className="text-base font-bold text-white mb-1">Reassign Platform Courier</h3>
            <p className="text-xs text-slate-400 mb-4">
              Select an approved active partner to take over dispatch for Order #{reassignTarget.orderId}:
            </p>

            <div className="space-y-3 mb-5 text-xs">
              <label className="block text-slate-300 font-semibold">Select Available Courier</label>
              <select
                value={selectedCourierId}
                onChange={(e) => setSelectedCourierId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                {couriers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.vehicleType} &bull; {c.isOnline ? 'Online Ready' : 'Offline'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReassignTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReassign}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Dispatch Reassignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT TIMELINE MODAL */}
      {inspectDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Delivery Lifecycle: #{inspectDelivery.orderId}</h3>
              <button onClick={() => setInspectDelivery(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Customer Destination:</span>
                  <span className="text-white font-medium">{inspectDelivery.customerName}</span>
                </div>
                <div className="text-slate-300">{inspectDelivery.destinationAddress}, {inspectDelivery.destinationCity}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Dispatch Steps Recorded
                </span>
                <div className="space-y-2">
                  {(inspectDelivery.timeline || []).map((step, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">{step.status}</div>
                        <div className="text-[10px] text-slate-400">{step.note}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">{new Date(step.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  {(!inspectDelivery.timeline || inspectDelivery.timeline.length === 0) && (
                    <p className="text-slate-500 italic p-3 bg-slate-950 rounded-xl">No logs recorded yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectDelivery(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

