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
  ListTodo,
} from 'lucide-react';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { DomainEnrollButton } from '@/components/DomainEnrollButton';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <span>13 COMPUTER SCIENCE DOMAINS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Your Internship Track
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Each domain includes five sequential, practical milestones designed for a 7-calendar-day
          learning sprint. Choose your track to begin.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {iconMap[domain.icon_name] || <Code2 className="w-6 h-6 text-blue-600" />}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  <ListTodo className="w-3.5 h-3.5 text-slate-600" />
                  <span>5 Tasks</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{domain.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {domain.description}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100">
              <DomainEnrollButton
                domainId={domain.id}
                domainName={domain.name}
                isAuthenticated={!!currentUser}
                hasActiveEnrollment={!!activeEnrollment}
                isEnrolledInThisDomain={activeEnrollment?.domain_id === domain.id}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
