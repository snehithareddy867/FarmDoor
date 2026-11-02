import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';
import { storageService } from '../../services/storage';
import { ShieldAlert, ArrowRight, Bike } from 'lucide-react';

export default function DeliveryProtectedRoute({ children }) {
  const { partner, isAuthenticated, loading } = useDeliveryAuth();
  const location = useLocation();
  const activeRole = storageService.getActiveRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2d6a4f] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#1b4332]">Loading Courier Portal...</p>
        </div>
      </div>
    );
  }

  // Cross-role protection: if another role is active (e.g. customer, farmer, admin)
  if (activeRole && activeRole !== 'delivery') {
    const roleLabels = {
      customer: { name: 'Customer', path: '/customer/dashboard' },
      farmer: { name: 'Farmer', path: '/farmer/dashboard' },
      admin: { name: 'Administrator', path: '/admin/dashboard' }
    };
    const current = roleLabels[activeRole] || { name: activeRole, path: '/' };

    return (
      <div className="min-h-screen bg-[#faf8f2] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-blue-200 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-[#081c15] mb-2">
            Access Restricted to Couriers
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
            You are currently authenticated as a <strong>{current.name}</strong>. The Fleet Courier Portal requires verified delivery partner credentials to view dispatch routes.
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
              to="/login?role=delivery"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
            >
              Switch Account / Sign In as Delivery Partner
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !partner) {
    return <Navigate to="/login?role=delivery" state={{ from: location }} replace />;
  }

  return children;
}
