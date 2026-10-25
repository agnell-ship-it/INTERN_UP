'use client';

import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, CheckCircle2, RotateCw, PlusCircle } from 'lucide-react';

interface DeadlineCountdownTimerProps {
  deadlineISO: string;
  enrollmentId?: string;
  onExtensionRequested?: () => void;
}

export const DeadlineCountdownTimer: React.FC<DeadlineCountdownTimerProps> = ({
  deadlineISO,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    totalSeconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    totalSeconds: 0,
  });

  const [extensionNotice, setExtensionNotice] = useState<string | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const target = new Date(deadlineISO).getTime();
      const diffMs = target - now;

      if (diffMs <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          totalSeconds: 0,
        });
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        totalSeconds,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [deadlineISO]);

  const handleRequestExtension = () => {
    setExtensionNotice(
      '3-day grace extension requested! Platform administrator will confirm your extension without resetting prior submissions.'
    );
  };

  const isUrgent = !timeLeft.isExpired && timeLeft.days === 0 && timeLeft.hours < 24;

  return (
    <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
          <span>Sprint Deadline Countdown</span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            timeLeft.isExpired
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : isUrgent
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}
        >
          {timeLeft.isExpired ? 'Sprint Expired' : isUrgent ? 'Final 24 Hours' : 'Active Horizon'}
        </span>
      </div>

      {!timeLeft.isExpired ? (
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Days</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Hours</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Mins</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <div className="text-xl sm:text-2xl font-black text-blue-400 font-mono">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Secs</div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Standard 7-day period has passed</span>
            <p className="text-[11px] text-red-300">
              Per our deadline policy, your submitted repositories remain intact. You can activate a 3-day extension or re-enroll for free.
            </p>
          </div>
        </div>
      )}

      {extensionNotice && (
        <div className="p-2.5 rounded-lg bg-blue-900/50 border border-blue-700/80 text-[11px] text-blue-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{extensionNotice}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
        <span>Timezone: Asia/Kolkata (IST)</span>
        <button
          type="button"
          onClick={handleRequestExtension}
          className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Activate 3-Day Grace Extension</span>
        </button>
      </div>
    </div>
  );
};
