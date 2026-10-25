'use client';

import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Award,
  FileText,
  Share2,
  Code2,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';

interface MilestoneProgressTrackerProps {
  completedTasksCount: number;
  isLinkedInApproved: boolean;
  isPaymentApproved: boolean;
  isCertificateIssued: boolean;
}

export const MilestoneProgressTracker: React.FC<MilestoneProgressTrackerProps> = ({
  completedTasksCount,
  isLinkedInApproved,
  isPaymentApproved,
  isCertificateIssued,
}) => {
  const steps = [
    {
      label: 'Enrollment',
      sub: 'Letter Issued',
      isComplete: true,
      icon: <FileText className="w-4 h-4" />,
    },
    {
      label: 'LinkedIn Post',
      sub: isLinkedInApproved ? 'Approved' : 'Announcement',
      isComplete: isLinkedInApproved,
      icon: <Share2 className="w-4 h-4" />,
    },
    {
      label: '5 Tasks',
      sub: `${completedTasksCount}/5 Repos`,
      isComplete: completedTasksCount >= 5,
      icon: <Code2 className="w-4 h-4" />,
    },
    {
      label: 'Payment',
      sub: isPaymentApproved ? 'Approved' : '₹100 Verification',
      isComplete: isPaymentApproved,
      icon: <IndianRupee className="w-4 h-4" />,
    },
    {
      label: 'Certificate',
      sub: isCertificateIssued ? 'Issued' : 'Ready',
      isComplete: isCertificateIssued,
      icon: <Award className="w-4 h-4" />,
    },
  ];

  return (
    <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-slate-900">Sprint Milestone Pipeline</h3>
          <p className="text-xs text-slate-500">Live single source of truth tracking</p>
        </div>
        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          {Math.round(
            ((Number(isLinkedInApproved) +
              Number(completedTasksCount >= 5) +
              Number(isPaymentApproved) +
              Number(isCertificateIssued) +
              1) /
              5) *
              100
          )}
          % Progress
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        {steps.map((s, idx) => (
          <div
            key={s.label}
            className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
              s.isComplete
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                0{idx + 1}
              </span>
              {s.isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300" />
              )}
            </div>

            <div>
              <div className="font-bold text-xs flex items-center gap-1.5">
                {s.icon}
                <span>{s.label}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
