import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Plus, 
  Truck, 
  User, 
  CreditCard, 
  Banknote, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, addresses, addAddress } = useCustomerAuth();
  const { cart, subtotal, deliveryFee, total, clearCart, deliveryMethod, setDeliveryMethod } = useCart();

  const discountPercent = location.state?.discountPercent || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, total - discountAmount);

  // Address selection
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0] || null;
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddr?.id || '');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New address form state
  const [newAddr, setNewAddr] = useState({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    addressLine: '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    label: 'Home'
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-outfit font-extrabold text-2xl text-[#081c15] mb-2">No Items to Checkout</h2>
        <p className="text-sm text-gray-500 mb-6">Your harvest basket is currently empty.</p>
        <Link
          to="/customer/marketplace"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Marketplace
        </Link>
      </div>
    );
  }

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newAddr.addressLine || !newAddr.city || !newAddr.pincode) {
      alert('Please fill all required address fields.');
      return;
    }
    const createdId = `addr-${Date.now()}`;
    addAddress({ ...newAddr, id: createdId, isDefault: false });
    setSelectedAddressId(createdId);
    setShowNewAddressForm(false);
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || defaultAddr;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setOrderError('Please select or enter a delivery address.');
      return;
    }

    const unverifiedItem = cart.find((item) => item.isCatalogue && !item.supplierVerified);
    if (unverifiedItem) {
      setOrderError(`"${unverifiedItem.name}" is a catalogue demonstration item without an assigned verified farmer supplier. Please remove it from your basket to complete checkout.`);
      return;
    }

    // Duplicate order prevention
    if (isSubmitting) return;
    setIsSubmitting(true);
    setOrderError('');

    try {
      const orderPayload = {
        customerId: user.id,
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.mobile,
        deliveryAddress: selectedAddress,
        deliveryMethod: deliveryMethod,
        deliveryFee: deliveryFee,
        subtotal: subtotal,
        discount: discountAmount,
        totalAmount: finalTotal,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'online' ? 'Paid' : 'Pending COD',
        orderStatus: 'Placed',
        estimatedDelivery: deliveryMethod === 'farmer' ? 'Tomorrow, 7:00 AM - 10:00 AM' : 'Today, 2:00 PM - 5:00 PM',
        deliveryPartner: {
          assigned: false,
          name: '',
          phone: '',
          vehicleType: ''
        },
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          farmerId: item.farmerId,
          farmerName: item.farmerName,
          farmLocation: item.farmLocation,
          image: item.image
        })),
        trackingTimeline: [
          {
            status: 'Placed',
            timestamp: new Date().toISOString(),
            note: paymentMethod === 'online'
              ? 'Order placed with online payment verification.'
              : 'Order placed with Cash on Delivery option.'
          }
        ]
      };

      const placedOrder = await api.createOrder(orderPayload);
      clearCart();
      navigate(`/customer/order-confirmation/${placedOrder.id}`, { state: { order: placedOrder } });
    } catch (err) {
      setOrderError('Failed to place order. Please check connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <Link
          to="/customer/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d6a4f] hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
        <h1 className="font-outfit text-3xl font-extrabold text-[#081c15]">
          Finalize Farm Order & Delivery
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Select destination address, delivery preference, and payment confirmation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Address, Delivery Method, Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {orderError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{orderError}</span>
            </div>
          )}

          {/* 1. Address Section */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-outfit font-extrabold text-lg text-[#081c15] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#52b788]" />
                1. Delivery Destination
              </h2>
              <button
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="text-xs font-bold text-[#2d6a4f] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> {showNewAddressForm ? 'Cancel' : 'Add New Address'}
              </button>
            </div>

            {/* Saved Addresses List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#52b788] bg-[#d8f3dc]/30 ring-2 ring-[#52b788]/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#081c15]">{addr.fullName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold">
                          {addr.label || 'Home'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mb-2">
                        {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">📞 {addr.mobile}</p>
                  </div>
                );
              })}
            </div>

            {/* Add New Address Form Modal/Inline */}
            {showNewAddressForm && (
              <form onSubmit={handleAddNewAddress} className="mt-4 p-5 rounded-2xl bg-[#faf8f2] border border-gray-200 space-y-3">
                <h4 className="font-bold text-xs text-[#081c15]">Add Delivery Location</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="p-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit Mobile"
                    value={newAddr.mobile}
                    onChange={(e) => setNewAddr({ ...newAddr, mobile: e.target.value })}
                    className="p-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Street / Flat / House Address"
                  value={newAddr.addressLine}
                  onChange={(e) => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="p-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="p-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="6-digit Pincode"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="p-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f]"
                >
                  Save & Use This Address
                </button>
              </form>
            )}
          </div>

          {/* 2. Delivery Method Selection */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-outfit font-extrabold text-lg text-[#081c15] flex items-center gap-2 pb-3 border-b border-gray-100">
              <Truck className="w-5 h-5 text-[#52b788]" />
              2. Delivery Logistics Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setDeliveryMethod('platform')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryMethod === 'platform'
                    ? 'border-[#52b788] bg-[#d8f3dc]/30 ring-2 ring-[#52b788]/20'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#081c15]">Platform Eco-Fleet</span>
                    <span className="font-extrabold text-xs text-[#1b4332]">
                      {subtotal >= 499 ? 'FREE' : '₹40'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Dispatched from regional temperature-controlled sorting hub with electric carriers.
                  </p>
                </div>
                <span className="text-[11px] text-[#2d6a4f] font-semibold mt-3 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Slot: Today, 2:00 PM - 5:00 PM
                </span>
              </div>

              <div
                onClick={() => setDeliveryMethod('farmer')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryMethod === 'farmer'
                    ? 'border-[#52b788] bg-[#d8f3dc]/30 ring-2 ring-[#52b788]/20'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#081c15]">Farmer-Managed Run</span>
                    <span className="font-extrabold text-xs text-[#1b4332]">
                      {subtotal >= 699 ? 'FREE' : '₹50'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Direct morning transport managed by our farmer co-op from farm gate to your building.
                  </p>
                </div>
                <span className="text-[11px] text-[#2d6a4f] font-semibold mt-3 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Slot: Tomorrow, 7:00 AM - 10:00 AM
                </span>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-outfit font-extrabold text-lg text-[#081c15] flex items-center gap-2 pb-3 border-b border-gray-100">
              <Banknote className="w-5 h-5 text-[#52b788]" />
              3. Payment Selection
            </h2>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#52b788] bg-[#d8f3dc]/30 ring-2 ring-[#52b788]/20'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="h-4 w-4 text-[#2d6a4f]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#081c15] block">
                      Cash on Delivery (COD) / UPI at Doorstep
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Inspect fresh produce upon arrival before handing payment.
                    </span>
                  </div>
                </div>
                <Banknote className="w-5 h-5 text-[#40916c]" />
              </label>

              <label
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'online'
                    ? 'border-[#52b788] bg-[#d8f3dc]/30 ring-2 ring-[#52b788]/20'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="h-4 w-4 text-[#2d6a4f]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#081c15] block">
                      Online Payment (UPI, Cards & NetBanking)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Simulated secure gateway confirmation with escrow release to farmer.
                    </span>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-[#40916c]" />
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Review & Place Button (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-outfit font-extrabold text-lg text-[#081c15] pb-3 border-b border-gray-100">
            Order Review ({cart.length} items)
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover bg-gray-100"
                  />
                  <div>
                    <h5 className="font-bold text-[#081c15] line-clamp-1">{item.name}</h5>
                    <p className="text-[11px] text-gray-500">
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[#081c15]">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Crops Subtotal</span>
              <span className="font-bold text-[#081c15]">₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Promotional Discount (15%)</span>
                <span>-₹{discountAmount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee ({deliveryMethod === 'farmer' ? 'Farmer' : 'Platform'})</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-extrabold text-[#081c15]">
              <span>Payable Total</span>
              <span className="font-outfit text-xl text-[#1b4332]">₹{finalTotal.toFixed(0)}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#74c69d]/40 text-xs text-[#1b4332] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#40916c]" />
              <span>Consumer & Farmer Protection Guarantee</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              If produce is damaged or not garden fresh, instant doorstep refund/replacement is honored.
            </p>
          </div>

          {/* Place Order CTA with Duplicate Order Prevention */}
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || !selectedAddress}
            className="w-full py-4 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-sm shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span>Placing & Routing to Farmers...</span>
            ) : (
              <>
                <span>Confirm & Place Order (₹{finalTotal.toFixed(0)})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

