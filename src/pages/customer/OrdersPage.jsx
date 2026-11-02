import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ChevronRight, 
  RotateCcw, 
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  User,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCart } from '../../context/CartContext';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useCustomerAuth();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'delivered', 'cancelled'
  const [loading, setLoading] = useState(true);
  const [cancelModalOrderId, setCancelModalOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of delivery plans');
  const [toastMessage, setToastMessage] = useState('');

  const fetchOrders = async () => {
    if (user?.id) {
      setLoading(true);
      try {
        const data = await api.getOrders(user.id);
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load customer orders:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async () => {
    if (cancelModalOrderId) {
      await api.cancelOrder(cancelModalOrderId, cancelReason);
      setCancelModalOrderId(null);
      setToastMessage('Order has been cancelled successfully.');
      fetchOrders();
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleReorder = (order) => {
    let readdedCount = 0;
    order.items?.forEach((item) => {
      const res = addToCart({
        id: item.productId,
        name: item.name,
        price: item.price,
        unit: item.unit,
        farmerName: item.farmerName,
        farmLocation: item.farmLocation,
        image: item.image,
        availableQuantity: 50
      }, item.quantity);
      if (res.success) readdedCount++;
    });

    setToastMessage(`Re-added ${readdedCount} items to your basket.`);
    navigate('/customer/cart');
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'active') {
      return o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled';
    }
    if (activeTab === 'delivered') {
      return o.orderStatus === 'Delivered';
    }
    if (activeTab === 'cancelled') {
      return o.orderStatus === 'Cancelled';
    }
    return true; // all
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Out for delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse';
      case 'Picked up':
      case 'Ready for pickup':
      case 'Preparing':
      case 'Confirmed':
      case 'Placed':
        return 'bg-[#d8f3dc] text-[#1b4332] border-[#74c69d]/40';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-[#081c15]">
            My Farm Harvest Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Review your order history, live delivery milestones, and reorder favourite seasonal crops.
          </p>
        </div>

        <Link
          to="/customer/marketplace"
          className="px-5 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" /> Start New Order
        </Link>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: `All Orders (${orders.length})` },
          { id: 'active', label: `Active (${orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length})` },
          { id: 'delivered', label: `Delivered (${orders.filter((o) => o.orderStatus === 'Delivered').length})` },
          { id: 'cancelled', label: `Cancelled (${orders.filter((o) => o.orderStatus === 'Cancelled').length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#1b4332] text-white shadow-sm'
                : 'text-gray-600 hover:bg-[#faf8f2]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-gray-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300 p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#faf8f2] text-gray-400 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-[#52b788]" />
          </div>
          <h3 className="font-outfit font-bold text-lg text-[#081c15] mb-1">
            No Orders in this Category
          </h3>
          <p className="text-xs text-gray-500 mb-6">You have no {activeTab !== 'all' ? activeTab : ''} orders recorded yet.</p>
          <Link
            to="/customer/marketplace"
            className="px-6 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const isCancellable = order.orderStatus === 'Placed' || order.orderStatus === 'Confirmed';
            const isActive = order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="font-outfit font-extrabold text-base text-[#081c15]">
                      Order #{order.id}
                    </span>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 flex items-center gap-3">
                    <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="font-extrabold text-[#081c15] text-sm">
                      Total: ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img
                          src={item.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#081c15] leading-snug">{item.name}</p>
                          <p className="text-[11px] text-gray-500">
                            By {item.farmerName} • Qty: {item.quantity} {item.unit} (₹{item.price * item.quantity})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Partner Summary */}
                  <div className="bg-[#faf8f2] p-4 rounded-2xl border border-gray-100 text-xs space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between font-bold text-[#081c15] mb-1">
                        <span className="flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-[#40916c]" />
                          {order.deliveryMethod === 'farmer' ? 'Farmer Direct Run' : 'Platform Eco-Fleet'}
                        </span>
                        <span className="text-[#2d6a4f] text-[11px]">{order.estimatedDelivery}</span>
                      </div>
                      <p className="text-gray-600 truncate">
                        📍 {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city}
                      </p>
                      {order.deliveryPartner?.assigned && (
                        <p className="text-[#1b4332] font-semibold mt-1">
                          Assigned Partner: {order.deliveryPartner.name} ({order.deliveryPartner.vehicleType})
                        </p>
                      )}
                    </div>

                    <p className="text-[11px] text-gray-500 pt-2 border-t border-gray-200">
                      Payment: <strong>{order.paymentMethod?.toUpperCase()}</strong> ({order.paymentStatus})
                    </p>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <Link
                        to={`/customer/orders/${order.id}/track`}
                        className="px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#52b788]" />
                        <span>Track Live Progression</span>
                      </Link>
                    )}

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1b4332] font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reorder Basket
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCancellable && (
                      <button
                        onClick={() => setCancelModalOrderId(order.id)}
                        className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}

                    <Link
                      to={`/customer/order-confirmation/${order.id}`}
                      className="text-gray-500 hover:text-black font-semibold flex items-center gap-0.5"
                    >
                      View Invoice Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Cancellation Modal */}
      {cancelModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCancelModalOrderId(null)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-outfit font-extrabold text-lg text-[#081c15]">
              Cancel Order #{cancelModalOrderId}?
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Cancellation is permitted before farmers commence final transport dispatch. If you already made an online payment, a full refund will be processed back to your original source method.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-[#faf8f2]"
              >
                <option value="Change of delivery plans">Change of delivery plans / Traveling</option>
                <option value="Ordered duplicate items">Ordered duplicate items by mistake</option>
                <option value="Need different delivery slot">Need different delivery slot</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelModalOrderId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

