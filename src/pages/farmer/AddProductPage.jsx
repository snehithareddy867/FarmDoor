import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Store, 
  Upload, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  X,
  Calendar,
  Tag,
  ShieldCheck,
  Plus,
  Trash2
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { api } from '../../services/api';

export default function AddProductPage() {
  const { farmer, isApproved, verificationStatus } = useFarmerAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables',
    price: '',
    unit: 'kg',
    availableQuantity: '',
    minOrderQuantity: 1,
    harvestDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    storageInstructions: 'Store in a cool, ventilated container or refrigerate below 8°C.',
    description: '',
    farmingMethod: 'Natural Jeevamrutha Organic Method',
    organicCertified: true,
    certificationName: 'NPOP Certified Organic',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'
    ]
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const SAMPLE_IMAGES = [
    { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { label: 'Bell Peppers', url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80' },
    { label: 'Baby Spinach', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80' },
    { label: 'Raw Honey', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80' },
    { label: 'Mangoes', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isApproved) {
      setErrorMsg('Product listing is restricted until farmer KYC is approved.');
      return;
    }
    if (!formData.name.trim() || !formData.price || !formData.availableQuantity) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createFarmerProduct({
        farmerId: farmer.id,
        farmerName: farmer.name || farmer.fullName,
        farmName: farmer.farmName,
        farmLocation: farmer.location || `${farmer.village || 'Pune'}, ${farmer.district || 'Maharashtra'}`,
        ...formData,
        price: Number(formData.price),
        availableQuantity: Number(formData.availableQuantity),
        minOrderQuantity: Number(formData.minOrderQuantity) || 1,
        inStock: formData.isAvailable && Number(formData.availableQuantity) > 0,
        status: formData.isAvailable ? 'Active' : 'Inactive',
        approvalStatus: 'Approved',
        rating: 5.0,
        reviewsCount: 0
      });
      navigate('/farmer/products');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to list product.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-black font-outfit text-[#081c15]">
            List Fresh Crop or Value-Added Product
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Add seasonal harvest directly into the consumer marketplace with live stock availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition border border-emerald-200"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Consumer Preview</span>
        </button>
      </div>

      {!isApproved && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              Your account is currently {verificationStatus}. Product submissions are locked until compliance verification is finished.
            </span>
          </div>
          <Link to="/farmer/verification" className="font-bold underline">
            Verify Now
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm space-y-6">
        {/* Name and Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">Crop / Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Heirloom Country Vine Tomatoes"
              className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
            >
              <option value="vegetables">Fresh Vegetables</option>
              <option value="fruits">Orchard Fruits</option>
              <option value="dairy">Farm Fresh Dairy</option>
              <option value="grains">Heritage Grains</option>
              <option value="honey">Raw Pure Honey</option>
              <option value="spices">Stone-Ground Spices</option>
              <option value="other">Other Farm Products</option>
            </select>
          </div>
        </div>

        {/* Price, Unit, Stock & MOQ */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Price per Unit (₹) *</label>
            <input
              type="number"
              name="price"
              min="1"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 45"
              className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Unit of Measure *</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
            >
              <option value="kg">kg (Kilogram)</option>
              <option value="gram">gram (g)</option>
              <option value="litre">litre (L)</option>
              <option value="ml">ml (Millilitre)</option>
              <option value="piece">piece</option>
              <option value="packet">packet</option>
              <option value="dozen">dozen</option>
              <option value="500g bunch">500g bunch</option>
              <option value="500g jar">500g jar</option>
              <option value="1 box (~5kg)">1 box (~5kg)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Available Quantity *</label>
            <input
              type="number"
              name="availableQuantity"
              min="0"
              value={formData.availableQuantity}
              onChange={handleChange}
              placeholder="e.g. 50"
              className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Minimum Order Qty</label>
            <input
              type="number"
              name="minOrderQuantity"
              min="1"
              value={formData.minOrderQuantity}
              onChange={handleChange}
              placeholder="e.g. 1"
              className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Harvest Date, Expiry Date & Storage Instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Harvest / Pick Date *</label>
            <input
              type="date"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Expiry / Best Before</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Availability Status</label>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isAvailableCheck"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <label htmlFor="isAvailableCheck" className="text-xs text-gray-800 font-semibold cursor-pointer">
                Available for Purchase
              </label>
            </div>
          </div>
        </div>

        {/* Storage Instructions & Farming Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Storage Instructions</label>
            <input
              type="text"
              name="storageInstructions"
              value={formData.storageInstructions}
              onChange={handleChange}
              placeholder="e.g. Keep refrigerated; consume within 4 days"
              className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Farming Practice Note</label>
            <input
              type="text"
              name="farmingMethod"
              value={formData.farmingMethod}
              onChange={handleChange}
              placeholder="e.g. 100% Pesticide-Free, Natural Jeevamrutha Method"
              className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Organic Certification Details if applicable */}
        <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="organicCheck"
              name="organicCertified"
              checked={formData.organicCertified}
              onChange={handleChange}
              className="rounded text-emerald-600 focus:ring-0"
            />
            <label htmlFor="organicCheck" className="text-xs font-bold text-[#081c15] cursor-pointer">
              Product carries Verified Organic Certification
            </label>
          </div>

          {formData.organicCertified && (
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Certification Agency & License Number</label>
              <input
                type="text"
                name="certificationName"
                value={formData.certificationName}
                onChange={handleChange}
                placeholder="e.g. NPOP Certified Organic / FSSAI #11522026000142"
                className="w-full px-3.5 py-2 bg-white border border-[#2d6a4f]/30 rounded-xl text-xs focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Description & Crop Flavor Profile</label>
          <textarea
            rows="3"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell customers about the flavor profile, variety, harvest morning time..."
            className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
          />
        </div>

        {/* Primary and Multiple Images */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-700">Crop Photography (Primary + Additional Images)</label>
          
          {/* Quick preset selector */}
          <div className="grid grid-cols-5 gap-2 mb-2">
            {SAMPLE_IMAGES.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, image: img.url }))}
                className={`p-1.5 rounded-2xl border text-center transition ${
                  formData.image === img.url
                    ? 'border-[#2d6a4f] ring-2 ring-[#52b788]/40 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img src={img.url} alt={img.label} className="w-full h-12 rounded-xl object-cover" />
                <span className="text-[10px] font-bold text-gray-700 mt-1 block truncate">{img.label}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Main Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3.5 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs font-mono"
            />
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Additional Gallery Photos</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste extra image URL..."
                className="flex-1 px-3.5 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-3 py-2 bg-[#081c15] text-[#52b788] rounded-2xl text-xs font-bold hover:bg-[#1b4332]"
              >
                Add Image
              </button>
            </div>

            {formData.additionalImages && formData.additionalImages.length > 0 && (
              <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
                {formData.additionalImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-rose-600 text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-4 py-2.5 rounded-2xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100"
          >
            Live Preview
          </button>
          <button
            type="submit"
            disabled={!isApproved || isSubmitting}
            className="px-6 py-2.5 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] text-xs font-bold transition shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish to Marketplace'}
          </button>
        </div>
      </form>

      {/* Live Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#2d6a4f]/20">
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Customer Marketplace Preview
              </span>
              <button onClick={() => setPreviewOpen(false)} className="p-1 hover:text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border mb-3">
              <img
                src={formData.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'}
                alt={formData.name || 'Produce'}
                className="w-full h-40 object-cover"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#081c15]">{formData.name || 'Crop Name'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                  {formData.category}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Grown by <strong className="text-[#081c15]">{farmer?.farmName}</strong>
              </p>
              <p className="text-gray-600 text-[11px] line-clamp-2">
                {formData.description || 'Fresh chemical-free farm harvest.'}
              </p>
              <div className="flex items-baseline justify-between pt-2 border-t">
                <span className="text-base font-black text-[#2d6a4f]">
                  ₹{formData.price || 0} <span className="text-[10px] font-normal text-gray-500">/{formData.unit}</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {formData.availableQuantity || 0} in stock
                </span>
              </div>
            </div>

            <button
              onClick={() => setPreviewOpen(false)}
              className="w-full mt-4 py-2 bg-[#081c15] text-[#52b788] rounded-xl text-xs font-bold"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
