import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Save, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  Eye, 
  EyeOff,
  Star
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export default function ProfilePage() {
  const { 
    user, 
    updateProfile, 
    addresses, 
    addAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useCustomerAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Address modal/inline
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    label: 'Home'
  });

  // Account Preferences
  const [preferences, setPreferences] = useState({
    morningHarvestAlerts: true,
    weeklyOrganicCatalog: true,
    ecoPackagingDefault: true,
    whatsappOrderUpdates: true
  });
  const [prefSaved, setPrefSaved] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    await updateProfile({ fullName, email, mobile });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordFeedback('');

    if (!oldPassword) {
      setPasswordError('Please provide your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordFeedback('Password updated successfully!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordFeedback(''), 3000);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addrForm.addressLine || !addrForm.city || !addrForm.pincode) return;
    addAddress(addrForm);
    setShowAddressForm(false);
    setAddrForm({
      fullName: user?.fullName || '',
      mobile: user?.mobile || '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      label: 'Home'
    });
  };

  const handleSavePreferences = () => {
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="font-outfit text-3xl font-extrabold text-[#081c15]">
          Customer Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Manage your personal identity, contact numbers, saved delivery addresses, and harvest preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Personal Info & Password (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Personal Details Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
            <h2 className="font-outfit font-extrabold text-lg text-[#081c15] flex items-center gap-2 pb-3 border-b border-gray-100">
              <User className="w-5 h-5 text-[#52b788]" />
              Personal Profile & Contact
            </h2>

            {profileSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-[#faf8f2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-[#faf8f2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-[#faf8f2]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-3.5 h-3.5" /> Save Profile Details
              </button>
            </form>
          </div>

          {/* 2. Change Password */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
            <h2 className="font-outfit font-extrabold text-lg text-[#081c15] flex items-center gap-2 pb-3 border-b border-gray-100">
              <Lock className="w-5 h-5 text-[#52b788]" />
              Change Password
            </h2>

            {passwordFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{passwordFeedback}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-[#faf8f2]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-[#faf8f2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-[#faf8f2]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-gray-500 hover:text-black flex items-center gap-1.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Saved Addresses & Preferences (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* 3. Manage Saved Addresses */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-outfit font-extrabold text-base text-[#081c15] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#52b788]" />
                Saved Addresses ({addresses.length})
              </h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs font-bold text-[#2d6a4f] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-[#faf8f2] border border-gray-200 space-y-3">
                <h4 className="font-bold text-xs text-[#081c15]">New Address Details</h4>
                <input
                  type="text"
                  required
                  placeholder="Street / Flat / Colony"
                  value={addrForm.addressLine}
                  onChange={(e) => setAddrForm({ ...addrForm, addressLine: e.target.value })}
                  className="w-full p-2 rounded-xl border border-gray-200 text-xs bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    className="p-2 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    value={addrForm.pincode}
                    onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })}
                    className="p-2 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold"
                >
                  Save Address
                </button>
              </form>
            )}

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3.5 rounded-2xl bg-[#faf8f2] border border-gray-200 text-xs flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#081c15]">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-[#52b788]/20 text-[#2d6a4f] text-[9px] font-bold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] text-[#2d6a4f] hover:underline font-semibold mt-1 inline-block"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Account Preferences */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-outfit font-extrabold text-base text-[#081c15] flex items-center gap-2 pb-3 border-b border-gray-100">
              <Sliders className="w-5 h-5 text-[#52b788]" />
              Account & Delivery Preferences
            </h2>

            {prefSaved && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl">
                Preferences saved!
              </div>
            )}

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Morning Dawn Harvest Alerts (SMS/Email)</span>
                <input
                  type="checkbox"
                  checked={preferences.morningHarvestAlerts}
                  onChange={(e) => setPreferences({ ...preferences, morningHarvestAlerts: e.target.checked })}
                  className="rounded text-[#2d6a4f] focus:ring-[#52b788]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Weekly Organic Vegetable Bulletin</span>
                <input
                  type="checkbox"
                  checked={preferences.weeklyOrganicCatalog}
                  onChange={(e) => setPreferences({ ...preferences, weeklyOrganicCatalog: e.target.checked })}
                  className="rounded text-[#2d6a4f] focus:ring-[#52b788]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Reusable Compostable Crates Default</span>
                <input
                  type="checkbox"
                  checked={preferences.ecoPackagingDefault}
                  onChange={(e) => setPreferences({ ...preferences, ecoPackagingDefault: e.target.checked })}
                  className="rounded text-[#2d6a4f] focus:ring-[#52b788]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>WhatsApp Live Dispatch Milestones</span>
                <input
                  type="checkbox"
                  checked={preferences.whatsappOrderUpdates}
                  onChange={(e) => setPreferences({ ...preferences, whatsappOrderUpdates: e.target.checked })}
                  className="rounded text-[#2d6a4f] focus:ring-[#52b788]"
                />
              </label>
            </div>

            <button
              onClick={handleSavePreferences}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1b4332] text-xs font-bold transition-colors cursor-pointer"
            >
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

