'use client';

import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Database,
  Terminal,
  Shield,
  Cpu,
  Smartphone,
  Cloud,
  FileCode2,
  Coffee,
  Palette,
  BarChart3,
  Binary,
  Layers,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { INITIAL_DOMAINS } from '@/lib/constants';
import { AiLogo, CybersecurityLogo, IotLogo } from '@/components/DomainLogo';

interface DomainStyleConfig {
  accentBorder: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  seatsText: string;
}

const DOMAIN_STYLES: Record<string, DomainStyleConfig> = {
  'web-development': {
    accentBorder: 'border-t-amber-500',
    iconBg: 'bg-amber-100 dark:bg-amber-950/60',
    iconColor: 'text-amber-700 dark:text-amber-400',
    icon: <Code2 className="w-6 h-6" />,
    seatsText: 'Only 3 Seats Left',
  },
  'data-science': {
    accentBorder: 'border-t-purple-500',
    iconBg: 'bg-purple-100 dark:bg-purple-950/60',
    iconColor: 'text-purple-700 dark:text-purple-400',
    icon: <Database className="w-6 h-6" />,
    seatsText: 'Only 4 Seats Left',
  },
  'cpp-programming': {
    accentBorder: 'border-t-pink-500',
    iconBg: 'bg-pink-100 dark:bg-pink-950/60',
    iconColor: 'text-pink-700 dark:text-pink-400',
    icon: <Terminal className="w-6 h-6" />,
    seatsText: 'Only 2 Seats Left',
  },
  'artificial-intelligence': {
    accentBorder: 'border-t-violet-500',
    iconBg: 'bg-violet-100 dark:bg-violet-950/60',
    iconColor: 'text-violet-700 dark:text-violet-400',
    icon: <AiLogo className="w-7 h-7" />,
    seatsText: 'Only 2 Seats Left',
  },
  'ai': {
    accentBorder: 'border-t-violet-500',
    iconBg: 'bg-violet-100 dark:bg-violet-950/60',
    iconColor: 'text-violet-700 dark:text-violet-400',
    icon: <AiLogo className="w-7 h-7" />,
    seatsText: 'Only 2 Seats Left',
  },
  'cybersecurity': {
    accentBorder: 'border-t-emerald-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    iconColor: 'text-emerald-700 dark:text-emerald-400',
    icon: <CybersecurityLogo className="w-7 h-7" />,
    seatsText: 'Only 3 Seats Left',
  },
  'cyber-security': {
    accentBorder: 'border-t-emerald-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    iconColor: 'text-emerald-700 dark:text-emerald-400',
    icon: <CybersecurityLogo className="w-7 h-7" />,
    seatsText: 'Only 3 Seats Left',
  },
  'iot': {
    accentBorder: 'border-t-teal-500',
    iconBg: 'bg-teal-100 dark:bg-teal-950/60',
    iconColor: 'text-teal-700 dark:text-teal-400',
    icon: <IotLogo className="w-7 h-7" />,
    seatsText: 'Only 4 Seats Left',
  },
  'iot-embedded-systems': {
    accentBorder: 'border-t-teal-500',
    iconBg: 'bg-teal-100 dark:bg-teal-950/60',
    iconColor: 'text-teal-700 dark:text-teal-400',
    icon: <IotLogo className="w-7 h-7" />,
    seatsText: 'Only 4 Seats Left',
  },
  'machine-learning': {
    accentBorder: 'border-t-cyan-500',
    iconBg: 'bg-cyan-100 dark:bg-cyan-950/60',
    iconColor: 'text-cyan-700 dark:text-cyan-400',
    icon: <Cpu className="w-6 h-6" />,
    seatsText: 'Only 3 Seats Left',
  },
  'android-development': {
    accentBorder: 'border-t-rose-500',
    iconBg: 'bg-rose-100 dark:bg-rose-950/60',
    iconColor: 'text-rose-700 dark:text-rose-400',
    icon: <Smartphone className="w-6 h-6" />,
    seatsText: 'Only 4 Seats Left',
  },
  'cloud-computing': {
    accentBorder: 'border-t-sky-500',
    iconBg: 'bg-sky-100 dark:bg-sky-950/60',
    iconColor: 'text-sky-700 dark:text-sky-400',
    icon: <Cloud className="w-6 h-6" />,
    seatsText: '86% Capacity',
  },
  'python-programming': {
    accentBorder: 'border-t-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-950/60',
    iconColor: 'text-blue-700 dark:text-blue-400',
    icon: <FileCode2 className="w-6 h-6" />,
    seatsText: 'Only 3 Seats Left',
  },
  'java-programming': {
    accentBorder: 'border-t-orange-500',
    iconBg: 'bg-orange-100 dark:bg-orange-950/60',
    iconColor: 'text-orange-700 dark:text-orange-400',
    icon: <Coffee className="w-6 h-6" />,
    seatsText: 'Only 4 Seats Left',
  },
  'ui-ux-design': {
    accentBorder: 'border-t-fuchsia-500',
    iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-950/60',
    iconColor: 'text-fuchsia-700 dark:text-fuchsia-400',
    icon: <Palette className="w-6 h-6" />,
    seatsText: 'Only 2 Seats Left',
  },
  'data-analytics': {
    accentBorder: 'border-t-teal-500',
    iconBg: 'bg-teal-100 dark:bg-teal-950/60',
    iconColor: 'text-teal-700 dark:text-teal-400',
    icon: <BarChart3 className="w-6 h-6" />,
    seatsText: '84% Capacity',
  },
  'database-management': {
    accentBorder: 'border-t-violet-500',
    iconBg: 'bg-violet-100 dark:bg-violet-950/60',
    iconColor: 'text-violet-700 dark:text-violet-400',
    icon: <Layers className="w-6 h-6" />,
    seatsText: '78% Capacity',
  },
};

export const CareerPathTracksSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div>
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-300 dark:border-blue-700 shadow-xs">
            INTERNSHIP TRACKS
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Choose Your Career Path
        </h2>

        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 font-medium">
          Select from our industry-vetted internship programs designed to make you job-ready.
        </p>
      </div>

      {/* Grid of Domain Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {INITIAL_DOMAINS.map((domain) => {
          const style = DOMAIN_STYLES[domain.slug] || {
            accentBorder: 'border-t-blue-500',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-700',
            icon: <Code2 className="w-6 h-6" />,
            seatsText: 'Limited Seats',
          };

          return (
            <div
              key={domain.slug}
              className={`bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 border-t-4 ${style.accentBorder} p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group`}
            >
              <div className="space-y-4">
                {/* Icon & Scarcity */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl ${style.iconBg} ${style.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}
                  >
                    {style.icon}
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    <Flame className="w-3 h-3 fill-amber-600 text-amber-600" />
                    <span>{style.seatsText}</span>
                  </span>
                </div>

                {/* Domain Title & Clear Text */}
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {domain.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed font-semibold">
                    5 curated modules focused on industry-standard workflows.
                  </p>
                </div>
              </div>

              {/* Action / Enroll Link */}
              <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  7-Day Sprint
                </span>
                <Link
                  href={`/register?domain=${domain.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Apply Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explore All Domains Button */}
      <div className="text-center pt-2">
        <Link
          href="/domains"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-sm shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>View Detailed Syllabus &amp; Tasks (13 Tracks)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
