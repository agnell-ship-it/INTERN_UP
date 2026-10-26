import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  IndianRupee,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  QrCode,
  Lock,
  ListTodo,
  Share2,
  Award,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { PaymentSubmissionForm } from '@/components/PaymentSubmissionForm';
import { DynamicUpiQrCard } from '@/components/DynamicUpiQrCard';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PaymentPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login?redirect=/payment');
  }

  const enrollment = await db.getActiveEnrollmentByStudentId(user.id);
  const settings = await db.getSiteSettings();
  const payment = enrollment ? await db.getPaymentByEnrollmentId(enrollment.id) : null;
  const taskSubmissions = enrollment
    ? await db.getTaskSubmissionsByEnrollmentId(enrollment.id)
    : [];

  const completedTasksCount = taskSubmissions.filter(
    (t) => t.github_url && t.github_url.trim().length > 0
  ).length;

  const isTasksComplete = completedTasksCount >= 5;
  const isReadyForPayment = isTasksComplete;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Student Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-xl ${
              isReadyForPayment ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'
            }`}
          >
            {isReadyForPayment ? (
              <IndianRupee className="w-5 h-5" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isReadyForPayment ? 'Direct UPI Certificate Fee' : 'Certificate Verification Fee'}
            </h1>
            <p className="text-xs text-slate-500">
              {isReadyForPayment
                ? 'One-time ₹100 certificate issuance and verification fee'
                : 'Unlocks after you submit all 5 tasks'}
            </p>
          </div>
        </div>
      </div>

      {!enrollment ? (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
          <div>
            <h2 className="text-base font-bold text-slate-900">No Active Enrollment Found</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Please choose a computer science domain before submitting payment.
            </p>
          </div>
          <Link
            href="/domains"
            className="inline-flex px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          >
            Browse Domains &rarr;
          </Link>
        </div>
      ) : !isReadyForPayment ? (
        /* LOCKED STATE: When user hasn't submitted all 5 tasks yet */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-6 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-slate-900">
              Payment is Locked Until Milestones Are Completed
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              At INTERN-UP, you learn and build first! The <strong>₹100 certificate fee</strong> is
              only payable once you have submitted all 5 tasks.
            </p>
          </div>

          {/* Progress Checklist */}
          <div className="max-w-md mx-auto bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Prerequisites to Unlock Payment:
            </span>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">Submit All 5 Tasks (GitHub Links)</span>
                </div>
                {isTasksComplete ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Completed (5/5)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {completedTasksCount}/5 Done
                  </span>
                )}
              </div>

            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Return to Tasks on Dashboard</span>
            </Link>
          </div>
        </div>
      ) : (
        /* UNLOCKED STATE: all 5 tasks submitted */
        <div className="space-y-6">
          {/* Readiness Celebration Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Ready for Completion Certificate</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold">
                Congratulations! You Have Completed All Milestones
              </h2>
              <p className="text-xs text-white/90 leading-relaxed">
                All 5 practical tasks are submitted. Pay the ₹100 fee by UPI, enter your transaction ID
                below, and the administrator will verify it and award your certificate.
              </p>
            </div>
            <div className="shrink-0 bg-white/20 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-white/80 block">Program Fee</span>
              <span className="text-xl font-extrabold text-white">₹{settings.program_fee || 100}</span>
            </div>
          </div>

          {/* Current Payment Status Banner if already submitted */}
          {payment && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
                payment.status === 'approved'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : payment.status === 'pending_verification'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : payment.status === 'rejected'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {payment.status === 'approved' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : payment.status === 'pending_verification' ? (
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold">
                  {payment.status === 'approved' && 'Payment Verified & Approved'}
                  {payment.status === 'pending_verification' &&
                    'Payment Status: Pending Administrator Verification'}
                  {payment.status === 'rejected' && 'Payment Verification Rejected'}
                </div>
                <p className="text-xs leading-relaxed">
                  {payment.status === 'approved' &&
                    'Your ₹100 direct UPI payment has been verified. Your certificate is unlocked and available on your dashboard!'}
                  {payment.status === 'pending_verification' &&
                    `Reference ID: ${payment.upi_reference}. The administrator is manually verifying your payment against incoming bank statements. Thank you for your patience.`}
                  {payment.status === 'rejected' &&
                    `Reason: ${payment.rejection_reason || 'UTR could not be matched.'} You can correct your reference details below and resubmit.`}
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Scannable UPI QR & Payment Instructions Card */}
          <DynamicUpiQrCard
            upiId={settings.upi_id}
            programFee={settings.program_fee || 100}
            qrImageUrl={settings.upi_qr_image_url}
            instructions={settings.payment_instructions}
          />

          {/* Submission Form (Shown if not yet approved) */}
          {payment?.status !== 'approved' && (
            <PaymentSubmissionForm
              enrollmentId={enrollment.id}
              initialUpiRef={payment?.upi_reference || ''}
              initialPaymentDate={payment?.payment_date || new Date().toISOString().split('T')[0]}
            />
          )}
        </div>
      )}
    </div>
  );
}
