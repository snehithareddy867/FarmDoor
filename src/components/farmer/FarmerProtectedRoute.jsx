import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { storageService } from '../../services/storage';
import { ShieldAlert, ArrowRight, Store } from 'lucide-react';

export default function FarmerProtectedRoute({ children }) {
  const { farmer, loading, isAuthenticated } = useFarmerAuth();
  const location = useLocation();
  const activeRole = storageService.getActiveRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2d6a4f] border-t-[#52b788] rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#1b4332]">Loading Farmer Session...</p>
        </div>
      </div>
    );
  }

  // Cross-role protection: if another role is active (e.g. customer, delivery, admin)
  if (activeRole && activeRole !== 'farmer') {
    const roleLabels = {
      customer: { name: 'Customer', path: '/customer/dashboard' },
      delivery: { name: 'Delivery Partner', path: '/delivery/dashboard' },
      admin: { name: 'Administrator', path: '/admin/dashboard' }
    };
    const current = roleLabels[activeRole] || { name: activeRole, path: '/' };

    return (
      <div className="min-h-screen bg-[#faf8f2] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-amber-200 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-[#081c15] mb-2">
            Access Restricted to Farmers
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
            You are currently authenticated as a <strong>{current.name}</strong>. The Farmer Workspace requires authorized agricultural producer credentials to manage crops and payouts.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              to={current.path}
              className="w-full py-2.5 px-4 rounded-xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <span>Return to {current.name} Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login?role=farmer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#52b788] hover:bg-[#40916c] text-[#081c15] text-xs font-bold transition"
            >
              Switch Account / Sign In as Farmer
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !farmer) {
    return <Navigate to="/login?role=farmer" state={{ from: location }} replace />;
  }

  return children;
}
