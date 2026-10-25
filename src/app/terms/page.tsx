import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';

export default function TermsPage() {
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
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: October 2026 &bull; {COMPANY_INFO.legalEntityName}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p>
          Welcome to INTERN-UP. By accessing our platform, registering an account, or enrolling in an
          engineering domain, you agree to these Terms of Service. These terms constitute a legally binding
          agreement between you and {COMPANY_INFO.legalEntityName}.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-5 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Program Nature and Scope</h2>
          <p>
            INTERN-UP provides a self-paced, task-based technical skill development program structured across
            seven (7) calendar days per enrollment. Participation does not establish an employer-employee
            relationship, agency, partnership, or corporate internship with any external commercial entity.
            INTERN-UP is an independent educational technology platform designed to help developers build
            practical portfolios.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Account Registration and Security</h2>
          <p>
            Participants must provide accurate and authentic personal and academic details. You are solely
            responsible for safeguarding your credentials. Sharing account credentials, attempting unauthorized
            role escalations, or attempting to compromise authentication or verification APIs is strictly
            prohibited and will result in immediate termination of platform access.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Task Submissions &amp; Code Ownership</h2>
          <p>
            Students retain 100% intellectual property ownership of all code authored and submitted. By
            submitting a public GitHub repository link, participants warrant that they are the primary authors
            of the code and complied with academic integrity standards. Cybersecurity domain participants must
            strictly restrict work to authorized, local, defensive sandbox environments.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Program Fee &amp; Direct UPI Verification</h2>
          <p>
            Participation requires a transparent one-time program administration fee of ₹100 paid via direct UPI.
            Students must submit their genuine 12-digit UPI transaction reference (UTR) and optional receipt.
            Approval is conducted through manual administrative verification against authorized bank records.
            Submitting counterfeit or reused transaction references will lead to immediate enrollment disqualification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. 7-Day Sprint Horizon &amp; Missed Deadline Policy</h2>
          <p>
            The standard program horizon is seven (7) calendar days calculated in the Asia/Kolkata (IST) timezone.
            If a participant requires additional time:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Grace Extension:</strong> Students may activate a one-time 3-calendar-day extension directly from their dashboard.</li>
            <li><strong>Retry Option:</strong> If the sprint expires before all 5 tasks are completed, students can reset or re-enroll without financial penalty within 30 days.</li>
            <li><strong>Work Preservation:</strong> Previously submitted GitHub repositories remain saved in the student profile for easy resubmission.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">6. Limitation of Liability &amp; Disclaimers</h2>
          <p>
            INTERN-UP provides educational milestone evaluations and digital completion credentials. We do not
            guarantee employment, placement, compensation, or academic credit transfer from any university or
            corporate employer. The platform and its materials are provided &quot;as is&quot; without warranties
            of any kind.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">7. Contact &amp; Legal Notices</h2>
          <p>
            Formal notices or inquiries regarding these terms may be directed to our official legal and support
            channel at <a href={`mailto:${COMPANY_INFO.supportEmail}`} className="text-blue-600 underline">{COMPANY_INFO.supportEmail}</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
