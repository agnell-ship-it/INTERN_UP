import React from 'react';
import Link from 'next/link';
import { ArrowLeft, IndianRupee } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';

export default function RefundPolicyPage() {
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
            DRAFT REFUND POLICY FOR REVIEW
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Refund Policy</h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: October 19, 2026 &bull; INTERN-UP Platform
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-5 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Program Administration Fee</h2>
          <p>
            The INTERN-UP fee of ₹100 per participant is a one-time administrative fee supporting curriculum
            curation, platform maintenance, manual task review, and document issuance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Refund Conditions</h2>
          <p>
            Because platform resources, personalized offer letters, and administrative verification are
            allocated upon enrollment, fees are generally non-refundable once an enrollment is confirmed.
          </p>
          <p>
            <strong>Exceptions:</strong> If an erroneous duplicate payment occurs (e.g., student accidentally
            transfers ₹100 twice for the same enrollment sprint), the student may contact{' '}
            {COMPANY_INFO.supportEmail} within 48 hours with both UTR references to request an administrative
            refund of the duplicate amount.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Incomplete Milestones</h2>
          <p>
            Failure to complete all 5 required tasks or failure to submit an approved LinkedIn announcement
            prior to program deadline does not entitle the student to a refund.
          </p>
        </section>
      </div>
    </div>
  );
}
