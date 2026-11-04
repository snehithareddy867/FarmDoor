import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  User, 
  ExternalLink,
  Bike,
  Navigation,
  FileCheck,
  RotateCcw
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { api } from '../../services/api';

export default function FarmerDeliveriesPage() {
  const { farmer } = useFarmerAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [toastMsg, setToastMsg] = useState('');

  const farmerIdentifier = farmer?.farmerId || farmer?.id || farmer?._id;

  const fetchOrders = async () => {
    if (!farmerIdentifier) return;
    const ords = await api.getFarmerOrders(farmerIdentifier);
    setOrders(ords || []);
  };

  useEffect(() => {
    fetchOrders();
  }, [farmerIdentifier]);

  const handleUpdateDelivery = async (orderId, status, note) => {
    await api.updateOrderStatusByFarmer(orderId, status, note);
    setToastMsg(`Delivery status updated: ${status}`);
    fetchOrders();
    setTimeout(() => setToastMsg(''), 3000);
  };

  const isPlatformOrder = (o) => o.deliveryMethod !== 'farmer';
  const isFarmerOrder = (o) => o.deliveryMethod === 'farmer';

  const filtered = orders.filter((o) => {
    if (activeTab === 'platform') return isPlatformOrder(o);
    if (activeTab === 'farmer') return isFarmerOrder(o);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
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
            Dispatch & Delivery Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Differentiate between Platform Eco-Courier dispatches and your own direct farm tractor/van deliveries.
          </p>
        </div>

        <div className="flex bg-[#faf8f2] p-1 rounded-2xl border border-[#2d6a4f]/20 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'all' ? 'bg-[#081c15] text-[#52b788]' : 'text-gray-600'
            }`}
          >
            All Shipments ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('platform')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'platform' ? 'bg-[#081c15] text-[#52b788]' : 'text-gray-600'
            }`}
          >
            Platform Fleet ({orders.filter(isPlatformOrder).length})
          </button>
          <button
            onClick={() => setActiveTab('farmer')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'farmer' ? 'bg-[#081c15] text-[#52b788]' : 'text-gray-600'
            }`}
          >
            Farmer Direct ({orders.filter(isFarmerOrder).length})
          </button>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#2d6a4f]/20 shadow-sm">
            <div className="w-14 h-14 rounded-3xl bg-[#faf8f2] text-[#2d6a4f] flex items-center justify-center mx-auto mb-4 border border-[#2d6a4f]/20">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#081c15]">No Active Dispatches</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              Customer orders marked "Ready for Pickup" or "Out for Delivery" will display live courier assignment and delivery tracking here.
            </p>
          </div>
        ) : (
          filtered.map((order) => {
            const isPlatform = isPlatformOrder(order);
          const isDelivered = order.orderStatus === 'Delivered';

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm space-y-4 hover:border-[#52b788] transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base text-[#081c15]">Order #{order.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isPlatform
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isPlatform ? '⚡ Eco-Fleet Courier Dispatched' : '🚜 Farmer Direct Transport'}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">
                    Status: <strong className="text-[#081c15]">{order.orderStatus}</strong>
                  </span>
                </div>

                <span className="text-xs font-bold text-[#2d6a4f]">
                  Est Delivery: {order.estimatedDelivery || 'Scheduled upon pickup'}
                </span>
              </div>

              {/* Courier vs Direct Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {isPlatform ? (
                  <div className="p-4 rounded-2xl bg-[#faf8f2] border border-emerald-200 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Platform-Managed Delivery Partner
                    </span>
                    <p className="font-bold text-[#081c15] text-sm">{order.deliveryPartner?.name || 'Assigned Fleet Partner'}</p>
                    <p className="text-gray-600 text-[11px]">{order.deliveryPartner?.vehicleType || 'Fleet vehicle details pending dispatch'}</p>
                    {order.deliveryPartner?.phone && (
                      <p className="text-emerald-700 font-semibold text-[10px]">Courier Phone: {order.deliveryPartner.phone}</p>
                    )}
                    <div className="text-[10px] text-gray-500 pt-1">
                      Pickup Status: <strong className="text-[#081c15]">{order.orderStatus === 'Ready for pickup' ? 'Awaiting Courier Handoff' : order.orderStatus === 'Preparing' ? 'Harvesting in Field' : 'Picked Up & En Route'}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-amber-800 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" />
                      Farmer-Managed Direct Delivery
                    </span>
                    <p className="font-bold text-[#081c15] text-sm">Direct Farm Vehicle Delivery</p>
                    <p className="text-gray-600 text-[11px]">Crates delivered directly by {farmer?.farmName} field team.</p>
                    <div className="text-[10px] text-amber-900 font-semibold pt-1">
                      Delivery Instructions: Please ring bell and leave with society guard if recipient is away.
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Customer Drop-Off Address</span>
                  <p className="font-bold text-[#081c15] text-sm">{order.customerName}</p>
                  <p className="text-gray-600 text-[11px]">
                    {order.deliveryAddress?.addressLine || order.shippingAddress?.streetAddress}, {order.deliveryAddress?.city || order.shippingAddress?.city} ({order.deliveryAddress?.pincode || '411045'})
                  </p>
                  <p className="text-emerald-700 font-semibold text-[10px]">Customer Contact: {order.customerPhone || order.shippingAddress?.phone}</p>
                </div>
              </div>

              {/* Delivery Management Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-gray-100">
                <span className="text-gray-500 text-[11px]">
                  Fulfillment channel: {isPlatform ? 'Central Eco-Courier Hub' : 'Farm Direct Delivery'}
                </span>

                <div className="flex items-center gap-2">
                  {/* Platform Flow */}
                  {isPlatform && order.orderStatus === 'Preparing' && (
                    <button
                      onClick={() => handleUpdateDelivery(order.id, 'Ready for pickup', 'Marked ready for platform logistics pickup')}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-700 text-white font-bold hover:bg-cyan-800"
                    >
                      Request Courier Pickup
                    </button>
                  )}

                  {isPlatform && order.orderStatus === 'Ready for pickup' && (
                    <button
                      onClick={() => handleUpdateDelivery(order.id, 'Picked up', 'Handover confirmed with verified delivery partner')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Confirm Courier Handover</span>
                    </button>
                  )}

                  {/* Farmer Direct Flow */}
                  {!isPlatform && order.orderStatus === 'Confirmed' && (
                    <button
                      onClick={() => handleUpdateDelivery(order.id, 'Preparing', 'Farmer accepted delivery responsibility & harvesting')}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700"
                    >
                      Accept Delivery Responsibility
                    </button>
                  )}

                  {!isPlatform && (order.orderStatus === 'Preparing' || order.orderStatus === 'Ready for pickup') && (
                    <button
                      onClick={() => handleUpdateDelivery(order.id, 'Out for delivery', 'Farmer vehicle departed on route')}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-700 text-white font-bold hover:bg-cyan-800"
                    >
                      Depart for Customer Address
                    </button>
                  )}

                  {!isPlatform && order.orderStatus === 'Out for delivery' && (
                    <button
                      onClick={() => handleUpdateDelivery(order.id, 'Delivered', 'Farmer verified doorstep drop-off & customer acceptance')}
                      className="px-4 py-2 rounded-xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332] flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Delivery to Customer</span>
                    </button>
                  )}

                  {isDelivered && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Delivered Successfully</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
}
