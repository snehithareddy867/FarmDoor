import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle2, 
  Coins, 
  PackagePlus, 
  AlertTriangle, 
  Info, 
  Trash2, 
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';
import { api } from '../../services/api';

export default function DeliveryNotificationsPage() {
  const { partner } = useDeliveryAuth();
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('all');

  const loadNotifications = async () => {
    if (!partner?.id) return;
    const notifs = await api.getDeliveryNotifications(partner.id);
    setNotifications(notifs || []);
  };

  useEffect(() => {
    loadNotifications();
  }, [partner?.id]);

  const handleMarkRead = async (id) => {
    await api.markDeliveryNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    notifications.forEach((n) => api.markDeliveryNotificationRead(n.id));
    loadNotifications();
  };

  const handleClearAll = async () => {
    if (!partner?.id) return;
    await api.clearDeliveryNotifications(partner.id);
    loadNotifications();
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'job') return n.type === 'job';
    if (filterType === 'payout') return n.type === 'payout';
    return true;
  });

  const getIcon = (type) => {
    if (type === 'job') return <PackagePlus className="w-4 h-4 text-emerald-600" />;
    if (type === 'payout') return <Coins className="w-4 h-4 text-emerald-600" />;
    if (type === 'eco') return <span className="text-sm">🌱</span>;
    return <Info className="w-4 h-4 text-[#2d6a4f]" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-black font-outfit text-[#081c15]">
            Fleet Notifications & Alerts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time delivery assignments, bank payout confirmations, and regional weather advisories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-[#2d6a4f]/20 max-w-md text-xs">
        {['all', 'unread', 'job', 'payout'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`flex-1 py-1.5 rounded-xl font-bold capitalize transition ${
              filterType === tab
                ? 'bg-[#081c15] text-[#52b788] shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#2d6a4f]/20 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#faf8f2] text-gray-400 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#081c15]">All Caught Up</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
            No notifications match your current filter. We'll alert you as soon as new jobs or payout transfers arrive.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifs.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-3xl border transition flex items-start justify-between gap-4 ${
                !item.read
                  ? 'bg-white border-[#52b788]/60 shadow-sm'
                  : 'bg-[#faf8f2]/60 border-[#2d6a4f]/15 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-[#081c15]">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#52b788]" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{item.message}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {item.link && (
                  <Link
                    to={item.link}
                    className="p-2 rounded-xl bg-[#faf8f2] hover:bg-[#2d6a4f]/10 text-[#2d6a4f] text-xs font-bold transition"
                    title="Open Related Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
                {!item.read && (
                  <button
                    onClick={() => handleMarkRead(item.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

