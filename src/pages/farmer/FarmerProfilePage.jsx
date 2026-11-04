import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Image as ImageIcon,
  Plus,
  Trash2,
  Camera
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { handleAvatarError, handleImageError, AVATAR_FALLBACKS } from '../../utils/imageFallback';

export default function FarmerProfilePage() {
  const { farmer, updateProfile } = useFarmerAuth();

  const [formData, setFormData] = useState({
    farmName: farmer?.farmName || '',
    name: farmer?.name || farmer?.fullName || '',
    location: farmer?.location || '',
    state: farmer?.state || 'Maharashtra',
    district: farmer?.district || 'Nashik',
    village: farmer?.village || 'Dindori',
    pincode: farmer?.pincode || '422202',
    phone: farmer?.phone || farmer?.mobile || '+91 98231 45012',
    email: farmer?.email || '',
    avatar: farmer?.avatar || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80',
    acreage: farmer?.acreage || '8.5 Acres',
    farmingPractices: farmer?.farmingPractices || '100% Certified Organic, Jeevamrutha enrichment',
    bio: farmer?.bio || farmer?.farmDescription || 'Generational regenerative farm dedicated to unpolished native grains, leafy greens, and hand-tended orchard fruits.',
    farmPhotographs: farmer?.farmPhotographs || [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'
    ]
  });

  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleAddFarmPhoto = () => {
    if (newPhotoUrl.trim()) {
      setFormData((p) => ({
        ...p,
        farmPhotographs: [...(p.farmPhotographs || []), newPhotoUrl.trim()]
      }));
      setNewPhotoUrl('');
    }
  };

  const handleRemoveFarmPhoto = (idx) => {
    setFormData((p) => ({
      ...p,
      farmPhotographs: (p.farmPhotographs || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile(formData);
    setIsSaving(false);
    setSuccessMsg('Farm profile and photographs updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-outfit text-[#081c15]">
            Farm Profile, Location & Heritage
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            This information is shown to consumers on the marketplace to build authentic trust.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farm Photos / Avatar */}
        <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm text-center flex flex-col items-center">
          <div className="relative mb-3">
            <img
              src={formData.avatar || AVATAR_FALLBACKS.farmer}
              alt={formData.name}
              loading="lazy"
              onError={(e) => handleAvatarError(e, 'farmer')}
              className="w-28 h-28 rounded-full object-cover border-4 border-[#2d6a4f]/30 shadow-md"
            />
          </div>
          <h3 className="font-bold text-base text-[#081c15]">{formData.name}</h3>
          <p className="text-xs text-[#2d6a4f] font-bold">{formData.farmName}</p>
          <span className="mt-2 text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            <span>{farmer?.verificationBadge || 'Verified Organic Grower'}</span>
          </span>

          <div className="w-full mt-4 text-left">
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Avatar Image URL</label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full px-2.5 py-1.5 bg-[#faf8f2] border border-gray-200 rounded-xl text-[11px] font-mono"
            />
          </div>

          <div className="w-full mt-5 pt-4 border-t border-gray-100 text-left text-xs space-y-2">
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Total Reviews</span>
              <span className="font-bold text-[#081c15]">{farmer?.totalReviews || 128}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Experience</span>
              <span className="font-bold text-[#081c15]">{farmer?.experienceYears || 18} Years</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Response Time</span>
              <span className="font-bold text-emerald-600">{farmer?.responseTime || 'Within 2 hours'}</span>
            </div>
          </div>
        </div>

        {/* Profile Inputs */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Farm Name *</label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Farmer Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Village</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Total Land Acreage</label>
              <input
                type="text"
                name="acreage"
                value={formData.acreage}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Cultivation & Soil Enrichment Practices</label>
              <input
                type="text"
                name="farmingPractices"
                value={formData.farmingPractices}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Farm Story & Heritage Description</label>
            <textarea
              rows="3"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
            />
          </div>

          {/* Farm Photographs Gallery */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Farm Landscape Photographs
            </label>
            <p className="text-[11px] text-gray-500 mb-2">Showcase your soil, irrigation canals, and orchards to urban consumers</p>
            
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Paste farm landscape image URL..."
                className="flex-1 px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-xl text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleAddFarmPhoto}
                className="px-3 py-2 bg-[#081c15] text-[#52b788] rounded-xl text-xs font-bold hover:bg-[#1b4332]"
              >
                Add Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(formData.farmPhotographs || []).map((imgUrl, idx) => (
                <div key={idx} className="relative h-24 rounded-2xl overflow-hidden border border-gray-200 group">
                  <img
                    src={imgUrl}
                    alt="Farm scene"
                    loading="lazy"
                    onError={(e) => handleImageError(e, 'default')}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFarmPhoto(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#081c15] text-[#52b788] font-bold text-xs hover:bg-[#1b4332] shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Farm Profile'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
