import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import DeliveryNavbar from './DeliveryNavbar';
import DeliverySidebar from './DeliverySidebar';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';
import { AlertCircle, Clock, Power, ShieldAlert, ChevronRight } from 'lucide-react';

export default function DeliveryLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { partner, isApproved, isOnline, toggleOnline, verificationStatus } = useDeliveryAuth();

  return (
    <div className="min-h-screen bg-[#faf8f2] flex flex-col font-sans">
      {/* Top Navbar */}
      <DeliveryNavbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <DeliverySidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
          {/* Status Alert Banners */}
          {!isApproved && (
            <div className={`px-4 sm:px-6 py-2.5 text-xs font-semibold flex items-center justify-between border-b ${
              verificationStatus === 'Pending'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              <div className="flex items-center gap-2">
                {verificationStatus === 'Pending' ? (
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                <span>
                  {verificationStatus === 'Pending'
                    ? 'Documents Under Review: Job assignments will be enabled once your commercial license & vehicle RC are verified.'
                    : 'Action Required: Verification rejected by admin. Please update your submitted documents.'}
                </span>
              </div>
              <Link
                to="/delivery/verification"
                className="inline-flex items-center gap-1 font-bold underline hover:opacity-80"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {isApproved && !isOnline && (
            <div className="px-4 sm:px-6 py-2 bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center justify-between border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Power className="w-3.5 h-3.5 text-zinc-500" />
                <span>You are currently OFFLINE. Turn switch ON to receive nearby farm pickup requests.</span>
              </div>
              <button
                onClick={toggleOnline}
                className="px-2.5 py-1 rounded-lg bg-[#2d6a4f] text-white font-bold text-[11px] hover:bg-[#1b4332] transition"
              >
                Go Online Now
              </button>
            </div>
          )}

          {/* Page Outlet */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>

          {/* Discreet Footer */}
          <footer className="mt-auto py-4 px-6 border-t border-zinc-200 bg-white/50 text-center text-xs text-zinc-500">
            <p>Farm to Home Eco-Fleet Portal • Direct Agricultural Logistics • Version 2.4.0</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

