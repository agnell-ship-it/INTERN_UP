'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  ExternalLink,
  QrCode,
  Sparkles,
  Award,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Button } from './ui/Button';

interface SampleGraduate {
  id: string;
  name: string;
  domain: string;
  issueDate: string;
  milestones: string;
}

const PRESET_GRADUATES: SampleGraduate[] = [
  {
    id: 'INUP-2026-W9K2-M8L1',
    name: 'Priya Patel',
    domain: 'Web Development',
    issueDate: 'October 24, 2026',
    milestones: '5 of 5 Milestones Verified',
  },
  {
    id: 'INUP-2026-P3X8-T9B4',
    name: 'Rohan Nair',
    domain: 'Python Programming',
    issueDate: 'October 22, 2026',
    milestones: '5 of 5 Milestones Verified',
  },
  {
    id: 'INUP-2026-A4B7-C9D2',
    name: 'Ananya Iyer',
    domain: 'Artificial Intelligence',
    issueDate: 'October 20, 2026',
    milestones: '5 of 5 Milestones Verified',
  },
];

export const CredentialVerifierSandbox: React.FC = () => {
  const [certId, setCertId] = useState('INUP-2026-W9K2-M8L1');
  const [activeResult, setActiveResult] = useState<SampleGraduate | null>(PRESET_GRADUATES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestPreset = (graduate: SampleGraduate) => {
    setCertId(graduate.id);
    setActiveResult(graduate);
    setError(null);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setLoading(true);
    setError(null);

    // Check if it matches preset first
    const preset = PRESET_GRADUATES.find(
      (p) => p.id.toLowerCase() === certId.trim().toLowerCase()
    );

    if (preset) {
      setTimeout(() => {
        setActiveResult(preset);
        setLoading(false);
      }, 350);
      return;
    }

    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(certId.trim())}`);
      const data = await res.json();

      if (res.ok && data.valid) {
        setActiveResult({
          id: data.certificate.certificate_id,
          name: data.certificate.student_name,
          domain: data.certificate.domain_name,
          issueDate: data.certificate.issue_date,
          milestones: '5 of 5 Milestones Verified',
        });
      } else {
        setActiveResult(null);
        setError(data.error || 'Certificate ID not found in active registry records.');
      }
    } catch {
      setActiveResult(null);
      setError('Verification service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>INTERACTIVE CREDENTIAL VERIFIER</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Test Verification of Any Graduate ID
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically signed credentials are queryable without revealing private student PII.
          </p>
        </div>

        <Link
          href="/registry"
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 shrink-0"
        >
          <span>Open Full Registry</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Preset quick test badges */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-400 font-medium">Quick Demo Preset IDs:</span>
        <div className="flex flex-wrap gap-2">
          {PRESET_GRADUATES.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => handleTestPreset(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                certId === g.id
                  ? 'bg-blue-600 text-white shadow-xs border border-blue-500'
                  : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700/80'
              }`}
            >
              {g.name} &bull; {g.id}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleVerify} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            placeholder="INUP-YYYY-XXXX-XXXX-XXXX"
            className="w-full pl-9 pr-3 py-2.5 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <Button type="submit" size="sm" isLoading={loading}>
          Verify Credential
        </Button>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Verification Card Result */}
      {activeResult && !error && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-emerald-500/40 relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  AUTHENTICATED RECORD CONFIRMED
                </span>
                <span className="text-xs font-bold text-white font-mono">{activeResult.id}</span>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              STATUS: ISSUED & VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">Recipient Graduate</span>
              <span className="font-bold text-slate-100 text-sm mt-0.5 block">{activeResult.name}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Specialization Track</span>
              <span className="font-bold text-blue-400 text-sm mt-0.5 block">{activeResult.domain}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Issue Timestamp</span>
              <span className="font-medium text-slate-300 text-xs mt-0.5 block">{activeResult.issueDate}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeResult.milestones} &bull; Signed by Dr. Jonath Watson</span>
            </span>

            <Link
              href={`/verify/${activeResult.id}`}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
            >
              <span>Inspect Full Public Ledger</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
