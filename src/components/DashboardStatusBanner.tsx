'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock,
  Share2,
  IndianRupee,
} from 'lucide-react';
import { Enrollment, LinkedInSubmission, Payment, Certificate } from '@/types';

interface DashboardStatusBannerProps {
  enrollment: Enrollment;
  linkedInSubmission?: LinkedInSubmission | null;
  payment?: Payment | null;
  certificate?: Certificate | null;
  completedTasksCount: number;
  isEligibleForCertificate: boolean;
}

export const DashboardStatusBanner: React.FC<DashboardStatusBannerProps> = ({
  enrollment,
  linkedInSubmission,
  payment,
  certificate,
  completedTasksCount,
  isEligibleForCertificate,
}) => {
  // Case 1: Certificate Unlocked & Ready
  if (isEligibleForCertificate) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Program Successfully Completed</span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg">
              Congratulations! Your Completion Certificate is Unlocked
            </h3>
            <p className="text-xs text-white/90 leading-relaxed max-w-2xl">
              All 5 practical milestones, LinkedIn announcement, and verification fee have been verified. Download your tamper-resistant PDF certificate below and showcase it on LinkedIn!
            </p>
          </div>
        </div>

        <a
          href={`/api/documents/certificate?enrollmentId=${enrollment.id}`}
          download
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-xs transition-colors"
        >
          <Award className="w-4 h-4" />
          <span>Download Certificate</span>
        </a>
      </div>
    );
  }

  // Case 2: Payment Pending Verification
  if (payment?.status === 'pending_verification') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-950 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
              <span>Payment Pending Review</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Direct UPI Payment Under Manual Verification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reference ID: <strong className="font-mono text-slate-900">{payment.upi_reference}</strong>. The administrator is currently reconciling this transaction against incoming bank statements. Your certificate will unlock automatically once verified!
            </p>
          </div>
        </div>

        <Link
          href="/payment"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors"
        >
          <span>View Payment Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Case 3: Payment Rejected
  if (payment?.status === 'rejected') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-red-500/10 border border-red-300 text-red-950 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-red-100 text-red-800 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider">
              <span>Action Required</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Payment Verification Could Not Be Completed
            </h3>
            <p className="text-xs text-red-700 leading-relaxed">
              Reason: <strong>{payment.rejection_reason || 'UTR could not be matched with bank statements.'}</strong> Please check your receipt and resubmit the correct reference.
            </p>
          </div>
        </div>

        <Link
          href="/payment"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-colors"
        >
          <span>Resubmit Payment Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Case 4: Milestones 5/5 + LinkedIn Approved (Ready for Payment)
  if (completedTasksCount >= 5 && linkedInSubmission?.status === 'approved') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
              <span>Final Step to Certificate</span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg">
              Milestones Complete! Pay ₹100 to Claim Your Certificate
            </h3>
            <p className="text-xs text-white/90 leading-relaxed max-w-2xl">
              You have completed all 5 practical tasks and your LinkedIn announcement is verified. Complete the one-time ₹100 direct UPI fee to generate your completion certificate.
            </p>
          </div>
        </div>

        <Link
          href="/payment"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold text-xs shadow-xs transition-colors"
        >
          <IndianRupee className="w-4 h-4" />
          <span>Pay ₹100 &amp; Claim Certificate</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Case 5: LinkedIn Rejected
  if (linkedInSubmission?.status === 'rejected') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-200 text-red-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-red-100 text-red-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-slate-900">
              LinkedIn Announcement Needs Revision
            </h3>
            <p className="text-xs text-red-700 leading-relaxed">
              Feedback from administrator: <strong>{linkedInSubmission.rejection_reason || 'Please provide an accessible public post URL.'}</strong>
            </p>
          </div>
        </div>

        <a
          href="#linkedin-section"
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors"
        >
          <span>Update Post URL</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // Case 6: Standard in-progress status
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-700 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
        <span>
          <strong>7-Day Active Sprint</strong> &bull; Complete all 5 practical tasks and submit your LinkedIn announcement to unlock the ₹100 certificate issuance.
        </span>
      </div>

      <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px] shrink-0">
        <span>Tasks: {completedTasksCount}/5</span>
        <span>&bull;</span>
        <span>LinkedIn: {linkedInSubmission?.status === 'approved' ? '✓ Approved' : 'Pending'}</span>
      </div>
    </div>
  );
};
