import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_confirmation':
        return <Package className="w-5 h-5 text-[#52b788]" />;
      case 'farmer_acceptance':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'order_update':
      case 'delivery_assigned':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'order_cancellation':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'support_ticket':
        return <AlertCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-[#52b788]" />;
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-[#081c15] flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-[#52b788]" />
            Customer Notifications
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Live updates on grower acceptance, dawn harvests, packing, and courier arrival.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#1b4332] flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-[#40916c]" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-[#1b4332] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          All Updates ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'unread'
              ? 'bg-[#1b4332] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300 p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#faf8f2] text-gray-400 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-[#52b788]" />
          </div>
          <h3 className="font-outfit font-bold text-lg text-[#081c15] mb-1">
            {filter === 'unread' ? 'No Unread Notifications' : 'Notification Box is Empty'}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm">
            You will receive instant updates as local farmers prepare and dispatch your harvest baskets.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !item.isRead
                  ? 'bg-white border-[#52b788] shadow-md ring-1 ring-[#52b788]/20'
                  : 'bg-white/80 border-gray-200 hover:bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#faf8f2] flex items-center justify-center shrink-0 border border-gray-100 mt-0.5">
                {getNotificationIcon(item.type)}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className="font-outfit font-bold text-sm text-[#081c15] flex items-center gap-2">
                    {item.title}
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#52b788] animate-ping" />
                    )}
                  </h4>
                  <span className="text-[11px] text-gray-400">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.message}
                </p>

                {item.link && (
                  <div className="mt-2 text-xs font-bold text-[#2d6a4f] flex items-center gap-1 hover:underline">
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

