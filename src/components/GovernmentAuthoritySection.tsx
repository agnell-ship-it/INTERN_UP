'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Sparkles, Briefcase, ArrowRight } from 'lucide-react';

export const GovernmentAuthoritySection: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div>
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-300 dark:border-blue-700 shadow-xs">
            ABOUT INTERN-UP
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Empowering India&apos;s Next Generation of Tech Leaders
        </h2>

        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          INTERN-UP EduTech LLP is an MSME-registered premier virtual internship and skill development organization committed to providing accessible, industry-aligned practical education for students nationwide.
        </p>
      </div>

      {/* 3 Authority Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Card 1: Government Recognized */}
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
            <Award className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Government Recognized
          </h3>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Officially registered under the Ministry of Micro, Small and Medium Enterprises (MSME), Government of India (Udyam Reg:{' '}
            <strong className="text-blue-700 dark:text-blue-400 font-bold font-mono bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
              UDYAM-TN-02-0512885
            </strong>).
          </p>
        </div>

        {/* Card 2: 100% Free Core Access */}
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
            <Sparkles className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            100% Free Core Access
          </h3>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            We believe quality technical training must be accessible to all. Applying, learning, submitting tasks, and receiving evaluation is <strong className="text-emerald-700 dark:text-emerald-400 font-bold">100% free with zero upfront charges</strong>.
          </p>
        </div>

        {/* Card 3: Real-World Engineering */}
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs">
            <Briefcase className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Real-World Engineering
          </h3>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Curriculum engineered to bridge academic learning with production standards across Web Dev, AI/ML, Data Science, Python, Cybersecurity, and 13+ domains.
          </p>
        </div>
      </div>

      {/* Learn More Link */}
      <div className="text-center pt-2">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors group"
        >
          <span>Learn More About Our Mission &amp; Leadership</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
