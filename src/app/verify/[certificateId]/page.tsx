import React from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  User,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { db } from '@/lib/db';
import { COMPANY_INFO } from '@/lib/constants';
import { formatISTDate } from '@/lib/date-utils';

export default async function CertificateVerificationResultPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const decodedId = decodeURIComponent(certificateId).trim();
  const cert = await db.getCertificateById(decodedId);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-6">
      <Link
        href="/verify"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Look up another certificate</span>
      </Link>

      {cert ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Status Bar */}
          <div
            className={`p-5 sm:p-6 text-white flex items-center justify-between ${
              cert.status === 'issued' ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            <div className="flex items-center gap-3">
              {cert.status === 'issued' ? (
                <CheckCircle2 className="w-8 h-8 text-white shrink-0" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-white shrink-0" />
              )}
              <div>
                <h1 className="text-xl font-bold">
                  {cert.status === 'issued' ? 'Official Certificate Verified' : 'Certificate Revoked'}
                </h1>
                <p className="text-xs text-white/80">
                  {cert.status === 'issued'
                    ? 'Authenticated by INTERN-UP Digital Registry'
                    : 'This certificate is no longer valid'}
                </p>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <span className="text-[11px] font-mono tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
                {cert.certificate_id}
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Certificate ID</span>
                <span className="font-mono font-bold text-slate-900">{cert.certificate_id}</span>
              </div>

              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Recipient Name</span>
                <span className="font-bold text-slate-900 uppercase">{cert.student_name}</span>
              </div>

              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Internship Domain</span>
                <span className="font-bold text-blue-600">{cert.domain_name}</span>
              </div>

              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Program Duration</span>
                <span className="font-medium text-slate-800">
                  {formatISTDate(cert.start_date)} to {formatISTDate(cert.end_date)}
                </span>
              </div>

              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Issue Date</span>
                <span className="font-medium text-slate-800">{formatISTDate(cert.issue_date)}</span>
              </div>

              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Signatory</span>
                <span className="font-medium text-slate-800">
                  {COMPANY_INFO.founderName} ({COMPANY_INFO.founderTitle})
                </span>
              </div>

              {cert.status === 'revoked' && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
                  <span className="font-bold">Revocation Reason: </span>
                  <span>{cert.revocation_reason || 'Administrative action'}</span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 text-[11px] text-slate-500 space-y-1">
              <p className="font-medium text-slate-700">Official Verification Note:</p>
              <p>
                This record verifies that the student met all criteria published for the INTERN-UP
                7-calendar-day structured curriculum. INTERN-UP does not assert government recognition
                or corporate employment.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Certificate Not Found</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We could not locate any active certificate matching identifier{' '}
              <strong className="font-mono text-slate-800">{decodedId}</strong> in our registry.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/verify"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Try Another ID</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
