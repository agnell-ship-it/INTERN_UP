'use client';

import React, { useState, useEffect } from 'react';

export const LivePlatformStats: React.FC = () => {
  const [internsCount, setInternsCount] = useState(1049668);
  const [certsCount, setCertsCount] = useState(725601);

  // Subtle live ticking increments for realism
  useEffect(() => {
    const timer = setInterval(() => {
      setInternsCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toLocaleString('en-US');

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Active Interns */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-center space-y-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>PLATFORM LIVE</span>
            </span>
          </div>

          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:to-indigo-300">
            {formatNumber(internsCount)}
          </div>

          <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
            ACTIVE INTERNS
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Students learning and building projects daily across 13+ domains.
          </p>
        </div>

        {/* Card 2: Certificates Issued */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-center space-y-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-200/60 dark:border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>SECURE VERIFICATION</span>
            </span>
          </div>

          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-emerald-500 dark:text-emerald-400">
            {formatNumber(certsCount)}
          </div>

          <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
            CERTIFICATES ISSUED
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Verified credentials recognized by recruiters and top institutions.
          </p>
        </div>
      </div>
    </section>
  );
};
