import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Calendar, 
  MessageSquare, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  Send, 
  X,
  Package
} from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function FarmerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [farmer, setFarmer] = useState(null);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    async function loadFarmer() {
      setLoading(true);
      try {
        const [f, prodsRes] = await Promise.all([
          api.getFarmerById(id),
          api.getProducts({ farmerId: id })
        ]);
        setFarmer(f);
        setFarmerProducts(prodsRes.products || []);
      } catch (err) {
        console.error('Failed to load farmer profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFarmer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-[#2d6a4f] border-t-[#52b788] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-[#1b4332]">Loading Farmer Profile...</p>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-outfit font-extrabold text-2xl text-[#081c15] mb-2">Farmer Profile Not Found</h2>
        <Link to="/customer/marketplace" className="inline-flex items-center gap-2 text-xs font-bold text-[#1b4332]">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      setMessageSent(true);
      setTimeout(() => {
        setMessageSent(false);
        setMessageText('');
        setContactModalOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Link
        to="/customer/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d6a4f] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      {/* Hero Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 bg-gray-100 overflow-hidden">
          <img
            src={farmer.coverImage}
            alt={farmer.farmName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081c15]/90 via-[#081c15]/30 to-transparent" />
        </div>

        {/* Info Header */}
        <div className="p-6 sm:p-10 relative -mt-16 sm:-mt-20 z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-gray-100">
            <div className="flex items-end gap-5">
              <img
                src={farmer.avatar}
                alt={farmer.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl shrink-0"
              />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#d8f3dc] text-[#1b4332] text-xs font-bold mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#40916c]" />
                  {farmer.verificationBadge}
                </div>
                <h1 className="font-outfit font-extrabold text-2xl sm:text-3xl text-[#081c15]">
                  {farmer.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {farmer.farmName} • {farmer.location}
                </p>
              </div>
            </div>

            {/* Safe Platform Contact Button */}
            <button
              onClick={() => setContactModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <MessageSquare className="w-4 h-4 text-[#74c69d]" />
              <span>Contact via Safe Portal</span>
            </button>
          </div>

          {/* Farm Bio & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-outfit font-bold text-base text-[#081c15]">About the Farm & Soil</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {farmer.bio}
              </p>
              <div className="p-4 rounded-2xl bg-[#faf8f2] border border-gray-200 text-xs text-gray-700">
                <strong className="text-[#1b4332] block mb-1">Cultivation Philosophy:</strong>
                {farmer.farmingPractices}
              </div>
            </div>

            <div className="bg-[#faf8f2] p-5 rounded-2xl border border-gray-200/80 space-y-3 text-xs">
              <h4 className="font-outfit font-bold text-sm text-[#081c15] mb-2">Verified Farm Metrics</h4>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Cultivated Area</span>
                <span className="font-bold text-[#081c15]">{farmer.acreage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Customer Rating</span>
                <span className="font-bold text-amber-700 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {farmer.rating} ({farmer.totalReviews})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Member Since</span>
                <span className="font-bold text-[#081c15]">{farmer.joinedDate}</span>
              </div>
              <div className="pt-2">
                <span className="text-gray-500 block mb-1 font-semibold">Government / Agency Badges:</span>
                <div className="flex flex-wrap gap-1">
                  {farmer.certifications?.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-semibold text-[#1b4332]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Products Listed by this Farmer */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-outfit font-extrabold text-2xl text-[#081c15]">
              Active Harvests by {farmer.name} ({farmerProducts.length})
            </h2>
            <p className="text-xs text-gray-500">Shipped fresh directly from {farmer.district}</p>
          </div>
        </div>

        {farmerProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-xs text-gray-500">No active crops listed at this moment by this grower.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {farmerProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => navigate(`/customer/product/${prod.id}`)}
                className="bg-white rounded-3xl border border-gray-200 p-4 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-3 bg-gray-100">
                    <img
                      src={prod.images?.[0] || prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#081c15]/85 backdrop-blur-md text-[10px] font-bold text-[#74c69d]">
                      {prod.harvestDate || 'Fresh Dawn Lot'}
                    </span>
                  </div>

                  <h3 className="font-outfit font-bold text-base text-[#081c15] group-hover:text-[#2d6a4f] mb-1">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="font-outfit font-extrabold text-lg text-[#081c15]">
                      ₹{prod.price}
                    </span>
                    <span className="text-xs text-gray-500"> / {prod.unit}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod, 1);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-colors"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safe Platform-Controlled Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setContactModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-base text-[#081c15]">
                  Message Farmer {farmer.name}
                </h3>
                <p className="text-[11px] text-gray-500">Platform-monitored safe inquiry</p>
              </div>
            </div>

            {messageSent ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-[#40916c] mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#081c15]">Message Sent Safely!</h4>
                <p className="text-xs text-gray-600 mt-1">
                  The farmer will reply directly to your customer notification inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="p-3 bg-[#faf8f2] rounded-xl text-[11px] text-[#1b4332] border border-[#74c69d]/40">
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-[#40916c]" />
                  For your safety and fair price assurance, all communications and payments remain protected inside Farm to Home.
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Question / Harvest Request
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. Inquiring about next week's tomato harvest or custom bulk basket sizes..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" /> Send Protected Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

