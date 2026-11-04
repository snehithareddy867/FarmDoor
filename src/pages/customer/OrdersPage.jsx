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
  MapPin,
  FileText,
  Printer,
  X,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCart } from '../../context/CartContext';
import { handleImageError } from '../../utils/imageFallback';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useCustomerAuth();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'delivered', 'cancelled'
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalOrderId, setCancelModalOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of delivery plans');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
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
    if (!cancelModalOrderId) return;
    setCancelling(true);
    try {
      const res = await api.cancelOrder(cancelModalOrderId, cancelReason);
      if (res?.success !== false) {
        // Optimistically update orders in UI state
        setOrders((prev) =>
          prev.map((o) =>
            o.id === cancelModalOrderId || o.orderNumber === cancelModalOrderId
              ? { ...o, orderStatus: 'Cancelled', cancellationReason: cancelReason }
              : o
          )
        );
        setToastMessage(`Order #${cancelModalOrderId} has been cancelled successfully. Inventory restored.`);
        setCancelModalOrderId(null);
        await fetchOrders();
      } else {
        alert(res?.message || 'Failed to cancel order.');
      }
    } catch (err) {
      console.error('Order cancellation failed:', err);
      alert('Failed to cancel order. Please verify connection and retry.');
    } finally {
      setCancelling(false);
      setTimeout(() => setToastMessage(''), 4000);
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
                          alt={item.name || 'Order Item'}
                          loading="lazy"
                          onError={(e) => handleImageError(e, item.category)}
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
                        className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold transition-colors cursor-pointer"
                      >
                        Cancel Order
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3.5 py-2 rounded-xl bg-[#faf8f2] hover:bg-emerald-50 text-[#1b4332] font-bold border border-gray-200 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      title="View instant invoice and billing breakdown"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#2d6a4f]" />
                      <span>View Invoice Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instant Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedInvoiceOrder(null)}
          />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 space-y-6">
            {/* Invoice Top Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center font-outfit font-extrabold text-xl shadow-sm">
                  🌾
                </div>
                <div>
                  <h3 className="font-outfit font-extrabold text-xl text-[#081c15]">
                    FarmDoor Tax Invoice
                  </h3>
                  <p className="text-xs text-gray-500">
                    Direct Agricultural Produce Transfer Receipt &bull; Original For Recipient
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metadata Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#faf8f2] rounded-2xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Invoice Ref</span>
                <span className="font-mono font-bold text-[#081c15]">INV-{selectedInvoiceOrder.id}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Issue Date</span>
                <span className="font-bold text-[#081c15]">{new Date(selectedInvoiceOrder.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Order Status</span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mt-0.5 ${getStatusBadge(selectedInvoiceOrder.orderStatus)}`}>
                  {selectedInvoiceOrder.orderStatus}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Payment Method</span>
                <span className="font-bold text-emerald-800 uppercase">
                  {selectedInvoiceOrder.paymentMethod || 'UPI'} ({selectedInvoiceOrder.paymentStatus || 'Paid'})
                </span>
              </div>
            </div>

            {/* Billed To / Shipping Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-white rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Billed To (Customer)</span>
                <p className="font-bold text-[#081c15]">{selectedInvoiceOrder.shippingAddress?.fullName || selectedInvoiceOrder.customerName || user?.name || 'Customer'}</p>
                <p className="text-gray-600">📞 {selectedInvoiceOrder.shippingAddress?.mobile || selectedInvoiceOrder.customerPhone || user?.mobile || 'N/A'}</p>
                <p className="text-gray-600">
                  📍 {selectedInvoiceOrder.shippingAddress?.addressLine || selectedInvoiceOrder.deliveryAddress?.addressLine || 'Pune'}, {selectedInvoiceOrder.shippingAddress?.city || 'Pune'} - {selectedInvoiceOrder.shippingAddress?.pincode || '411045'}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Delivery & Origin Logistics</span>
                <p className="font-bold text-[#081c15]">
                  {selectedInvoiceOrder.deliveryMethod === 'farmer' ? 'Farmer Direct Harvest Transport' : 'Platform Regional Eco-Fleet'}
                </p>
                <p className="text-gray-600">
                  Slot: <strong>{selectedInvoiceOrder.deliverySlot || 'Morning 7:00 AM - 10:00 AM'}</strong>
                </p>
                {selectedInvoiceOrder.deliveryPartner?.assigned && (
                  <p className="text-emerald-800 font-semibold text-[11px]">
                    Dispatched Partner: {selectedInvoiceOrder.deliveryPartner.name} ({selectedInvoiceOrder.deliveryPartner.vehicleType})
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf8f2] text-gray-500 uppercase tracking-wider text-[10px] font-bold border-y border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Item / Produce</th>
                    <th className="py-2.5 px-3">Farm Origin</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {selectedInvoiceOrder.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 font-bold text-[#081c15]">
                        {item.name}
                      </td>
                      <td className="py-3 px-3 text-gray-500">
                        {item.farmerName || 'Cooperative'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        ₹{item.price}/{item.unit || 'kg'}
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        {item.quantity} {item.unit || 'kg'}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-[#081c15] font-mono">
                        ₹{item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Breakdown */}
            <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4 text-xs">
              <div className="text-gray-500 text-[11px] space-y-1">
                <p>• Zero middleman markup guaranteed.</p>
                <p>• Goods dispatched in compostable agro-packaging.</p>
                <p className="font-semibold text-emerald-800">Verified Direct Farm-to-Consumer Transaction.</p>
              </div>

              <div className="w-full sm:w-64 space-y-1.5 font-medium">
                <div className="flex justify-between text-gray-600">
                  <span>Produce Subtotal:</span>
                  <span className="font-mono">₹{selectedInvoiceOrder.subtotal || selectedInvoiceOrder.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || selectedInvoiceOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Farm Delivery Run:</span>
                  <span className="font-mono">{selectedInvoiceOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedInvoiceOrder.deliveryFee || 40}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Agro Facilitation:</span>
                  <span className="font-mono">₹{selectedInvoiceOrder.platformFee || 5}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#081c15] pt-2 border-t border-gray-200 font-outfit">
                  <span>Total Amount:</span>
                  <span className="text-[#1b4332] font-mono">₹{selectedInvoiceOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-gray-600" />
                <span>Print / Save PDF</span>
              </button>

              <div className="flex items-center gap-2">
                <Link
                  to={`/customer/orders/${selectedInvoiceOrder.id}/track`}
                  className="px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Truck className="w-4 h-4 text-[#74c69d]" />
                  <span>Track Progression</span>
                </Link>

                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Cancellation Modal */}
      {cancelModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !cancelling && setCancelModalOrderId(null)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-outfit font-extrabold text-lg text-[#081c15]">
              Cancel Order #{cancelModalOrderId}?
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Cancellation is permitted before farmers commence final transport dispatch. When confirmed, all reserved crops will be restored back to the farmer's inventory and any payment will be refunded.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Reason for Cancellation
              </label>
              <select
                disabled={cancelling}
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
                disabled={cancelling}
                onClick={() => setCancelModalOrderId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {cancelling ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Cancelling Order...</span>
                  </>
                ) : (
                  <span>Confirm Cancellation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

