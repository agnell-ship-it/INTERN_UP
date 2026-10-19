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
  Copy,
  Info,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { PaymentSubmissionForm } from '@/components/PaymentSubmissionForm';

export default async function PaymentPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login?redirect=/payment');
  }

  const enrollment = await db.getActiveEnrollmentByStudentId(user.id);
  const settings = await db.getSiteSettings();
  const payment = enrollment ? await db.getPaymentByEnrollmentId(enrollment.id) : null;

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
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Direct UPI Program Fee</h1>
            <p className="text-xs text-slate-500">
              One-time ₹100 administration and certificate verification fee
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
      ) : (
        <div className="space-y-6">
          {/* Enrollment Summary Banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400">Enrolled Domain: </span>
              <strong className="text-white text-sm font-bold">
                {enrollment.domain?.name || 'Selected Domain'}
              </strong>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Fixed Program Fee:</span>
              <span className="text-emerald-400 font-bold text-sm">
                ₹{settings.program_fee || 100}
              </span>
            </div>
          </div>

          {/* Current Payment Status Banner if submitted */}
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
                    'Your ₹100 direct UPI payment has been manually reconciled with our bank records. Your payment milestone is complete!'}
                  {payment.status === 'pending_verification' &&
                    `Reference ID: ${payment.upi_reference}. The administrator is manually verifying your payment against incoming bank statements. Thank you for your patience.`}
                  {payment.status === 'rejected' &&
                    `Reason: ${payment.rejection_reason || 'UTR could not be matched.'} You can correct your reference details below and resubmit.`}
                </p>
              </div>
            </div>
          )}

          {/* Payment Instructions & QR Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Payment Instructions & UPI Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* QR Code display */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                {settings.upi_qr_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.upi_qr_image_url}
                    alt="Official UPI QR Code"
                    className="w-48 h-48 object-contain rounded-lg border border-slate-200 bg-white p-2"
                  />
                ) : (
                  <div className="w-44 h-44 rounded-xl bg-white border border-dashed border-slate-300 flex flex-col items-center justify-center p-4 text-slate-400 space-y-2">
                    <QrCode className="w-12 h-12 text-slate-300" />
                    <span className="text-[11px] text-slate-500 font-medium">
                      Scan via UPI Application
                    </span>
                  </div>
                )}
                <span className="text-[11px] text-slate-500 font-medium">
                  Scan using Google Pay, PhonePe, Paytm, or BHIM
                </span>
              </div>

              {/* UPI ID & Steps */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Official UPI ID
                  </label>
                  {settings.upi_id ? (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 font-mono text-sm text-blue-900 font-bold justify-between">
                      <span className="truncate">{settings.upi_id}</span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      UPI ID being updated by administrator. Please use the support email for direct details or check back shortly.
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <div className="font-semibold text-slate-800">Payment Steps:</div>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Open any UPI app on your mobile device.</li>
                    <li>Pay ₹{settings.program_fee || 100} to the UPI ID above.</li>
                    <li>Copy your 12-digit UTR or Transaction Reference number.</li>
                    <li>Submit the reference number below for manual verification.</li>
                  </ol>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    We never ask for your UPI PIN, banking password, or OTP. Keep your PIN confidential.
                  </span>
                </div>
              </div>
            </div>

            {/* Custom Payment Instructions if set */}
            {settings.payment_instructions && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Note from Administrator: </span>
                <span>{settings.payment_instructions}</span>
              </div>
            )}
          </div>

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
