'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MailCheck, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('token') || '';

  const [code, setCode] = useState(initialToken);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) {
      setStatus({ type: 'error', text: 'Please enter your verification code.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed.');
      }

      setStatus({ type: 'success', text: data.message });
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
    } catch (err: unknown) {
      setStatus({
        type: 'error',
        text: err instanceof Error ? err.message : 'Verification failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <MailCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Verify Your Email</h1>
          <p className="text-xs text-slate-500">
            Enter the 6-digit verification code sent to your registered email address.
          </p>
        </div>

        {status && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
              status.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{status.text}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label
              htmlFor="verification-code"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              6-Digit Code or Token
            </label>
            <input
              id="verification-code"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 582914"
              className="w-full px-4 py-2.5 text-center text-lg tracking-widest font-mono rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <Button
            type="submit"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full"
          >
            Confirm Email Address
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 space-y-1">
          <p>Already confirmed or want to log in?</p>
          <Link href="/login" className="text-blue-600 font-semibold hover:underline inline-block">
            Return to Sign In &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading verification...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
