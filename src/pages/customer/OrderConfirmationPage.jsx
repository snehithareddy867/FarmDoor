import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  User, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { api } from '../../services/api';
import { handleImageError } from '../../utils/imageFallback';

export default function OrderConfirmationPage() {
  const { id, orderId } = useParams();
  const effectiveId = id || orderId;
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order && !!effectiveId);

  useEffect(() => {
    if (!order && effectiveId) {
      let isMounted = true;
      async function fetchOrder() {
        setLoading(true);
        try {
          const data = await api.getOrderById(effectiveId);
          if (isMounted) setOrder(data);
        } catch (err) {
          console.error('Failed to load order:', err);
        } finally {
          if (isMounted) setLoading(false);
        }
      }
      fetchOrder();
      return () => {
        isMounted = false;
      };
    } else if (!effectiveId && !order) {
      setLoading(false);
    }
  }, [effectiveId, order]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#2d6a4f] border-t-[#52b788] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-[#1b4332]">Retrieving Harvest Order Confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-outfit font-extrabold text-2xl text-[#081c15] mb-2">Order Not Found</h2>
        <Link to="/customer/orders" className="text-xs font-bold text-[#2d6a4f] underline">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Banner */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center mb-4 shadow-lg animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-[#40916c]" />
        </div>

        <span className="px-3 py-1 rounded-full bg-[#faf8f2] text-[#1b4332] text-xs font-bold uppercase tracking-wider mb-2 border border-[#52b788]/30">
          Order Confirmed & Logged
        </span>

        <h1 className="font-outfit font-extrabold text-3xl sm:text-4xl text-[#081c15] mb-2">
          Thank You For Supporting Local Farmers!
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mb-6 leading-relaxed">
          Order <strong>#{order.id}</strong> has been transmitted directly to our verified local agricultural partners. Crops will be harvested at dawn and staged for eco-dispatch.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            to={`/customer/orders/${order.id}/track`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-[#74c69d]" />
            <span>Track Order Progression</span>
          </Link>

          <Link
            to="/customer/marketplace"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#faf8f2] hover:bg-gray-100 text-[#1b4332] text-xs font-bold border border-gray-200 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Order Details Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <h2 className="font-outfit font-extrabold text-lg text-[#081c15] pb-3 border-b border-gray-100 flex items-center justify-between">
          <span>Order Summary</span>
          <span className="text-xs font-mono text-gray-500">#{order.id}</span>
        </h2>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-[#faf8f2] p-4 rounded-2xl border border-gray-100">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Estimated Arrival</span>
            <span className="font-bold text-[#081c15]">{order.estimatedDelivery}</span>
          </div>

          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Delivery Method</span>
            <span className="font-bold text-[#081c15] capitalize">
              {order.deliveryMethod === 'farmer' ? 'Farmer Direct Run' : 'Platform Eco-Fleet'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Payment Status</span>
            <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
              {order.paymentStatus} ({order.paymentMethod?.toUpperCase()})
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Paid</span>
            <span className="font-outfit font-extrabold text-sm text-[#1b4332]">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>

        {/* Ordered Crops List */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Ordered Crops
          </h3>
          <div className="divide-y divide-gray-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name || 'Crop Item'}
                    loading="lazy"
                    onError={(e) => handleImageError(e, item.category)}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-[#081c15]">{item.name}</h4>
                    <p className="text-[11px] text-gray-500">
                      Grown by {item.farmerName} ({item.farmLocation?.split(',')[0]})
                    </p>
                    <span className="text-[11px] text-[#40916c] font-semibold">
                      Qty: {item.quantity} {item.unit}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-[#081c15]">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Address */}
        <div className="pt-4 border-t border-gray-100 text-xs">
          <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">
            Delivery Destination
          </span>
          <p className="font-bold text-[#081c15]">{order.deliveryAddress?.fullName} (📞 {order.deliveryAddress?.mobile})</p>
          <p className="text-gray-600">
            {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
          </p>
        </div>
      </div>
    </div>
  );
}

