import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { storageService } from '../../services/storage';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

export default function CustomerProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useCustomerAuth();
  const location = useLocation();
  const activeRole = storageService.getActiveRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2d6a4f] border-t-[#52b788] rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#1b4332]">Loading Customer Session...</p>
        </div>
      </div>
    );
  }

  // If another role is currently active (e.g. farmer, delivery, admin)
  if (activeRole && activeRole !== 'customer') {
    const roleLabels = {
      farmer: { name: 'Farmer', path: '/farmer/dashboard' },
      delivery: { name: 'Delivery Partner', path: '/delivery/dashboard' },
      admin: { name: 'Administrator', path: '/admin/dashboard' }
    };
    const current = roleLabels[activeRole] || { name: activeRole, path: '/' };

    return (
      <div className="min-h-screen bg-[#faf8f2] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-[#081c15] mb-2">
            Access Restricted to Customers
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
            You are currently authenticated in an active <strong>{current.name}</strong> session. Customer shopping baskets and order history are reserved for customer accounts.
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
              to="/login?role=customer"
              className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition"
            >
              Switch Account / Sign In as Customer
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login?role=customer" state={{ from: location }} replace />;
  }

  return children;
}
