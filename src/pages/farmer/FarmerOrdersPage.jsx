import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Truck, 
  Coins, 
  Filter, 
  User, 
  Search,
  ArrowRight,
  XCircle,
  X,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { api } from '../../services/api';

export default function FarmerOrdersPage() {
  const { farmer } = useFarmerAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [toastMsg, setToastMsg] = useState('');

  // Reject order modal
  const [rejectOrderTarget, setRejectOrderTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const farmerIdentifier = farmer?.farmerId || farmer?.id || farmer?._id;

  const fetchOrders = async () => {
    if (!farmerIdentifier) return;
    setLoading(true);
    const ords = await api.getFarmerOrders(farmerIdentifier);
    setOrders(ords || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [farmerIdentifier]);

  const handleUpdateStatus = async (orderId, newStatus, note = '') => {
    await api.updateOrderStatusByFarmer(orderId, newStatus, note || `Farmer updated order to ${newStatus}`);
    setToastMsg(`Order #${orderId} moved to ${newStatus}`);
    fetchOrders();
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for declining this order.');
      return;
    }
    await api.updateOrderStatusByFarmer(
      rejectOrderTarget.id,
      'Cancelled',
      `Farmer declined order: ${rejectReason}`
    );
    setToastMsg(`Order #${rejectOrderTarget.id} declined. Customer notified.`);
    setRejectOrderTarget(null);
    setRejectReason('');
    fetchOrders();
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredOrders = orders.filter((o) => {
    const s = (o.orderStatus || '').toLowerCase();
    if (filterStatus === 'new') return s === 'placed' || s === 'new' || s === 'pending';
    if (filterStatus === 'preparing') return s === 'confirmed' || s === 'preparing' || s === 'harvesting' || s === 'packed';
    if (filterStatus === 'pickup') return s === 'ready for pickup' || s === 'out for delivery' || s === 'picked up' || s === 'pickup';
    if (filterStatus === 'delivered') return s === 'delivered' || s === 'completed';
    if (filterStatus === 'cancelled') return s === 'cancelled' || s === 'rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-black font-outfit text-[#081c15]">
            Customer Farm Orders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Accept, prepare, pack, and release orders to logistics couriers or customer doorstep.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#faf8f2] p-1 rounded-2xl border border-[#2d6a4f]/20 text-xs overflow-x-auto">
          {['all', 'new', 'preparing', 'pickup', 'delivered', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize transition whitespace-nowrap ${
                filterStatus === tab
                  ? 'bg-[#081c15] text-[#52b788] shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-gray-500 bg-white rounded-3xl border">
          <div className="w-8 h-8 border-3 border-[#2d6a4f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p>Loading farm orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#2d6a4f]/20 shadow-sm">
          <p className="text-xs text-gray-500">No orders match this status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isPlatform = order.deliveryMethod === 'platform';
            const isDelivered = order.orderStatus === 'Delivered';
            const isCancelled = order.orderStatus === 'Cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm hover:border-[#52b788] transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-[#081c15]">Order #{order.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPlatform ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isPlatform ? 'Platform Eco-Fleet' : 'Farmer Direct Run'}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500">
                      Status: <span className="text-[#081c15] font-bold">{order.orderStatus}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-[#2d6a4f]">
                      ₹{order.totalAmount || order.finalAmount}
                    </span>
                    <p className="text-[10px] text-gray-400">Payment: {order.paymentMethod?.toUpperCase()}</p>
                  </div>
                </div>

                {/* Items & Customer info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ordered Produce</span>
                    <div className="mt-1 space-y-1">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="flex justify-between font-semibold text-[#081c15]">
                          <span>{it.name}</span>
                          <span>{it.quantity} {it.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer Destination</span>
                    <p className="font-bold text-[#081c15] mt-1">{order.customerName}</p>
                    <p className="text-gray-600 text-[11px]">
                      {order.deliveryAddress?.addressLine || order.shippingAddress?.addressLine || order.shippingAddress?.streetAddress || 'Pune Delivery Zone'}, {order.deliveryAddress?.city || order.shippingAddress?.city || 'Pune'}
                    </p>
                    <p className="text-emerald-700 font-semibold text-[10px] mt-0.5">Phone: {order.customerPhone || order.shippingAddress?.mobile || order.shippingAddress?.phone || 'Customer Phone on Record'}</p>
                  </div>
                </div>

                {/* Farmer Lifecycle Workflow Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-gray-500 text-[11px]">
                    Placed: {new Date(order.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Stage 1: Placed -> Accept or Reject */}
                    {(order.orderStatus === 'Placed' || order.orderStatus === 'New') && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Confirmed', 'Farmer accepted order for harvesting')}
                          className="px-3.5 py-1.5 rounded-xl bg-[#081c15] text-[#52b788] font-bold hover:bg-[#1b4332]"
                        >
                          Accept Order
                        </button>
                        <button
                          onClick={() => {
                            setRejectOrderTarget(order);
                            setRejectReason('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold hover:bg-rose-100"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {/* Stage 2: Confirmed / Harvesting -> Prepare */}
                    {(order.orderStatus === 'Confirmed' || order.orderStatus === 'Harvesting') && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Preparing', 'Produce hand-picked from fields & boxed')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700"
                      >
                        Start Harvest & Packing
                      </button>
                    )}

                    {/* Stage 3: Preparing / Packed -> Ready for pickup */}
                    {(order.orderStatus === 'Preparing' || order.orderStatus === 'Packed') && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Ready for Pickup', 'Crates sealed & ready for dispatch')}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-700 text-white font-bold hover:bg-cyan-800"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}

                    {/* Stage 4: Ready for pickup -> Handover or Deliver */}
                    {(order.orderStatus === 'Ready for Pickup' || order.orderStatus === 'Ready for pickup') && (
                      <>
                        {isPlatform ? (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Out for Delivery', 'Handed over crates to platform courier')}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                          >
                            Confirm Handover to Courier
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Out for Delivery', 'Farmer vehicle en route to customer')}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                          >
                            Depart on Direct Farm Delivery
                          </button>
                        )}
                      </>
                    )}

                    {/* Stage 5: Out for delivery (Farmer Run) -> Complete */}
                    {!isPlatform && (order.orderStatus === 'Out for Delivery' || order.orderStatus === 'Out for delivery') && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Delivered', 'Farmer hand-delivered fresh produce at customer doorstep')}
                        className="px-3.5 py-1.5 rounded-xl bg-[#081c15] text-[#52b788] font-bold hover:bg-[#1b4332]"
                      >
                        Complete Delivery
                      </button>
                    )}

                    {isDelivered && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed & Settled</span>
                      </span>
                    )}

                    {isCancelled && (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        <span>Cancelled / Declined</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Order Modal */}
      {rejectOrderTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-rose-200">
            <h3 className="text-base font-bold font-outfit text-rose-950 mb-1">
              Decline Order #{rejectOrderTarget.id}
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              State the reason for declining this order so the buyer can be credited immediately:
            </p>

            <textarea
              rows="3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Sudden morning frost ruined ripe batch; or delivery address outside harvest radius."
              className="w-full p-3 bg-[#faf8f2] border border-gray-300 rounded-2xl text-xs focus:outline-none mb-4"
            />

            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setRejectOrderTarget(null)}
                className="px-4 py-2 rounded-xl border text-gray-600 font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
