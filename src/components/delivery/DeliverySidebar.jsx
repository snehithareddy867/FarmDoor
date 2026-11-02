import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PackagePlus, 
  Truck, 
  History, 
  Coins, 
  ShieldCheck, 
  Bell, 
  User, 
  HelpCircle, 
  X,
  ExternalLink,
  Store,
  ShoppingBag
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';

const NAV_ITEMS = [
  { path: '/delivery/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/delivery/requests', label: 'Delivery Requests', icon: PackagePlus, highlight: true },
  { path: '/delivery/active', label: 'Active Deliveries', icon: Truck },
  { path: '/delivery/history', label: 'Trip History', icon: History },
  { path: '/delivery/earnings', label: 'Earnings & Payouts', icon: Coins },
  { path: '/delivery/verification', label: 'Verification Status', icon: ShieldCheck },
  { path: '/delivery/notifications', label: 'Notifications', icon: Bell },
  { path: '/delivery/profile', label: 'Rider Profile', icon: User },
  { path: '/delivery/support', label: 'Support & Hotline', icon: HelpCircle }
];

export default function DeliverySidebar({ mobileOpen, onCloseMobile }) {
  const { partner, isApproved, isOnline } = useDeliveryAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#081c15] text-white border-r border-[#2d6a4f]/40 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#2d6a4f]/40">
            <div className="flex items-center gap-2">
              <span className="font-outfit font-extrabold text-base text-white">
                Fleet Portal
              </span>
            </div>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] text-xs">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold transition-all ${
                      isActive
                        ? 'bg-[#1b4332] text-white shadow-md border border-[#52b788]/40'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    } ${item.highlight ? 'text-[#74c69d]' : ''}`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#52b788]" />
                    <span>{item.label}</span>
                  </div>

                  {item.label === 'Delivery Requests' && !isApproved && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-normal">
                      Lock
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Ecosystem Portal Switcher */}
        <div className="p-4 border-t border-[#2d6a4f]/40 bg-white/5 space-y-2 text-xs">
          <p className="text-[10px] uppercase font-bold text-[#74c69d] tracking-wider">
            Switch Workspace
          </p>
          <div className="space-y-1">
            <NavLink
              to="/farmer/dashboard"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-medium transition"
            >
              <div className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>Farmer Workspace</span>
              </div>
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </NavLink>
            <NavLink
              to="/customer/marketplace"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-medium transition"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Customer Marketplace</span>
              </div>
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}

