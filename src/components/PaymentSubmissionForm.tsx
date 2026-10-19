'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IndianRupee, Send, AlertCircle, CheckCircle2, ShieldCheck, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PaymentSubmissionFormProps {
  enrollmentId: string;
  initialUpiRef?: string;
  initialPaymentDate?: string;
}

export const PaymentSubmissionForm: React.FC<PaymentSubmissionFormProps> = ({
  enrollmentId,
  initialUpiRef = '',
  initialPaymentDate = new Date().toISOString().split('T')[0],
}) => {
  const router = useRouter();
  const [upiRef, setUpiRef] = useState(initialUpiRef);
  const [paymentDate, setPaymentDate] = useState(initialPaymentDate);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Simple screenshot upload via local FileReader for preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Screenshot image must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!upiRef.trim() || upiRef.trim().length < 6) {
      setError('Please enter a valid UTR / Transaction Reference (at least 6 characters).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/payment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollment_id: enrollmentId,
          upi_reference: upiRef.trim(),
          payment_date: paymentDate,
          screenshot_url: screenshotUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment submission failed.');

      setSuccess(true);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Submit Payment Verification Details
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter your 12-digit UTR or Transaction Reference number from your payment receipt
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Payment Details Submitted</div>
            <p className="text-xs text-emerald-700 mt-0.5">
              Your status is now <strong>Pending Verification</strong>. The administrator will manually reconcile the transaction against bank statements.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="upiRef"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
          >
            Transaction Reference / UTR Number *
          </label>
          <input
            id="upiRef"
            type="text"
            required
            value={upiRef}
            onChange={(e) => setUpiRef(e.target.value)}
            placeholder="e.g. 234567890123 or UPI Reference"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
          />
          <p className="text-[11px] text-slate-400 mt-0.5">
            Locate the 12-digit UPI Transaction ID or UTR in your GPay / PhonePe / Paytm receipt.
          </p>
        </div>

        <div>
          <label
            htmlFor="paymentDate"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
          >
            Payment Date *
          </label>
          <input
            id="paymentDate"
            type="date"
            required
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Payment Screenshot (Optional, max 2MB)
          </label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Screenshot Image</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {screenshotUrl && (
              <span className="text-xs text-emerald-600 font-medium">Screenshot attached</span>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Anti-Abuse & Verification Notice</span>
          </div>
          <p>
            Submitting a reference number or screenshot does not automatically approve your payment.
            All submissions are manually verified against incoming bank records prior to certificate unlocking.
          </p>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          rightIcon={<Send className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Submit for Manual Review
        </Button>
      </form>
    </div>
  );
};
