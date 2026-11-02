import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Upload, 
  CheckCircle2, 
  RefreshCw, 
  HelpCircle,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';
import { Link } from 'react-router-dom';

export default function DeliveryVerificationPage() {
  const { 
    partner, 
    verificationStatus, 
    isApproved, 
    toggleVerificationForTesting,
    resubmitVerification 
  } = useDeliveryAuth();

  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);
  const [resubmitDocType, setResubmitDocType] = useState('Commercial Driving License');
  const [resubmitNote, setResubmitNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const documents = partner?.documents || [
    { name: 'Commercial_Driving_License.pdf', type: 'Driving License', status: isApproved ? 'Verified' : 'Under Review', date: '2026-01-14' },
    { name: 'Government_Photo_ID.pdf', type: 'Aadhaar Card', status: isApproved ? 'Verified' : 'Under Review', date: '2026-01-14' },
    { name: 'Vehicle_Registration_Certificate.pdf', type: 'Vehicle RC', status: isApproved ? 'Verified' : 'Under Review', date: '2026-01-14' }
  ];

  const handleResubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const updatedDocs = documents.map((doc) => {
      if (doc.type.includes(resubmitDocType) || resubmitDocType.includes(doc.type)) {
        return {
          ...doc,
          name: `Revised_${resubmitDocType.replace(/\s+/g, '_')}_Updated.pdf`,
          status: 'Under Review',
          date: new Date().toLocaleDateString()
        };
      }
      return doc;
    });

    await resubmitVerification(updatedDocs);
    setIsSubmitting(false);
    setResubmitModalOpen(false);
    setSuccessMsg('Revised documents submitted successfully! Admin review in progress.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Status Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isApproved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : verificationStatus === 'Pending'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}>
                {verificationStatus} Status
              </span>
              <span className="text-xs text-gray-400">• Application Ref: #{partner?.id || 'partner-1'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-[#081c15]">
              Delivery Compliance & KYC Status
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
              All couriers in the Farm to Home network undergo identity validation, driving record checks, and eco-vehicle inspection before accepting customer orders.
            </p>
          </div>

          {/* Quick Testing Switcher */}
          <div className="p-3 bg-[#faf8f2] rounded-2xl border border-[#2d6a4f]/20 flex flex-col gap-2 min-w-[220px]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#081c15]">
              <Sparkles className="w-3.5 h-3.5 text-[#52b788]" />
              <span>Simulate Status for Review:</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => toggleVerificationForTesting('Approved')}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition ${
                  verificationStatus === 'Approved'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-emerald-50'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => toggleVerificationForTesting('Pending')}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition ${
                  verificationStatus === 'Pending'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-amber-50'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => toggleVerificationForTesting('Rejected')}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition ${
                  verificationStatus === 'Rejected'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-rose-50'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-10 translate-y-10">
          <ShieldCheck className="w-64 h-64 text-[#2d6a4f]" />
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Admin Feedback Box */}
      <div className={`p-5 rounded-3xl border ${
        isApproved
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          : verificationStatus === 'Pending'
          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
          : 'bg-rose-50/80 border-rose-200 text-rose-950'
      }`}>
        <div className="flex items-start gap-3">
          {isApproved ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : verificationStatus === 'Pending' ? (
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <h3 className="text-sm font-bold">
              {isApproved
                ? 'Official Fleet Clearance Granted'
                : verificationStatus === 'Pending'
                ? 'Document Verification In Progress'
                : 'Action Required: Documents Re-Upload Necessary'}
            </h3>
            <p className="text-xs mt-1 text-gray-700 leading-relaxed">
              {partner?.adminFeedback || (
                isApproved
                  ? 'All driving credentials, RTO records, and vehicle inspection passed successfully.'
                  : verificationStatus === 'Pending'
                  ? 'Your profile is queued for RTO cross-reference. You will receive an SMS and email notification upon approval.'
                  : 'Submitted documents were blurry or incomplete. Please upload high-resolution photocopies.'
              )}
            </p>

            {!isApproved && (
              <div className="mt-3 p-3 rounded-2xl bg-white/60 border border-current/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <Lock className="w-4 h-4" />
                  <span>Job assignments are locked until approval is granted.</span>
                </div>
                {verificationStatus === 'Rejected' && (
                  <button
                    onClick={() => setResubmitModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Re-upload Documents</span>
                  </button>
                )}
              </div>
            )}

            {isApproved && (
              <div className="mt-3 flex items-center gap-3">
                <Link
                  to="/delivery/requests"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332] transition"
                >
                  <span>Browse Available Delivery Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submitted Documents Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm">
        <h2 className="text-base font-bold text-[#081c15] mb-4">
          Submitted Verification Dossier
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.status === 'Under Review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#081c15] line-clamp-1">{doc.type}</h4>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5 truncate">{doc.name}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
                <span>Updated: {doc.date || 'Recent'}</span>
                {doc.status !== 'Verified' && (
                  <button
                    onClick={() => {
                      setResubmitDocType(doc.type);
                      setResubmitModalOpen(true);
                    }}
                    className="text-[#2d6a4f] font-bold hover:underline"
                  >
                    Replace
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Inspection & Badge Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2d6a4f]/20 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-bold text-[#081c15] uppercase tracking-wider mb-3">
            Registered Transport Unit
          </h3>
          <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#2d6a4f]/20 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-500">Vehicle Type</span>
              <span className="font-bold text-[#081c15]">{partner?.vehicleType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-500">Model / Make</span>
              <span className="font-bold text-[#081c15]">{partner?.vehicleModel}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-500">License Plate</span>
              <span className="font-bold text-[#081c15] font-mono">{partner?.vehicleNumber}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Commercial License #</span>
              <span className="font-bold text-[#081c15] font-mono">{partner?.licenseNumber}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#081c15] uppercase tracking-wider mb-3">
            Eco-Accreditation & Badges
          </h3>
          <div className="p-4 rounded-2xl bg-[#081c15] text-white border border-[#2d6a4f]/40 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-[#52b788] flex items-center justify-center font-bold text-lg">
                🌱
              </div>
              <div>
                <p className="text-xs font-bold text-white">Green Fleet Zero-Emission Courier</p>
                <p className="text-[11px] text-[#74c69d]">Earns +₹25 eco-bonus on every delivered farm order</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 text-[11px] text-gray-300">
              Couriers with electric two-wheelers and bio-fueled transports receive priority routing around central farmer staging clusters.
            </div>
          </div>
        </div>
      </div>

      {/* Resubmit Modal */}
      {resubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#2d6a4f]/20">
            <h3 className="text-base font-bold text-[#081c15] mb-1">
              Resubmit Compliance Document
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Please choose document type and upload a clear, legible photograph or PDF scan.
            </p>

            <form onSubmit={handleResubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Document Type</label>
                <select
                  value={resubmitDocType}
                  onChange={(e) => setResubmitDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs font-medium focus:outline-none"
                >
                  <option value="Commercial Driving License">Commercial Driving License (Both sides)</option>
                  <option value="Government Photo ID">Aadhaar Card / National ID</option>
                  <option value="Vehicle RC">Vehicle Registration Certificate (RC)</option>
                  <option value="PUC Certificate">Pollution Under Control (PUC) Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select File (PDF, JPG, PNG)</label>
                <div className="p-6 border-2 border-dashed border-[#2d6a4f]/30 rounded-2xl text-center bg-[#faf8f2] hover:bg-[#faf8f2]/60 cursor-pointer">
                  <Upload className="w-6 h-6 text-[#2d6a4f] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#081c15]">Click to select revised scan</p>
                  <p className="text-[10px] text-gray-500 mt-1">Maximum file size 10MB</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Remarks for Transport Reviewer (Optional)</label>
                <textarea
                  rows="2"
                  value={resubmitNote}
                  onChange={(e) => setResubmitNote(e.target.value)}
                  placeholder="e.g. Attached high-resolution flatbed scan with clear stamp and barcode."
                  className="w-full px-3.5 py-2 bg-[#faf8f2] border border-[#2d6a4f]/30 rounded-2xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResubmitModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332] disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading...' : 'Submit Revision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

