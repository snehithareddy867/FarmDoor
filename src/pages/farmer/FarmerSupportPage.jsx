import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Phone, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles,
  BookOpen,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { api } from '../../services/api';

export default function FarmerSupportPage() {
  const { farmer } = useFarmerAuth();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Packaging & Logistics');
  const [priority, setPriority] = useState('Normal');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const fetchTickets = async () => {
    if (!farmer?.id) return;
    setLoadingTickets(true);
    try {
      const data = await api.getFarmerTickets(farmer.id);
      setTickets(data || []);
    } catch (err) {
      console.warn('Failed to fetch farmer tickets', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [farmer?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await api.createFarmerTicket({
        farmerId: farmer?.id || 'farmer-1',
        farmerName: farmer?.name || farmer?.fullName || 'Farmer Partner',
        category,
        priority,
        orderId: orderId.trim() || 'N/A',
        subject: subject.trim(),
        message: message.trim()
      });

      setSubmitted(true);
      setSubject('');
      setMessage('');
      setOrderId('');
      setPriority('Normal');
      await fetchTickets();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Failed to submit ticket', err);
      alert('Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#081c15] to-[#1b4332] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#2d6a4f]/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#52b788]/20 text-[#74c69d] border border-[#52b788]/30">
            Agronomy & Logistics Helpdesk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-outfit text-white mt-1">
            Kisan Care & Support Line
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Direct Agronomist Hotline: <span className="text-[#52b788] font-bold">1800-KISAN-RUN</span> (1800-547-2678)
          </p>
        </div>

        <a
          href="tel:18005472678"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#52b788] hover:bg-[#74c69d] text-[#081c15] font-bold text-xs transition shadow-lg self-start md:self-auto"
        >
          <Phone className="w-4 h-4" />
          <span>Call Kisan Support</span>
        </a>
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Inquiry ticket successfully registered! Regional field coordinator will review and contact you.</span>
        </div>
      )}

      {/* Main Grid: Submit Form + Manuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Submission Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-[#2d6a4f]" />
            <h2 className="text-base font-bold text-[#081c15]">
              Submit Support Inquiry / Audit Request
            </h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Assistance with organic compliance audits, thermal crates, delivery pickup schedules, or bank settlements.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                >
                  <option value="Packaging & Logistics">Packaging & Crates Supply</option>
                  <option value="Agronomy & Quality Audit">Agronomy & Quality Audit</option>
                  <option value="Courier Pickup Schedule">Courier Pickup Schedule</option>
                  <option value="Payment & Settlements">Payment & Bank Settlements</option>
                  <option value="Organic Certification">Organic Certification (NPOP/PGS)</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                >
                  <option value="Normal">Normal (Response within 24 hrs)</option>
                  <option value="Urgent - Harvest Critical">Urgent - Perishable Harvest Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Related Order ID (Optional)</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. FTH-91204"
                className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Need 25 extra thermal insulated crates for Friday harvest"
                className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Detailed Inquiry</label>
              <textarea
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide full details, crop specifics, plot location, or courier issue..."
                className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-xs transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#52b788] border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Ticket...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Support Inquiry</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resources & Agronomy Manuals */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-[#2d6a4f]" />
            <h2 className="text-base font-bold text-[#081c15]">
              Agricultural Guidelines & Extension Manuals
            </h2>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Official operational standards for premium farm-to-table freshness.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 hover:border-[#2d6a4f]/30 transition">
              <h4 className="font-bold text-[#081c15] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Thermal Packaging for Leafy Greens
              </h4>
              <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">
                Harvest spinach, mint, and coriander before 7:00 AM while field moisture is cool. Line crates with moist muslin cloth to retain crunch.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 hover:border-[#2d6a4f]/30 transition">
              <h4 className="font-bold text-[#081c15] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Direct Farm-to-Home Delivery Protocol
              </h4>
              <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">
                Guidelines for direct farmer fulfillment trips: check recipient contact before departure and update delivery status directly from the portal.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 hover:border-[#2d6a4f]/30 transition">
              <h4 className="font-bold text-[#081c15] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                NPOP Organic Soil Audit Renewal
              </h4>
              <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">
                Checklist for bi-annual agronomy inspections: keep compost certification, natural neem pest records, and water laboratory reports ready.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
              <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Regional Farm Hub Centers
              </h4>
              <p className="text-emerald-800 text-[11px] mt-1">
                Drop off packed orders or collect returnable crates at Bavdhan Hub or Hinjewadi Agro Station (Daily 6:00 AM - 11:00 AM).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket History Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#081c15]">
              My Support Tickets & Inquiries ({tickets.length})
            </h2>
            <p className="text-xs text-gray-500">
              Live status tracking of your requests with field support notes.
            </p>
          </div>
        </div>

        {loadingTickets ? (
          <div className="py-8 text-center text-xs text-gray-400">
            <div className="w-6 h-6 border-2 border-[#52b788] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading your inquiries...
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-8 text-center bg-[#faf8f2] rounded-2xl border border-dashed border-[#2d6a4f]/20">
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#081c15]">No Support Inquiries Yet</h3>
            <p className="text-xs text-gray-500 mt-1">
              Have questions regarding packaging, payouts, or crop audits? Submit an inquiry using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/15 hover:border-[#2d6a4f]/30 transition space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#081c15]">
                      #{t.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {t.category || t.issueType || 'Inquiry'}
                    </span>
                    {t.priority?.includes('Urgent') && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                        {t.priority}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">
                      {new Date(t.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      t.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : t.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-[#081c15]">
                  {t.subject}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t.description}
                </p>

                {t.orderId && t.orderId !== 'N/A' && (
                  <p className="text-[11px] text-gray-500 font-mono">
                    Ref Order: <span className="font-bold text-[#081c15]">{t.orderId}</span>
                  </p>
                )}

                {/* Resolution note or assigned coordinator */}
                <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-500 gap-1">
                  <div className="flex items-center gap-1 text-gray-600">
                    <UserCheck className="w-3.5 h-3.5 text-[#2d6a4f]" />
                    <span>Desk Coordinator: {t.assignedTo || 'Regional Agronomist Desk'}</span>
                  </div>

                  {(t.resolutionNote || t.resolution) && (
                    <div className="text-emerald-700 font-medium">
                      <span className="font-bold">Resolution: </span>
                      {t.resolutionNote || t.resolution}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
