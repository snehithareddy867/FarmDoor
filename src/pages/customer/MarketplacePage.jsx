import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  MapPin, 
  User, 
  Heart, 
  Plus, 
  Check, 
  Filter, 
  X, 
  RefreshCw, 
  PackageX, 
  Sparkles,
  ArrowUpDown,
  Carrot,
  Apple,
  Milk,
  Wheat,
  Sprout
} from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { storageService } from '../../services/storage';

export default function MarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Search and Filter States from URL or local state
  const initialCat = searchParams.get('cat') || 'all';
  const initialQ = searchParams.get('q') || '';

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [sourceFilter, setSourceFilter] = useState('all'); // 'all' | 'farmer' | 'catalogue'
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [displayCount, setDisplayCount] = useState(12);

  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedIds, setAddedIds] = useState({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load Products, Categories and Farmers from MongoDB
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const [prodRes, catRes, farmerRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getFarmers()
      ]);
      setProducts(prodRes.products || []);
      setCategories(Array.isArray(catRes) ? catRes : []);
      setFarmers(farmerRes || []);
    } catch (err) {
      setError('Unable to load agricultural listings. Please check connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync category or search query from URL params
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Filtered & Sorted Listings
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Source filter: all vs verified farmer vs farm catalogue
      if (sourceFilter === 'farmer' && p.isCatalogue) return false;
      if (sourceFilter === 'catalogue' && !p.isCatalogue) return false;

      // Category filter
      if (selectedCategory !== 'all') {
        const pCat = (p.category || '').toLowerCase();
        const selCat = selectedCategory.toLowerCase();
        const isDirectMatch = pCat === selCat || pCat.includes(selCat) || selCat.includes(pCat);
        const isAliasMatch =
          (selCat.includes('dairy') && pCat.includes('dairy')) ||
          (selCat.includes('grain') && pCat.includes('grain')) ||
          (selCat.includes('pulse') && pCat.includes('pulse')) ||
          (selCat.includes('spice') && pCat.includes('spice')) ||
          (selCat.includes('oilseed') && pCat.includes('oilseed')) ||
          (selCat.includes('flower') && pCat.includes('flower')) ||
          (selCat.includes('organic') && pCat.includes('organic'));
        if (!isDirectMatch && !isAliasMatch) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesFarmer = (p.farmerName || '').toLowerCase().includes(q);
        const matchesLocation = (p.farmLocation || '').toLowerCase().includes(q);
        const matchesCat = (p.categoryName || p.category || '').toLowerCase().includes(q);
        if (!matchesName && !matchesFarmer && !matchesLocation && !matchesCat) return false;
      }

      // Farmer filter
      if (selectedFarmer !== 'all' && p.farmerId !== selectedFarmer) {
        return false;
      }

      // In stock filter
      if (inStockOnly && p.availableQuantity <= 0) {
        return false;
      }

      // Min price
      if (minPrice && p.price < parseFloat(minPrice)) {
        return false;
      }

      // Max price
      if (maxPrice && p.price > parseFloat(maxPrice)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.id || '').localeCompare(a.id || '');
      return (b.rating || 5) - (a.rating || 5); // default: highest rated
    });
  }, [products, selectedCategory, sourceFilter, searchQuery, selectedFarmer, inStockOnly, minPrice, maxPrice, sortBy]);

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    const res = addToCart(product, 1);
    if (res.success) {
      setAddedIds((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [product.id]: false }));
      }, 1200);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSourceFilter('all');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedFarmer('all');
    setInStockOnly(false);
    setSortBy('rating');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#40916c]" />
            Direct Agricultural Exchange
          </div>
          <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#081c15]">
            Product Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Genuine farmer-listed inventory with verifiable dawn harvest logs and zero middleman markup.
          </p>
        </div>

        {/* Search Bar & Mobile Filter Trigger */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crops or farmers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center gap-1.5 text-xs font-bold"
          >
            <Filter className="w-4 h-4 text-[#52b788]" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar (Desktop + Mobile Drawer) */}
        <div className={`
          lg:block bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6
          ${mobileFilterOpen ? 'fixed inset-x-4 top-20 z-50 max-h-[85vh] overflow-y-auto block shadow-2xl' : 'hidden'}
        `}>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="font-outfit font-extrabold text-base text-[#081c15] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#52b788]" />
              Filter Listings
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#2d6a4f] hover:underline font-semibold"
              >
                Reset All
              </button>
              {mobileFilterOpen && (
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Inventory Source Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Catalogue vs Farmer
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#faf8f2] p-1 rounded-xl border border-gray-200 text-[11px] font-bold">
              <button
                onClick={() => setSourceFilter('all')}
                className={`py-1.5 rounded-lg transition-all ${
                  sourceFilter === 'all' ? 'bg-[#1b4332] text-white shadow-sm' : 'text-gray-600 hover:text-black'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSourceFilter('farmer')}
                className={`py-1.5 rounded-lg transition-all ${
                  sourceFilter === 'farmer' ? 'bg-[#1b4332] text-white shadow-sm' : 'text-gray-600 hover:text-black'
                }`}
              >
                Farmer
              </button>
              <button
                onClick={() => setSourceFilter('catalogue')}
                className={`py-1.5 rounded-lg transition-all ${
                  sourceFilter === 'catalogue' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:text-black'
                }`}
              >
                Catalogue
              </button>
            </div>
          </div>

          {/* Category Filter from MongoDB */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
              Agricultural Category ({categories.length || 10})
            </label>
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#1b4332] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-[#faf8f2]'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-75 font-mono">{products.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-[#1b4332] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-[#faf8f2]'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">{cat.productCount || 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
              Price Range (₹)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-[#faf8f2]"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-[#faf8f2]"
              />
            </div>
          </div>

          {/* Filter by Specific Farmer / Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
              Filter by Verified Farmer
            </label>
            <select
              value={selectedFarmer}
              onChange={(e) => setSelectedFarmer(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#faf8f2] text-gray-700 font-medium focus:outline-none"
            >
              <option value="all">All Verified Farmers</option>
              {farmers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.district})
                </option>
              ))}
            </select>
          </div>

          {/* Availability Toggle */}
          <div>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-[#2d6a4f] focus:ring-[#52b788]"
              />
              <span>In-Stock Items Only</span>
            </label>
          </div>
        </div>

        {/* Right Listings View */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting and Results Count Bar */}
          <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-gray-600">
              Showing <strong className="text-[#081c15]">{filteredProducts.length}</strong> farmer-created {filteredProducts.length === 1 ? 'listing' : 'listings'}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 font-semibold text-[#1b4332] bg-[#faf8f2] focus:outline-none"
              >
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Recently Listed</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 bg-gray-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-red-200 p-8">
              <p className="text-sm font-semibold text-red-600 mb-3">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold"
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Proper Empty State Required by Prompt */
            <div className="text-center py-20 px-6 bg-white rounded-3xl border border-dashed border-gray-300 flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-[#faf8f2] text-gray-400 flex items-center justify-center mb-4">
                <PackageX className="w-8 h-8 text-[#52b788]" />
              </div>
              <h3 className="font-outfit font-extrabold text-xl text-[#081c15] mb-2">
                No Farmer Listings Found
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
                Products in Farm to Home come exclusively from registered local farmers through our verified database. No items currently match your chosen criteria.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.slice(0, displayCount).map((product) => {
                  const isOutOfStock = product.availableQuantity <= 0;
                  const isAdded = addedIds[product.id];

                  return (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/customer/product/${product.id}`)}
                      className={`group bg-white rounded-3xl border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                        isOutOfStock ? 'opacity-70 border-gray-200' : 'border-gray-200 hover:border-[#74c69d]'
                      }`}
                    >
                      {/* Image Top */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={product.images?.[0] || product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                          {product.isCatalogue ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/90 text-white text-[9px] font-extrabold uppercase shadow-sm">
                              Farm Catalogue
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold uppercase shadow-sm">
                              Verified Farmer
                            </span>
                          )}

                          {isOutOfStock ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                              Out of Stock
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#081c15]/85 backdrop-blur-md text-[10px] font-bold text-[#74c69d]">
                              {product.availableQuantity} {product.unit} left
                            </span>
                          )}

                          {product.grade && (
                            <span className="px-2 py-0.5 rounded-full bg-white/90 text-[#081c15] text-[9px] font-extrabold shadow-sm">
                              {product.grade}
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                            isInWishlist(product.id)
                              ? 'bg-red-50 text-red-500'
                              : 'bg-white/80 text-gray-600 hover:text-red-500 hover:bg-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                        </button>

                        {/* Bottom Tag */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white">
                          <span className="bg-[#081c15]/80 backdrop-blur-md px-2 py-0.5 rounded-md font-semibold text-[#d8f3dc]">
                            {product.harvestDate || 'Harvested Today'}
                          </span>
                          <span className="bg-[#081c15]/80 backdrop-blur-md px-2 py-0.5 rounded-md font-bold flex items-center gap-1 text-[#e9d8a6]">
                            <Star className="w-3 h-3 fill-current" />
                            {product.rating}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Farmer / Catalogue Source Name & Location */}
                          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
                            <span className={`font-semibold flex items-center gap-1 ${product.isCatalogue ? 'text-amber-900' : 'text-[#1b4332]'}`}>
                              {product.isCatalogue ? (
                                <>
                                  <Sprout className="w-3 h-3 text-amber-600" />
                                  <span>Cooperative Hub</span>
                                </>
                              ) : (
                                <>
                                  <User className="w-3 h-3 text-[#52b788]" />
                                  <span className="truncate max-w-[130px]">{product.farmerName}</span>
                                </>
                              )}
                            </span>
                            <span className="flex items-center gap-0.5 text-gray-400 truncate max-w-[120px]">
                              <MapPin className="w-3 h-3 shrink-0" />
                              {product.farmLocation?.split(',')[0]}
                            </span>
                          </div>

                          <h3 className="font-outfit font-bold text-base text-[#081c15] group-hover:text-[#2d6a4f] transition-colors leading-snug line-clamp-1 mb-1">
                            {product.name}
                          </h3>

                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                            {product.description}
                          </p>
                        </div>

                        {/* Price & Add to Cart */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 block font-medium">Farm Gate Price</span>
                            <div className="flex items-baseline gap-1">
                              <span className="font-outfit font-extrabold text-lg text-[#081c15]">
                                ₹{product.price}
                              </span>
                              <span className="text-[11px] text-gray-500">/ {product.unit}</span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleQuickAdd(e, product)}
                            disabled={isOutOfStock}
                            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              isOutOfStock
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : isAdded
                                ? 'bg-[#52b788] text-white shadow-sm scale-95'
                                : 'bg-[#1b4332] hover:bg-[#2d6a4f] text-white shadow-sm'
                            }`}
                          >
                            {isOutOfStock ? (
                              <span>Sold Out</span>
                            ) : isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" /> Added
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" /> Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Pagination Button */}
              {displayCount < filteredProducts.length && (
                <div className="text-center pt-6">
                  <button
                    onClick={() => setDisplayCount((prev) => prev + 6)}
                    className="px-8 py-3 rounded-2xl bg-white border border-gray-300 hover:border-[#1b4332] text-xs font-bold text-[#1b4332] shadow-sm hover:shadow transition-all"
                  >
                    Load More Crops ({filteredProducts.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

