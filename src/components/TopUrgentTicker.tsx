'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, AlertTriangle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const TopUrgentTicker: React.FC = () => {
  const [seatsLeft, setSeatsLeft] = useState(9);

  // Dynamic urgency oscillation between 9 and 7 seats
  useEffect(() => {
    const timer = setInterval(() => {
      setSeatsLeft((prev) => (prev > 7 ? prev - 1 : 9));
    }, 18000);
    return () => clearInterval(timer);
  }, []);

  const marqueeContent = (
    <div className="flex items-center gap-8 px-4 text-xs font-semibold text-white">
      {/* Item 1 */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-200">
          <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
          <span>BATCH STARTING — IN 6 DAYS | 01 Nov 2026</span>
        </span>
        <Link
          href="/register"
          className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] shadow-xs hover:scale-105 transition-all"
        >
          <span>Register Now — IUP-NOV26-001</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <span className="text-white/40">&bull;</span>

      {/* Item 2 */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1.5 text-white/95">
          <Clock className="w-3.5 h-3.5 text-amber-200" />
          <span>Next Batch Selection Ends Soon! Enroll Now to Secure Your Domain.</span>
        </span>
        <Link
          href="/register"
          className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] shadow-xs hover:scale-105 transition-all"
        >
          <span>Apply Before Selection Closes</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <span className="text-white/40">&bull;</span>

      {/* Item 3 */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1.5 font-bold text-amber-100">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
          <span>URGENT: Batch Starting Soon! Only {seatsLeft} Seats Left Across All Domains.</span>
        </span>
        <Link
          href="/register"
          className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] shadow-xs hover:scale-105 transition-all"
        >
          <span>Apply Before Selection Closes</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <span className="text-white/40">&bull;</span>

      {/* Item 4 */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1.5 text-white/95">
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>100% Free Core Access & Verified Virtual Internship 2026 | Pan-India</span>
        </span>
        <Link
          href="/register"
          className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] shadow-xs hover:scale-105 transition-all"
        >
          <span>Lock Free Spot</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <span className="text-white/40">&bull;</span>
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white overflow-hidden py-1.5 border-b border-red-800 shadow-xs relative z-50">
      <div className="animate-marquee flex items-center whitespace-nowrap">
        {marqueeContent}
        {marqueeContent}
      </div>
    </div>
  );
};
