'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

const RECENT_ENROLLMENTS = [
  { name: 'Aditya K.', college: 'DTU Delhi', domain: 'Web Development', time: '3m ago' },
  { name: 'Sneha P.', college: 'VIT Vellore', domain: 'Python Programming', time: '7m ago' },
  { name: 'Karthik R.', college: 'IIT Madras', domain: 'Artificial Intelligence', time: '12m ago' },
  { name: 'Megha S.', college: 'BITS Pilani', domain: 'Cloud & DevOps', time: '18m ago' },
  { name: 'Harsh V.', college: 'NIT Trichy', domain: 'Data Science', time: '24m ago' },
  { name: 'Ananya B.', college: 'PES University', domain: 'Cybersecurity', time: '31m ago' },
];

export const SocialProofToast: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Show after initial 4 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Rotate every 12 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % RECENT_ENROLLMENTS.length);
        setVisible(true);
      }, 800);
    }, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed || !visible) return null;

  const current = RECENT_ENROLLMENTS[index];

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md flex items-center gap-3 relative">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
          <CheckCircle2 className="w-5 h-5" />
        </div>

        <div className="space-y-0.5 text-xs pr-4">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
            <span>{current.name}</span>
            <span className="text-[10px] font-normal text-slate-400">({current.college})</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
            Enrolled in <strong className="text-blue-600 dark:text-blue-400 font-semibold">{current.domain}</strong>
          </p>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            Slot claimed &bull; {current.time}
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
