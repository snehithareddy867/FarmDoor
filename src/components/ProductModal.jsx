import React, { useState } from 'react';
import { handleImageError } from '../utils/imageFallback';
import { 
  X, 
  Star, 
  MapPin, 
  User, 
  Clock, 
  Sparkles, 
  ShoppingCart, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Check 
} from 'lucide-react';

export default function ProductModal({ product, isOpen, onClose, onAddToCart, onNotify }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    onNotify(`Added ${quantity} × ${product.name} to your basket!`);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Image */}
          <div className="relative h-64 md:h-full bg-gray-100 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={(e) => handleImageError(e, product.category)}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-[#081c15]/85 backdrop-blur-md text-xs font-bold text-[#74c69d]">
                {product.tag}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
              <span className="bg-[#081c15]/75 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#e9d8a6] fill-[#e9d8a6]" />
                {product.rating} ({product.reviewsCount} reviews)
              </span>
            </div>
          </div>

          {/* Right Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Farmer Badge or Catalogue Badge */}
              {product.isCatalogue ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Farm Catalogue Reference {product.supplierVerified ? '• Verified Supplier' : '• Awaiting Local Farmer'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-[#40916c] font-bold mb-2">
                  <User className="w-3.5 h-3.5 text-[#52b788]" />
                  <span>Verified Harvest by {product.farmerName}</span>
                </div>
              )}

              <h3 className="font-outfit font-extrabold text-2xl text-[#081c15] leading-tight mb-2">
                {product.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{product.farmLocation || 'Regional Farming Basin'}</span>
              </div>

              {/* Quality & Grade tags */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-0.5 rounded-md bg-[#d8f3dc] text-[#1b4332] text-[11px] font-bold">
                  {product.grade || 'Grade A'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                  {product.organicStatus || (product.isOrganic ? '100% Organic' : 'Naturally Grown')}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium">
                  {product.availableQuantity} {product.unit} in stock
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-outfit font-extrabold text-3xl text-[#081c15]">
                  ₹{product.price}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  / {product.unit}
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Harvest details */}
              <div className="space-y-2 bg-[#faf8f2] p-3 rounded-2xl border border-gray-200 text-xs text-gray-600 mb-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 font-semibold text-gray-700">
                    <Clock className="w-3.5 h-3.5 text-[#40916c]" /> Harvest Time:
                  </span>
                  <span className="text-[#1b4332] font-bold">{product.harvestDate}</span>
                </div>
                {product.nutrition && (
                  <div className="flex items-start justify-between pt-1 border-t border-gray-200/60">
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <Sparkles className="w-3.5 h-3.5 text-[#e9d8a6]" /> Key Nutrition:
                    </span>
                    <span className="text-gray-700 text-right max-w-[150px]">{product.nutrition}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and CTA */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
              <div className="flex items-center gap-3 bg-[#faf8f2] rounded-xl border border-gray-200 px-3 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-gray-500 hover:text-black"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-[#081c15] w-4 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-gray-500 hover:text-black"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-[#52b788] text-white'
                    : 'bg-[#1b4332] hover:bg-[#2d6a4f] text-white shadow-lg'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Basket (₹{product.price * quantity})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

