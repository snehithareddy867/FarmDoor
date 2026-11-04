import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  Leaf,
  Sun,
  Droplets,
  Calendar,
  ShieldCheck,
  TrendingUp,
  ShoppingCart,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { handleImageError } from '../../utils/imageFallback';

export default function CatalogueExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('q') || '';

  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [detailItem, setDetailItem] = useState(null);
  const [farmerListings, setFarmerListings] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [cartFeedback, setCartFeedback] = useState('');

  const CATEGORIES = [
    { id: 'all', name: 'All Produce' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'grains-and-cereals', name: 'Grains & Cereals' },
    { id: 'pulses-and-lentils', name: 'Pulses & Lentils' },
    { id: 'dairy-products', name: 'Dairy' },
    { id: 'spices', name: 'Spices' },
    { id: 'organic-products', name: 'Organic' },
    { id: 'other-farm-products', name: 'Farm-Produced' }
  ];

  const SEASONS = ['all', 'Kharif', 'Rabi', 'Zaid', 'Year-round'];

  const loadCatalogue = async () => {
    setLoading(true);
    try {
      const res = await api.getCatalogueProducts({
        category: selectedCategory !== 'all' ? selectedCategory : '',
        search: searchQuery,
        season: selectedSeason !== 'all' ? selectedSeason : '',
        limit: 60
      });
      if (res && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Failed to load catalogue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadCatalogue, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedSeason, searchQuery]);

  const openDetailModal = async (item) => {
    setDetailLoading(true);
    setDetailItem(item);
    try {
      const res = await api.getCatalogueProductById(item.catalogueId || item._id);
      if (res && res.catalogueItem) {
        setDetailItem(res.catalogueItem);
        setFarmerListings(res.activeFarmerListings || []);
      }
    } catch (err) {
      console.warn('Detail load failed', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBuyFromFarmer = (farmerProduct) => {
    const res = addToCart(farmerProduct, 1);
    if (res.success) {
      setCartFeedback(`Added 1 ${farmerProduct.unit} of ${farmerProduct.name} to your basket!`);
      setTimeout(() => setCartFeedback(''), 3500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#081c15] via-[#1b4332] to-[#2d6a4f] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#52b788]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Master Agricultural Knowledge Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-outfit tracking-tight">
            Agricultural Catalogue & Botanical Guide
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Curated botanical taxonomy, USDA FoodData Central nutritional facts, seasonal cycles, and AGMARKNET wholesale mandi price benchmarks. Reference records are purely educational and connect you directly to authentic farmer harvest listings.
          </p>
        </div>

        {cartFeedback && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
            <ShoppingCart className="w-4 h-4" />
            <span>{cartFeedback}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search crops by common name, scientific name or botanical family..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#52b788]/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 shrink-0">Season:</span>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs font-semibold text-gray-800 focus:outline-none"
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Seasons' : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'bg-[#faf8f2] text-gray-700 hover:bg-[#e9f5ed] border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Catalogue Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-[#2d6a4f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-gray-600">Retrieving master agricultural records...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-gray-300 p-8">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">No Catalogue Commodities Found</h3>
          <p className="text-xs text-gray-500">Try adjusting your search terms or seasonal filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.catalogueId || item._id}
              className="bg-white rounded-3xl border border-[#2d6a4f]/20 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => handleImageError(e, item.category)}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#081c15]/80 backdrop-blur-md text-white border border-white/20">
                    Non-Purchasable Reference
                  </span>
                  {item.category && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#1b4332] shadow-sm uppercase">
                      {item.category}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 right-2">
                  <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-purple-900/80 backdrop-blur-md text-purple-200 border border-purple-500/30">
                    Wikimedia CC
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-outfit font-black text-base text-[#081c15] leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs italic text-emerald-800 font-medium">
                    {item.scientificName || 'Cultivated Flora'}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Botanical & Nutritional Snapshot */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-[11px]">
                  <div className="p-2 rounded-xl bg-[#faf8f2] border border-gray-100">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase">Botanical Family</span>
                    <span className="font-bold text-[#1b4332] truncate block">{item.family || 'Plantae'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                    <span className="block text-[9px] font-bold text-amber-700 uppercase">Mandi Benchmark</span>
                    <span className="font-bold text-amber-900">₹{item.mandiBenchmark?.typicalModalPricePerKg || 30}/kg</span>
                  </div>
                </div>

                {/* USDA Highlights */}
                {item.nutritionalInfo && (
                  <div className="flex items-center justify-between text-[10px] font-semibold text-gray-600 bg-gray-50 p-2 rounded-xl">
                    <span>{item.nutritionalInfo.calories} kcal / 100g</span>
                    <span>P: {item.nutritionalInfo.protein}g</span>
                    <span>Vit C: {item.nutritionalInfo.vitaminC}mg</span>
                  </div>
                )}

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => openDetailModal(item)}
                  className="w-full py-2.5 rounded-2xl bg-[#081c15] hover:bg-[#1b4332] text-[#52b788] text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Explore Botanical Guide</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl text-gray-900 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-200">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-1 inline-block uppercase">
                  {detailItem.category} • Agricultural Reference Guide
                </span>
                <h2 className="text-2xl font-black font-outfit text-[#081c15]">
                  {detailItem.name}
                </h2>
                <p className="text-xs italic text-emerald-700 font-semibold">
                  {detailItem.scientificName} • Family: {detailItem.family || 'Plantae'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Specimen Visual & Mandi Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={detailItem.image}
                  alt={detailItem.name}
                  className="w-full h-44 object-cover"
                />
                <div className="p-2 bg-gray-50 text-[10px] text-gray-500 border-t border-gray-200">
                  Photo source: Wikimedia Commons (CC BY-SA)
                </div>
              </div>

              <div className="sm:col-span-2 space-y-3">
                <p className="text-xs text-gray-700 leading-relaxed">
                  {detailItem.description}
                </p>

                {/* Mandi Wholesale Benchmark */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                    <span>AGMARKNET Mandi Price Benchmark (National APMC)</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-xl font-black text-amber-950 font-outfit">
                      ₹{detailItem.mandiBenchmark?.typicalModalPricePerKg || 30}/kg
                    </span>
                    <span className="text-[11px] text-gray-600">
                      Wholesale modal auction rate across mandis
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* USDA Nutritional Facts Table */}
            {detailItem.nutritionalInfo && (
              <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/20 space-y-2">
                <h4 className="text-xs font-black uppercase text-[#1b4332] tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  USDA FoodData Central Nutritional Profile (per 100g serving)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="p-2 rounded-xl bg-white border border-gray-200">
                    <span className="text-[10px] text-gray-400 block font-bold">Energy</span>
                    <span className="font-extrabold text-[#081c15]">{detailItem.nutritionalInfo.calories} kcal</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-gray-200">
                    <span className="text-[10px] text-gray-400 block font-bold">Protein</span>
                    <span className="font-extrabold text-[#081c15]">{detailItem.nutritionalInfo.protein} g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-gray-200">
                    <span className="text-[10px] text-gray-400 block font-bold">Carbohydrates</span>
                    <span className="font-extrabold text-[#081c15]">{detailItem.nutritionalInfo.carbohydrates} g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-gray-200">
                    <span className="text-[10px] text-gray-400 block font-bold">Dietary Fiber</span>
                    <span className="font-extrabold text-[#081c15]">{detailItem.nutritionalInfo.fiber} g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-gray-200">
                    <span className="text-[10px] text-gray-400 block font-bold">Vitamin C</span>
                    <span className="font-extrabold text-[#081c15]">{detailItem.nutritionalInfo.vitaminC} mg</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-gray-200">
                    <span className="text-[10px] text-gray-400 block font-bold">Calcium</span>
                    <span className="font-extrabold text-[#081c15]">{detailItem.nutritionalInfo.calcium} mg</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-gray-200">
                    <span className="text-[10px] text-gray-400 block font-bold">Iron</span>
                    <span className="font-extrabold text-[#081c15]">{detailItem.nutritionalInfo.iron} mg</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-gray-200">
                    <span className="text-[10px] text-gray-400 block font-bold">Potassium</span>
                    <span className="font-extrabold text-[#081c15]">{detailItem.nutritionalInfo.potassium} mg</span>
                  </div>
                </div>
              </div>
            )}

            {/* Botanical & Agronomic Growing Conditions (Perenual) */}
            {detailItem.botanicalInfo && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-emerald-700" />
                  Botanical Traits & Cultivation Requirements (Perenual)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Lifecycle</span>
                    <span className="font-bold text-gray-900">{detailItem.botanicalInfo.cycle || 'Annual'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Watering Requirement</span>
                    <span className="font-bold text-gray-900">{detailItem.botanicalInfo.watering || 'Average'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Sunlight Preference</span>
                    <span className="font-bold text-gray-900">
                      {Array.isArray(detailItem.botanicalInfo.sunlight) ? detailItem.botanicalInfo.sunlight.join(', ') : 'Full Sun'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* REAL FARMER MARKETPLACE LISTINGS AVAILABLE FOR PURCHASE */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#081c15] flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-emerald-700" />
                    Available Directly from Registered Local Farmers
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Purchase fresh harvests of this commodity directly from certified growers.
                  </p>
                </div>
              </div>

              {farmerListings.length === 0 ? (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center text-xs text-gray-500">
                  Currently no active farmer listings for this crop. Check back soon as dawn harvests arrive!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {farmerListings.map((fp) => (
                    <div
                      key={fp.productId || fp._id}
                      className="p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center justify-between gap-3 shadow-sm hover:border-emerald-300 transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={fp.image}
                          alt={fp.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <h5 className="font-bold text-xs text-gray-900">{fp.name}</h5>
                          <p className="text-[11px] text-gray-500">{fp.farmerName || 'Verified Farmer'} • {fp.farmLocation || 'Farm Fresh'}</p>
                          <div className="font-extrabold text-xs text-[#081c15] mt-0.5">
                            ₹{fp.price} / {fp.unit || 'kg'}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBuyFromFarmer(fp)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-sm"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

