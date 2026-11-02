import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  Users,
  Truck,
  Package,
  Layers,
  ShoppingBag,
  Navigation,
  CreditCard,
  LifeBuoy,
  BarChart3,
  BellRing,
  FileText,
  Settings,
  X,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const data = await api.getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load counters', err);
      }
    };
    fetchCounters();
    const interval = setInterval(fetchCounters, 15000);
    return () => clearInterval(interval);
  }, []);

  const navSections = [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'Stakeholder Management',
      items: [
        {
          label: 'Farmers',
          path: '/admin/farmers',
          icon: Tractor,
          badge: stats?.farmers?.pending > 0 ? `${stats.farmers.pending} KYC` : null,
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
        },
        {
          label: 'Customers',
          path: '/admin/customers',
          icon: Users,
          count: stats?.customers?.total
        },
        {
          label: 'Delivery Partners',
          path: '/admin/delivery-partners',
          icon: Truck,
          badge: stats?.deliveryPartners?.pending > 0 ? `${stats.deliveryPartners.pending} Appr` : null,
          badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
        }
      ]
    },
    {
      group: 'Marketplace Operations',
      items: [
        {
          label: 'Product Catalog',
          path: '/admin/products',
          icon: Package,
          badge: stats?.products?.pendingApproval > 0 ? `${stats.products.pendingApproval} Rev` : null,
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
        },
        {
          label: 'Category Taxonomy',
          path: '/admin/categories',
          icon: Layers
        },
        {
          label: 'Orders',
          path: '/admin/orders',
          icon: ShoppingBag,
          badge: stats?.orders?.active > 0 ? `${stats.orders.active} Act` : null,
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        },
        {
          label: 'Delivery Dispatch',
          path: '/admin/deliveries',
          icon: Navigation
        }
      ]
    },
    {
      group: 'Finance & Compliance',
      items: [
        {
          label: 'Payments & Refunds',
          path: '/admin/payments',
          icon: CreditCard
        },
        {
          label: 'Complaints & Disputes',
          path: '/admin/complaints',
          icon: LifeBuoy,
          badge: stats?.complaints?.open > 0 ? `${stats.complaints.open} Open` : null,
          badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
        },
        {
          label: 'Reports & Analytics',
          path: '/admin/reports',
          icon: BarChart3
        }
      ]
    },
    {
      group: 'System Control',
      items: [
        {
          label: 'Broadcasts',
          path: '/admin/notifications',
          icon: BellRing
        },
        {
          label: 'Audit Trail Logs',
          path: '/admin/audit-logs',
          icon: FileText
        },
        {
          label: 'Platform Settings',
          path: '/admin/settings',
          icon: Settings
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Department banner */}
        <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[11px] font-semibold text-slate-300 tracking-wide uppercase truncate">
              {admin?.department || 'Operations Node'}
            </p>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
            Session: <span className="text-emerald-400 font-mono">{admin?.username || 'admin'}</span>
          </p>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h5 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {section.group}
              </h5>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => onClose && onClose()}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom System Status */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px]">API Node: Online</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">v2.4.0</span>
        </div>
      </aside>
    </>
  );
};

