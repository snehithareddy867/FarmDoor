import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FarmerNavbar from './FarmerNavbar';
import FarmerSidebar from './FarmerSidebar';

export default function FarmerLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f2] text-[#1b4332] flex">
      {/* Sidebar */}
      <FarmerSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <FarmerNavbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

