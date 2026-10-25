import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Award, ShieldAlert, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';

export default function CertificatePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>OFFICIAL POLICY &bull; VERSION 1.0 (FINAL)</span>
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Certificate Issuance &amp; Verification Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: October 2026 &bull; {COMPANY_INFO.legalEntityName}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p>
          INTERN-UP completion certificates document genuine student milestone achievement. To maintain the highest
          credibility for students, recruiters, and academic institutions, credentials are evaluated against strict,
          tamper-resistant server-side criteria.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-5 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Mandatory Single Source of Truth Eligibility</h2>
          <p>
            Certificates are never automatically issued upon registration. To receive an official INTERN-UP
            Completion Certificate, all 6 business conditions must be verified server-side:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li><strong>Active Enrollment:</strong> Valid registration and completed enrollment in one of our 13 technical tracks.</li>
            <li><strong>LinkedIn Learning Sprint Announcement:</strong> An administrator-approved public post URL documenting participation.</li>
            <li><strong>5 Verified Task Deliverables:</strong> All 5 practical milestones submitted with public, accessible GitHub repositories.</li>
            <li><strong>Direct UPI Program Fee:</strong> Confirmed ₹100 payment approved by administrative manual audit against bank UTR.</li>
            <li><strong>Timeline Fulfillment:</strong> Completion within the 7-calendar-day window (or approved 3-day extension).</li>
            <li><strong>Good Standing:</strong> Account and submissions free of academic dishonesty, plagiarism, or revocation flags.</li>
          </ol>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Tamper-Resistant Security &amp; Cryptographic IDs</h2>
          <p>
            Every certificate is issued with a cryptographically secure, non-guessable identifier formatted as{' '}
            <code>INUP-YYYY-XXXX-XXXX-XXXX</code> containing 48 bits of cryptographic entropy. Each certificate PDF
            embeds a high-resolution QR code directly linking to its official public verification page at{' '}
            <code>/verify/[certificateId]</code>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Permanent Public Registry &amp; Verification</h2>
          <p>
            All issued credentials are indexed in our public registry (<code>/registry</code>) and can be verified
            24/7 by prospective employers and universities without requiring an account or fee. Verification displays
            only the recipient&apos;s name, domain, dates, and validation status, preserving participant privacy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Revocation and Invalidation Protocol</h2>
          <p>
            INTERN-UP administrators reserve the right to revoke any certificate if substantive evidence of
            plagiarism, fraudulent transaction references, or unauthorized malicious activity is identified post-issuance.
            All revocations are recorded in the immutable audit log and publicly indicated with a red revocation status
            on the verification portal.
          </p>
        </section>
      </div>
    </div>
  );
}
