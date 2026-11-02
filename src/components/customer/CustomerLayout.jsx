import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerNavbar from './CustomerNavbar';
import CustomerFooter from './CustomerFooter';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f2] text-[#1b4332]">
      <CustomerNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
}

