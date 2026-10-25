import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: October 2026 &bull; {COMPANY_INFO.legalEntityName}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p>
          At INTERN-UP, we prioritize data privacy and transparency. This Privacy Policy details how{' '}
          {COMPANY_INFO.legalEntityName} collects, protects, and handles your information when using our
          platform.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-5 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            We collect only the essential personal details necessary to administer the program and generate
            authentic credentials:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Identity:</strong> Full Name (used on Enrollment Letters and Completion Certificates).</li>
            <li><strong>Contact:</strong> Email Address (for authentication, verification, and sprint reminders).</li>
            <li><strong>Academic:</strong> College/institution name, course/degree, and graduation year (optional).</li>
            <li><strong>Payment Verification:</strong> 12-digit UPI transaction reference (UTR) and receipt screenshot.</li>
            <li><strong>Work Deliverables:</strong> Public GitHub repository URLs and public LinkedIn announcement URLs.</li>
          </ul>
          <p>
            We never collect or store sensitive financial passwords, Aadhaar, PAN, debit/credit card numbers,
            or UPI PINs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Public Verification &amp; Privacy Protection</h2>
          <p>
            Our public certificate verification portal (<code>/verify</code>) and Public Registry (<code>/registry</code>)
            disclose strictly non-sensitive credential attributes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Certificate Identifier (e.g. <code>INUP-2026-X7K2-M9L4</code>)</li>
            <li>Recipient Full Name</li>
            <li>Enrolled Domain Track</li>
            <li>Program Start Date, End Date, and Issue Date</li>
            <li>Current Validation Status (Issued / Revoked)</li>
          </ul>
          <p>
            We never expose student email addresses, telephone numbers, or payment screenshots on public pages.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Data Retention and Security Architecture</h2>
          <p>
            All passwords are salted and hashed using cryptographic standards (PBKDF2/SHA-256) and never stored in
            plaintext. Data transmissions use TLS 1.3 HTTPS encryption. Platform databases employ Row-Level
            Security (RLS) to ensure students can only view and edit their own profiles and deliverables.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Data Deletion and Privacy Rights</h2>
          <p>
            Students may request export or deletion of their personal records at any time by contacting our
            privacy team at{' '}
            <a href={`mailto:${COMPANY_INFO.supportEmail}`} className="text-blue-600 underline">
              {COMPANY_INFO.supportEmail}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
