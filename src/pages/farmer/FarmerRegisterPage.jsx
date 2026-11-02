import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Building, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';

const CROP_OPTIONS = [
  'Organic Vegetables',
  'Orchard Fruits',
  'Pastoral Desi Cow Dairy',
  'Heirloom Grains & Millets',
  'Raw Forest Honey',
  'Cold-Pressed Virgin Oils',
  'Culinary Herbs & Spices'
];

export default function FarmerRegisterPage() {
  const navigate = useNavigate();
  const { register } = useFarmerAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    farmAddress: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    farmType: 'Certified Organic Family Farm',
    productsGrown: ['Organic Vegetables'],
    farmDescription: '',
    acceptTerms: false
  });

  const [uploadedDocs, setUploadedDocs] = useState([
    { name: 'Kisan_Identity_Card.pdf', size: '1.2 MB' }
  ]);
  const [docNameInput, setDocNameInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const toggleCrop = (crop) => {
    setFormData((prev) => {
      const exists = prev.productsGrown.includes(crop);
      const updated = exists
        ? prev.productsGrown.filter((c) => c !== crop)
        : [...prev.productsGrown, crop];
      return { ...prev, productsGrown: updated };
    });
  };

  const handleAddDoc = () => {
    if (docNameInput.trim()) {
      setUploadedDocs((prev) => [
        ...prev,
        { name: docNameInput.trim(), size: '1.8 MB' }
      ]);
      setDocNameInput('');
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length < 10) {
      errs.mobile = 'Valid 10-digit mobile number required';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!formData.farmName.trim()) errs.farmName = 'Farm name is required';
    if (!formData.farmAddress.trim()) errs.farmAddress = 'Farm address is required';
    if (!formData.district.trim()) errs.district = 'District is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pincode.trim()) errs.pincode = 'Pincode is required';
    if (!formData.farmDescription.trim()) errs.farmDescription = 'Please describe your farm and soil';
    if (!formData.acceptTerms) errs.acceptTerms = 'You must accept the Farmer Charter to register';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      await register({
        ...formData,
        documents: uploadedDocs.map((d) => ({
          name: d.name,
          type: 'Farmer Verification Record',
          status: 'Under Review'
        }))
      });

      setRegisteredSuccess(true);
      setTimeout(() => {
        navigate('/farmer/verification');
      }, 1500);
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#52b788] to-[#1b4332] p-0.5 shadow-md">
            <div className="w-full h-full bg-[#081c15] rounded-[10px] flex items-center justify-center">
              <Sprout className="w-6 h-6 text-[#52b788]" />
            </div>
          </div>
          <span className="font-outfit font-extrabold text-2xl text-[#081c15]">Farm to Home</span>
        </Link>
        <h1 className="font-outfit font-extrabold text-3xl sm:text-4xl text-[#081c15]">
          Farmer & Grower Registration
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#5c4033]/80">
          Sell directly to thousands of urban households at transparent farm-gate prices.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-gray-200">
          {registeredSuccess ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center mb-4 shadow-lg animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-[#40916c]" />
              </div>
              <h3 className="font-outfit text-2xl font-bold text-[#081c15] mb-2">
                Application Submitted for Verification!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-md">
                Your farm details and verification documents are now logged. Redirecting to your Farmer Verification Status dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
              {errors.form && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* 1. Farmer Personal Info */}
              <div className="border-b border-gray-100 pb-5 space-y-4">
                <h3 className="font-outfit font-bold text-base text-[#081c15] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#52b788]" /> 1. Grower Identity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Patel"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
                    />
                    {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      placeholder="ramesh@greenvalley.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
                    />
                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      placeholder="9823145012"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
                    />
                    {errors.mobile && <p className="text-[11px] text-red-500 mt-1">{errors.mobile}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-2.5 pr-10 rounded-xl border border-gray-200 bg-[#faf8f2]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password *</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
                    />
                    {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* 2. Farm Location & Address */}
              <div className="border-b border-gray-100 pb-5 space-y-4">
                <h3 className="font-outfit font-bold text-base text-[#081c15] flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#52b788]" /> 2. Farm Estate Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Farm / Agro Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Green Valley Agro Haven"
                      value={formData.farmName}
                      onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
                    />
                    {errors.farmName && <p className="text-[11px] text-red-500 mt-1">{errors.farmName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Farming Type</label>
                    <select
                      value={formData.farmType}
                      onChange={(e) => setFormData({ ...formData, farmType: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
                    >
                      <option value="Certified Organic Family Farm">100% Certified Organic Farm</option>
                      <option value="Natural Farming (ZBNF)">Natural / Zero-Budget (ZBNF)</option>
                      <option value="Mountain Orchard">Mountain Fruit Orchard</option>
                      <option value="Free-Range Pastoral Dairy">Free-Range Pastoral Dairy</option>
                      <option value="Heritage Grain Farm">Heritage Grain & Pulse Cultivation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Farm Street / Survey Address *</label>
                  <input
                    type="text"
                    placeholder="Survey No. 42/B, Old Canal Road"
                    value={formData.farmAddress}
                    onChange={(e) => setFormData({ ...formData, farmAddress: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
                  />
                  {errors.farmAddress && <p className="text-[11px] text-red-500 mt-1">{errors.farmAddress}</p>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Village</label>
                    <input
                      type="text"
                      placeholder="e.g. Dindori"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">District *</label>
                    <input
                      type="text"
                      placeholder="e.g. Nashik"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
                    />
                    {errors.district && <p className="text-[11px] text-red-500 mt-1">{errors.district}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
                    />
                    {errors.state && <p className="text-[11px] text-red-500 mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="422202"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
                    />
                    {errors.pincode && <p className="text-[11px] text-red-500 mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              {/* 3. Crops & Farm Description */}
              <div className="border-b border-gray-100 pb-5 space-y-4">
                <h3 className="font-outfit font-bold text-base text-[#081c15] flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#52b788]" /> 3. Harvests & Cultivation Practices
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Primary Crops Produced (Select All Applicable)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CROP_OPTIONS.map((c) => {
                      const isSel = formData.productsGrown.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleCrop(c)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            isSel
                              ? 'bg-[#1b4332] text-white border-[#1b4332]'
                              : 'bg-[#faf8f2] text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '} {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Farm Bio & Soil Enrichment Practices *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell urban families about your heritage, organic soil practices, composting, and water source..."
                    value={formData.farmDescription}
                    onChange={(e) => setFormData({ ...formData, farmDescription: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
                  />
                  {errors.farmDescription && <p className="text-[11px] text-red-500 mt-1">{errors.farmDescription}</p>}
                </div>
              </div>

              {/* 4. Verification Documents Upload */}
              <div className="border-b border-gray-100 pb-5 space-y-4">
                <h3 className="font-outfit font-bold text-base text-[#081c15] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#52b788]" /> 4. Verification Documents
                </h3>
                <p className="text-xs text-gray-500">
                  Upload Government Land Record (7/12 extract), Kisan ID, Aadhaar, or Organic Certification.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter document filename (e.g. Organic_Certificate_2026.pdf)"
                    value={docNameInput}
                    onChange={(e) => setDocNameInput(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2] text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddDoc}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#1b4332]"
                  >
                    + Attach File
                  </button>
                </div>

                <div className="space-y-2">
                  {uploadedDocs.map((doc, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#52b788]" />
                        <span className="font-bold text-[#081c15]">{doc.name}</span>
                        <span className="text-gray-400">({doc.size})</span>
                      </div>
                      <span className="text-emerald-700 font-semibold text-[11px]">Ready for Verification</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded text-[#2d6a4f] focus:ring-[#52b788]"
                  />
                  <span className="text-xs text-gray-600">
                    I pledge that all crops listed will adhere to natural, honest cultivation practices, zero synthetic ripening gases, and agree to the{' '}
                    <strong className="text-[#1b4332]">Farm to Home Grower Charter</strong>.
                  </span>
                </label>
                {errors.acceptTerms && <p className="text-[11px] text-red-500 mt-1">{errors.acceptTerms}</p>}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                {loading ? <span>Submitting Application...</span> : <><span>Complete Farmer Registration</span><ArrowRight className="w-4 h-4" /></>}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-600">
                  Already registered as a partner grower?{' '}
                  <Link to="/farmer/login" className="font-bold text-[#1b4332] hover:underline">
                    Sign in to Grower Desk
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

