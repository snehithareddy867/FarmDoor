import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  ShieldCheck 
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useCustomerAuth();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/customer/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or 10-digit mobile number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({ emailOrPhone: emailOrPhone.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
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
        <h1 className="font-outfit font-extrabold text-3xl text-[#081c15]">
          Customer Sign In
        </h1>
        <p className="mt-2 text-sm text-[#5c4033]/80">
          Access your farm-fresh basket, live deliveries, and saved growers.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="name@example.com or 9876543210"
                  value={emailOrPhone}
                  onChange={(e) => { setEmailOrPhone(e.target.value); setError(''); }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#1b4332] hover:text-[#52b788] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#2d6a4f] focus:ring-[#52b788]"
                />
                <span className="text-xs text-gray-600">Remember this device</span>
              </label>

              <span className="text-[11px] text-[#40916c] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Secure
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-sm shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-5">
            <p className="text-xs text-gray-600">
              Don’t have a customer account?{' '}
              <Link to="/register" className="font-bold text-[#1b4332] hover:text-[#52b788] hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

