import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
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
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">
            DRAFT POLICY FOR REVIEW
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: October 19, 2026 &bull; INTERN-UP Platform
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Notice:</strong> This is a draft terms of service document outlining program rules,
          acceptable use, and platform limitations. The platform owner must review and finalize prior
          to legal enforcement.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-5 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Program Nature and Scope</h2>
          <p>
            INTERN-UP provides a self-paced, task-based technical skill development program spanning
            seven (7) calendar days per enrollment. Participation does not establish an employment
            relationship, contractor agreement, or corporate internship with any external commercial entity.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Account Registration and Security</h2>
          <p>
            Users must provide authentic and accurate academic and personal information. Users may not
            share account credentials or attempt to access or modify records belonging to other participants.
            Attempting to manipulate administrative privileges or tamper with verification endpoints will result
            in immediate termination of account access.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Task Submissions & Code Ownership</h2>
          <p>
            Students retain ownership of all code authored and submitted via public GitHub repositories.
            By submitting a link, participants confirm that they authored the submitted code and adhered to
            ethical academic standards. Cybersecurity domain participants must restrict all work to safe,
            authorized defensive exercises.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Program Fee & Direct UPI Verification</h2>
          <p>
            Participation requires a non-refundable one-time program administration fee of ₹100 paid via
            direct UPI. Submission of a transaction reference (UTR) is subject to manual verification by
            the platform administration against received banking records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Limitation of Liability</h2>
          <p>
            INTERN-UP makes no guarantees of employment, job placement, corporate compensation, or academic
            credit transfer. The platform is provided &quot;as is&quot; without warranties of any kind.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">6. Contact Information</h2>
          <p>
            Inquiries regarding these terms may be directed to {COMPANY_INFO.supportEmail}.
          </p>
        </section>
      </div>
    </div>
  );
}
