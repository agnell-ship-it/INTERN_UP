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
  Lock,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { calculateCertificateEligibility } from '@/lib/eligibility';
import { formatISTDate, getEnrollmentTimeStatus } from '@/lib/date-utils';
import { TaskSubmissionItem } from '@/components/TaskSubmissionItem';
import { LinkedInSubmissionSection } from '@/components/LinkedInSubmissionSection';
import { DashboardProfileSection } from '@/components/DashboardProfileSection';
import { DashboardStatusBanner } from '@/components/DashboardStatusBanner';
import { DocumentActionButtons } from '@/components/DocumentActionButtons';
import { LinkedInShareCertificate } from '@/components/LinkedInShareCertificate';
import { DeadlineCountdownTimer } from '@/components/DeadlineCountdownTimer';
import { MilestoneProgressTracker } from '@/components/MilestoneProgressTracker';
import { EmailReminderSettings } from '@/components/EmailReminderSettings';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  const isTasksComplete = completedCount >= 5;
  const isLinkedInApproved = linkedInSubmission?.status === 'approved';
  const isReadyForPayment = isTasksComplete && isLinkedInApproved;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Student Welcome & Profile Header */}
      <DashboardProfileSection profile={user} />

      {/* If No Active Enrollment */}
      {!enrollment ? (
        <div className="p-8 sm:p-12 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              You Have No Active Enrollment
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
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
        <div className="space-y-6">
          {/* Dynamic Live Status Alert Banner */}
          <DashboardStatusBanner
            enrollment={enrollment}
            linkedInSubmission={linkedInSubmission}
            payment={payment}
            certificate={certificate}
            completedTasksCount={completedCount}
            isEligibleForCertificate={eligibility.isEligible}
          />

          {/* Milestone 5-Step Pipeline Tracker */}
          <MilestoneProgressTracker
            completedTasksCount={completedCount}
            isLinkedInApproved={isLinkedInApproved}
            isPaymentApproved={payment?.status === 'approved'}
            isCertificateIssued={certificate?.status === 'issued'}
          />

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

              {/* Enrollment Letter Action Buttons with Preview Modal */}
              <div className="shrink-0">
                <DocumentActionButtons
                  title={`${enrollment.domain?.name || 'Internship'} - Enrollment Letter`}
                  documentType="Enrollment Letter"
                  pdfUrl={`/api/documents/enrollment-letter?enrollmentId=${enrollment.id}`}
                />
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

          {/* Real-time Deadline Countdown & Email Reminder Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DeadlineCountdownTimer
              deadlineISO={enrollment.deadline}
              enrollmentId={enrollment.id}
            />
            <EmailReminderSettings
              studentEmail={user.email}
            />
          </div>

          {/* Quick Action Cards (Payment & Certificate status overview) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Direct UPI Payment Overview Card */}
            {isReadyForPayment ? (
              /* UNLOCKED & READY FOR CERTIFICATE */
              <div className="p-6 bg-white dark:bg-slate-900/90 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/10 dark:bg-emerald-950/20 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                        <IndianRupee className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Certificate Processing Fee</h3>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider block">
                          Milestones Met • Ready for Certificate
                        </span>
                      </div>
                    </div>

                    {payment?.status === 'approved' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        Approved
                      </span>
                    ) : payment?.status === 'pending_verification' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        Pending Verification
                      </span>
                    ) : payment?.status === 'rejected' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700">
                        Rejected
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-600 text-white animate-pulse">
                        Unlocked
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {payment?.status === 'approved'
                      ? 'Your ₹100 direct UPI payment has been verified by the administrator. Your completion certificate is unlocked!'
                      : payment?.status === 'pending_verification'
                      ? `Your ₹100 payment submission (UTR: ${payment.upi_reference}) is currently undergoing manual administrator verification.`
                      : 'You have completed all 5 tasks and your LinkedIn announcement is approved! Fulfill the ₹100 direct UPI payment to claim your verified certificate.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Certificate Fee:</span>
                    <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">₹100</span>
                  </div>
                  <Link
                    href="/payment"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>{payment ? 'View / Update Payment' : 'Pay ₹100 & Claim Certificate'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              /* LOCKED STATE: User has not completed all 5 tasks and/or LinkedIn not approved */
              <div className="p-6 bg-slate-50/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">Certificate Fee (Locked)</h3>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                          Milestones In Progress
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Locked
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    At INTERN-UP, you build first! The <strong>₹100 certificate fee</strong> will only appear once you have completed all 5 tasks and your LinkedIn announcement is approved.
                  </p>

                  <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Milestone Tasks (5 Required):</span>
                      <span className={completedCount === 5 ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'font-semibold text-slate-700 dark:text-slate-200'}>
                        {completedCount} / 5 Submitted
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">LinkedIn Announcement:</span>
                      <span className={isLinkedInApproved ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'font-semibold text-slate-700 dark:text-slate-200'}>
                        {isLinkedInApproved ? 'Approved' : linkedInSubmission ? 'Pending Review' : 'Not Submitted'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Payment unlocks when ready for certificate</span>
                  <button
                    disabled
                    className="px-3.5 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold text-xs cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Payment Locked</span>
                  </button>
                </div>
              </div>
            )}

            {/* Certificate Status Card */}
            <div className="p-6 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
                      <Award className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Completion Certificate</h3>
                  </div>

                  {eligibility.isEligible ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Unlocked & Eligible
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Requirements Incomplete
                    </span>
                  )}
                </div>

                {eligibility.isEligible ? (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
                    Congratulations! All 5 tasks, LinkedIn announcement, and ₹100 payment have been verified.
                  </p>
                ) : isReadyForPayment ? (
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                    All tasks and LinkedIn post are approved! Fulfill the ₹100 program fee to unlock and download your completion certificate.
                  </p>
                ) : (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Checklist to unlock certificate:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-500 dark:text-slate-400">
                      <li className={completedCount === 5 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}>
                        5/5 Tasks submitted ({completedCount}/5 done)
                      </li>
                      <li className={isLinkedInApproved ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}>
                        LinkedIn announcement approved
                      </li>
                      <li className={payment?.status === 'approved' ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}>
                        ₹100 direct UPI fee (unlocks once above 2 are done)
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                {eligibility.isEligible ? (
                  <DocumentActionButtons
                    title={`${enrollment.domain?.name || 'Internship'} - Completion Certificate`}
                    documentType="Completion Certificate"
                    pdfUrl={`/api/documents/certificate?enrollmentId=${enrollment.id}`}
                    verificationId={certificate?.certificate_id}
                    className="w-full justify-center"
                  />
                ) : isReadyForPayment ? (
                  <Link
                    href="/payment"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    <span>Proceed to Pay ₹100 &amp; Claim Certificate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Certificate Locked (Complete Milestones First)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Certificate Viral LinkedIn Showcase Section */}
          {eligibility.isEligible && (
            <LinkedInShareCertificate
              certificateId={certificate?.certificate_id || enrollment.id}
              domainName={enrollment.domain?.name || 'Computer Science'}
              studentName={user.full_name}
              issuedAt={certificate?.issue_date}
            />
          )}

          {/* LinkedIn Announcement Section */}
          <LinkedInSubmissionSection
            enrollmentId={enrollment.id}
            submission={linkedInSubmission}
          />

          {/* 5 Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Domain Milestones & Task Submissions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Complete each of the 5 tasks and submit the public GitHub repository URL
                </p>
              </div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
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
