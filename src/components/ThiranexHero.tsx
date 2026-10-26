'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileText, Briefcase, Clock, Sparkles, ShieldCheck } from 'lucide-react';

export const ThiranexHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#133075] via-[#0d2358] to-[#08183c] text-white pt-16 sm:pt-24 pb-24 sm:pb-32 border-b border-blue-900/40">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-blue-500/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
        {/* Top Floating Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/60 border border-blue-400/30 text-blue-200 text-xs font-bold tracking-wide backdrop-blur-md shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>JOIN 50,000+ VIRTUAL INTERNS ACROSS INDIA</span>
        </div>

        {/* Hero Title with Gold Gradient Accent */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] max-w-4xl mx-auto">
          100% Free{' '}
          <span className="text-[#ffd54f] drop-shadow-md">
            Verified Virtual Internship
          </span>{' '}
          2026 | Pan-India
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto font-normal">
          Apply free, learn free, and complete your internship free. Choose from 13+ domains,
          get an instant offer letter, and build real project experience online with INTERN-UP.
        </p>

        {/* Dynamic Batch Start Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/70 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-sm">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>New Batch Starts: <strong className="text-white">01 November 2026</strong> | Limited Slots Left!</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#ffd54f] hover:bg-[#ffca28] text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Get Started Now (It&apos;s Free)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/domains"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/25 text-white font-semibold text-sm backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Domains</span>
            <ArrowRight className="w-4 h-4 text-blue-200" />
          </Link>
        </div>

        {/* Trust Value Badges Row */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified Program</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Instant Offer Letter</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>100% Virtual</span>
          </div>
        </div>
      </div>
    </section>
  );
};
