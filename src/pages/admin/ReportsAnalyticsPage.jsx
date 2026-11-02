import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Layers,
  Tractor,
  Truck,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';

export const ReportsAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const s = await api.getAdminDashboardStats();
        setStats(s);
        const o = await api.getAllOrdersAdmin();
        setOrders(o);
        const f = await api.getAllFarmersAdmin();
        setFarmers(f);
        const p = await api.getAllDeliveryPartnersAdmin();
        setPartners(p);
        const c = await api.getCategories();
        setCategories(c);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // CSV Export utility
  const exportCsv = (type) => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (type === 'orders') {
      csvContent += 'Order ID,Customer,Delivery Method,Courier,Amount,Payment Method,Status,Created At\n';
      orders.forEach((o) => {
        csvContent += `"${o.id}","${o.shippingAddress?.fullName || 'Customer'}","${o.deliveryMethod}","${o.assignedCourier?.name || 'N/A'}",${o.finalAmount || o.pricing?.total},"${o.paymentMethod}","${o.orderStatus}","${o.createdAt}"\n`;
      });
    } else if (type === 'farmers') {
      csvContent += 'Farmer ID,Farm Name,Full Name,Location,Products Count,Orders Count,Revenue,Status\n';
      farmers.forEach((f) => {
        csvContent += `"${f.id}","${f.farmName || ''}","${f.fullName}","${f.district || 'Pune'}",${f.productsCount || 0},${f.ordersCount || 0},${f.totalRevenue || 0},"${f.status}"\n`;
      });
    } else if (type === 'couriers') {
      csvContent += 'Partner ID,Name,Phone,Vehicle,Deliveries Count,Total Earnings,Status\n';
      partners.forEach((p) => {
        csvContent += `"${p.id}","${p.fullName}","${p.mobile}","${p.vehicleType}",${p.completedDeliveries || 0},${p.totalEarnings || 0},"${p.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FarmToHome_${type}_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !stats) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400">Aggregating platform reports...</p>
      </div>
    );
  }

  // Top farmers by revenue
  const topFarmers = [...farmers].sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            Executive Reports & Marketplace Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated revenue telemetry, producer performance indices, and fulfillment velocity metrics.
          </p>
        </div>

        {/* CSV Export Dropdown / Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCsv('orders')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Orders CSV</span>
          </button>
          <button
            onClick={() => exportCsv('farmers')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Farmers CSV</span>
          </button>
          <button
            onClick={() => exportCsv('couriers')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Couriers CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Gross Merchandise (GMV)</span>
          <div className="text-2xl font-bold text-white mt-1">₹{stats.financials.totalGmv.toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-emerald-400 mt-1">+18.4% vs previous 30-day window</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform Retained Revenue (10%)</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">₹{stats.financials.platformCommissionEarned.toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-slate-500 mt-1">Zero intermediary distributor margins</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Producer Disbursal Volume</span>
          <div className="text-2xl font-bold text-white mt-1">₹{stats.financials.netFarmerPayouts.toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-teal-400 mt-1">Average 90% direct farm gate value</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Delivery Success Rate</span>
          <div className="text-2xl font-bold text-white mt-1">
            {stats.orders.total > 0 ? Math.round((stats.orders.completed / stats.orders.total) * 100) : 100}%
          </div>
          <p className="text-[10px] text-emerald-400 mt-1">Across 5 supported delivery zones</p>
        </div>
      </div>

      {/* Two Column Layout: Top Farmers Leaderboard + Categories Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Farmers Leaderboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tractor className="w-4 h-4 text-emerald-400" />
                Producer Sales & Order Leaderboard
              </h3>
              <p className="text-xs text-slate-400">Top earning regenerative farms</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Verified Farms
            </span>
          </div>

          <div className="space-y-3">
            {topFarmers.map((f, idx) => (
              <div key={f.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-800">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-xs">{f.farmName || f.fullName}</div>
                    <div className="text-[10px] text-slate-400">{f.village || f.district || 'Pune'} &bull; {f.farmType || 'Organic Agro'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 text-xs">₹{f.totalRevenue || 0}</div>
                  <div className="text-[10px] text-slate-500">{f.ordersCount || 0} orders completed</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courier Fleet Efficiency */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                Courier Fleet Transit Performance
              </h3>
              <p className="text-xs text-slate-400">Fulfillment speed & Eco-Fleet adoption</p>
            </div>
            <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
              Active Fleet
            </span>
          </div>

          <div className="space-y-3">
            {partners.slice(0, 5).map((p, idx) => (
              <div key={p.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-800">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-xs">{p.fullName}</div>
                    <div className="text-[10px] text-slate-400">{p.vehicleType} &bull; {p.city}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-white text-xs">{p.completedDeliveries || 0} trips</div>
                  <div className="text-[10px] text-emerald-400 font-mono">₹{p.totalEarnings || 0} earned</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

