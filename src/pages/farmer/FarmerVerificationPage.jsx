import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { Link } from 'react-router-dom';

export default function FarmerVerificationPage() {
  const { farmer, isApproved, verificationStatus, toggleVerificationStatusForTesting, resubmitVerification } = useFarmerAuth();
  const [resubmitOpen, setResubmitOpen] = useState(false);
  const [certType, setCertType] = useState('Organic Farm Inspection Certificate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const documents = farmer?.documents || [
    { name: 'Land_Title_7-12_Extract.pdf', type: 'Land Ownership Document', status: isApproved ? 'Verified' : 'Under Review' },
    { name: 'NPOP_Organic_Certificate.pdf', type: 'Organic Certification', status: isApproved ? 'Verified' : 'Under Review' },
    { name: 'Kisan_Aadhaar_ID.pdf', type: 'Government Photo ID', status: isApproved ? 'Verified' : 'Under Review' }
  ];

  const handleResubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    await resubmitVerification({
      certifications: [certType, 'FSSAI Certified'],
      documents: documents.map((d) => ({ ...d, status: 'Under Review', date: new Date().toLocaleDateString() }))
    });

    setIsSubmitting(false);
    setResubmitOpen(false);
    setSuccessMsg('Revised certificates submitted to agricultural audit cell!');
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
              <span className="text-xs text-gray-400">• Farmer ID: #{farmer?.farmerId || farmer?.id || farmer?._id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-[#081c15]">
              Agricultural Verification & Organic Compliance
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
              To protect customers, our agronomists verify land titles, soil testing reports, and zero-chemical declarations before farm listings go live on the marketplace.
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
                onClick={() => toggleVerificationStatusForTesting('Approved')}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition ${
                  verificationStatus === 'Approved'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-emerald-50'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => toggleVerificationStatusForTesting('Pending')}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition ${
                  verificationStatus === 'Pending'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-amber-50'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => toggleVerificationStatusForTesting('Rejected')}
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
                ? 'Official Organic Grower Accreditation Granted'
                : verificationStatus === 'Pending'
                ? 'Soil & Land Title Review In Progress'
                : 'Action Required: Documents Re-Upload Necessary'}
            </h3>
            <p className="text-xs mt-1 text-gray-700 leading-relaxed">
              {farmer?.adminFeedback || 'All certificates are verified and in order.'}
            </p>

            {!isApproved && (
              <div className="mt-3 p-3 rounded-2xl bg-white/60 border border-current/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <Lock className="w-4 h-4" />
                  <span>Selling and product creation are restricted until approval is granted.</span>
                </div>
                {verificationStatus === 'Rejected' && (
                  <button
                    onClick={() => setResubmitOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Re-upload Documents</span>
                  </button>
                )}
              </div>
            )}

            {isApproved && (
              <div className="mt-3">
                <Link
                  to="/farmer/products/add"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332] transition"
                >
                  <span>List a New Crop for Sale</span>
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
          Submitted Verification Documents
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
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#081c15]">{doc.type}</h4>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5 truncate">{doc.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resubmit Modal */}
      {resubmitOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#2d6a4f]/20">
            <h3 className="text-base font-bold text-[#081c15] mb-1">
              Resubmit Agricultural Credentials
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Upload clear renewal certificate or land registry record.
            </p>

            <form onSubmit={handleResubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Certificate Type</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f2] border rounded-2xl text-xs"
                >
                  <option value="NPOP Organic Certificate Renewal">NPOP Organic Certificate Renewal</option>
                  <option value="Land Registry 7-12 Extract">Land Registry 7-12 Extract</option>
                  <option value="Soil Testing & Pesticide Residue Audit">Soil Testing & Residue Audit</option>
                </select>
              </div>

              <div className="p-6 border-2 border-dashed border-[#2d6a4f]/30 rounded-2xl text-center bg-[#faf8f2] cursor-pointer">
                <Upload className="w-6 h-6 text-[#2d6a4f] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#081c15]">Click to upload PDF document</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResubmitOpen(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#081c15] text-[#52b788] text-xs font-bold hover:bg-[#1b4332]"
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

