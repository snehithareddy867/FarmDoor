import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { storageService } from '../../services/storage';
import { ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';

export const AdminProtectedRoute = ({ children, requiredPermission }) => {
  const { admin, isAuthenticated, loading, hasPermission } = useAdminAuth();
  const location = useLocation();
  const activeRole = storageService.getActiveRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-300 text-sm font-medium">Verifying Administrator Access...</p>
        </div>
      </div>
    );
  }

  // Cross-role protection: if another non-admin role is active (e.g. customer, farmer, delivery)
  if (activeRole && activeRole !== 'admin') {
    const roleLabels = {
      customer: { name: 'Customer', path: '/customer/dashboard' },
      farmer: { name: 'Farmer', path: '/farmer/dashboard' },
      delivery: { name: 'Delivery Partner', path: '/delivery/dashboard' }
    };
    const current = roleLabels[activeRole] || { name: activeRole, path: '/' };

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-rose-500/30 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-white mb-2">
            Restricted Admin Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            You are currently signed in as a <strong>{current.name}</strong>. Administrative governance, dispute handling, and financial operations require authenticated admin credentials.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              to={current.path}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <span>Return to {current.name} Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login?role=admin"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700"
            >
              Sign in with Administrator Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !admin) {
    return <Navigate to="/login?role=admin" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-slate-900">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-2xl font-bold">🚫</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Restricted Department Access</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          Your current administrator persona does not possess the <code className="text-rose-400 bg-slate-800 px-2 py-0.5 rounded">{requiredPermission}</code> credential privilege.
        </p>
        <p className="text-xs text-slate-500">Switch to Super Admin in the top-right header to unlock full system capabilities.</p>
      </div>
    );
  }

  return children;
};
