import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  User, 
  Sparkles,
  X
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { api } from '../../services/api';

export default function FarmerReviewsPage() {
  const { farmer } = useFarmerAuth();
  const [reviews, setReviews] = useState([]);
  const [replyModalReview, setReplyModalReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    if (!farmer?.id) return;
    const r = await api.getFarmerReviews(farmer.id);
    setReviews(r || []);
  };

  useEffect(() => {
    fetchReviews();
  }, [farmer?.id]);

  const handleOpenReply = (review) => {
    setReplyModalReview(review);
    setReplyText(review.farmerReply?.replyText || '');
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyModalReview || !replyText.trim()) return;

    setIsSubmitting(true);
    await api.addFarmerReply(replyModalReview.id, replyText.trim());
    setIsSubmitting(false);
    setReplyModalReview(null);
    fetchReviews();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-outfit text-[#081c15]">
            Verified Customer Reviews & Harvest Feedback
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real feedback from customers who received and prepared your organic harvest.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-[#faf8f2] px-3.5 py-2 rounded-2xl border border-[#2d6a4f]/20">
          <span className="text-amber-500 text-sm">★</span>
          <span className="text-[#081c15]">{farmer?.rating || 4.9} Average Rating</span>
          <span className="text-gray-400">({reviews.length} reviews)</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border text-xs text-gray-500">
            No customer reviews yet. Reviews from verified purchasers will appear here.
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {rev.customerName?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#081c15]">{rev.customerName}</h4>
                    <p className="text-[11px] text-gray-500">
                      Product: <strong className="text-[#2d6a4f]">{rev.productName}</strong> • {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed italic">
                "{rev.comment}"
              </p>

              {/* Farmer Reply if exists */}
              {rev.farmerReply && (
                <div className="p-3.5 rounded-2xl bg-[#faf8f2] border-l-4 border-[#2d6a4f] text-xs">
                  <span className="font-bold text-[#081c15] block mb-0.5">
                    Farmer Reply ({farmer?.name}):
                  </span>
                  <p className="text-gray-700">{rev.farmerReply.replyText}</p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleOpenReply(rev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-800 text-xs font-bold hover:bg-gray-200"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{rev.farmerReply ? 'Edit Reply' : 'Reply as Cultivator'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {replyModalReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#2d6a4f]/20">
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <h3 className="text-sm font-bold text-[#081c15]">Respond to Customer</h3>
              <button onClick={() => setReplyModalReview(null)} className="text-gray-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReply} className="space-y-3 text-xs">
              <textarea
                rows="3"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Thank the customer or explain your organic harvesting process..."
                className="w-full px-3 py-2 bg-[#faf8f2] border rounded-2xl focus:outline-none"
                required
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReplyModalReview(null)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gray-100 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#081c15] text-[#52b788] font-bold"
                >
                  {isSubmitting ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

