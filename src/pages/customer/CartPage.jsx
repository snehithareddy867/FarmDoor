import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  User, 
  AlertTriangle,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { handleImageError } from '../../utils/imageFallback';

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    deliveryFee, 
    total,
    deliveryMethod,
    setDeliveryMethod
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (!promoCode.trim()) {
      setPromoError('Please enter a coupon code.');
      return;
    }
    try {
      const res = await api.validateCoupon(promoCode, subtotal);
      if (res.success && res.coupon) {
        setDiscountPercent(res.coupon.discountPercent);
        setPromoSuccess(res.message || `${res.coupon.discountPercent}% discount applied!`);
      } else {
        setPromoError(res.message || 'Invalid or expired coupon code.');
        setDiscountPercent(0);
      }
    } catch {
      setPromoError('Failed to validate coupon code.');
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, total - discountAmount);

  // Check if any cart item exceeds available stock or is an unverified catalogue item
  const hasStockIssue = cart.some((item) => item.quantity > item.availableQuantity);
  const hasUnverifiedCatalogueItem = cart.some((item) => item.isCatalogue && !item.supplierVerified);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-[#081c15]">
            Your Fresh Harvest Basket
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {cart.length} {cart.length === 1 ? 'farm item' : 'farm items'} selected directly from local growers.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-500 hover:text-red-700 self-start sm:self-auto flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Empty Basket
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300 p-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#faf8f2] text-gray-400 flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-[#52b788]" />
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-[#081c15] mb-2">
            Your Basket is Empty
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
            Support local family farmers by filling your basket with hand-harvested vegetables, fruits, dairy, and grains.
          </p>
          <Link
            to="/customer/marketplace"
            className="px-6 py-3 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Browse Fresh Produce
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {hasUnverifiedCatalogueItem && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  <strong>Catalogue Notice:</strong> Your basket contains agricultural catalogue demonstration items that do not yet have an assigned verified farmer supplier. Please remove them to proceed with order checkout.
                </span>
              </div>
            )}

            {hasStockIssue && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Some items exceed available grower stock. Please reduce quantity to proceed.</span>
              </div>
            )}

            {cart.map((item) => {
              const exceedsStock = item.quantity > item.availableQuantity;
              const isUnverifiedCatalogue = item.isCatalogue && !item.supplierVerified;

              return (
                <div
                  key={item.id}
                  className={`bg-white p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
                    exceedsStock || isUnverifiedCatalogue ? 'border-amber-300 bg-amber-50/20' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => handleImageError(e, item.category)}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-gray-100"
                    />
                    <div>
                      {item.isCatalogue ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md border border-amber-200 mb-1">
                          Farm Catalogue {item.supplierVerified ? '• Verified Supplier' : '• Demo Commodity'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#40916c] uppercase tracking-wider block mb-0.5">
                          Farmer: {item.farmerName}
                        </span>
                      )}
                      <h3 className="font-outfit font-bold text-base text-[#081c15] leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ₹{item.price} per {item.unit}
                      </p>
                      {item.grade && (
                        <span className="text-[10px] font-semibold text-gray-600 block mt-0.5">
                          Grade: {item.grade}
                        </span>
                      )}
                      {item.availableQuantity < 10 && (
                        <span className="text-[10px] font-bold text-amber-700 block mt-0.5">
                          Only {item.availableQuantity} {item.unit} remaining in stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controls: Quantity + Price + Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-[#faf8f2] border border-gray-200 rounded-xl px-2.5 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-black p-1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-outfit font-bold text-xs w-6 text-center text-[#081c15]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.availableQuantity}
                        className="text-gray-500 hover:text-black p-1 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="font-outfit font-extrabold text-base text-[#081c15] w-20 text-right">
                      ₹{item.price * item.quantity}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <Link
                to="/customer/marketplace"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1b4332] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Shopping for More Crops
              </Link>
            </div>
          </div>

          {/* Order Summary & Delivery Method Selector (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-outfit font-extrabold text-lg text-[#081c15] pb-3 border-b border-gray-100">
              Basket Summary
            </h3>

            {/* Delivery Method Choice */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Select Delivery Method
              </label>

              <div
                onClick={() => setDeliveryMethod('platform')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  deliveryMethod === 'platform'
                    ? 'border-[#52b788] bg-[#d8f3dc]/30'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Truck className="w-4 h-4 text-[#40916c] mt-0.5" />
                <div className="text-xs">
                  <div className="flex items-center justify-between font-bold text-[#081c15]">
                    <span>Platform Eco-Fleet</span>
                    <span>{subtotal >= 499 ? 'FREE' : '₹40'}</span>
                  </div>
                  <p className="text-[11px] text-gray-500">Temperature-controlled local hub dispatch</p>
                </div>
              </div>

              <div
                onClick={() => setDeliveryMethod('farmer')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  deliveryMethod === 'farmer'
                    ? 'border-[#52b788] bg-[#d8f3dc]/30'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4 text-[#40916c] mt-0.5" />
                <div className="text-xs">
                  <div className="flex items-center justify-between font-bold text-[#081c15]">
                    <span>Farmer-Direct Delivery</span>
                    <span>{subtotal >= 699 ? 'FREE' : '₹50'}</span>
                  </div>
                  <p className="text-[11px] text-gray-500">Direct morning run by farmer collective</p>
                </div>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Coupon (try FARMFRESH)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-[#faf8f2]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#1b4332]"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && <p className="text-[11px] text-emerald-700 font-semibold">{promoSuccess}</p>}
              {promoError && <p className="text-[11px] text-red-600 font-semibold">{promoError}</p>}
            </form>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Produce Subtotal</span>
                <span className="font-bold text-[#081c15]">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Farm Promo (15%)</span>
                  <span>-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-gray-200 text-sm font-extrabold text-[#081c15]">
                <span>Total Amount</span>
                <span className="font-outfit text-xl text-[#1b4332]">₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#faf8f2] border border-[#74c69d]/40 text-[11px] text-[#1b4332] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#40916c] shrink-0" />
              <span>Over 85% of your bill directly supports our partnered growers.</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/customer/checkout', { state: { discountPercent } })}
              disabled={hasStockIssue || hasUnverifiedCatalogueItem || cart.length === 0}
              className="w-full py-4 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-sm shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{hasUnverifiedCatalogueItem ? 'Remove Demo Items to Checkout' : 'Proceed to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

