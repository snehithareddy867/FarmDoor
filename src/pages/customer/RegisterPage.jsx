import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useCustomerAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    deliveryAddress: '',
    city: '',
    state: '',
    pincode: '',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (cleanMobile.length < 10) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    const pinRegex = /^\d{6}$/;
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!pinRegex.test(formData.pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit postal code';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms & conditions to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        password: formData.password,
        deliveryAddress: formData.deliveryAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim()
      });

      setSuccessMessage('Registration successful! Welcome to the Farm to Home family.');
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 1200);
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#52b788] to-[#1b4332] p-0.5 shadow-md">
            <div className="w-full h-full bg-[#081c15] rounded-[10px] flex items-center justify-center">
              <Sprout className="w-6 h-6 text-[#52b788]" />
            </div>
          </div>
          <span className="font-outfit font-extrabold text-2xl text-[#081c15] tracking-tight">
            Farm to Home
          </span>
        </Link>
        <h1 className="font-outfit font-extrabold text-3xl sm:text-4xl text-[#081c15]">
          Customer Account Registration
        </h1>
        <p className="mt-2 text-sm text-[#5c4033]/80">
          Create an account to purchase dawn-harvested organic produce straight from local farmers.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-gray-200">
          {successMessage ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center mb-4 shadow-lg animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-[#40916c]" />
              </div>
              <h3 className="font-outfit text-2xl font-bold text-[#081c15] mb-2">
                Registration Successful!
              </h3>
              <p className="text-sm text-gray-600 mb-6">{successMessage}</p>
              <div className="flex items-center gap-2 text-xs text-[#2d6a4f] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#52b788] animate-ping" />
                <span>Redirecting to your fresh food dashboard...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.form && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Personal Details */}
              <div className="border-b border-gray-100 pb-5">
                <h3 className="font-outfit font-bold text-base text-[#081c15] mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#52b788]" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="e.g. Priya Sharma"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-[#faf8f2] focus:outline-none focus:ring-2 ${
                          errors.fullName ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#52b788]'
                        }`}
                      />
                    </div>
                    {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="mobile"
                        placeholder="e.g. 9876543210"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-[#faf8f2] focus:outline-none focus:ring-2 ${
                          errors.mobile ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#52b788]'
                        }`}
                      />
                    </div>
                    {errors.mobile && <p className="text-[11px] text-red-500 mt-1">{errors.mobile}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. priya.sharma@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-[#faf8f2] focus:outline-none focus:ring-2 ${
                        errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#52b788]'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Password Section */}
              <div className="border-b border-gray-100 pb-5">
                <h3 className="font-outfit font-bold text-base text-[#081c15] mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#52b788]" />
                  Security
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm bg-[#faf8f2] focus:outline-none focus:ring-2 ${
                          errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#52b788]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm bg-[#faf8f2] focus:outline-none focus:ring-2 ${
                          errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#52b788]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="border-b border-gray-100 pb-5">
                <h3 className="font-outfit font-bold text-base text-[#081c15] mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#52b788]" />
                  Primary Delivery Address
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Street / Flat / House Address *
                    </label>
                    <textarea
                      name="deliveryAddress"
                      rows={2}
                      placeholder="e.g. Flat 402, Green Woods Residency, Baner Road"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-[#faf8f2] focus:outline-none focus:ring-2 ${
                        errors.deliveryAddress ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#52b788]'
                      }`}
                    />
                    {errors.deliveryAddress && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.deliveryAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="e.g. Pune"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-[#faf8f2] focus:outline-none focus:ring-2 ${
                          errors.city ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#52b788]'
                        }`}
                      />
                      {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="e.g. Maharashtra"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-[#faf8f2] focus:outline-none focus:ring-2 ${
                          errors.state ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#52b788]'
                        }`}
                      />
                      {errors.state && <p className="text-[11px] text-red-500 mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        placeholder="e.g. 411045"
                        value={formData.pincode}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-[#faf8f2] focus:outline-none focus:ring-2 ${
                          errors.pincode ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#52b788]'
                        }`}
                      />
                      {errors.pincode && <p className="text-[11px] text-red-500 mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2d6a4f] focus:ring-[#52b788]"
                  />
                  <span className="text-xs text-gray-600">
                    I agree to the{' '}
                    <a href="#terms" className="text-[#1b4332] font-bold hover:underline">
                      Farm to Home Terms of Trade
                    </a>
                    , Dawn-Harvest Replacement Guarantee, and Privacy Policy.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.acceptTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] hover:from-[#2d6a4f] hover:to-[#40916c] text-white font-extrabold text-sm shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Customer Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-[#1b4332] hover:text-[#52b788] hover:underline">
                    Sign In here
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

