import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  KeyRound,
  Percent,
  Truck,
  MapPin,
  Save,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  UserCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminSettingsPage = () => {
  const { admin } = useAdminAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Form states for profile
  const [profileName, setProfileName] = useState(admin?.name || '');
  const [profileAvatar, setProfileAvatar] = useState(admin?.avatar || '');

  // Form states for platform config
  const [commissionRate, setCommissionRate] = useState(10);
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(40);
  const [ecoBonus, setEcoBonus] = useState(25);
  const [minOrder, setMinOrder] = useState(150);
  const [freeThreshold, setFreeThreshold] = useState(499);
  const [zones, setZones] = useState([]);

  // New zone state
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneHub, setNewZoneHub] = useState('');

  // Password update state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await api.getPlatformSettings();
        setSettings(data);
        setCommissionRate(data.platformFeeRate || 10);
        setBaseDeliveryFee(data.baseDeliveryFee || 40);
        setEcoBonus(data.ecoFleetBonus || 25);
        setMinOrder(data.minOrderAmount || 150);
        setFreeThreshold(data.freeDeliveryThreshold || 499);
        setZones(data.supportedZones || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    try {
      const res = await api.updateAdminProfile(admin.id, {
        name: profileName,
        avatar: profileAvatar
      });
      if (res.success) {
        setFeedback({ type: 'success', text: 'Admin profile updated successfully.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleSavePlatformSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updatePlatformSettings(
        {
          platformFeeRate: Number(commissionRate),
          baseDeliveryFee: Number(baseDeliveryFee),
          ecoFleetBonus: Number(ecoBonus),
          minOrderAmount: Number(minOrder),
          freeDeliveryThreshold: Number(freeThreshold),
          supportedZones: zones
        },
        `${admin?.name} (${admin?.role})`
      );

      if (res.success) {
        setFeedback({ type: 'success', text: 'Global platform settings and commission rates updated.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to save settings.' });
    }
  };

  const handleAddZone = () => {
    if (!newZoneName.trim() || !newZoneHub.trim()) {
      alert('Please fill out zone title and primary staging hub.');
      return;
    }
    const newZ = {
      id: `zone-${Date.now().toString().slice(-4)}`,
      name: newZoneName,
      hub: newZoneHub,
      active: true
    };
    setZones([...zones, newZ]);
    setNewZoneName('');
    setNewZoneHub('');
  };

  const handleToggleZone = (id) => {
    setZones(zones.map((z) => (z.id === id ? { ...z, active: !z.active } : z)));
  };

  const handleDeleteZone = (id) => {
    setZones(zones.filter((z) => z.id !== id));
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPass.length < 6) {
      alert('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      alert('Passwords do not match.');
      return;
    }
    setFeedback({ type: 'success', text: 'Administrator security credentials updated.' });
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-emerald-400" />
            Platform Configuration & Administration Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global commission percentages, delivery logistics fees, eco bonuses, and regional fulfillment hubs.
          </p>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Platform Commission & Economics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Global Commission & Fees Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              Platform Monetization & Fee Schedule
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Governs the automatic breakdown split applied to customer orders at settlement.
            </p>

            <form onSubmit={handleSavePlatformSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Platform Commission Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-500">%</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Standard producer fee (default 10%)</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Base Delivery Fee (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={baseDeliveryFee}
                      onChange={(e) => setBaseDeliveryFee(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-500">INR</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Charged on orders below free threshold</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Eco-Fleet EV Incentive Bonus (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={ecoBonus}
                      onChange={(e) => setEcoBonus(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-500">INR</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Bonus added for electric vehicle riders</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Free Delivery Threshold (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={freeThreshold}
                      onChange={(e) => setFreeThreshold(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-500">INR</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Basket size for complimentary transit</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Economics Configuration</span>
                </button>
              </div>
            </form>
          </div>

          {/* Regional Delivery Zones */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Supported Fulfillment Hubs & Regional Zones
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Regional operating territories eligible for same-day harvest delivery.
            </p>

            <div className="space-y-2 mb-4">
              {zones.map((z) => (
                <div key={z.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">{z.name}</div>
                    <div className="text-[10px] text-slate-400">Hub: {z.hub}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleZone(z.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        z.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {z.active ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteZone(z.id)}
                      className="p-1 hover:text-rose-400 text-slate-500 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Zone Inline */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Zone Title (e.g. Nagpur Citrus Corridor)"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                className="flex-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                placeholder="Staging Hub Name"
                value={newZoneHub}
                onChange={(e) => setNewZoneHub(e.target.value)}
                className="flex-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddZone}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Zone</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Profile & Security */}
        <div className="space-y-6">
          {/* Admin Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Active Admin Identity
            </h3>
            <p className="text-xs text-slate-400 mb-4">Credentials & profile visual</p>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Account (Immutable)</label>
                <input
                  type="text"
                  disabled
                  value={admin?.email || 'admin@farmtohome.in'}
                  className="w-full p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={profileAvatar}
                  onChange={(e) => setProfileAvatar(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition"
              >
                Update Profile
              </button>
            </form>
          </div>

          {/* Security & Password */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              Security & Password
            </h3>
            <p className="text-xs text-slate-400 mb-4">Update administrator passphrase</p>

            <form onSubmit={handleUpdatePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition"
              >
                Change Passphrase
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

