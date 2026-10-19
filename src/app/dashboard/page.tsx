import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  GraduationCap,
  Calendar,
  Clock,
  FileDown,
  CheckCircle2,
  AlertTriangle,
  Award,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
  User,
  ListTodo,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { calculateCertificateEligibility } from '@/lib/eligibility';
import { formatISTDate, getEnrollmentTimeStatus } from '@/lib/date-utils';
import { TaskSubmissionItem } from '@/components/TaskSubmissionItem';
import { LinkedInSubmissionSection } from '@/components/LinkedInSubmissionSection';
import { DashboardProfileSection } from '@/components/DashboardProfileSection';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  const enrollment = await db.getActiveEnrollmentByStudentId(user.id);

  let tasks: Awaited<ReturnType<typeof db.getTasksByDomainId>> = [];
  let taskSubmissions: Awaited<ReturnType<typeof db.getTaskSubmissionsByEnrollmentId>> = [];
  let linkedInSubmission: Awaited<ReturnType<typeof db.getLinkedInSubmissionByEnrollmentId>> = null;
  let payment: Awaited<ReturnType<typeof db.getPaymentByEnrollmentId>> = null;
  let certificate: Awaited<ReturnType<typeof db.getCertificateByEnrollmentId>> = null;

  if (enrollment) {
    tasks = await db.getTasksByDomainId(enrollment.domain_id);
    taskSubmissions = await db.getTaskSubmissionsByEnrollmentId(enrollment.id);
    linkedInSubmission = await db.getLinkedInSubmissionByEnrollmentId(enrollment.id);
    payment = await db.getPaymentByEnrollmentId(enrollment.id);
    certificate = await db.getCertificateByEnrollmentId(enrollment.id);
  }

  // Calculate certificate eligibility strictly on the server
  const eligibility = calculateCertificateEligibility({
    enrollment,
    linkedInSubmission,
    taskSubmissions,
    payment,
    isRevoked: certificate?.status === 'revoked',
  });

  const timeStatus = enrollment ? getEnrollmentTimeStatus(enrollment.deadline) : null;
  const completedCount = taskSubmissions.filter((t) => t.github_url?.trim().length > 0).length;
  const progressPercent = Math.min(100, Math.round((completedCount / 5) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Student Welcome & Profile Header */}
      <DashboardProfileSection profile={user} />

      {/* If No Active Enrollment */}
      {!enrollment ? (
        <div className="p-8 sm:p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              You Have No Active Enrollment
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Choose one of our 13 computer science domains to begin your seven-calendar-day task sprint.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/domains"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <span>Explore 13 Domains</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Enrollment Horizon Card */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold">
                    7-DAY ACTIVE SPRINT
                  </span>
                  {timeStatus?.isExpired && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-semibold">
                      DEADLINE EXPIRED
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {enrollment.domain?.name}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Enrolled on {formatISTDate(enrollment.enrolled_at, { includeTime: true })}
                </p>
              </div>

              {/* Offer Letter Download Button */}
              <div className="shrink-0">
                <a
                  href={`/api/documents/offer-letter?enrollmentId=${enrollment.id}`}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Offer Letter (PDF)</span>
                </a>
              </div>
            </div>

            {/* Sprint Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <div className="text-slate-400 font-medium">Program Start</div>
                <div className="text-sm font-bold text-white mt-1">
                  {formatISTDate(enrollment.start_date)}
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <div className="text-slate-400 font-medium">Submission Deadline</div>
                <div className="text-sm font-bold text-amber-300 mt-1">
                  {formatISTDate(enrollment.deadline)}
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <div className="text-slate-400 font-medium">Time Remaining</div>
                <div
                  className={`text-sm font-bold mt-1 ${
                    timeStatus?.isExpired ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {timeStatus?.displayStatus}
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <div className="text-slate-400 font-medium">Tasks Submitted</div>
                <div className="text-sm font-bold text-white mt-1">
                  {completedCount} of 5 Milestones
                </div>
              </div>
            </div>

            {/* Task Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Milestone Progress</span>
                <span className="text-blue-300 font-mono">{progressPercent}% Completed</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-700/80 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Cards (Payment & Certificate status overview) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Direct UPI Payment Overview Card */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Direct UPI Program Fee</h3>
                  </div>

                  {payment?.status === 'approved' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Approved
                    </span>
                  ) : payment?.status === 'pending_verification' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Pending Verification
                    </span>
                  ) : payment?.status === 'rejected' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                      Rejected
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                      Not Started
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  A one-time ₹100 direct UPI payment verified manually by the administrator against bank records.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Fee: ₹100</span>
                <Link
                  href="/payment"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>{payment ? 'View / Update Payment' : 'Pay & Submit UTR'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Certificate Status Card */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                      <Award className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Completion Certificate</h3>
                  </div>

                  {eligibility.isEligible ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Unlocked & Eligible
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                      Requirements Incomplete
                    </span>
                  )}
                </div>

                {eligibility.isEligible ? (
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    Congratulations! All 5 tasks, LinkedIn announcement, and payment have been verified.
                  </p>
                ) : (
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <span className="font-medium text-slate-700">Checklist to unlock:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                      <li className={completedCount === 5 ? 'text-emerald-600' : ''}>
                        5/5 Tasks submitted ({completedCount}/5 done)
                      </li>
                      <li className={linkedInSubmission?.status === 'approved' ? 'text-emerald-600' : ''}>
                        LinkedIn announcement approved
                      </li>
                      <li className={payment?.status === 'approved' ? 'text-emerald-600' : ''}>
                        ₹100 direct UPI payment approved
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                {eligibility.isEligible ? (
                  <a
                    href={`/api/documents/certificate?enrollmentId=${enrollment.id}`}
                    download
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    <Award className="w-4 h-4" />
                    <span>Download Completion Certificate (PDF)</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full px-4 py-2 rounded-lg bg-slate-100 text-slate-400 font-semibold text-xs cursor-not-allowed"
                  >
                    Certificate Locked (Fulfill Checklist)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* LinkedIn Announcement Section */}
          <LinkedInSubmissionSection
            enrollmentId={enrollment.id}
            submission={linkedInSubmission}
          />

          {/* 5 Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Domain Milestones & Task Submissions
                </h3>
                <p className="text-xs text-slate-500">
                  Complete each of the 5 tasks and submit the public GitHub repository URL
                </p>
              </div>
              <div className="text-xs font-bold text-blue-600">
                {completedCount} / 5 Submitted
              </div>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => {
                const sub = taskSubmissions.find((s) => s.task_id === task.id);
                return (
                  <TaskSubmissionItem
                    key={task.id}
                    task={task}
                    submission={sub}
                    enrollmentId={enrollment.id}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
