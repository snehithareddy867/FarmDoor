import React, { useState } from 'react';
import { 
  User, 
  Bike, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Save, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';
import { handleAvatarError, AVATAR_FALLBACKS } from '../../utils/imageFallback';

export default function DeliveryProfilePage() {
  const { partner, updateProfile } = useDeliveryAuth();

  const [formData, setFormData] = useState({
    name: partner?.name || '',
    email: partner?.email || '',
    mobile: partner?.mobile || '',
    secondaryPhone: partner?.secondaryPhone || '',
    address: partner?.address || '',
    city: partner?.city || 'Pune',
    pincode: partner?.pincode || '',
    preferredLanguage: partner?.preferredLanguage || 'Marathi / English / Hindi',
    emergencyContact: partner?.emergencyContact || '',
    vehicleModel: partner?.vehicleModel || '',
    vehicleNumber: partner?.vehicleNumber || '',
    licenseNumber: partner?.licenseNumber || '',
    serviceArea: partner?.serviceArea || 'Pune Central & Kothrud'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile(formData);
    setIsSaving(false);
    setSuccessMsg('Profile details successfully updated!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPass !== passwordData.confirm) {
      setPasswordMsg('New passwords do not match.');
      return;
    }
    setPasswordMsg('Password changed successfully.');
    setTimeout(() => {
      setPasswordModalOpen(false);
      setPasswordMsg('');
      setPasswordData({ current: '', newPass: '', confirm: '' });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-outfit text-[#081c15]">
            Rider Identity & Fleet Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your personal profile, vehicle specifications, emergency dispatch contacts, and password.
          </p>
        </div>

        <button
          onClick={() => setPasswordModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700 transition"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Change Password</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Quick Summary */}
          <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm text-center flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={partner?.avatar || AVATAR_FALLBACKS.delivery}
                alt={partner?.name}
                loading="lazy"
                onError={(e) => handleAvatarError(e, 'delivery')}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#2d6a4f]/30 shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <h3 className="font-bold text-base text-[#081c15]">{partner?.name}</h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {partner?.id}</p>
            <span className="mt-2 text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              {partner?.verificationBadge || 'Certified Fleet Courier'}
            </span>

            <div className="w-full mt-6 pt-4 border-t border-gray-100 text-left text-xs space-y-2.5">
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Total Runs</span>
                <span className="font-bold text-[#081c15]">{partner?.totalDeliveries || 184}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Customer Rating</span>
                <span className="font-bold text-[#081c15]">★ {partner?.rating || 4.92} / 5.0</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">On-Time Rate</span>
                <span className="font-bold text-emerald-600">{partner?.onTimeRate || '98.5%'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Member Since</span>
                <span className="font-bold text-[#081c15]">{partner?.joinedDate || 'Jan 2025'}</span>
              </div>
            </div>
          </div>

          {/* Right Columns: Personal & Vehicle Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#081c15] uppercase tracking-wider mb-2">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Secondary / Backup Phone</label>
                  <input
                    type="tel"
                    name="secondaryPhone"
                    value={formData.secondaryPhone}
                    onChange={handleChange}
                    placeholder="+91 94220 11982"
                    className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="e.g. Sunita Kumar (Spouse) - +91 98221 44556"
                  className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle & Zone Specs */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#081c15] uppercase tracking-wider mb-2">
                Vehicle & Service Operational Zone
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Registration #</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Driving License #</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Operating Service Zone</label>
                <select
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none"
                >
                  <option value="Pune Central & Kothrud">Pune Central & Kothrud</option>
                  <option value="Baner / Wakad / PCMC">Baner / Wakad / PCMC</option>
                  <option value="Pune East & Hadapsar">Pune East & Hadapsar</option>
                  <option value="Mumbai South Suburbs">Mumbai South Suburbs</option>
                  <option value="Nashik Agro City">Nashik Agro City</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-xs transition shadow-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#2d6a4f]/20">
            <h3 className="text-base font-bold text-[#081c15] mb-2">Change Password</h3>

            {passwordMsg && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold">
                {passwordMsg}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f2] border rounded-xl text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPass}
                  onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f2] border rounded-xl text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f2] border rounded-xl text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

