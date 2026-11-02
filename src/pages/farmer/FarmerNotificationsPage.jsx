import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Package, 
  Coins, 
  CheckCircle2, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { api } from '../../services/api';

export default function FarmerNotificationsPage() {
  const { farmer } = useFarmerAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      const all = await api.getNotifications();
      setNotifications(all || []);
    };
    fetchNotifs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#2d6a4f]/20 shadow-sm">
        <h1 className="text-2xl font-black font-outfit text-[#081c15]">
          Farmer Notifications
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Order alerts, verification audit milestones, and escrow payout confirmations.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-4 rounded-3xl bg-white border border-[#2d6a4f]/15 shadow-sm flex items-start gap-3.5 text-xs"
          >
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#081c15]">{n.title}</h4>
              <p className="text-gray-600 mt-0.5">{n.message}</p>
              <span className="text-[10px] text-gray-400 mt-1 block">
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

