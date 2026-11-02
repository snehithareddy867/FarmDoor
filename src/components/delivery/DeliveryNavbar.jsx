import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bike, 
  Power, 
  MapPin, 
  Bell, 
  User, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Menu, 
  LogOut, 
  ChevronDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';

export default function DeliveryNavbar({ onToggleMobileSidebar }) {
  const { 
    partner, 
    isOnline, 
    toggleOnline, 
    serviceArea, 
    setServiceArea, 
    verificationStatus,
    isApproved,
    logout,
    switchDemoAccount,
    toggleVerificationForTesting
  } = useDeliveryAuth();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/delivery/login');
  };

  const SERVICE_AREAS = [
    'Pune Central & Kothrud',
    'Baner / Wakad / PCMC',
    'Pune East & Hadapsar',
    'Mumbai South Suburbs',
    'Nashik Agro City'
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#081c15] text-white border-b border-[#2d6a4f]/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Mobile menu button + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/delivery/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#40916c] to-[#1b4332] flex items-center justify-center text-white shadow-md shadow-emerald-950/40 border border-[#52b788]/30 group-hover:scale-105 transition">
              <Bike className="w-5 h-5 text-[#b7e4c7]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-outfit font-black text-lg tracking-tight text-white">
                  Farm to Home
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#52b788]/20 text-[#74c69d] border border-[#52b788]/30">
                  Fleet
                </span>
              </div>
              <p className="text-[11px] text-[#74c69d] hidden sm:block">Eco-Courier Partner Workspace</p>
            </div>
          </Link>
        </div>

        {/* Center: Online/Offline Toggle & Service Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online Toggle Pill */}
          <button
            onClick={toggleOnline}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border ${
              isOnline
                ? 'bg-[#1b4332] text-white border-[#52b788] ring-2 ring-[#52b788]/30'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'
            }`}
            title={isOnline ? 'You are receiving delivery jobs' : 'You are offline (Jobs paused)'}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full transition ${
                isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
              }`}
            />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
            <Power className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Service Area Selector (hidden on small screens) */}
          <div className="relative hidden md:block">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <MapPin className="w-3.5 h-3.5 text-[#52b788]" />
              <select
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                className="bg-transparent text-gray-200 text-xs font-medium focus:outline-none cursor-pointer pr-2"
              >
                {SERVICE_AREAS.map((area) => (
                  <option key={area} value={area} className="bg-[#081c15] text-white">
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Section: Status badge, Notification & Partner Profile */}
        <div className="flex items-center gap-2.5">
          {/* Verification Status Pill */}
          <Link
            to="/delivery/verification"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition ${
              isApproved
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                : verificationStatus === 'Pending'
                ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 hover:bg-amber-900/60'
                : 'bg-rose-950/60 text-rose-300 border-rose-500/40 hover:bg-rose-900/60'
            }`}
          >
            {isApproved ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : verificationStatus === 'Pending' ? (
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>{verificationStatus}</span>
          </Link>

          {/* Notifications Shortcut */}
          <Link
            to="/delivery/notifications"
            className="relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#52b788]" />
          </Link>

          {/* User Profile & Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              <img
                src={partner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={partner?.name || 'Rider'}
                className="w-7 h-7 rounded-full object-cover border border-[#52b788]/60"
              />
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-white truncate max-w-[100px] leading-tight">
                  {partner?.name || 'Santosh'}
                </p>
                <p className="text-[10px] text-[#74c69d] leading-tight">
                  {partner?.vehicleType?.includes('Electric') ? '🌱 EV Fleet' : 'Courier'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-[#081c15] border border-[#2d6a4f]/50 rounded-2xl shadow-2xl py-2 z-50 text-xs backdrop-blur-xl"
                onClick={() => setProfileDropdownOpen(false)}
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="font-bold text-sm text-white">{partner?.name}</p>
                  <p className="text-[11px] text-gray-400">{partner?.email}</p>
                  <p className="text-[11px] text-[#52b788] mt-1 font-semibold">
                    {partner?.vehicleNumber} • {partner?.vehicleModel}
                  </p>
                </div>

                {/* Persona Switcher for effortless testing */}
                <div className="p-3 bg-white/5 border-b border-white/10">
                  <p className="text-[10px] uppercase font-bold text-[#74c69d] tracking-wider mb-2">
                    ⚡ Quick Persona Switch (Testing)
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={() => switchDemoAccount('partner-1')}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-gray-200"
                    >
                      <span className="font-medium">Santosh (Approved EV)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Active
                      </span>
                    </button>
                    <button
                      onClick={() => switchDemoAccount('partner-pending')}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-gray-200"
                    >
                      <span className="font-medium">Vikram (Pending Review)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        Locked
                      </span>
                    </button>
                    <button
                      onClick={() => switchDemoAccount('partner-rejected')}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-gray-200"
                    >
                      <span className="font-medium">Sunil (Rejected Docs)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                        Action
                      </span>
                    </button>
                  </div>
                </div>

                {/* Links */}
                <div className="py-1">
                  <Link
                    to="/delivery/profile"
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/10 text-gray-200"
                  >
                    <User className="w-4 h-4 text-[#52b788]" />
                    <span>My Rider Profile</span>
                  </Link>
                  <Link
                    to="/delivery/earnings"
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/10 text-gray-200"
                  >
                    <Sparkles className="w-4 h-4 text-[#52b788]" />
                    <span>Earnings & Bank Account</span>
                  </Link>
                  <Link
                    to="/"
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/10 text-gray-200 border-t border-white/5"
                  >
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                    <span>Switch to Customer Store</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="pt-1 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-500/10 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

