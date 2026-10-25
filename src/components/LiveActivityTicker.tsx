'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, Award, ArrowRight, ShieldCheck } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'enrollment' | 'submission' | 'certificate' | 'review';
  text: string;
  badge: string;
  timeAgo: string;
  link: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'certificate',
    text: 'Priya Patel claimed verified Certificate for Web Development',
    badge: 'INUP-2026-W9K2',
    timeAgo: '4m ago',
    link: '/verify/INUP-2026-W9K2-M8L1',
  },
  {
    id: '2',
    type: 'submission',
    text: 'Rohan Nair submitted Milestone 4 GitHub repository in Python Track',
    badge: 'Code Verified',
    timeAgo: '11m ago',
    link: '/domains',
  },
  {
    id: '3',
    type: 'certificate',
    text: 'Ananya Iyer verified Credential with scannable QR Code',
    badge: 'INUP-2026-A4B7',
    timeAgo: '28m ago',
    link: '/registry',
  },
  {
    id: '4',
    type: 'enrollment',
    text: 'Student enrolled in 7-Day AI & Neural Networks Sprint',
    badge: 'Enrollment Letter Issued',
    timeAgo: '35m ago',
    link: '/domains',
  },
  {
    id: '5',
    type: 'review',
    text: 'Mentor evaluation approved: Cloud Computing Task 5 architecture',
    badge: 'Rubric Passed',
    timeAgo: '42m ago',
    link: '/how-it-works',
  },
];

export const LiveActivityTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = ACTIVITIES[currentIndex];

  return (
    <div className="w-full bg-slate-900/95 dark:bg-slate-950/95 border-b border-slate-800 text-xs py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Live pulsing dot */}
          <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE SPRINT FEED</span>
          </div>

          {/* Animated active item */}
          <div className="flex items-center gap-2 truncate text-slate-300">
            <span className="truncate">{current.text}</span>
            <span className="hidden md:inline-block px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono shrink-0">
              {current.badge}
            </span>
            <span className="text-slate-500 text-[10px] shrink-0">&bull; {current.timeAgo}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={current.link}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
          >
            <span>View In Registry</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 text-[11px] border-l border-slate-800 pl-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Cryptographically Verifiable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
