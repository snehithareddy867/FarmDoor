import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bike, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';

export default function DeliveryLoginPage() {
  const { login } = useDeliveryAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const from = location.state?.from?.pathname || '/delivery/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your email or registered phone number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await login({ emailOrPhone, password });
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials.');
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (forgotEmail) {
      setResetSuccess(true);
      setTimeout(() => {
        setForgotModalOpen(false);
        setResetSuccess(false);
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-[#081c15] text-[#52b788] flex items-center justify-center border border-[#52b788]/30 shadow-md">
              <Bike className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="mt-3 text-3xl font-black font-outfit text-[#081c15] tracking-tight">
            Fleet Partner Login
          </h2>
          <p className="mt-1 text-sm text-[#2d6a4f]">
            Access delivery jobs, turn-by-turn routes & weekly settlements
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
                  placeholder="santosh.kumar@farmtohome.in"
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
                  onClick={() => setForgotModalOpen(true)}
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
              {isSubmitting ? 'Signing in...' : 'Sign In to Courier Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Don't have a delivery fleet account?{' '}
            <Link to="/delivery/register" className="font-bold text-[#2d6a4f] hover:underline">
              Apply to Deliver
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#2d6a4f]/20">
            <h3 className="text-base font-bold text-[#081c15] mb-2">Reset Password</h3>
            <p className="text-xs text-gray-600 mb-4">
              Enter your registered courier email or mobile number to receive verification code.
            </p>

            {resetSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Password reset link sent to your phone/email!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <input
                  type="text"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter email or mobile"
                  className="w-full px-4 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 rounded-xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332]"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

