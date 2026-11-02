import React, { useState } from 'react';
import { X, Sprout, Mail, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialTab = 'login', onLogin, onNotify }) {
  const [tab, setTab] = useState(initialTab); // 'login' or 'register'
  const [role, setRole] = useState('customer'); // 'customer' or 'farmer'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'login') {
      const demoUser = {
        name: email.split('@')[0] || 'Farm Lover',
        email: email,
        role: 'Customer'
      };
      onLogin(demoUser);
      onNotify(`Welcome back, ${demoUser.name}!`);
      onClose();
    } else {
      const newUser = {
        name: name || 'New Member',
        email: email,
        role: role === 'farmer' ? 'Farmer' : 'Customer'
      };
      onLogin(newUser);
      onNotify(`Account created successfully! Welcome, ${newUser.name}.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#081c15] p-6 text-white text-center relative border-b border-[#1b4332]">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#52b788] to-[#1b4332] p-0.5 mx-auto mb-3 shadow-lg">
            <div className="w-full h-full bg-[#081c15] rounded-[14px] flex items-center justify-center">
              <Sprout className="w-6 h-6 text-[#52b788]" />
            </div>
          </div>

          <h3 className="font-outfit font-extrabold text-2xl text-white">
            {tab === 'login' ? 'Welcome Back' : 'Join Farm to Home'}
          </h3>
          <p className="text-xs text-[#95d5b2] mt-1">
            {tab === 'login' 
              ? 'Access your fresh baskets and saved farm subscriptions' 
              : 'Direct connection to local growers and farm-gate prices'}
          </p>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#133926] rounded-xl mt-5 border border-[#2d6a4f]/50">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                tab === 'login' 
                  ? 'bg-[#52b788] text-[#081c15] shadow-md' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                tab === 'register' 
                  ? 'bg-[#52b788] text-[#081c15] shadow-md' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === 'register' && (
            <>
              {/* Account Role Selector */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                    role === 'customer'
                      ? 'border-[#40916c] bg-[#d8f3dc] text-[#1b4332]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Household Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                    role === 'farmer'
                      ? 'border-[#40916c] bg-[#d8f3dc] text-[#1b4332]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Farmer / Producer
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={role === 'farmer' ? "e.g. Ramesh Patel" : "e.g. Priya Sharma"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916c]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916c]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916c]"
              />
            </div>
          </div>

          {tab === 'login' && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#40916c] focus:ring-[#40916c]" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="text-[#2d6a4f] hover:underline font-semibold">Forgot password?</a>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-lg transition-all cursor-pointer mt-2"
          >
            {tab === 'login' ? 'Sign In to Marketplace' : 'Complete Registration'}
          </button>

          <p className="text-[11px] text-center text-gray-500 pt-1">
            By continuing, you agree to Farm to Home’s Terms of Trade and Harvest Quality Pledge.
          </p>
        </form>
      </div>
    </div>
  );
}

