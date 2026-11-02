import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Phone, 
  AlertTriangle, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Send, 
  LifeBuoy, 
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';
import { api } from '../../services/api';

export default function DeliverySupportPage() {
  const { partner } = useDeliveryAuth();
  const [tickets, setTickets] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  const [ticketForm, setTicketForm] = useState({
    orderId: '',
    category: 'Customer dispute or unreachable',
    subject: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [sosActive, setSosActive] = useState(false);

  const loadTickets = async () => {
    if (!partner?.id) return;
    const t = await api.getDeliveryTickets(partner.id);
    setTickets(t || []);
  };

  useEffect(() => {
    loadTickets();
  }, [partner?.id]);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) return;

    setIsSubmitting(true);
    await api.submitDeliveryTicket({
      partnerId: partner?.id,
      ...ticketForm
    });

    setIsSubmitting(false);
    setSuccessMsg('Support ticket filed successfully! Dispatch lead will contact your registered phone.');
    setTicketForm({ orderId: '', category: 'Customer dispute or unreachable', subject: '', description: '' });
    loadTickets();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const FAQS = [
    {
      q: 'What should I do if a customer does not answer their phone?',
      a: 'Attempt to call at least 3 times within 10 minutes. If unanswered, speak with building security or ring doorbell. If still unreachable, go to Active Delivery and select "Report Issue / Failure", then return the goods to the nearest Agro Cold Staging facility.'
    },
    {
      q: 'How does the 4-digit OTP verification work at customer doorstep?',
      a: 'When you arrive at the customer doorstep, ask the resident for the 4-digit code displayed in their Farm to Home app. Enter this code into your app to mark the delivery complete. This releases payout to your balance instantly.'
    },
    {
      q: 'When do weekly earnings get deposited to my bank?',
      a: 'Fleet payouts are automatically deposited directly via IMPS every Tuesday and Friday at 6:00 PM IST to your verified bank account with zero deduction.'
    },
    {
      q: 'What happens if organic produce is damaged during transit?',
      a: 'If a crate or bottle is damaged in transit due to road vibrations, take a photo in the app and inform the customer honestly. File an incident ticket immediately so support can dispatch a replacement without penalty to the rider.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & SOS Helpline Bar */}
      <div className="bg-gradient-to-r from-rose-900 to-[#081c15] text-white rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Emergency Dispatch Helpdesk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-outfit text-white mt-1">
            24/7 Fleet Safety & Rider Support
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
            Toll-Free Emergency Priority Line: <span className="font-bold text-rose-300 font-mono text-base">1800-FARM-RUN</span> (1800-3276-786). Available 24/7 for en-route breakdown, route hazards, or customer disputes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:18003276786"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span>Call Hotline</span>
          </a>

          <button
            onClick={() => setSosActive(!sosActive)}
            className={`px-4 py-3 rounded-2xl font-black text-xs transition border ${
              sosActive
                ? 'bg-amber-400 text-black border-amber-500 animate-pulse'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            {sosActive ? '🚨 SOS Alert Active' : 'Trigger SOS Alert'}
          </button>
        </div>
      </div>

      {sosActive && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Emergency SOS broadcast sent to regional fleet coordinator. Keep phone line open.</span>
          </div>
          <button
            onClick={() => setSosActive(false)}
            className="px-2.5 py-1 rounded-xl bg-amber-200 text-amber-900 font-bold hover:bg-amber-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Ticket Form & FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Filing Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#081c15] mb-1">
              File a Dispute or Assistance Ticket
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Submit details regarding payment mismatches, address issues, or cargo damage.
            </p>

            {successMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Order ID (If Applicable)</label>
                  <input
                    type="text"
                    value={ticketForm.orderId}
                    onChange={(e) => setTicketForm({ ...ticketForm, orderId: e.target.value })}
                    placeholder="e.g. FTH-91204"
                    className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Issue Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl focus:outline-none"
                  >
                    <option value="Customer dispute or unreachable">Customer dispute or unreachable</option>
                    <option value="Cash collection mismatch">Cash collection mismatch (COD)</option>
                    <option value="Vehicle breakdown en-route">Vehicle breakdown en-route</option>
                    <option value="Produce damage at farm pickup">Produce damage at farm pickup</option>
                    <option value="Payout or settlement inquiry">Payout or settlement inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Subject</label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="Summary of what happened..."
                  className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Detailed Description</label>
                <textarea
                  rows="3"
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Provide timestamps, location landmarks, and what assistance is needed..."
                  className="w-full px-3 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-xs transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#081c15] mb-1">
              Rider Knowledge Base & FAQs
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Answers to common delivery scenarios and standard operating procedures.
            </p>

            <div className="space-y-2.5">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#2d6a4f]/15 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full text-left p-3.5 bg-[#faf8f2] hover:bg-emerald-50/50 flex items-center justify-between text-xs font-bold text-[#081c15] transition"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-[#2d6a4f] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {openFaq === idx && (
                    <div className="p-3.5 bg-white text-xs text-gray-600 border-t border-[#2d6a4f]/10 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Operating hours: 6:00 AM - 10:00 PM IST daily</span>
            <span className="font-bold text-[#2d6a4f]">Fast Response Desk</span>
          </div>
        </div>
      </div>

      {/* Existing Submitted Tickets History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm">
        <h2 className="text-base font-bold text-[#081c15] mb-4">
          Your Recent Support Tickets ({tickets.length})
        </h2>

        {tickets.length === 0 ? (
          <p className="text-xs text-gray-500 py-4">No support tickets filed yet.</p>
        ) : (
          <div className="divide-y divide-gray-100 text-xs">
            {tickets.map((t) => (
              <div key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#081c15]">{t.id}</span>
                    <span className="font-bold text-gray-800">{t.subject}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    Category: {t.category} {t.orderId ? `• Order #${t.orderId}` : ''} •{' '}
                    {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                  {t.resolutionNote && (
                    <p className="text-emerald-700 text-[11px] font-semibold mt-1">
                      Resolution: {t.resolutionNote}
                    </p>
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

