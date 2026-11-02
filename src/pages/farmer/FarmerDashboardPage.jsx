import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  Package, 
  Boxes, 
  Coins, 
  PlusCircle, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Truck,
  Bell,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { api } from '../../services/api';

export default function FarmerDashboardPage() {
  const { farmer, isApproved, verificationStatus } = useFarmerAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!farmer?.id) return;
      setLoading(true);
      const [p, o, e, notifs] = await Promise.all([
        api.getFarmerProducts(farmer.id),
        api.getFarmerOrders(farmer.id),
        api.getFarmerEarnings(farmer.id),
        api.getNotifications()
      ]);
      setProducts(p || []);
      setOrders(o || []);
      setEarnings(e || null);
      setNotifications((notifs || []).slice(0, 3));
      setLoading(false);
    };
    fetchData();
  }, [farmer?.id]);

  const activeProducts = products.filter((p) => p.inStock && (p.availableQuantity || p.stock || 0) > 0);
  const outOfStockProducts = products.filter((p) => !p.inStock || (p.availableQuantity || p.stock || 0) <= 0);
  const lowStockProducts = products.filter((p) => {
    const qty = p.availableQuantity || p.stock || 0;
    return qty > 0 && qty <= 5;
  });

  const newOrders = orders.filter((o) => o.orderStatus === 'Placed' || o.orderStatus === 'New');
  const acceptedOrders = orders.filter((o) => ['Confirmed', 'Preparing', 'Ready for pickup', 'Out for delivery', 'Picked up'].includes(o.orderStatus));
  const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered');

  const grossSales = earnings?.totalGrossSales || orders.reduce((sum, o) => sum + (o.totalAmount || o.finalAmount || 0), 0);
  const netEarnings = Math.round(grossSales * 0.9);
  const pendingSettlement = earnings?.pendingSettlements || Math.round(newOrders.concat(acceptedOrders).reduce((sum, o) => sum + (o.totalAmount || o.finalAmount || 0), 0) * 0.9);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-[#081c15] to-[#1b4332] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#2d6a4f]/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#52b788]/20 text-[#74c69d] border border-[#52b788]/30">
                {farmer?.farmName}
              </span>
              <span className="text-xs text-gray-300">• {farmer?.location}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-white">
              Welcome back, {farmer?.name || farmer?.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
              Real-time harvest performance, incoming direct consumer orders, and transparent bank settlements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/farmer/products/add"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#52b788] hover:bg-[#74c69d] text-[#081c15] font-black text-xs transition shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Crop</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row 1: Product & Stock Health */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <Link
          to="/farmer/products"
          className="bg-white rounded-3xl p-5 border border-[#2d6a4f]/20 shadow-sm hover:border-[#52b788] transition"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-gray-500">Listed Crops</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-[#081c15]">{products.length}</p>
          <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1 pt-1 border-t border-gray-100">
            <span className="text-emerald-700 font-semibold">{activeProducts.length} Active</span>
            <span className="text-rose-600 font-semibold">{outOfStockProducts.length} Out of Stock</span>
          </div>
        </Link>

        {/* Low Stock Alerts */}
        <Link
          to="/farmer/inventory"
          className="bg-white rounded-3xl p-5 border border-[#2d6a4f]/20 shadow-sm hover:border-amber-400 transition"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-gray-500">Low-Stock Crops</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-amber-600">{lowStockProducts.length}</p>
          <p className="text-[11px] text-gray-500 mt-1">Crops requiring batch replenishment</p>
        </Link>

        {/* Orders Breakdown */}
        <Link
          to="/farmer/orders"
          className="bg-white rounded-3xl p-5 border border-[#2d6a4f]/20 shadow-sm hover:border-[#52b788] transition"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-gray-500">Orders Pipeline</span>
            <div className="w-8 h-8 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-[#081c15]">{orders.length}</p>
          <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1 pt-1 border-t border-gray-100">
            <span className="text-amber-700 font-bold">{newOrders.length} New</span>
            <span className="text-cyan-700 font-bold">{acceptedOrders.length} In Progress</span>
            <span className="text-emerald-700 font-bold">{completedOrders.length} Done</span>
          </div>
        </Link>

        {/* Total Net Sales */}
        <Link
          to="/farmer/earnings"
          className="bg-white rounded-3xl p-5 border border-[#2d6a4f]/20 shadow-sm hover:border-[#52b788] transition"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-gray-500">Net Sales (90%)</span>
            <div className="w-8 h-8 rounded-xl bg-[#081c15] text-[#52b788] flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-[#2d6a4f]">
            ₹{netEarnings.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1 pt-1 border-t border-gray-100">
            <span>Gross: ₹{grossSales}</span>
            <span className="text-amber-700 font-semibold">Pending: ₹{pendingSettlement}</span>
          </div>
        </Link>
      </div>

      {/* Row 2: Low-Stock Warnings & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low-Stock Alerts Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <h2 className="text-sm font-bold text-[#081c15] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Low-Stock Inventory Warnings
              </h2>
              <Link to="/farmer/inventory" className="text-xs font-bold text-[#2d6a4f] hover:underline">
                Update Stock →
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">
                All listed harvest items have sufficient available inventory.
              </p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-amber-950">{p.name}</span>
                      <span className="text-[10px] text-amber-800 block capitalize">{p.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-lg">
                        {p.availableQuantity || p.stock} {p.unit} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <h2 className="text-sm font-bold text-[#081c15] flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-emerald-600" />
                Recent Farmer Alerts
              </h2>
              <Link to="/farmer/notifications" className="text-xs font-bold text-[#2d6a4f] hover:underline">
                View All →
              </Link>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No alerts at this moment.</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 flex items-start gap-2.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="font-bold text-[#081c15]">{n.title}</div>
                      <div className="text-[11px] text-gray-600 line-clamp-1">{n.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#081c15]">Recent Consumer Orders</h2>
          <Link to="/farmer/orders" className="text-xs font-bold text-[#2d6a4f] hover:underline">
            View All ({orders.length}) →
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">No orders received yet.</p>
        ) : (
          <div className="divide-y divide-gray-100 text-xs">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#081c15]">Order #{order.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.deliveryMethod === 'platform' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.deliveryMethod === 'platform' ? 'Platform Eco-Fleet' : 'Farmer Run'}
                    </span>
                    <span className="text-gray-400">• {order.orderStatus}</span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    Customer: {order.customerName} ({order.deliveryAddress?.city || 'Pune'})
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-[#081c15]">₹{order.totalAmount || order.finalAmount}</span>
                  <Link
                    to="/farmer/orders"
                    className="block text-[11px] font-bold text-[#2d6a4f] hover:underline"
                  >
                    Manage Order →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
