import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Bell, 
  User, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  ExternalLink,
  Sliders,
  Menu,
  X
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { handleAvatarError } from '../../utils/imageFallback';

export default function FarmerNavbar({ onToggleMobileSidebar }) {
  const navigate = useNavigate();
  const { farmer, logout, verificationStatus, toggleVerificationStatusForTesting } = useFarmerAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [testerOpen, setTesterOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/farmer/login');
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case 'Approved':
        return {
          icon: ShieldCheck,
          text: 'Verified Grower',
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
      case 'Rejected':
        return {
          icon: XCircle,
          text: 'Action Required',
          bg: 'bg-red-500/20 text-red-300 border-red-500/40'
        };
      default:
        return {
          icon: Clock,
          text: 'Verification Pending',
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
    }
  };

  const badge = getStatusBadge();
  const StatusIcon = badge.icon;

  return (
    <header className="sticky top-0 z-30 bg-[#081c15] text-white border-b border-[#2d6a4f]/40 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/farmer/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#52b788] to-[#1b4332] p-0.5 shadow-md">
              <div className="w-full h-full bg-[#081c15] rounded-[10px] flex items-center justify-center">
                <Sprout className="w-4 h-4 text-[#52b788]" />
              </div>
            </div>
            <div>
              <span className="font-outfit font-extrabold text-base text-white tracking-tight flex items-center gap-1.5 leading-none">
                Farm to Home
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#95d5b2] mt-0.5 block">
                Farmer & Grower Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Center/Right: Verification Status Pill & Tester Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Verification Status Pill */}
          <Link
            to="/farmer/verification"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${badge.bg}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{badge.text}</span>
          </Link>

          {/* Reviewer Simulation Tool */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setTesterOpen(!testerOpen)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-semibold border border-white/10 flex items-center gap-1"
              title="Test Requirement C: Verification status restrictions"
            >
              <Sliders className="w-3 h-3 text-[#52b788]" />
              <span>Simulate Status</span>
            </button>

            {testerOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0d281e] border border-[#2d6a4f] rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1">
                <p className="px-2 py-1 text-[10px] uppercase font-bold text-gray-400">
                  Switch State:
                </p>
                <button
                  onClick={() => { toggleVerificationStatusForTesting('Approved'); setTesterOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-emerald-300 hover:bg-[#1b4332] flex items-center justify-between"
                >
                  <span>Approved (Selling ON)</span>
                  {verificationStatus === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => { toggleVerificationStatusForTesting('Pending'); setTesterOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-amber-300 hover:bg-[#1b4332] flex items-center justify-between"
                >
                  <span>Pending (Restricted)</span>
                  {verificationStatus === 'Pending' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => { toggleVerificationStatusForTesting('Rejected'); setTesterOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-red-300 hover:bg-[#1b4332] flex items-center justify-between"
                >
                  <span>Rejected (Resubmit)</span>
                  {verificationStatus === 'Rejected' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Shortcut */}
          <Link
            to="/farmer/notifications"
            className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors relative"
            title="Farmer Notifications"
          >
            <Bell className="w-5 h-5 text-[#95d5b2]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#52b788]" />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#2d6a4f]/40 text-left transition-colors"
            >
              <img
                src={farmer?.avatar}
                alt={farmer?.name || 'Farmer Avatar'}
                loading="lazy"
                onError={(e) => handleAvatarError(e, 'farmer')}
                className="w-7 h-7 rounded-lg object-cover border border-[#52b788]"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-white leading-none">
                  {farmer?.name?.split(' ')[0]}
                </span>
                <span className="text-[10px] text-[#95d5b2] leading-none mt-0.5 truncate max-w-[100px]">
                  {farmer?.farmName}
                </span>
              </div>
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#081c15] border border-[#2d6a4f]/60 shadow-2xl py-2 z-50 text-xs animate-in fade-in"
                onClick={() => setProfileOpen(false)}
              >
                <div className="px-4 py-2 border-b border-[#2d6a4f]/40">
                  <p className="font-bold text-white text-sm">{farmer?.name}</p>
                  <p className="text-[#95d5b2] text-[11px] truncate">{farmer?.farmName}</p>
                  <p className="text-gray-400 text-[10px]">{farmer?.location}</p>
                </div>

                <Link
                  to="/farmer/profile"
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#1b4332]"
                >
                  <User className="w-4 h-4 text-[#52b788]" />
                  Farm Profile & Photographs
                </Link>

                <Link
                  to="/farmer/verification"
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#1b4332]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#52b788]" />
                  Verification Documents
                </Link>

                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#1b4332]"
                >
                  <ExternalLink className="w-4 h-4 text-[#74c69d]" />
                  View Public Website
                </Link>

                <div className="border-t border-[#2d6a4f]/40 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-950/30 font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out of Farmer Desk
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

