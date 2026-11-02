import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Send,
  Clock,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const FAQ_ITEMS = [
  {
    category: 'Orders & Freshness',
    q: 'How fresh is the produce when delivered to my doorstep?',
    a: 'Every crop is picked on the morning of scheduled dispatch. Unlike supermarkets where vegetables sit in multi-week cold storages with ripening gases, our produce reaches your kitchen in under 24 hours from harvest.'
  },
  {
    category: 'Orders & Freshness',
    q: 'What is the 100% Dawn-Harvest Guarantee?',
    a: 'If any vegetable, fruit, or dairy item arrives damaged, bruised, or unsatisfactory, simply report it within 24 hours through this portal for an instant full replacement or wallet refund with no questions asked.'
  },
  {
    category: 'Farmer Direct Economics',
    q: 'How much of my payment goes directly to the farmer?',
    a: 'Between 85% and 90% of your bill is deposited directly into the partnered grower’s bank account. We charge only a nominal platform logistics facilitation fee.'
  },
  {
    category: 'Delivery & Logistics',
    q: 'What are the morning and evening delivery time slots?',
    a: 'Morning slot runs from 6:30 AM to 9:30 AM for dawn harvest vegetables and fresh milk. Evening slot runs from 4:30 PM to 8:00 PM for staples, grains, and orchard fruits.'
  },
  {
    category: 'Packaging',
    q: 'What type of packaging is used?',
    a: 'We use reusable, sterilized bamboo crates and compostable cornstarch wrappers. You can return crates to the delivery partner on subsequent drop-offs.'
  }
];

export default function SupportPage() {
  const { user } = useCustomerAuth();
  const [complaints, setComplaints] = useState([]);
  const [orders, setOrders] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(0);

  // New Complaint Form
  const [orderId, setOrderId] = useState('');
  const [issueType, setIssueType] = useState('Damaged or bruised produce');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaintSuccess, setComplaintSuccess] = useState('');

  const loadData = async () => {
    if (user?.id) {
      const [complaintData, orderData] = await Promise.all([
        api.getComplaints(user.id),
        api.getOrders(user.id)
      ]);
      setComplaints(complaintData || []);
      setOrders(orderData || []);
      if (orderData?.length > 0 && !orderId) {
        setOrderId(orderData[0].id);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    await api.submitComplaint({
      customerId: user.id,
      customerName: user.fullName,
      orderId: orderId || 'General Inquiry',
      issueType,
      subject: subject.trim(),
      description: description.trim()
    });

    setComplaintSuccess('Your complaint ticket has been submitted. Our Agri Care desk will respond within 4 hours.');
    setSubject('');
    setDescription('');
    setIsSubmitting(false);
    loadData();
    setTimeout(() => setComplaintSuccess(''), 4000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Title */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="font-outfit text-3xl font-extrabold text-[#081c15]">
          Help, Support & Resolution Center
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Have an inquiry about crop quality, order delivery, or need a replacement? We’re here to help.
        </p>
      </div>

      {/* Quick Contact Numbers Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-gray-200 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-[#40916c]" />
          </div>
          <div className="text-xs">
            <span className="text-gray-400 block font-semibold text-[10px] uppercase">Toll-Free Helpline</span>
            <strong className="text-sm text-[#081c15]">+91 1800-FARM-FRESH</strong>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-[#40916c]" />
          </div>
          <div className="text-xs">
            <span className="text-gray-400 block font-semibold text-[10px] uppercase">Direct Email Support</span>
            <strong className="text-sm text-[#081c15]">care@farmtohome.market</strong>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-[#40916c]" />
          </div>
          <div className="text-xs">
            <span className="text-gray-400 block font-semibold text-[10px] uppercase">Response Window</span>
            <strong className="text-sm text-[#081c15]">Within 4 Hours (Daily)</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Submit Complaint + Existing Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Submit a Complaint / Report Problem (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
          <h2 className="font-outfit font-extrabold text-lg text-[#081c15] flex items-center gap-2 pb-3 border-b border-gray-100">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Report an Order Problem / Submit Complaint
          </h2>

          {complaintSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{complaintSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmitComplaint} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Related Order</label>
              <select
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
              >
                <option value="">General Platform Inquiry</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    Order #{o.id} (₹{o.totalAmount} • {o.orderStatus})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Issue Category *</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
              >
                <option value="Damaged or bruised produce">Damaged or bruised produce (Dawn replacement)</option>
                <option value="Missing item from basket">Missing crop / item from basket</option>
                <option value="Delivery delay or rescheduling">Delivery delay or rescheduling request</option>
                <option value="Payment or refund inquiry">Payment or refund verification inquiry</option>
                <option value="Farmer quality feedback">Farmer crop quality feedback</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Subject Headline *</label>
              <input
                type="text"
                required
                placeholder="Brief summary of the problem"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Detailed Description *</label>
              <textarea
                rows={4}
                required
                placeholder="Please describe what happened in detail so our Agri Care desk can rectify it immediately..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Submit Support Ticket</span>
            </button>
          </form>
        </div>

        {/* Right: View Complaint Status (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-outfit font-extrabold text-base text-[#081c15] pb-3 border-b border-gray-100 flex items-center justify-between">
            <span>Your Support Tickets</span>
            <span className="text-xs font-mono text-gray-400">({complaints.length})</span>
          </h2>

          {complaints.length === 0 ? (
            <div className="text-center py-10 bg-[#faf8f2] rounded-2xl border border-dashed border-gray-200 text-xs text-gray-500">
              <p>No active complaint tickets filed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-2xl bg-[#faf8f2] border border-gray-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#081c15]">#{ticket.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-[#081c15]">{ticket.subject}</h4>
                  <p className="text-gray-600 leading-relaxed text-[11px]">{ticket.description}</p>

                  {ticket.resolutionNote && (
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-900 text-[11px] border border-emerald-200">
                      <strong>Resolution Note:</strong> {ticket.resolutionNote}
                    </div>
                  )}

                  <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-200 flex justify-between">
                    <span>Order: {ticket.orderId}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="text-xs font-bold uppercase text-[#40916c] tracking-wider block mb-1">
            Common Inquiries
          </span>
          <h2 className="font-outfit font-extrabold text-2xl text-[#081c15]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm text-[#081c15] hover:text-[#2d6a4f] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#52b788] shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

