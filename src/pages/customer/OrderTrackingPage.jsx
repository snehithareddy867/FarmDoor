import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  ArrowLeft, 
  ShieldCheck,
  AlertCircle,
  Package
} from 'lucide-react';
import { api } from '../../services/api';

const PROGRESSION_STEPS = [
  'Placed',
  'Confirmed',
  'Preparing',
  'Ready for pickup',
  'Picked up',
  'Out for delivery',
  'Delivered'
];

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const data = await api.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load tracking data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#2d6a4f] border-t-[#52b788] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-[#1b4332]">Retrieving Milestone Progression...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-outfit font-extrabold text-2xl text-[#081c15] mb-2">Order Not Found</h2>
        <Link to="/customer/orders" className="text-xs font-bold text-[#2d6a4f] underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStatusIndex = PROGRESSION_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div>
        <Link
          to="/customer/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d6a4f] hover:underline mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-outfit text-3xl font-extrabold text-[#081c15]">
              Order Tracking #{order.id}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Live milestones logged by growers, packaging stations, and delivery hubs.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white border border-gray-200 shadow-sm text-right self-start sm:self-auto">
            <span className="text-[10px] text-gray-400 block font-bold uppercase">Estimated Drop-off</span>
            <span className="font-outfit font-extrabold text-sm text-[#1b4332]">
              {order.estimatedDelivery}
            </span>
          </div>
        </div>
      </div>

      {isCancelled ? (
        <div className="bg-red-50 p-6 rounded-3xl border border-red-200 text-red-800 space-y-2">
          <div className="flex items-center gap-2 font-bold text-base">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span>This Order Was Cancelled</span>
          </div>
          <p className="text-xs leading-relaxed">
            Reason: {order.cancellationReason || 'Cancelled by customer'}. No further transit progression will occur.
          </p>
        </div>
      ) : (
        /* Actual Order Progression Stepper (7 Steps) */
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <h2 className="font-outfit font-extrabold text-lg text-[#081c15] pb-3 border-b border-gray-100 flex items-center justify-between">
            <span>Milestone Progression Log</span>
            <span className="text-xs font-bold text-[#40916c]">
              Current Status: {order.orderStatus}
            </span>
          </h2>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
            {PROGRESSION_STEPS.map((step, idx) => {
              const isPast = currentStatusIndex > idx;
              const isCurrent = currentStatusIndex === idx;
              const isFuture = currentStatusIndex < idx;

              // Find milestone note from tracking timeline
              const milestoneData = order.trackingTimeline?.find((t) => t.status === step);

              return (
                <div key={step} className="relative flex items-start gap-4">
                  {/* Step Marker */}
                  <div
                    className={`absolute -left-6 sm:-left-8 w-6 sm:w-7 h-6 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isPast
                        ? 'bg-[#1b4332] text-white ring-4 ring-[#d8f3dc]'
                        : isCurrent
                        ? 'bg-[#52b788] text-[#081c15] ring-4 ring-[#52b788]/30 animate-pulse'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4
                        className={`font-outfit font-bold text-sm ${
                          isCurrent
                            ? 'text-[#1b4332] font-extrabold text-base'
                            : isPast
                            ? 'text-[#081c15]'
                            : 'text-gray-400'
                        }`}
                      >
                        {step}
                      </h4>
                      {milestoneData?.timestamp && (
                        <span className="text-[11px] text-gray-400">
                          {new Date(milestoneData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <p className={`text-xs mt-0.5 leading-relaxed ${isFuture ? 'text-gray-300' : 'text-gray-600'}`}>
                      {milestoneData?.note || (
                        isFuture ? 'Awaiting prior milestone completion.' : 'Status confirmed.'
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery Partner Details: Displayed ONLY When Assigned */}
      {order.deliveryPartner?.assigned && (
        <div className="bg-[#081c15] text-white p-6 sm:p-8 rounded-3xl border border-[#2d6a4f] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1b4332] text-[#74c69d] flex items-center justify-center border border-[#52b788]/30 shrink-0">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#95d5b2] block mb-0.5">
                  Assigned Delivery Partner
                </span>
                <h3 className="font-outfit font-bold text-lg text-white">
                  {order.deliveryPartner.name}
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  {order.deliveryPartner.vehicleType}
                </p>
              </div>
            </div>

            {order.deliveryPartner.phone && (
              <a
                href={`tel:${order.deliveryPartner.phone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#52b788] text-[#081c15] text-xs font-bold hover:bg-[#74c69d] transition-colors self-start sm:self-auto"
              >
                <Phone className="w-4 h-4" /> Call Partner ({order.deliveryPartner.phone})
              </a>
            )}
          </div>
        </div>
      )}

      {/* Destination & Crops Summary */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div>
          <h4 className="font-bold text-gray-400 uppercase text-[10px] mb-2 tracking-wider">
            Destination Address
          </h4>
          <p className="font-bold text-[#081c15] text-sm">{order.deliveryAddress?.fullName}</p>
          <p className="text-gray-600 mt-0.5">
            {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
          </p>
          <p className="text-gray-500 mt-1">📞 {order.deliveryAddress?.mobile}</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-400 uppercase text-[10px] mb-2 tracking-wider">
            Package Contents ({order.items?.length} Crops)
          </h4>
          <ul className="space-y-1.5 text-gray-700">
            {order.items?.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>• {item.name} ({item.quantity} {item.unit})</span>
                <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

