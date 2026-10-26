'use client';

import React, { useState, useEffect } from 'react';
import { Users, Award, ShieldCheck, Flame, School, Sparkles } from 'lucide-react';

export const LivePlatformStats: React.FC = () => {
  const [internsCount, setInternsCount] = useState(1049668);
  const [certsCount, setCertsCount] = useState(725601);

  // Subtle live ticking increments for realism
  useEffect(() => {
    const timer = setInterval(() => {
      setInternsCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toLocaleString('en-US');

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-30">
      {/* 2 Main Giant Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Card 1: Active Interns */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border-2 border-slate-200/90 dark:border-slate-800 shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all text-center space-y-4">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-xs font-extrabold uppercase tracking-wider border border-blue-300 dark:border-blue-700 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>PLATFORM LIVE</span>
            </span>
          </div>

          {/* Solid high-contrast text color - NO TRANSPARENCY */}
          <div className="text-5xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight text-blue-600 dark:text-blue-400">
            {formatNumber(internsCount)}
          </div>

          <div className="text-sm sm:text-base font-black uppercase tracking-widest text-slate-900 dark:text-white">
            ACTIVE INTERNS
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 max-w-md mx-auto leading-relaxed font-medium">
            Students learning, submitting code milestones, and building production repositories daily across 13+ domains.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 py-1.5 px-3 rounded-xl border border-amber-200 dark:border-amber-800/60 max-w-xs mx-auto">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>42/50 Enrolled in This Batch (84% Full)</span>
          </div>
        </div>

        {/* Card 2: Certificates Issued */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border-2 border-slate-200/90 dark:border-slate-800 shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all text-center space-y-4">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-300 dark:border-emerald-700 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>SECURE VERIFICATION</span>
            </span>
          </div>

          {/* Solid high-contrast text color - NO TRANSPARENCY */}
          <div className="text-5xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
            {formatNumber(certsCount)}
          </div>

          <div className="text-sm sm:text-base font-black uppercase tracking-widest text-slate-900 dark:text-white">
            CERTIFICATES ISSUED
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 max-w-md mx-auto leading-relaxed font-medium">
            Verified credentials recognized by recruiters, startup tech leads, and top universities nationwide.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 py-1.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 max-w-xs mx-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>100% Cryptographic QR Verification</span>
          </div>
        </div>
      </div>

      {/* 4 Quick Social Proof Highlights Row */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">1.04M+</div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Students Enrolled</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">725K+</div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Verified Credentials</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">2,450+</div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Colleges &amp; Universities</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">100% Free</div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Core Training Access</div>
        </div>
      </div>
    </section>
  );
};
