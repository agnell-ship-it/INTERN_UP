'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileText, Briefcase, Clock, Sparkles, ShieldCheck, Flame, Users, Award } from 'lucide-react';

export const ThiranexHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#102c70] via-[#0b1f4f] to-[#071434] text-white pt-16 sm:pt-24 pb-20 sm:pb-28 border-b border-blue-900/50">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-blue-500/25 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
        {/* Top Floating Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border-2 border-blue-400/40 text-blue-200 text-xs sm:text-sm font-extrabold tracking-wide backdrop-blur-md shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>JOIN 50,000+ VIRTUAL INTERNS ACROSS INDIA</span>
        </div>

        {/* Hero Title with Gold Gradient Accent */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.14] max-w-4xl mx-auto">
          100% Free{' '}
          <span className="text-[#ffd54f] drop-shadow-[0_4px_16px_rgba(255,213,79,0.35)]">
            Verified Virtual Internship
          </span>{' '}
          2026 | Pan-India
        </h1>

        {/* High-Contrast Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-white/95 leading-relaxed max-w-2xl mx-auto font-medium">
          Apply free, learn free, and complete your internship free. Choose from 13+ domains,
          get an instant offer letter, and build real project experience online with INTERN-UP.
        </p>

        {/* Dynamic Batch Start Banner with High-Contrast Text */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/90 border-2 border-amber-400/60 text-amber-300 text-xs sm:text-sm font-bold backdrop-blur-md shadow-md">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>New Batch Starts: <strong className="text-white font-extrabold underline decoration-amber-400 decoration-2">01 November 2026</strong> | Limited Slots Left!</span>
        </div>

        {/* Live Counter Pill in Hero for Instant Visibility */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-white text-xs font-bold border border-blue-400/40">
            <Users className="w-3.5 h-3.5 text-blue-300" />
            <span>1,049,668+ Active Interns</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-white text-xs font-bold border border-emerald-400/40">
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            <span>725,601+ Certificates Issued</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#ffd54f] hover:bg-[#ffca28] text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Get Started Now (It&apos;s Free)</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
          <Link
            href="/domains"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/15 hover:bg-white/20 border-2 border-white/40 text-white font-bold text-sm sm:text-base backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore 13 Domains</span>
            <ArrowRight className="w-4 h-4 text-blue-200 stroke-[2.5]" />
          </Link>
        </div>

        {/* Trust Value Badges Row with Bold Clear White Text */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-white font-bold">
          <div className="flex items-center gap-2 bg-slate-950/40 px-3 py-1 rounded-full border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified Program</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/40 px-3 py-1 rounded-full border border-white/10">
            <FileText className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Instant Offer Letter</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/40 px-3 py-1 rounded-full border border-white/10">
            <Briefcase className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>100% Virtual</span>
          </div>
        </div>
      </div>
    </section>
  );
};
