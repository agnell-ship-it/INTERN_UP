import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, IndianRupee, ShieldCheck } from 'lucide-react';
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
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>OFFICIAL POLICY &bull; VERSION 1.0 (FINAL)</span>
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Refund Policy</h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: October 2026 &bull; {COMPANY_INFO.legalEntityName}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <IndianRupee className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p>
          At INTERN-UP, we maintain absolute financial transparency. The one-time ₹100 direct UPI program
          administration fee directly funds server resources, manual mentor code reviews, and digital credential
          generation.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-5 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Program Administration Fee</h2>
          <p>
            The ₹100 fee is an accessible, one-time program fee per enrolled student. It covers administrative
            verification, manual review of submitted GitHub deliverables by mentors, server upkeep, and automated
            document generation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Standard Non-Refundable Condition</h2>
          <p>
            Because platform access, curriculum tasks, enrollment letter generation, and mentor allocation occur
            immediately upon enrollment, program fees are generally non-refundable once an enrollment is confirmed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Duplicate Transaction Refund Guarantee</h2>
          <p>
            <strong>Exceptions:</strong> If an accidental duplicate transaction occurs (for example, a network
            lag causing a student to transfer ₹100 twice for the same enrollment), the student may contact our
            finance desk at{' '}
            <a href={`mailto:${COMPANY_INFO.supportEmail}`} className="text-blue-600 underline">
              {COMPANY_INFO.supportEmail}
            </a>{' '}
            within 48 hours with both UPI UTR numbers. Upon verification, the duplicate ₹100 payment will be refunded
            to the original paying account within 3 to 5 business days.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Program Extensions and Missed Milestones</h2>
          <p>
            Inability to complete all 5 tasks within the standard 7 days does not result in forfeiture of your fee.
            Students can activate a 3-day extension or re-enroll in a subsequent sprint cohort without paying any
            additional fee within 30 days of registration.
          </p>
        </section>
      </div>
    </div>
  );
}
