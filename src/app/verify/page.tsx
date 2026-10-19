'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Search, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function VerifyLookupPage() {
  const router = useRouter();
  const [certId, setCertId] = useState('');
  const [error, setError] = useState('');

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const clean = certId.trim();
    if (!clean) {
      setError('Please enter a certificate identifier.');
      return;
    }

    router.push(`/verify/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>OFFICIAL REGISTRY LOOKUP</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Verify INTERN-UP Certificate
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Employers, institutions, and recruiters can verify the authenticity of an INTERN-UP
          Completion Certificate by entering the unique certificate ID below.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label
              htmlFor="certId"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
            >
              Certificate Identifier
            </label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="certId"
                type="text"
                required
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. INUP-2026-X7K2-M9L4"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 uppercase font-mono"
              />
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>

          <Button
            type="submit"
            rightIcon={<Search className="w-4 h-4" />}
            className="w-full"
          >
            Verify Credential
          </Button>
        </form>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 space-y-1">
          <div className="font-semibold text-slate-700">Privacy Safeguard Notice:</div>
          <p>
            Our registry validates certificate recipient names, domains, and issuance dates without
            disclosing private personal records, email addresses, or payment data.
          </p>
        </div>
      </div>
    </div>
  );
}
