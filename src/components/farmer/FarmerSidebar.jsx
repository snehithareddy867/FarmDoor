import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  PlusCircle, 
  Package, 
  Boxes, 
  Truck, 
  Coins, 
  Star, 
  Bell, 
  User, 
  HelpCircle, 
  ShieldCheck,
  X,
  ExternalLink
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { handleAvatarError } from '../../utils/imageFallback';

const NAV_ITEMS = [
  { path: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/farmer/products', label: 'My Products', icon: Store },
  { path: '/farmer/products/add', label: 'Add Product', icon: PlusCircle, highlight: true },
  { path: '/farmer/orders', label: 'Orders', icon: Package },
  { path: '/farmer/inventory', label: 'Inventory', icon: Boxes },
  { path: '/farmer/deliveries', label: 'Deliveries', icon: Truck },
  { path: '/farmer/earnings', label: 'Earnings & Sales', icon: Coins },
  { path: '/farmer/reviews', label: 'Customer Reviews', icon: Star },
  { path: '/farmer/notifications', label: 'Notifications', icon: Bell },
  { path: '/farmer/profile', label: 'Farm Profile', icon: User },
  { path: '/farmer/verification', label: 'Verification Status', icon: ShieldCheck },
  { path: '/farmer/support', label: 'Support & Help', icon: HelpCircle },
];

export default function FarmerSidebar({ mobileOpen, onCloseMobile }) {
  const { farmer, isApproved } = useFarmerAuth();

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
                Farmer Workspace
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
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none text-xs">
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

                  {item.label === 'Add Product' && !isApproved && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-normal">
                      Lock
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Farm Quick Info */}
        <div className="p-4 border-t border-[#2d6a4f]/40 bg-[#0d281e]/60">
          <div className="flex items-center gap-3">
            <img
              src={farmer?.avatar}
              alt=""
              loading="lazy"
              onError={(e) => handleAvatarError(e, 'farmer')}
              className="w-10 h-10 rounded-xl object-cover border border-[#52b788]"
            />
            <div className="truncate">
              <h4 className="font-bold text-xs text-white truncate">{farmer?.farmName}</h4>
              <p className="text-[10px] text-[#95d5b2] truncate">{farmer?.location}</p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-[#2d6a4f]/30 flex justify-between items-center text-[10px] text-gray-400">
            <NavLink to="/" className="hover:text-white flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Public Site
            </NavLink>
            <span className="text-[#52b788] font-bold">Role: Grower</span>
          </div>
        </div>
      </aside>
    </>
  );
}

