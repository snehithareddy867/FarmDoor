import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <AdminNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Body */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Content Area */}
        <main className="flex-1 lg:pl-64 min-w-0 flex flex-col bg-slate-950">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>

          {/* Minimalist Admin Footer */}
          <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
              <span>Farm to Home &copy; 2026 Admin Operations Hub. All access logged & monitored.</span>
              <span className="text-[11px] text-slate-600">Enterprise Multi-Role Control System</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

