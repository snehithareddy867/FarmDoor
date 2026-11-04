import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ChevronDown,
  LogOut,
  ExternalLink,
  Bell,
  Search,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import { handleAvatarError } from '../../utils/imageFallback';

export const AdminNavbar = ({ onToggleSidebar }) => {
  const { admin, logout, switchDemoAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [adminList, setAdminList] = useState([]);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [stats, setStats] = useState(null);

  const personaRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const accounts = await api.getAdminAccounts();
        setAdminList(accounts);
        const dashStats = await api.getAdminDashboardStats();
        setStats(dashStats);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [admin]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (personaRef.current && !personaRef.current.contains(e.target)) {
        setShowPersonaMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleSwitch = async (id) => {
    await switchDemoAdmin(id);
    setShowPersonaMenu(false);
  };

  const pendingApprovalsCount = (stats?.farmers?.pending || 0) + (stats?.products?.pendingApproval || 0) + (stats?.deliveryPartners?.pending || 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold tracking-tight text-white flex items-center gap-2">
                Farm to Home
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Control Console
                </span>
              </span>
              <p className="text-[11px] text-slate-400">National Marketplace Operations</p>
            </div>
          </Link>
        </div>

        {/* Center: Live Action Shortcuts */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition"
            title="Open Customer Marketplace in new tab"
          >
            <span>Customer View</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            to="/farmer/dashboard"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition"
            title="Open Farmer Producer Console in new tab"
          >
            <span>Farmer Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            to="/delivery/dashboard"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition"
            title="Open Field Courier App in new tab"
          >
            <span>Courier App</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Right: Persona Switcher, Alerts & Admin Profile */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Pending administrative approvals"
            >
              <Bell className="w-5 h-5" />
              {pendingApprovalsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-semibold text-sm text-white">Action Required</h4>
                  <span className="text-[11px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-medium">
                    {pendingApprovalsCount} items pending
                  </span>
                </div>
                <div className="py-2 space-y-2 text-xs">
                  <Link
                    to="/admin/farmers?filter=Pending"
                    onClick={() => setShowNotifMenu(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Pending Farmer KYC Audits
                    </span>
                    <span className="font-bold text-white">{stats?.farmers?.pending || 0}</span>
                  </Link>
                  <Link
                    to="/admin/products?filter=Pending"
                    onClick={() => setShowNotifMenu(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Pending Listing Approvals
                    </span>
                    <span className="font-bold text-white">{stats?.products?.pendingApproval || 0}</span>
                  </Link>
                  <Link
                    to="/admin/delivery-partners?filter=Pending"
                    onClick={() => setShowNotifMenu(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Courier Rider Onboarding
                    </span>
                    <span className="font-bold text-white">{stats?.deliveryPartners?.pending || 0}</span>
                  </Link>
                  <Link
                    to="/admin/complaints?status=Open"
                    onClick={() => setShowNotifMenu(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      Open Support Escalations
                    </span>
                    <span className="font-bold text-white">{stats?.complaints?.open || 0}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Persona Switcher / Profile Dropdown */}
          <div className="relative" ref={personaRef}>
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition group"
            >
              <img
                src={admin?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'}
                alt={admin?.name}
                loading="lazy"
                onError={(e) => handleAvatarError(e, 'admin')}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/50"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                  {admin?.name}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium leading-tight">
                  {admin?.role || 'Administrator'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-slate-200">
                <div className="px-3 py-2 border-b border-slate-800 mb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Preview Persona
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Test role-specific access controls</p>
                </div>

                <div className="space-y-1 mb-2">
                  {adminList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSwitch(item.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition ${
                        admin?.id === item.id
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-white'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <img
                        src={item.avatar}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => handleAvatarError(e, 'admin')}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate flex items-center justify-between">
                          <span>{item.name}</span>
                          {admin?.id === item.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-emerald-400/90 truncate">{item.role}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <Link
                    to="/admin/settings"
                    onClick={() => setShowPersonaMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    <span>Admin Settings & Security</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Secure Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

