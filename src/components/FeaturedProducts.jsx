import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ShoppingCart, 
  Star, 
  MapPin, 
  User, 
  Check, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  Clock, 
  Sparkles,
  Plus
} from 'lucide-react';

export default function FeaturedProducts({ 
  onAddToCart, 
  onOpenProductModal, 
  selectedCategory, 
  onSelectCategory 
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [addedItemIds, setAddedItemIds] = useState({});

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [prodList, catList] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        if (isMounted) {
          setProducts(Array.isArray(prodList) ? prodList : []);
          setCategories(Array.isArray(catList) ? catList : []);
        }
      } catch (err) {
        if (isMounted) {
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.farmerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.farmLocation || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleAddToCartClick = (e, product) => {
    e.stopPropagation();
    onAddToCart(product);
    
    // Animate temporary checkmark
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="shop" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#52b788]/15 text-[#1b4332] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#40916c]" />
              Direct Marketplace
            </div>
            <h2 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#081c15] tracking-tight">
              Featured Harvests
            </h2>
            <p className="text-sm sm:text-base text-[#5c4033]/80 mt-2 max-w-xl">
              Handpicked today by independent local growers. Transparent pricing where over 85% goes directly to the farmer.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search crop or farmer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916c] focus:border-transparent transition-all bg-[#faf8f2]"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[#1b4332] bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-[#40916c] cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'bg-[#faf8f2] text-[#5c4033] hover:bg-[#ede5d8]'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id || cat.slug}
              onClick={() => onSelectCategory(cat.id || cat.slug)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === (cat.id || cat.slug)
                  ? 'bg-[#1b4332] text-white shadow-md'
                  : 'bg-[#faf8f2] text-[#5c4033] hover:bg-[#ede5d8]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#faf8f2] rounded-3xl border border-dashed border-gray-300">
            <p className="text-lg font-semibold text-gray-600 mb-2">No fresh harvests match your criteria.</p>
            <p className="text-sm text-gray-500 mb-4">Try clearing your search query or choosing another category.</p>
            <button
              onClick={() => { setSearchQuery(''); onSelectCategory('all'); }}
              className="px-5 py-2 rounded-xl bg-[#1b4332] text-white text-sm font-bold hover:bg-[#2d6a4f] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = addedItemIds[product.id];

              return (
                <div
                  key={product.id}
                  onClick={() => onOpenProductModal(product)}
                  className="group bg-white rounded-3xl border border-[#e5e4e7] overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
                >
                  {/* Top Image Container */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Tag Badge */}
                    <div className="absolute top-3 left-3">
                      {product.isCatalogue ? (
                        <span className="px-3 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-extrabold uppercase shadow-sm">
                          Farm Catalogue
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-[#081c15]/85 backdrop-blur-md text-[10px] font-bold text-[#74c69d] shadow-sm">
                          {product.badge || 'Verified Farmer'}
                        </span>
                      )}
                    </div>

                    {/* Quick View Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onOpenProductModal(product); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:text-[#1b4332] hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Harvest status pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#1b4332] shadow-sm">
                        <Clock className="w-3 h-3 text-[#40916c]" />
                        {product.harvestDate || product.availabilityStatus || 'Fresh Harvest'}
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#081c15]/80 backdrop-blur-md text-[11px] font-bold text-white shadow-sm">
                        <Star className="w-3 h-3 text-[#e9d8a6] fill-[#e9d8a6]" />
                        {product.rating || 4.8}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Farmer info badge */}
                      <div className="flex items-center justify-between text-xs text-[#5c4033]/80 mb-2">
                        {product.isCatalogue ? (
                          <span className="flex items-center gap-1 font-semibold text-amber-900">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Cooperative Hub</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-semibold text-[#1b4332]">
                            <User className="w-3.5 h-3.5 text-[#52b788]" />
                            <span className="truncate max-w-[120px]">{product.farmerName}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-0.5 text-[11px] text-gray-500 truncate max-w-[130px]">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          {product.farmLocation ? product.farmLocation.split(',')[0] : 'Regional Hub'}
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-outfit font-bold text-lg text-[#081c15] group-hover:text-[#2d6a4f] transition-colors leading-snug mb-2">
                        {product.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing & Add to Cart */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-gray-400 block font-medium">Fair Farm Price</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-outfit font-extrabold text-xl text-[#081c15]">
                            ₹{product.price}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            / {product.unit}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleAddToCartClick(e, product)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                          isAdded
                            ? 'bg-[#52b788] text-white shadow-md scale-95'
                            : 'bg-[#1b4332] hover:bg-[#2d6a4f] text-white shadow-sm hover:shadow-md'
                        }`}
                        title="Add to Cart"
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

