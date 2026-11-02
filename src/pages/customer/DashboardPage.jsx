import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  ShoppingCart, 
  Heart, 
  Package, 
  Bell, 
  Star, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Leaf, 
  ChevronRight,
  Carrot,
  Apple,
  Milk,
  Wheat,
  Sprout,
  Plus,
  Check
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';

const categoryShortcuts = [
  { id: 'vegetables', name: 'Vegetables', icon: Carrot, color: 'bg-emerald-50 text-emerald-800' },
  { id: 'fruits', name: 'Fruits', icon: Apple, color: 'bg-amber-50 text-amber-800' },
  { id: 'dairy', name: 'Dairy', icon: Milk, color: 'bg-blue-50 text-blue-800' },
  { id: 'grains', name: 'Grains', icon: Wheat, color: 'bg-orange-50 text-orange-800' },
  { id: 'other farm products', name: 'Other Farm', icon: Sprout, color: 'bg-purple-50 text-purple-800' }
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useCustomerAuth();
  const { cartCount, addToCart } = useCart();
  const { wishlistCount, toggleWishlist, isInWishlist } = useWishlist();
  const { notifications } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [seasonalProducts, setSeasonalProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState({});

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [prodRes, farmerData, orderData] = await Promise.all([
          api.getProducts(),
          api.getFarmers(),
          api.getOrders(user?.id)
        ]);

        const allProds = prodRes.products || [];
        setFeaturedProducts(allProds.filter((p) => p.isFeatured).slice(0, 4));
        setRecentProducts(allProds.slice(0, 4));
        setSeasonalProducts(allProds.filter((p) => p.isSeasonal).slice(0, 4));
        setFarmers(farmerData.slice(0, 3));
        setRecentOrders((orderData || []).slice(0, 2));
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/customer/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const res = addToCart(product, 1);
    if (res.success) {
      setAddedIds((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [product.id]: false }));
      }, 1200);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Top Welcome & Overview Header */}
      <div className="bg-gradient-to-r from-[#081c15] via-[#133926] to-[#1b4332] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#2d6a4f]/50 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#52b788]/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d6a4f]/70 text-[#95d5b2] text-[11px] font-bold uppercase tracking-wider mb-2 border border-[#52b788]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#e9d8a6]" />
              Welcome to Your Fresh Harvest Hub
            </div>
            <h1 className="font-outfit text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Hello, {user?.fullName?.split(' ')[0] || 'Friend'}! 🌾
            </h1>
            <p className="text-xs sm:text-sm text-[#d8f3dc]/90 mt-1 max-w-xl">
              Fresh produce harvested this dawn from {farmers.length || 'local'} family farms around {user?.city || 'your region'}.
            </p>
          </div>

          {/* Quick Stat Pill Shortcuts */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link
              to="/customer/cart"
              className="bg-white/10 hover:bg-white/20 border border-white/10 px-3.5 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all"
            >
              <ShoppingCart className="w-4 h-4 text-[#52b788]" />
              <span>Cart ({cartCount})</span>
            </Link>

            <Link
              to="/customer/wishlist"
              className="bg-white/10 hover:bg-white/20 border border-white/10 px-3.5 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all"
            >
              <Heart className="w-4 h-4 text-[#e07a5f]" />
              <span>Saved ({wishlistCount})</span>
            </Link>

            <Link
              to="/customer/orders"
              className="bg-[#52b788] hover:bg-[#74c69d] text-[#081c15] px-4 py-2.5 rounded-2xl flex items-center gap-1.5 text-xs font-extrabold shadow-md transition-all"
            >
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </Link>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 relative max-w-2xl">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fresh vegetables, fruits, A2 dairy, stone-ground flours, or farmers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#52b788] shadow-lg"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* 2. Promotional Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-[#d8f3dc] to-[#b7e4c7] p-5 rounded-3xl border border-[#74c69d]/40 flex items-center justify-between shadow-sm">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1b4332] text-white text-[10px] font-bold uppercase tracking-wider">
              Dawn Harvest Special
            </span>
            <h3 className="font-outfit font-bold text-base sm:text-lg text-[#081c15] mt-1.5">
              15% Off Your Farm Basket
            </h3>
            <p className="text-xs text-[#1b4332] mt-0.5">
              Use code <strong className="underline">FARMFRESH</strong> at checkout.
            </p>
          </div>
          <Link
            to="/customer/marketplace"
            className="px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-all shadow-md shrink-0 ml-3"
          >
            Shop Now
          </Link>
        </div>

        <div className="bg-[#fff9eb] p-5 rounded-3xl border border-amber-200/70 flex items-center justify-between shadow-sm">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-800 text-white text-[10px] font-bold uppercase tracking-wider">
              Doorstep Eco Dispatch
            </span>
            <h3 className="font-outfit font-bold text-base sm:text-lg text-amber-950 mt-1.5">
              Free Delivery on Orders Over ₹499
            </h3>
            <p className="text-xs text-amber-900 mt-0.5">
              Insulated reusable bamboo crates dispatched daily.
            </p>
          </div>
          <Link
            to="/customer/marketplace"
            className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-all shadow-md shrink-0 ml-3"
          >
            Explore
          </Link>
        </div>
      </div>

      {/* 3. Category Shortcuts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-outfit font-extrabold text-xl text-[#081c15]">
            Browse by Farm Category
          </h2>
          <Link
            to="/customer/marketplace"
            className="text-xs font-bold text-[#2d6a4f] hover:text-[#52b788] flex items-center gap-1"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {categoryShortcuts.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/customer/marketplace?cat=${cat.id}`}
                className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#52b788] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
              >
                <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-outfit font-bold text-xs text-[#081c15] group-hover:text-[#2d6a4f]">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Active Orders Tracking Alert (If any) */}
      {recentOrders.length > 0 && recentOrders.some((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled') && (
        <div className="bg-[#081c15] text-white p-5 rounded-3xl border border-[#2d6a4f] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#52b788]/20 flex items-center justify-center shrink-0 border border-[#52b788]/30">
              <Package className="w-5 h-5 text-[#52b788]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Active Order #{recentOrders[0].id}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#52b788]/20 text-[#74c69d] text-[10px] font-bold">
                  {recentOrders[0].orderStatus}
                </span>
              </div>
              <p className="text-xs text-[#95d5b2] mt-0.5">
                {recentOrders[0].items.length} items • Estimated: {recentOrders[0].estimatedDelivery}
              </p>
            </div>
          </div>
          <Link
            to={`/customer/orders/${recentOrders[0].id}/track`}
            className="px-4 py-2 rounded-xl bg-[#52b788] text-[#081c15] text-xs font-bold hover:bg-[#74c69d] transition-colors whitespace-nowrap"
          >
            Track Delivery Progression
          </Link>
        </div>
      )}

      {/* 5. Featured Available Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-outfit font-extrabold text-xl text-[#081c15]">
              Featured Dawn Harvests
            </h2>
            <p className="text-xs text-gray-500">Curated organic crops handpicked today</p>
          </div>
          <Link
            to="/customer/marketplace"
            className="text-xs font-bold text-[#2d6a4f] hover:text-[#52b788] flex items-center gap-1"
          >
            Browse Marketplace <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-xs text-gray-500">No featured products currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => navigate(`/customer/product/${prod.id}`)}
                className="group bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={prod.images?.[0] || prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#081c15]/85 backdrop-blur-md text-[10px] font-bold text-[#74c69d]">
                      {prod.harvestDate || 'Harvested Today'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod);
                    }}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isInWishlist(prod.id)
                        ? 'bg-red-50 text-red-500'
                        : 'bg-white/80 text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isInWishlist(prod.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                      <span className="font-semibold text-[#1b4332]">{prod.farmerName}</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {prod.rating}
                      </span>
                    </div>

                    <h3 className="font-outfit font-bold text-sm text-[#081c15] group-hover:text-[#2d6a4f] transition-colors leading-snug line-clamp-1">
                      {prod.name}
                    </h3>

                    <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {prod.farmLocation}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="font-outfit font-extrabold text-base text-[#081c15]">
                        ₹{prod.price}
                      </span>
                      <span className="text-[11px] text-gray-500"> / {prod.unit}</span>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(e, prod)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                        addedIds[prod.id]
                          ? 'bg-[#52b788] text-white scale-95'
                          : 'bg-[#1b4332] hover:bg-[#2d6a4f] text-white'
                      }`}
                    >
                      {addedIds[prod.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Nearby Verified Farmers Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#40916c] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              Verified Local Agricultural Partners
            </div>
            <h2 className="font-outfit font-extrabold text-xl text-[#081c15]">
              Meet Nearby Farmers in Your State
            </h2>
          </div>
          <Link
            to="/customer/marketplace"
            className="text-xs font-bold text-[#2d6a4f] hover:text-[#52b788] flex items-center gap-1"
          >
            All Growers <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {farmers.map((farmer) => (
            <div
              key={farmer.id}
              onClick={() => navigate(`/customer/farmer/${farmer.id}`)}
              className="bg-[#faf8f2] rounded-2xl p-5 border border-gray-200/80 hover:border-[#52b788] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-3">
                  <img
                    src={farmer.avatar}
                    alt={farmer.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-[#52b788]"
                  />
                  <div>
                    <h3 className="font-outfit font-bold text-sm text-[#081c15] group-hover:text-[#2d6a4f]">
                      {farmer.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {farmer.location}
                    </p>
                  </div>
                </div>

                <div className="inline-block px-2 py-0.5 rounded-full bg-[#d8f3dc] text-[#1b4332] text-[10px] font-bold mb-2">
                  {farmer.verificationBadge}
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {farmer.bio}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs font-bold text-[#1b4332]">
                <span className="flex items-center gap-1 text-[11px] text-amber-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {farmer.rating} ({farmer.totalReviews} reviews)
                </span>
                <span className="text-[#2d6a4f] group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                  View Farm Profile <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Seasonal Produce Strip */}
      {seasonalProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-outfit font-extrabold text-xl text-[#081c15]">
                Seasonal Agricultural Highlights
              </h2>
              <p className="text-xs text-gray-500">Limited seasonal crops currently in peak harvest</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {seasonalProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => navigate(`/customer/product/${prod.id}`)}
                className="group bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={prod.images?.[0] || prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold shadow">
                      Limited Season
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-outfit font-bold text-sm text-[#081c15] leading-snug line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      By {prod.farmerName} • {prod.farmLocation}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="font-outfit font-extrabold text-base text-[#081c15]">
                        ₹{prod.price}
                      </span>
                      <span className="text-[11px] text-gray-500"> / {prod.unit}</span>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(e, prod)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                        addedIds[prod.id] ? 'bg-[#52b788] text-white' : 'bg-[#1b4332] text-white'
                      }`}
                    >
                      {addedIds[prod.id] ? 'Added' : '+ Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

