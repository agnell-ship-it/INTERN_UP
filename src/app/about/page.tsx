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
} from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>ABOUT INTERN-UP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Practical, Task-Based Learning For Modern Developers
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          INTERN-UP was designed to give aspiring software professionals a structured,
          accountable seven-calendar-day framework to build real projects, publish code to GitHub,
          and demonstrate their capabilities.
        </p>
      </div>

      {/* Program Core Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">7-Calendar-Day Horizon</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            A focused one-week time window keeps learners accountable and motivated. From enrollment to submission,
            you know exactly what tasks are required.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">5 Progressive Tasks</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rather than passive video watching, every domain presents 5 progressive deliverables that culminate
            in public GitHub repositories.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Transparent ₹100 Fee</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Accessible direct UPI program fee of ₹100 per participant covers platform upkeep, manual submission
            verification, and digital certificate generation.
          </p>
        </div>
      </div>

      {/* Leadership & Integrity */}
      <div className="p-8 bg-white rounded-2xl border border-slate-200 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
            JW
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">{COMPANY_INFO.founderName}</h2>
            <p className="text-xs font-semibold text-blue-600">{COMPANY_INFO.founderTitle}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
              <Mail className="w-3.5 h-3.5" />
              <a href={`mailto:${COMPANY_INFO.supportEmail}`} className="hover:underline">
                {COMPANY_INFO.supportEmail}
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
          <p>
            INTERN-UP is founded on the belief that coding is learned by building. We structure real tasks
            spanning 13 foundational computer science domains, including Web Development, Python, Java, AI,
            Machine Learning, Data Science, Data Analytics, Android, UI/UX, Cybersecurity, Cloud Computing, IoT,
            and Database Management.
          </p>
          <p>
            We strictly believe in transparency: our certificates document completion of INTERN-UP&apos;s published
            milestones and verified repository submissions. We make no claims of university accreditation,
            government recognition, or guaranteed job placement.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link href="/register">
          <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Join the Next 7-Day Cohort
          </Button>
        </Link>
      </div>
    </div>
  );
}
