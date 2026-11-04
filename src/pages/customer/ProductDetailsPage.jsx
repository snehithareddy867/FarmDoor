import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  User, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ShoppingCart, 
  Heart, 
  Plus, 
  Minus, 
  Check, 
  ArrowLeft, 
  Calendar, 
  Leaf, 
  ChevronRight,
  MessageCircle,
  Truck,
  RotateCcw,
  TrendingUp,
  BookOpen,
  Sun
} from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { handleImageError } from '../../utils/imageFallback';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [toastError, setToastError] = useState('');
  const [mandiComparison, setMandiComparison] = useState(null);
  const [catalogueInfo, setCatalogueInfo] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prod = await api.getProductById(id);
        if (prod) {
          setProduct(prod);
          const commodity = (prod.name || '').split(' ')[0];
          const [revs, relRes, mandiRes, catRes] = await Promise.all([
            api.getReviews(prod.id),
            api.getProducts({ category: prod.category }),
            api.compareMandiPrice(commodity, prod.price),
            api.getCatalogueProductById(prod.catalogueProductId || prod.name)
          ]);
          setReviews(revs || []);
          setRelatedProducts(
            (relRes.products || []).filter((p) => p.id !== prod.id).slice(0, 3)
          );
          if (mandiRes && mandiRes.comparison) {
            setMandiComparison(mandiRes.comparison);
          }
          if (catRes && catRes.catalogueItem) {
            setCatalogueInfo(catRes.catalogueItem);
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-[#2d6a4f] border-t-[#52b788] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-[#1b4332]">Loading Crop Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-outfit font-extrabold text-2xl text-[#081c15] mb-2">Crop Listing Not Found</h2>
        <p className="text-sm text-gray-600 mb-6">This listing may have been concluded or unlisted by the grower.</p>
        <Link
          to="/customer/marketplace"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.availableQuantity <= 0;
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    setToastError('');
    const res = addToCart(product, quantity);
    if (res.success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } else {
      setToastError(res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/customer/dashboard" className="hover:text-[#1b4332]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/customer/marketplace" className="hover:text-[#1b4332]">Marketplace</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/customer/marketplace?cat=${product.category}`} className="hover:text-[#1b4332] capitalize">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-gray-800 truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Details Section: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={images[selectedImage] || images[0]}
              alt={product.name}
              loading="lazy"
              onError={(e) => handleImageError(e, product.category)}
              className="w-full h-full object-cover"
            />
            {product.isOrganic && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1b4332]/90 backdrop-blur-md text-[#74c69d] text-xs font-bold">
                100% Certified Organic
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md ${
                isInWishlist(product.id)
                  ? 'bg-red-50 text-red-500'
                  : 'bg-white/80 text-gray-600 hover:text-red-500 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-[#52b788] ring-2 ring-[#52b788]/20' : 'border-gray-200 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Farmer Card Link or Catalogue Badge */}
            {product.isCatalogue ? (
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold mb-3">
                <Leaf className="w-3.5 h-3.5 text-amber-600" />
                <span>Agricultural Catalogue Reference • <strong>{product.farmLocation || 'Regional Farming Hub'}</strong></span>
                {product.supplierVerified ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Verified Supplier
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    Catalogue Display
                  </span>
                )}
              </div>
            ) : (
              <Link
                to={`/customer/farmer/${product.farmerId}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#faf8f2] border border-gray-200 hover:border-[#52b788] text-xs text-[#1b4332] font-semibold mb-3 group transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#52b788]" />
                <span>Grown by <strong>{product.farmerName}</strong></span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 group-hover:text-[#2d6a4f] flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" /> {product.farmLocation}
                </span>
              </Link>
            )}

            <h1 className="font-outfit font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#081c15] leading-tight mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-5 text-xs">
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount} customer reviews)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600">Category: <strong className="capitalize text-[#1b4332]">{product.category}</strong></span>
            </div>

            {/* Price & Unit Display */}
            <div className="bg-[#faf8f2] p-4 rounded-2xl border border-gray-200/80 mb-4 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider block">
                  Direct Farm-Gate Price
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-outfit font-extrabold text-3xl text-[#081c15]">
                    ₹{product.price}
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    / {product.unit}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider block">
                  Inventory Status
                </span>
                {isOutOfStock ? (
                  <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                    Currently Sold Out
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#d8f3dc] text-[#1b4332] text-xs font-bold">
                    ✓ {product.availableQuantity} {product.unit} Available
                  </span>
                )}
              </div>
            </div>

            {/* Mandi Wholesale Benchmark Comparison */}
            {mandiComparison && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-950">Mandi Wholesale Benchmark:</span>{' '}
                    <span className="text-gray-700">₹{mandiComparison.mandiModalPriceKg}/kg APMC Modal</span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${mandiComparison.badgeClass || 'bg-white text-gray-800'}`}>
                  {mandiComparison.verdict}
                </span>
              </div>
            )}

            {/* Harvest, Quality & Production Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-xs text-gray-600">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="block text-[10px] uppercase font-bold text-gray-400">Quality Grade</span>
                <span className="font-bold text-[#1b4332]">{product.grade || 'Grade A Standard'}</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="block text-[10px] uppercase font-bold text-gray-400">Organic Status</span>
                <span className="font-bold text-emerald-700">{product.organicStatus || (product.isOrganic ? 'Certified Organic' : 'Naturally Grown')}</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="block text-[10px] uppercase font-bold text-gray-400">Harvest Log</span>
                <span className="font-semibold text-gray-800 truncate">{product.harvestDate || 'Dawn Harvest'}</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="block text-[10px] uppercase font-bold text-gray-400">Natural Shelf Life</span>
                <span className="font-semibold text-gray-800">{product.shelfLifeDays || 5} days</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 mb-6">
              <h3 className="font-outfit font-bold text-sm text-[#081c15]">About This Crop</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
              {product.nutrition && (
                <p className="text-xs text-[#2d6a4f] bg-[#d8f3dc]/50 p-2.5 rounded-xl font-medium">
                  <strong>Nutrition Highlights:</strong> {product.nutrition}
                </p>
              )}
            </div>

            {/* Botanical & USDA Nutritional Guide (Inherited from Catalogue) */}
            {catalogueInfo && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 mb-6 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <Leaf className="w-4 h-4 text-emerald-700" />
                    <span>Botanical Taxonomy & USDA Nutritional Breakdown</span>
                  </div>
                  <Link
                    to={`/catalogue/${catalogueInfo.catalogueId || catalogueInfo._id}`}
                    className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-0.5"
                  >
                    <span>Full Agri Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-xl bg-white border border-emerald-100">
                    <span className="text-[9px] text-gray-400 block font-bold uppercase">Scientific Name</span>
                    <span className="font-semibold text-emerald-900 italic truncate block">{catalogueInfo.scientificName || 'Cultivated Flora'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-emerald-100">
                    <span className="text-[9px] text-gray-400 block font-bold uppercase">Calories</span>
                    <span className="font-bold text-gray-900">{catalogueInfo.nutritionalInfo?.calories || 0} kcal / 100g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-emerald-100">
                    <span className="text-[9px] text-gray-400 block font-bold uppercase">Protein & Fiber</span>
                    <span className="font-bold text-gray-900">P: {catalogueInfo.nutritionalInfo?.protein || 0}g • F: {catalogueInfo.nutritionalInfo?.fiber || 0}g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-emerald-100">
                    <span className="text-[9px] text-gray-400 block font-bold uppercase">Vitamin C</span>
                    <span className="font-bold text-gray-900">{catalogueInfo.nutritionalInfo?.vitaminC || 0} mg</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Purchasing Controls */}
          <div className="pt-5 border-t border-gray-100 space-y-3">
            {product.isCatalogue && !product.supplierVerified && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Catalogue Commodity Reference:</strong> Initial catalogue commodity available for preview. Doorstep dispatch will be activated when an approved local farmer supplies this harvest.
                </span>
              </div>
            )}

            {toastError && (
              <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                {toastError}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between w-full sm:w-auto bg-[#faf8f2] border border-gray-200 rounded-2xl px-3 py-2 gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-outfit font-extrabold text-sm w-6 text-center text-[#081c15]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
                  disabled={quantity >= product.availableQuantity || isOutOfStock}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : addedSuccess
                    ? 'bg-[#52b788] text-white'
                    : 'bg-[#1b4332] hover:bg-[#2d6a4f] text-white hover:-translate-y-0.5'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" /> Added to Basket!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Basket • ₹{product.price * quantity}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase text-[#40916c] tracking-wider block mb-1">
              Verified Feedback
            </span>
            <h2 className="font-outfit font-extrabold text-2xl text-[#081c15]">
              Customer Reviews ({reviews.length})
            </h2>
          </div>
          <div className="text-right">
            <span className="font-outfit font-extrabold text-2xl text-[#081c15]">
              ★ {product.rating}
            </span>
            <span className="block text-xs text-gray-400">Overall Rating</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-[#faf8f2] rounded-2xl border border-dashed border-gray-200">
            <p className="text-xs text-gray-500">No reviews yet for this harvest batch.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-[#faf8f2] border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#081c15]">{rev.customerName}</span>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d8f3dc] text-[#1b4332] text-[10px] font-bold">
                        <Check className="w-3 h-3 text-[#40916c]" /> Verified Purchaser
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400">{rev.date}</span>
                </div>
                <div className="flex items-center text-amber-500 text-xs mb-2">
                  {'★'.repeat(rev.rating)}
                  {'☆'.repeat(5 - rev.rating)}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Harvests */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-outfit font-extrabold text-xl text-[#081c15] mb-5">
            More Fresh Harvests in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/customer/product/${rel.id}`)}
                className="bg-white rounded-3xl border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer flex gap-4 group"
              >
                <img
                  src={rel.images?.[0] || rel.image}
                  alt={rel.name}
                  loading="lazy"
                  onError={(e) => handleImageError(e, rel.category)}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#40916c] font-semibold">{rel.farmerName}</span>
                    <h4 className="font-outfit font-bold text-xs text-[#081c15] group-hover:text-[#2d6a4f] line-clamp-1">
                      {rel.name}
                    </h4>
                  </div>
                  <span className="font-outfit font-extrabold text-sm text-[#081c15]">
                    ₹{rel.price} <span className="text-[10px] font-normal text-gray-500">/ {rel.unit}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

