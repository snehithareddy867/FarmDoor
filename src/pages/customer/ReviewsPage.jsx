import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2, Trash2, Edit3, ShieldCheck, AlertCircle, ArrowLeft, MessageSquare } from 'lucide-react';
import { api } from '../../services/api';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export default function ReviewsPage() {
  const { user } = useCustomerAuth();
  const [reviews, setReviews] = useState([]);
  const [verifiedProducts, setVerifiedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New review form
  const [selectedProductId, setSelectedProductId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const loadData = async () => {
    if (user?.id) {
      setLoading(true);
      try {
        const [orders, prodsRes] = await Promise.all([
          api.getOrders(user.id),
          api.getProducts()
        ]);

        // Find all delivered products purchased by this user (verified purchasers only!)
        const deliveredOrders = (orders || []).filter((o) => o.orderStatus === 'Delivered');
        const purchasedItemIds = new Set();
        deliveredOrders.forEach((o) => {
          o.items?.forEach((i) => purchasedItemIds.add(i.productId));
        });

        const eligible = (prodsRes.products || []).filter((p) => purchasedItemIds.has(p.id));
        setVerifiedProducts(eligible);
        if (eligible.length > 0 && !selectedProductId) {
          setSelectedProductId(eligible[0].id);
        }

        // Get reviews created by this user
        // We can inspect all product reviews
        const allRevs = [];
        for (const p of prodsRes.products || []) {
          const revs = await api.getReviews(p.id);
          revs.forEach((r) => {
            if (r.customerId === user.id || r.customerName === user.fullName) {
              allRevs.push({ ...r, productName: p.name });
            }
          });
        }
        setReviews(allRevs);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !comment.trim()) return;

    await api.addReview({
      productId: selectedProductId,
      customerId: user.id,
      customerName: user.fullName,
      customerLocation: `${user.city || 'Pune'}, ${user.state || 'Maharashtra'}`,
      rating: rating,
      verifiedPurchase: true,
      comment: comment.trim()
    });

    setReviewSuccess('Review published successfully with Verified Purchaser status!');
    setComment('');
    loadData();
    setTimeout(() => setReviewSuccess(''), 3000);
  };

  const handleDeleteReview = async (reviewId) => {
    await api.deleteReview(reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-[#081c15]">
            Ratings & Harvest Feedback
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Share genuine quality ratings for crops delivered to your home. Only verified purchasers may leave reviews.
          </p>
        </div>

        <Link
          to="/customer/orders"
          className="text-xs font-bold text-[#2d6a4f] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> View Delivered Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Write a Review Form (Only for verified purchased products) (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <MessageSquare className="w-5 h-5 text-[#52b788]" />
            <h2 className="font-outfit font-extrabold text-lg text-[#081c15]">
              Rate a Purchased Harvest
            </h2>
          </div>

          <div className="p-3 bg-[#faf8f2] rounded-2xl border border-[#74c69d]/40 text-xs text-[#1b4332] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#40916c] shrink-0" />
            <span>Strict Verification: You can only rate crops from your successfully delivered orders.</span>
          </div>

          {reviewSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{reviewSuccess}</span>
            </div>
          )}

          {verifiedProducts.length === 0 ? (
            <div className="text-center py-8 bg-[#faf8f2] rounded-2xl border border-dashed border-gray-200 text-xs text-gray-500">
              <p>You don't have any delivered orders yet.</p>
              <p className="mt-1">Once your first farm harvest is delivered, it will appear here for rating.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Select Delivered Crop *
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-[#faf8f2]"
                >
                  {verifiedProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Grown by {p.farmerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Freshness & Quality Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#081c15] ml-2">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Detailed Agricultural Review *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How was the crispness, aroma, packaging, and harvest freshness upon arrival?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Submit Verified Review
              </button>
            </form>
          )}
        </div>

        {/* Right: User's Submitted Reviews List (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
          <h2 className="font-outfit font-extrabold text-lg text-[#081c15] pb-3 border-b border-gray-100 flex items-center justify-between">
            <span>Your Submitted Reviews</span>
            <span className="text-xs font-mono text-gray-400">({reviews.length})</span>
          </h2>

          {loading ? (
            <p className="text-xs text-gray-400">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-[#faf8f2] rounded-2xl border border-dashed border-gray-200 text-xs text-gray-500">
              <p>You have not published any crop reviews yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-[#faf8f2] border border-gray-100 text-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-[#081c15]">{rev.productName || 'Harvest Item'}</h4>
                      <div className="flex items-center gap-1 text-amber-500 text-xs my-0.5">
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-gray-600 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-[10px] text-gray-400">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Buyer Review
                    </span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

