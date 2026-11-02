import React, { useState, useEffect } from 'react';
import {
  BellRing,
  Send,
  Users,
  Tractor,
  Truck,
  CheckCircle2,
  Calendar,
  X,
  Sparkles,
  History
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminNotificationsPage = () => {
  const { admin } = useAdminAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('all');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await api.getBroadcastAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert('Please fill out both broadcast title and message body.');
      return;
    }

    setSending(true);
    try {
      const res = await api.createBroadcastAnnouncement(
        {
          title,
          target,
          message,
          sender: `${admin?.name} (${admin?.role})`
        },
        `${admin?.name} (${admin?.role})`
      );

      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Broadcast announcement dispatched successfully to ${target.toUpperCase()} stakeholder channels.`
        });
        setTitle('');
        setMessage('');
        loadAnnouncements();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to broadcast announcement.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BellRing className="w-6 h-6 text-emerald-400" />
            Platform Broadcasts & Stakeholder Notices
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch announcements directly to Farmers, Delivery Partners, or Consumers across platform inboxes.
          </p>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid: Form on Left, History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Broadcast Form */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            Dispatch New Announcement
          </h3>
          <p className="text-xs text-slate-400 mb-4">Pushes alert banners and notifications in real-time</p>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Audience</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">🌐 All Ecosystem Users (Farmers, Couriers, Buyers)</option>
                <option value="farmers">🚜 Registered Farmers & Producers</option>
                <option value="delivery">🛵 Active Courier Fleets & Riders</option>
                <option value="customers">🛍️ Registered Marketplace Customers</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Announcement Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Monsoon Packaging & Cold Chain Advisory"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Message Body</label>
              <textarea
                rows="5"
                required
                placeholder="Write detailed advisory instructions for stakeholders..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {sending ? (
                <span>Broadcasting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast Now</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Broadcast History List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                Broadcast Transmission History
              </h3>
              <p className="text-xs text-slate-400">Past notifications delivered across system nodes</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">{announcements.length} Messages</span>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-bold text-white text-xs">{ann.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Target: {ann.target}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(ann.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{ann.message}</p>

                <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
                  <span>Author: {ann.sender}</span>
                  <span className="font-mono text-emerald-400">✓ Delivered to inboxes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

