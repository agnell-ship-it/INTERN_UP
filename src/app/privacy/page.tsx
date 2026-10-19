import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
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
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">
            DRAFT PRIVACY POLICY FOR REVIEW
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: October 19, 2026 &bull; INTERN-UP Platform
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-5 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            We collect only the minimum information necessary to administer the internship program:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full Name (used for generating official Offer Letters and Certificates)</li>
            <li>Email Address (for authentication and support communication)</li>
            <li>Academic details: Institution name, course/degree, graduation year (optional)</li>
            <li>Payment reference: UPI transaction reference / UTR number</li>
            <li>Submitted project links: Public GitHub URLs and LinkedIn post URLs</li>
          </ul>
          <p>
            We do <strong>not</strong> collect government identity numbers, Aadhaar, PAN, banking passwords,
            or UPI PINs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Public Verification & Data Protection</h2>
          <p>
            Our public certificate verification service (/verify) discloses only non-sensitive verification
            attributes: the recipient&apos;s name, domain name, program dates, and issue status. We never expose
            student email addresses, telephone numbers, or payment screenshots on public pages.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Data Retention and Security</h2>
          <p>
            Student data is stored securely and protected with database Row Level Security (RLS). Passwords
            are salted and hashed using cryptographic standards and never stored in plaintext.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Contact & Inquiries</h2>
          <p>
            For privacy inquiries or data removal requests, please email {COMPANY_INFO.supportEmail}.
          </p>
        </section>
      </div>
    </div>
  );
}
