'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';
import Link from 'next/link';

interface CohortUrgencyBannerProps {
  compact?: boolean;
}

export const CohortUrgencyBanner: React.FC<CohortUrgencyBannerProps> = ({ compact = false }) => {
  const totalSeats = 50;
  const [filledSeats] = useState(42);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const percentage = Math.round((filledSeats / totalSeats) * 100);
  const seatsRemaining = totalSeats - filledSeats;

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
        <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
        <span>Only <strong>{seatsRemaining} seats remaining</strong> in this week&apos;s sprint cohort</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 dark:border-amber-500/20 shadow-sm backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Urgency & Slots Alert */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              <span>Limited Batch Capacity</span>
            </span>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
              {percentage}% of slots claimed
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Only</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono font-extrabold">
              {seatsRemaining} Seats Remaining
            </span>
            <span>in this review cohort!</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Capped at 50 students per mentor cohort to guarantee thorough individual GitHub code reviews.
          </p>
        </div>

        {/* Right: Countdown Timer & Fast Action Button */}
        <div className="flex flex-col sm:items-end gap-2 shrink-0 w-full sm:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Batch Registration Window Closes in:</span>
          </div>
          
          <div className="flex items-center gap-1 font-mono font-bold text-xs text-slate-900 dark:text-white">
            <span className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs text-amber-600 dark:text-amber-400">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>

          <Link
            href="/register"
            className="w-full sm:w-auto text-center px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-md shadow-orange-500/20 active:scale-95 transition-all"
          >
            Claim Your Free Sprint Slot &rarr;
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3.5 space-y-1">
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span>{filledSeats} Enrolled Students</span>
          <span className="font-semibold text-amber-700 dark:text-amber-400">
            {seatsRemaining} Left (First-Come, First-Served)
          </span>
        </div>
      </div>
    </div>
  );
};
