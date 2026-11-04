import React, { useState } from 'react';
import { api } from '../services/api';
import { handleImageError } from '../utils/imageFallback';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  CheckCircle2 
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onClearCart,
  onNotify
}) {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 25 || subtotal === 0 ? 0 : 2.50;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const applyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const res = await api.validateCoupon(couponCode, subtotal);
      if (res.success && res.coupon) {
        setDiscountPercent(res.coupon.discountPercent);
        setCouponApplied(true);
        onNotify(res.message || `${res.coupon.discountPercent}% discount applied!`);
      } else {
        onNotify(res.message || 'Invalid or expired promo code.');
      }
    } catch {
      onNotify('Failed to validate promo code.');
    }
  };

  const handleCheckout = () => {
    setCheckoutComplete(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 bg-[#081c15] text-white flex items-center justify-between border-b border-[#1b4332]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#52b788]/20 flex items-center justify-center border border-[#52b788]/30">
                <ShoppingBag className="w-5 h-5 text-[#52b788]" />
              </div>
              <div>
                <h2 className="font-outfit font-bold text-lg leading-tight">Your Farm Basket</h2>
                <p className="text-xs text-[#95d5b2]">
                  {cartItems.length} {cartItems.length === 1 ? 'variety' : 'varieties'} selected
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {checkoutComplete ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center mb-4 shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-[#40916c]" />
                </div>
                <h3 className="font-outfit text-2xl font-bold text-[#081c15] mb-2">Order Confirmed!</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-xs">
                  Your harvest request has been sent to our verified farmers. They will harvest fresh at sunrise for your delivery.
                </p>
                <div className="bg-[#faf8f2] p-4 rounded-2xl border border-gray-200 text-xs text-gray-600 text-left w-full mb-6">
                  <p className="font-bold text-[#1b4332] mb-1">Demonstration Notice:</p>
                  <p>In this project demo, order checkout is simulated without real credit card charges.</p>
                </div>
                <button
                  onClick={() => {
                    setCheckoutComplete(false);
                    onClearCart();
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-[#1b4332] text-white font-bold text-sm hover:bg-[#2d6a4f] transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-[#faf8f2] flex items-center justify-center mb-4 text-gray-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-outfit font-bold text-lg text-gray-800 mb-1">Your basket is empty</h3>
                <p className="text-xs text-gray-500 mb-6 max-w-xs">
                  Add fresh seasonal vegetables, fruits, dairy, or grains from our featured harvests.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] transition-colors"
                >
                  Explore Harvests
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3.5 rounded-2xl bg-[#faf8f2] border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => handleImageError(e, item.category)}
                      className="w-18 h-18 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-outfit font-bold text-sm text-[#081c15] leading-snug">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-gray-500">
                            By {item.farmerName} • ${item.price.toFixed(2)} / {item.unit}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/60">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center text-[#081c15]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-outfit font-bold text-sm text-[#081c15]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Input */}
                <form onSubmit={applyCoupon} className="pt-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Coupon (try FARMFRESH)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#40916c]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#1b4332] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] text-[#2d6a4f] font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#52b788]" /> 15% promotional discount active!
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {!checkoutComplete && cartItems.length > 0 && (
            <div className="p-6 bg-[#faf8f2] border-t border-gray-200 space-y-4">
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#081c15]">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2d6a4f] font-semibold">
                    <span>Discount (15%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Farm Dispatch & Eco-crate Delivery</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong className="text-[#2d6a4f] font-bold">FREE (over $25)</strong>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 text-base font-extrabold text-[#081c15]">
                  <span>Total Amount</span>
                  <span className="font-outfit text-xl text-[#1b4332]">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#2d6a4f] bg-[#d8f3dc]/60 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-[#40916c] shrink-0" />
                <span>Over 85% goes directly to the growers' bank accounts.</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Proceed to Checkout (${total.toFixed(2)})
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

