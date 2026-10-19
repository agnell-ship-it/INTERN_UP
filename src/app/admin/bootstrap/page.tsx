'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { COMPANY_INFO } from '@/lib/constants';

export default function AdminBootstrapPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleBootstrap = async () => {
    setStatusMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Bootstrap failed.');
      }

      setStatusMessage({ type: 'success', text: data.message });
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 2000);
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Bootstrap failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Initial Administrator Activation
            </h2>
            <p className="text-xs text-slate-500">
              One-time secure server-side bootstrap procedure
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2.5">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Lock className="w-4 h-4 text-slate-500" />
            <span>Strict Security Conditions:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
            <li>
              Only accounts matching the designated owner email (
              <strong className="text-blue-700 font-mono">
                {COMPANY_INFO.initialAdminEmail}
              </strong>
              ) can execute this procedure.
            </li>
            <li>
              You must register this account first if it does not already exist.
            </li>
            <li>
              Once completed, this bootstrap routine is{' '}
              <strong>permanently closed</strong> and cannot be re-executed.
            </li>
            <li>
              All role promotions are recorded in the immutable administrative audit log.
            </li>
          </ul>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{statusMessage.text}</span>
          </div>
        )}

        <div className="pt-2 space-y-3">
          <Button
            onClick={handleBootstrap}
            isLoading={loading}
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full bg-slate-900 hover:bg-slate-800"
          >
            Authenticate & Promote Administrator
          </Button>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Not logged in as the owner?</span>
            <div className="space-x-3">
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Register
              </Link>
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
