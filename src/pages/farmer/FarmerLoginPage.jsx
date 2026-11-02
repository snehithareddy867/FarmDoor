import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Store, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';

export default function FarmerLoginPage() {
  const { login } = useFarmerAuth();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password) {
      setErrorMsg('Please enter your credentials.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await login({ emailOrPhone, password });
      navigate('/farmer/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Farmer authentication failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-[#081c15] text-[#52b788] flex items-center justify-center border border-[#52b788]/30 shadow-md">
              <Store className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="mt-3 text-3xl font-black font-outfit text-[#081c15] tracking-tight">
            Farmer Partner Portal
          </h2>
          <p className="mt-1 text-sm text-[#2d6a4f]">
            List your harvest, manage customer orders, and track direct earnings
          </p>
        </div>

        {/* Regular Login Form Card */}
        <div className="bg-white py-8 px-6 shadow-xl shadow-emerald-950/5 rounded-3xl border border-[#2d6a4f]/20 sm:px-10">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider mb-1.5">
                Registered Email or Mobile
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="ramesh.greenvalley@farmtohome.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs text-[#081c15] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#081c15] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(emailOrPhone || '');
                    setForgotSubmitted(false);
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-semibold text-[#2d6a4f] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-sm transition shadow-lg disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In to Farm Workspace'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Are you a cultivator looking to sell direct?{' '}
            <Link to="/farmer/register" className="font-bold text-[#2d6a4f] hover:underline">
              Register Your Farm
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-[#2d6a4f]/20">
            <h3 className="text-lg font-bold font-outfit text-[#081c15] mb-1">
              Reset Farmer Passphrase
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Enter your registered agricultural email or mobile to receive OTP credential recovery instructions.
            </p>

            {forgotSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <span>Password recovery instructions sent to your registered contact!</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail.trim()) {
                    setForgotSubmitted(true);
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Email / Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. ramesh.greenvalley@farmtohome.in"
                    className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-xs transition"
                >
                  Send OTP Recovery Code
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full mt-2 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

