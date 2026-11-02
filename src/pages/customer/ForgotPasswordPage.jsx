import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#52b788] to-[#1b4332] p-0.5 shadow-md">
            <div className="w-full h-full bg-[#081c15] rounded-[9px] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-[#52b788]" />
            </div>
          </div>
          <span className="font-outfit font-extrabold text-2xl text-[#081c15]">Farm to Home</span>
        </Link>
        <h2 className="font-outfit font-extrabold text-2xl text-[#081c15]">Reset Your Password</h2>
        <p className="mt-1 text-xs text-gray-600">Enter your registered email address to receive recovery instructions.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-gray-200">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center mx-auto mb-3 shadow">
                <CheckCircle2 className="w-6 h-6 text-[#40916c]" />
              </div>
              <h3 className="font-outfit font-bold text-lg text-[#081c15] mb-2">Password Reset Link Sent</h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                We have sent an authentication verification link to <strong>{email}</strong>. Please check your inbox and follow the steps.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1b4332] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Send Password Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-3">
                <Link to="/login" className="text-xs font-semibold text-gray-500 hover:text-gray-800">
                  Cancel & return to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

