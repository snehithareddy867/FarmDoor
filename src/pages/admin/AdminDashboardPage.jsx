import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Tractor,
  Truck,
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminDashboardPage = () => {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminDashboardStats();
      setStats(data);
      const orders = await api.getAllOrdersAdmin();
      setRecentOrders(orders.slice(0, 6));
    } catch (err) {
      console.error('Error fetching dashboard statistics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400">Loading platform statistics...</p>
      </div>
    );
  }

  // Calculate percentage of category share for the visual breakdown
  const categoryEntries = Object.entries(stats.products.categoryCounts || {});
  const totalCategoryProducts = categoryEntries.reduce((sum, [, count]) => sum + count, 0) || 1;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Live Operations Node
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {admin?.name || 'Administrator'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time farm direct supply chain, order fulfillment, and multi-tier verification telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live Data</span>
          </button>
          <Link
            to="/admin/reports"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition"
          >
            <span>Platform Analytics</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Urgent Action Banner if pending items exist */}
      {(stats.farmers.pending > 0 || stats.products.pendingApproval > 0 || stats.deliveryPartners.pending > 0) && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300">Action Queue Pending Review</h4>
              <p className="text-[11px] text-amber-400/80 mt-0.5">
                {stats.farmers.pending} farmers await document verification &bull; {stats.products.pendingApproval} listings require catalog approval &bull; {stats.deliveryPartners.pending} couriers pending onboarding.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {stats.farmers.pending > 0 && (
              <Link
                to="/admin/farmers?filter=Pending"
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-semibold border border-amber-500/30 text-amber-200 transition"
              >
                Review Farmers ({stats.farmers.pending})
              </Link>
            )}
            {stats.products.pendingApproval > 0 && (
              <Link
                to="/admin/products?filter=Pending"
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-semibold border border-amber-500/30 text-amber-200 transition"
              >
                Approve Listings ({stats.products.pendingApproval})
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Ecosystem</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{stats.totalUsers}</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span>{stats.customers.total} Customers</span>
            <span>{stats.farmers.total} Farmers</span>
            <span>{stats.deliveryPartners.total} Couriers</span>
          </div>
        </div>

        {/* Farmers & KYC */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Registered Farmers</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
              <Tractor className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{stats.farmers.total}</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
            <span className="text-emerald-400 font-medium">{stats.farmers.approved} Approved</span>
            <span className="text-amber-400 font-medium">{stats.farmers.pending} Pending KYC</span>
            {stats.farmers.suspended > 0 && (
              <span className="text-rose-400 font-medium">{stats.farmers.suspended} Suspended</span>
            )}
          </div>
        </div>

        {/* Delivery Fleet */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Delivery Fleet</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{stats.deliveryPartners.total}</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
            <span className="text-emerald-400 font-medium">{stats.deliveryPartners.online} Online Now</span>
            <span className="text-teal-400 font-medium">{stats.deliveryPartners.approved} Approved</span>
            <span className="text-amber-400 font-medium">{stats.deliveryPartners.pending} Pending</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform Orders</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{stats.orders.total}</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
            <span className="text-amber-400 font-medium">{stats.orders.active} In Transit</span>
            <span className="text-emerald-400 font-medium">{stats.orders.completed} Delivered</span>
            <span className="text-rose-400 font-medium">{stats.orders.cancelled} Cancelled</span>
          </div>
        </div>
      </div>

      {/* Financial Health Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Financial & Revenue Summary (Live Order Realization)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Based on genuine completed and active customer transactions. Platform fee: {stats.financials.commissionRate}%.
            </p>
          </div>
          <Link
            to="/admin/payments"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Transactions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Gross Platform Volume</p>
            <div className="text-2xl font-bold text-white mt-1">₹{stats.financials.totalGmv.toLocaleString('en-IN')}</div>
            <p className="text-[10px] text-slate-500 mt-1">Total value of all ordered goods</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">Platform Commission (10%)</p>
            <div className="text-2xl font-bold text-emerald-400 mt-1">₹{stats.financials.platformCommissionEarned.toLocaleString('en-IN')}</div>
            <p className="text-[10px] text-emerald-400/80 mt-1">Direct platform retained revenue</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Net Farmer Disbursals</p>
            <div className="text-2xl font-bold text-white mt-1">₹{stats.financials.netFarmerPayouts.toLocaleString('en-IN')}</div>
            <p className="text-[10px] text-slate-500 mt-1">Directly credited to producer accounts</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Courier Trip Payouts</p>
            <div className="text-2xl font-bold text-white mt-1">₹{stats.financials.deliveryPayouts.toLocaleString('en-IN')}</div>
            <p className="text-[10px] text-slate-500 mt-1">Base pay, mileage, and eco-fleet bonuses</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Real Data Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Product Distribution Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Live Product Inventory by Category
              </h3>
              <p className="text-xs text-slate-400">Total active listings: {stats.products.total}</p>
            </div>
            <Link to="/admin/categories" className="text-xs text-emerald-400 hover:underline">
              Manage Taxonomy
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {categoryEntries.map(([category, count]) => {
              const pct = Math.round((count / totalCategoryProducts) * 100);
              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300 capitalize">{category}</span>
                    <span className="font-mono text-slate-400">
                      {count} items ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fulfillment Pipeline Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              Order Pipeline Health
            </h3>
            <p className="text-xs text-slate-400 mb-4">Fulfillment status of all recorded orders</p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-300">Delivered Successfully</span>
                </div>
                <span className="text-xs font-bold font-mono text-emerald-400">{stats.orders.completed}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs text-slate-300">Active In Transit / Dispatch</span>
                </div>
                <span className="text-xs font-bold font-mono text-amber-400">{stats.orders.active}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs text-slate-300">Cancelled / Refunded</span>
                </div>
                <span className="text-xs font-bold font-mono text-rose-400">{stats.orders.cancelled}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Link
              to="/admin/deliveries"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <span>Inspect Live Dispatch Runs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              Recent Platform Transactions & Orders
            </h3>
            <p className="text-xs text-slate-400">Live order activity across all zones</p>
          </div>
          <Link to="/admin/orders" className="text-xs text-emerald-400 hover:underline">
            View All ({stats.orders.total})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Delivery Method</th>
                <th className="py-3 px-4">Courier</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {recentOrders.map((order) => {
                const total = order.finalAmount || order.pricing?.total || 0;
                return (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-medium text-white">#{order.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{order.shippingAddress?.fullName || 'Customer'}</div>
                      <div className="text-[10px] text-slate-500">{order.shippingAddress?.city || 'Pune'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        order.deliveryMethod === 'platform'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {order.deliveryMethod === 'platform' ? 'Platform Courier' : 'Farmer Self-Run'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {order.assignedCourier?.name || (order.deliveryMethod === 'farmer' ? 'Farmer Direct' : 'Unassigned')}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">₹{total}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/admin/orders?search=${order.id}`}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

