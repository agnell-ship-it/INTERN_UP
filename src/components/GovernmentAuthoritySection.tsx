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
          <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60">
            ABOUT INTERN-UP
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Empowering India&apos;s Next Generation of Tech Leaders
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          INTERN-UP EduTech LLP is an MSME-registered premier virtual internship and skill development organization committed to providing accessible, industry-aligned practical education for students nationwide.
        </p>
      </div>

      {/* 3 Authority Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Card 1: Government Recognized */}
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
            <Award className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Government Recognized
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Officially registered under the Ministry of Micro, Small and Medium Enterprises (MSME), Government of India (Udyam Reg: <strong className="text-slate-700 dark:text-slate-300 font-semibold font-mono">UDYAM-TN-02-0512885</strong>).
          </p>
        </div>

        {/* Card 2: 100% Free Core Access */}
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xs">
            <Sparkles className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            100% Free Core Access
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            We believe quality technical training must be accessible to all. Applying, learning, submitting tasks, and receiving evaluation is 100% free with zero upfront charges.
          </p>
        </div>

        {/* Card 3: Real-World Engineering */}
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/70 border border-purple-100 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-2xs">
            <Briefcase className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Real-World Engineering
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Curriculum engineered to bridge academic learning with production standards across Web Dev, AI/ML, Data Science, Python, Cybersecurity, and 13+ domains.
          </p>
        </div>
      </div>

      {/* Learn More Link */}
      <div className="text-center pt-2">
        <Link
          href="/about"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
          <span>Learn More About Our Mission &amp; Leadership</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
