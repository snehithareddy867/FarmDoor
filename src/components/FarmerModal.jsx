import React, { useState } from 'react';
import { X, Sprout, ShieldCheck, CheckCircle2, MapPin, Phone, User, Building, Sparkles } from 'lucide-react';

export default function FarmerModal({ isOpen, onClose, onNotify }) {
  const [formData, setFormData] = useState({
    farmerName: '',
    farmName: '',
    phone: '',
    location: '',
    acreage: '',
    crops: ['Vegetables'],
    farmingType: '100% Organic'
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCropToggle = (crop) => {
    setFormData((prev) => {
      const exists = prev.crops.includes(crop);
      if (exists) {
        return { ...prev, crops: prev.crops.filter((c) => c !== crop) };
      } else {
        return { ...prev, crops: [...prev.crops, crop] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    onNotify(`Farmer application for ${formData.farmName || 'your farm'} submitted!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#081c15] p-6 text-white relative border-b border-[#1b4332] shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#52b788] to-[#1b4332] p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-[#081c15] rounded-[14px] flex items-center justify-center">
                <Sprout className="w-6 h-6 text-[#52b788]" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#74c69d]">
                <Sparkles className="w-3.5 h-3.5" />
                Grower Verification Portal
              </div>
              <h3 className="font-outfit font-extrabold text-2xl text-white">
                Register as a Verified Farmer
              </h3>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-[#40916c]" />
              </div>
              <h4 className="font-outfit text-2xl font-bold text-[#081c15] mb-2">
                Application Received!
              </h4>
              <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                Thank you, <strong>{formData.farmerName}</strong>. Our Regional Agricultural Manager will inspect and verify <strong>{formData.farmName}</strong> within 24 hours to activate your direct seller dashboard.
              </p>

              <div className="bg-[#faf8f2] p-4 rounded-2xl border border-gray-200 text-left text-xs text-gray-600 mb-6 max-w-md mx-auto space-y-2">
                <p className="font-bold text-[#1b4332]">What Happens Next:</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52b788]" />
                  <span>Doorstep soil & water quality test check</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52b788]" />
                  <span>Free reusable transport eco-crates issued</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52b788]" />
                  <span>Direct daily mobile app pricing access activated</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-8 py-3 rounded-xl bg-[#1b4332] text-white font-bold text-sm hover:bg-[#2d6a4f] transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Farmer / Grower Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={formData.farmerName}
                      onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#40916c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Farm / Estate Name *</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Green Valley Agro Haven"
                      value={formData.farmName}
                      onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#40916c]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#40916c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location (District & State) *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nashik, Maharashtra"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#40916c]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Total Cultivated Area</label>
                  <select
                    value={formData.acreage}
                    onChange={(e) => setFormData({ ...formData, acreage: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#40916c] bg-white"
                  >
                    <option value="">Select Acreage</option>
                    <option value="1-3">1 to 3 Acres (Smallholder)</option>
                    <option value="4-10">4 to 10 Acres (Medium)</option>
                    <option value="10+">10+ Acres (Commercial Organic)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Farming Practice</label>
                  <select
                    value={formData.farmingType}
                    onChange={(e) => setFormData({ ...formData, farmingType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#40916c] bg-white"
                  >
                    <option value="100% Organic">100% Certified Organic</option>
                    <option value="Natural / ZBNF">Natural / Zero Budget (ZBNF)</option>
                    <option value="Pesticide-Free">Pesticide-Free Traditional</option>
                    <option value="Hydroponic">Protected / Polyhouse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Crops Ready to Sell (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {['Vegetables', 'Fruits', 'Dairy & Ghee', 'Grains & Millets', 'Raw Honey', 'Cold-Pressed Oils'].map((crop) => {
                    const isChecked = formData.crops.includes(crop);
                    return (
                      <button
                        type="button"
                        key={crop}
                        onClick={() => handleCropToggle(crop)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isChecked
                            ? 'bg-[#1b4332] text-white border-[#1b4332]'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {isChecked ? '✓ ' : '+ '} {crop}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-[#d8f3dc]/60 rounded-xl flex items-center gap-2 text-[11px] text-[#1b4332]">
                <ShieldCheck className="w-4 h-4 text-[#40916c] shrink-0" />
                <span>Zero commission for your initial 90 days. Free doorstep collection.</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-xl transition-all cursor-pointer"
                >
                  Submit Farmer Application
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

