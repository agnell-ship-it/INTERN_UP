import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO, INITIAL_DOMAINS } from '@/lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                INTERN<span className="text-blue-500">-UP</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Build practical software skills through structured, task-based learning.
              Choose an engineering domain, complete 5 hands-on milestones, and track your
              progress transparently.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Founder: <strong className="text-slate-200">{COMPANY_INFO.founderName}</strong> ({COMPANY_INFO.founderTitle})</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`mailto:${COMPANY_INFO.supportEmail}`}
                  className="hover:text-blue-400 transition-colors underline"
                >
                  {COMPANY_INFO.supportEmail}
                </a>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <span>Transparent Program Fee:</span>
              <strong className="text-emerald-400 font-semibold">₹100 (Direct UPI)</strong>
            </div>
          </div>

          {/* Internship Domains (Quick list) */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Domains (13)
            </h4>
            <ul className="space-y-2 text-xs">
              {INITIAL_DOMAINS.slice(0, 7).map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/domains`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/domains"
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                >
                  <span>View All 13 Domains &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Program Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/how-it-works" className="hover:text-blue-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About Platform
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-blue-400 transition-colors">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Support & Contact
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin/bootstrap"
                  className="text-amber-400/80 hover:text-amber-300 text-[11px] flex items-center gap-1"
                >
                  <span>Owner / Admin Setup</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Compliance */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Policies & Notice
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="hover:text-blue-400 transition-colors">
                  Terms of Service (Draft)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                  Privacy Policy (Draft)
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-blue-400 transition-colors">
                  Refund Policy (Draft)
                </Link>
              </li>
              <li>
                <Link href="/certificate-policy" className="hover:text-blue-400 transition-colors">
                  Certificate Policy (Draft)
                </Link>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-lg bg-slate-800/50 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1 text-slate-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Honest Disclosure</span>
              </div>
              <p>
                INTERN-UP provides self-paced practical educational tasks. Submitting work does not imply independent third-party code auditing or guarantee external employment.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY_INFO.websiteName}. All rights reserved. Directed by {COMPANY_INFO.founderName}.
          </p>
          <p className="text-[11px]">
            Platform Timezone: Asia/Kolkata (IST) &bull; Standard Duration: 7 Calendar Days
          </p>
        </div>
      </div>
    </footer>
  );
};
