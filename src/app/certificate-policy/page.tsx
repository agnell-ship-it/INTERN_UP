import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, CheckCircle2 } from 'lucide-react';
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
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">
            DRAFT CERTIFICATE POLICY FOR REVIEW
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Certificate Issuance & Verification Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: October 19, 2026 &bull; INTERN-UP Platform
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-5 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Mandatory Eligibility Criteria</h2>
          <p>
            Certificates are never issued automatically or upon request alone. To be eligible for an official
            INTERN-UP Completion Certificate, a participant must fulfill all 6 conditions:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Hold an active or valid completed enrollment in an approved domain.</li>
            <li>Have an administrator-approved LinkedIn internship announcement post.</li>
            <li>Submit all five (5) practical task deliverables with valid public GitHub repository links.</li>
            <li>Complete the ₹100 direct UPI program fee with manual administrator approval.</li>
            <li>Complete deliverables within the 7-calendar-day sprint (or authorized extension).</li>
            <li>Account and certificate must not be flagged, revoked, or invalidated.</li>
          </ol>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Revocation & Superseding Policy</h2>
          <p>
            An administrator may revoke or supersede an issued certificate if plagiarism, malicious code,
            fraudulent payment submission, or violation of defensive security rules is determined. All
            revocations require recorded administrative reasons and are permanently noted in the audit log.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Verification & Credential Authenticity</h2>
          <p>
            Each certificate contains a non-guessable identifier (e.g. INUP-2026-XXXX-XXXX). Anyone may verify
            the certificate&apos;s validity at /verify. The certificate certifies completion of INTERN-UP&apos;s
            internal curriculum and does not imply government accreditation or university affiliation.
          </p>
        </section>
      </div>
    </div>
  );
}
