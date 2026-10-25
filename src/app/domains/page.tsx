import React from 'react';
import Link from 'next/link';
import {
  Globe,
  Code2,
  Coffee,
  Cpu,
  Binary,
  LineChart,
  BarChart3,
  Smartphone,
  Palette,
  ShieldCheck,
  Cloud,
  Database,
  ArrowRight,
  Clock,
  RotateCcw,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { DomainCardPublic } from '@/components/DomainCardPublic';
import { ReviewRubricSection } from '@/components/ReviewRubricSection';

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-6 h-6 text-blue-600" />,
  Code2: <Code2 className="w-6 h-6 text-indigo-600" />,
  Coffee: <Coffee className="w-6 h-6 text-amber-600" />,
  Cpu: <Cpu className="w-6 h-6 text-purple-600" />,
  Binary: <Binary className="w-6 h-6 text-emerald-600" />,
  LineChart: <LineChart className="w-6 h-6 text-teal-600" />,
  BarChart3: <BarChart3 className="w-6 h-6 text-cyan-600" />,
  Smartphone: <Smartphone className="w-6 h-6 text-rose-600" />,
  Palette: <Palette className="w-6 h-6 text-pink-600" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
  Cloud: <Cloud className="w-6 h-6 text-sky-600" />,
  Database: <Database className="w-6 h-6 text-violet-600" />,
};

export default async function DomainsPage() {
  const domains = await db.getAllDomains(true);
  const currentUser = await getCurrentUser();
  const activeEnrollment = currentUser
    ? await db.getActiveEnrollmentByStudentId(currentUser.id)
    : null;

  // Fetch tasks for each domain to show publicly with difficulty and expected hours
  const domainsWithTasks = await Promise.all(
    domains.map(async (domain) => {
      const tasks = await db.getTasksByDomainId(domain.id);
      return {
        domain,
        tasks,
      };
    })
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <span>13 COMPUTER SCIENCE DOMAINS &bull; 65 PUBLIC TASKS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Your Internship Track
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Every track features 5 public practical milestones with transparent difficulty ratings,
          expected completion times, and deliverable standards.
        </p>
      </div>

      {activeEnrollment && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-blue-900">
          <div>
            You currently have an active enrollment in{' '}
            <strong className="font-semibold text-blue-700">
              {activeEnrollment.domain?.name || 'an active domain'}
            </strong>
            .
          </div>
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 shrink-0"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 13 Domain Cards with Public 5-Task Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domainsWithTasks.map(({ domain, tasks }) => (
          <DomainCardPublic
            key={domain.id}
            domain={domain}
            tasks={tasks}
            icon={iconMap[domain.icon_name]}
            isAuthenticated={!!currentUser}
            hasActiveEnrollment={!!activeEnrollment}
            isEnrolledInThisDomain={activeEnrollment?.domain_id === domain.id}
          />
        ))}
      </div>

      {/* Missed Deadline Policy: Extension, Retry, or Fail */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-md space-y-6">
        <div className="space-y-1 border-b border-slate-700 pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>DEADLINE POLICY DISCLOSURE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            What Happens If You Miss the 7-Day Deadline?
          </h2>
          <p className="text-xs text-slate-400">
            Clear guidelines on extensions, retries, and failure states for complete student confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>1. 3-Day Grace Extension</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              Need extra time for exams or complex debugging? You can activate a one-time 3-calendar-day extension directly from your dashboard prior to cutoff, extending your sprint to 10 days.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <RotateCcw className="w-4 h-4" />
              <span>2. Free Retry &amp; Re-enrollment</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              If your deadline expires before completing all 5 tasks, you do not lose your ₹100 registration fee. You can reset or re-enroll in a fresh sprint cohort within 30 days without any additional charge.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>3. Fail &amp; Invalidation State</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              An enrollment is only marked as failed if inactive for over 30 days or if substantive academic plagiarism is detected. Submitted repositories remain saved in your student profile.
            </p>
          </div>
        </div>
      </section>

      {/* Review Rubric Section */}
      <ReviewRubricSection />
    </div>
  );
}
