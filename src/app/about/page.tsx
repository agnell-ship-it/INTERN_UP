import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Mail,
  Building2,
  Award,
  Globe,
  FileCheck,
} from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-semibold border border-transparent dark:border-blue-800/60">
          <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>ABOUT INTERN-UP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Practical, Task-Based Learning For Modern Developers
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {COMPANY_INFO.legalEntityName} was founded with a singular purpose: to replace passive video
          watching with structured, hands-on software development sprints that yield genuine GitHub portfolios.
        </p>
      </div>

      {/* Program Core Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">7-Calendar-Day Sprint</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            A focused one-week time window keeps learners accountable and motivated. From enrollment to submission,
            you know exactly what tasks are required.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">5 Practical Milestones</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Rather than generic multiple-choice quizzes, every domain presents 5 progressive deliverables that culminate
            in public GitHub repositories with mentor review.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Accessible ₹100 Fee</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            A transparent one-time direct UPI program administration fee of ₹100 per participant covers platform upkeep,
            manual submission reviews, and digital certificate generation.
          </p>
        </div>
      </div>

      {/* Corporate Entity & Operating Information */}
      <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>REGISTERED ENTITY</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {COMPANY_INFO.legalEntityName}
            </h2>
            <p className="text-xs text-slate-400">
              Incorporated under educational technology regulations &bull; Operating in Asia/Kolkata (IST)
            </p>
          </div>

          <div className="text-xs space-y-1 text-slate-300 sm:text-right">
            <div>Official Domain: <span className="font-mono text-blue-400">{COMPANY_INFO.officialDomain}</span></div>
            <div>Support Desk: <a href={`mailto:${COMPANY_INFO.supportEmail}`} className="text-white underline hover:text-blue-300 font-mono">{COMPANY_INFO.supportEmail}</a></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-1.5">
            <span className="font-semibold text-white block">Mission</span>
            <p className="text-slate-400 leading-relaxed">
              Empowering university engineering students and self-taught developers to bridge the gap between classroom theory and real-world code repositories.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="font-semibold text-white block">Curriculum Standards</span>
            <p className="text-slate-400 leading-relaxed">
              13 computer science domains with 65 structured milestones, curated to emphasize modular programming, Git hygiene, and accessible web standards.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="font-semibold text-white block">Honest Credentialing</span>
            <p className="text-slate-400 leading-relaxed">
              We certify completed, verified tasks. We never claim government accreditation or university degrees, ensuring full honesty with employers.
            </p>
          </div>
        </div>
      </div>

      {/* Leadership & Founder Credentials */}
      <div className="p-8 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
            JW
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{COMPANY_INFO.founderName}</h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-[10px] font-semibold">
                Academic Director
              </span>
            </div>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{COMPANY_INFO.founderTitle}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {COMPANY_INFO.founderCredentials}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <a href={`mailto:${COMPANY_INFO.supportEmail}`} className="hover:underline font-mono">
                  {COMPANY_INFO.supportEmail}
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-mono">{COMPANY_INFO.officialDomain}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
          <p>
            Dr. Jonath Watson has spent over a decade leading undergraduate computing courses, mentoring aspiring
            engineers, and designing competency-based computer science curricula. INTERN-UP was built from firsthand
            observations that recruiters evaluate candidates by inspecting what they build, not by passive certificates.
          </p>
          <p>
            Under Dr. Watson&apos;s guidance, every task deliverable in our 13 tracks requires public version-controlled
            repository submissions, README documentation, and ethical compliance.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link href="/domains">
          <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore 13 Tracks &amp; Tasks
          </Button>
        </Link>
      </div>
    </div>
  );
}
