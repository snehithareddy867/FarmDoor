import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bike, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  ShieldCheck, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';

export default function DeliveryRegisterPage() {
  const { register } = useDeliveryAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411038',
    vehicleType: 'Eco Electric Two-Wheeler',
    vehicleModel: '',
    vehicleNumber: '',
    licenseNumber: '',
    serviceArea: 'Pune Central & Kothrud',
    preferredLanguage: 'Marathi / English / Hindi',
    emergencyContact: '',
    termsAccepted: false,
    documents: [
      { name: 'Commercial_Driving_License.pdf', type: 'Driving License', status: 'Under Review', date: new Date().toLocaleDateString() },
      { name: 'Government_Photo_ID.pdf', type: 'Aadhaar / National ID', status: 'Under Review', date: new Date().toLocaleDateString() },
      { name: 'Vehicle_Registration_RC.pdf', type: 'Vehicle RC', status: 'Under Review', date: new Date().toLocaleDateString() }
    ]
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFormError('');
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Please enter your full legal name.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please provide a valid email address.';
    if (!formData.mobile.trim() || formData.mobile.length < 10) return 'Please provide a valid 10-digit mobile number.';
    if (!formData.password || formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const validateStep2 = () => {
    if (!formData.address.trim()) return 'Please enter your street address.';
    if (!formData.pincode.trim() || formData.pincode.length < 6) return 'Please enter a valid 6-digit pincode.';
    if (!formData.vehicleModel.trim()) return 'Please specify your vehicle make & model (e.g. Ather 450X, Hero Splendor).';
    if (!formData.vehicleNumber.trim()) return 'Please enter vehicle registration number (e.g. MH-12-EA-4412).';
    if (!formData.licenseNumber.trim()) return 'Please enter your driving license number.';
    return '';
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setFormError(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setFormError(err);
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setFormError('Please accept the Delivery Partner Agreement and safety standards.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      await register({
        ...formData,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
      navigate('/delivery/verification');
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please check inputs.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-[#081c15] text-[#52b788] flex items-center justify-center border border-[#52b788]/30 shadow-md">
              <Bike className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="mt-3 text-3xl font-black font-outfit text-[#081c15] tracking-tight">
            Join the Eco-Delivery Fleet
          </h2>
          <p className="mt-1 text-sm text-[#2d6a4f]">
            Deliver fresh harvest directly from local organic farmers to urban homes.
          </p>
        </div>

        {/* Stepper Header */}
        <div className="bg-white p-4 rounded-3xl border border-[#2d6a4f]/15 shadow-sm mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-[#1b4332] px-2 sm:px-6">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#2d6a4f]' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-[#2d6a4f] text-white' : 'bg-gray-100 text-gray-400'}`}>
                1
              </span>
              <span>Account</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-200" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#2d6a4f]' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-[#2d6a4f] text-white' : 'bg-gray-100 text-gray-400'}`}>
                2
              </span>
              <span>Vehicle & Zone</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-200" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#2d6a4f]' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-[#2d6a4f] text-white' : 'bg-gray-100 text-gray-400'}`}>
                3
              </span>
              <span>Documents</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 shadow-xl shadow-emerald-950/5 rounded-3xl border border-[#2d6a4f]/20 sm:px-10">
          {formError && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                    Full Legal Name (as on Driving License) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Santosh Kumar"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rider@farmtohome.in"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="+91 98220 33411"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                    Emergency Contact Name & Phone
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="e.g. Sunita Kumar (Spouse) - +91 98221 44556"
                    className="w-full px-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-sm transition shadow-lg"
                  >
                    <span>Proceed to Vehicle & Zone</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Address, Vehicle & Service Area */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                    Residential Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Flat 12, Jai Malhar Apts, Paud Road"
                    className="w-full px-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="411038"
                      className="w-full px-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                      Vehicle Type *
                    </label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                    >
                      <option value="Eco Electric Two-Wheeler">🌱 Eco Electric Two-Wheeler (EV Bonus Eligible)</option>
                      <option value="Motorcycle">Motorcycle / Petrol Two-Wheeler</option>
                      <option value="Three Wheeler Cargo">Three Wheeler Cargo / Auto-Cargo</option>
                      <option value="Mini Van / Eco Van">Mini Van / Eco Van (Large Crates)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                      Preferred Service Zone *
                    </label>
                    <select
                      name="serviceArea"
                      value={formData.serviceArea}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                    >
                      <option value="Pune Central & Kothrud">Pune Central & Kothrud</option>
                      <option value="Baner / Wakad / PCMC">Baner / Wakad / PCMC</option>
                      <option value="Pune East & Hadapsar">Pune East & Hadapsar</option>
                      <option value="Mumbai South Suburbs">Mumbai South Suburbs</option>
                      <option value="Nashik Agro City">Nashik Agro City</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                      Vehicle Model *
                    </label>
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleChange}
                      placeholder="e.g. Ather 450X Cargo"
                      className="w-full px-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                      Vehicle Reg Number *
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      placeholder="MH-12-EA-4412"
                      className="w-full px-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                      Driving License # *
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="DL-MH12-2018-009412"
                      className="w-full px-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 px-4 rounded-2xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-2/3 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-sm transition shadow-lg"
                  >
                    <span>Proceed to Verification Docs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Document Attachments & Terms */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-xs text-gray-600">
                  Please attach scanned copies of mandatory compliance documents. PDF, JPG, and PNG are supported.
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#081c15]">Commercial Driving License</p>
                        <p className="text-[11px] text-gray-500">Valid LMV or MCWG license scan</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready to Verify</span>
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#081c15]">Government Identity Proof</p>
                        <p className="text-[11px] text-gray-500">Aadhaar Card or Voter ID</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready to Verify</span>
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#081c15]">Vehicle Registration Certificate (RC)</p>
                        <p className="text-[11px] text-gray-500">Vehicle Smart Card & Insurance</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready to Verify</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-[#2d6a4f] rounded focus:ring-[#52b788]"
                    />
                    <span className="text-xs text-gray-700">
                      I agree to the <span className="font-bold text-[#081c15]">Farm to Home Courier Code of Conduct</span>, safety protocols for handling organic farm produce, and platform terms of service.
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3 px-4 rounded-2xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-sm transition shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Creating Fleet Account...</span>
                    ) : (
                      <>
                        <span>Submit Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Already registered as a delivery partner?{' '}
            <Link to="/delivery/login" className="font-bold text-[#2d6a4f] hover:underline">
              Sign In to Fleet Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

