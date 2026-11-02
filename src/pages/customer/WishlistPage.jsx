import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowLeft, Star, MapPin, AlertCircle, Package } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-[#081c15]">
            My Saved Farm Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {wishlist.length} {wishlist.length === 1 ? 'crop saved' : 'crops saved'} for upcoming harvest orders.
          </p>
        </div>

        <Link
          to="/customer/marketplace"
          className="text-xs font-bold text-[#2d6a4f] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300 p-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#faf8f2] text-gray-400 flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-[#081c15] mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
            Click the heart icon on any crop in the marketplace to bookmark seasonal vegetables, fruits, and dairy for quick orders.
          </p>
          <Link
            to="/customer/marketplace"
            className="px-6 py-3 rounded-2xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] transition-all"
          >
            Explore Farm Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const isOutOfStock = item.availableQuantity <= 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {isOutOfStock ? (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                        Temporarily Sold Out
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#081c15]/80 text-[#74c69d] text-[10px] font-bold">
                        {item.availableQuantity} in stock
                      </span>
                    )}

                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-500 hover:text-red-500 flex items-center justify-center shadow-md transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] text-gray-500 block mb-0.5">
                      Grown by {item.farmerName}
                    </span>
                    <h3
                      onClick={() => navigate(`/customer/product/${item.id}`)}
                      className="font-outfit font-bold text-base text-[#081c15] hover:text-[#2d6a4f] cursor-pointer line-clamp-1 mb-1"
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {item.farmLocation}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="font-outfit font-extrabold text-lg text-[#081c15]">
                      ₹{item.price}
                    </span>
                    <span className="text-xs text-gray-500"> / {item.unit}</span>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={isOutOfStock}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isOutOfStock
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#1b4332] hover:bg-[#2d6a4f] text-white shadow-sm'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

