'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AdminAuditLog,
  Certificate,
  Domain,
  Enrollment,
  Payment,
  Profile,
  SiteSettings,
  Task,
  TaskSubmission,
} from '@/types';
import {
  Users,
  Compass,
  ListTodo,
  Share2,
  IndianRupee,
  Award,
  Settings,
  FileSpreadsheet,
  History,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  Plus,
  Edit2,
  ShieldAlert,
  Save,
  Download,
  Clock,
  Eye,
  MessageSquare,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatISTDate } from '@/lib/date-utils';
import { PdfPreviewModal } from './PdfPreviewModal';

interface AdminPortalClientProps {
  stats: {
    totalStudents: number;
    activeEnrollments: number;
    completedEnrollments: number;
    pendingPayments: number;
    issuedCertificates: number;
    totalDomains: number;
    totalTasks: number;
    pendingTaskReviews?: number;
  };
  students: Profile[];
  enrollments: Enrollment[];
  domains: Domain[];
  payments: (Payment & { student?: Profile; domain?: Domain })[];
  certificates: Certificate[];
  siteSettings: SiteSettings;
  auditLogs: AdminAuditLog[];
  taskSubmissions?: (TaskSubmission & { task?: Task; student?: Profile; domain?: Domain })[];
}

export const AdminPortalClient: React.FC<AdminPortalClientProps> = ({
  stats,
  students,
  enrollments,
  domains,
  payments,
  certificates,
  siteSettings,
  auditLogs,
  taskSubmissions = [],
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'students'
    | 'reviews'
    | 'payments'
    | 'domains'
    | 'certificates'
    | 'settings'
    | 'reports'
    | 'audit'
  >('overview');

  // Search queries
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null);

  // Task Reviews State
  const [reviewTaskModal, setReviewTaskModal] = useState<(TaskSubmission & {
    task?: Task;
    student?: Profile;
    domain?: Domain;
  }) | null>(null);
  const [taskReviewFeedback, setTaskReviewFeedback] = useState('');
  const [taskReviewStatus, setTaskReviewStatus] = useState<'approved' | 'changes_requested'>('approved');
  const [taskReviewSearch, setTaskReviewSearch] = useState('');
  const [taskCheckingMap, setTaskCheckingMap] = useState<
    Record<string, { checking?: boolean; valid?: boolean; commitCount?: number; message?: string }>
  >({});

  // Settings State
  const [upiId, setUpiId] = useState(siteSettings.upi_id || '');
  const [upiQrImageUrl, setUpiQrImageUrl] = useState(siteSettings.upi_qr_image_url || '');
  const [paymentInstructions, setPaymentInstructions] = useState(
    siteSettings.payment_instructions || ''
  );
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Review Modals
  const [rejectPaymentModal, setRejectPaymentModal] = useState<{
    id: string;
    studentName?: string;
    reference?: string;
  } | null>(null);
  const [paymentRejectionReason, setPaymentRejectionReason] = useState('');

  // Revoke Certificate Modal
  const [revokeCertModal, setRevokeCertModal] = useState<Certificate | null>(null);
  const [revocationReason, setRevocationReason] = useState('');
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  // Domain Editing / Adding
  const [editDomainModal, setEditDomainModal] = useState<Partial<Domain> | null>(null);

  // Task Review Handlers
  const handleSaveTaskReview = async () => {
    if (!reviewTaskModal || !taskReviewFeedback.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/tasks/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: reviewTaskModal.id,
          status: taskReviewStatus,
          feedback: taskReviewFeedback.trim(),
        }),
      });
      if (res.ok) {
        setReviewTaskModal(null);
        setTaskReviewFeedback('');
        router.refresh();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickCheckGithub = async (submissionId: string, url: string) => {
    setTaskCheckingMap((prev) => ({
      ...prev,
      [submissionId]: { checking: true },
    }));
    try {
      const res = await fetch(`/api/tasks/check-github?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setTaskCheckingMap((prev) => ({
        ...prev,
        [submissionId]: {
          checking: false,
          valid: data.valid,
          commitCount: data.commitCount,
          message: data.message,
        },
      }));
    } catch {
      setTaskCheckingMap((prev) => ({
        ...prev,
        [submissionId]: { checking: false, valid: false, message: 'Check failed' },
      }));
    }
  };

  // Handlers
  const handleApprovePayment = async (id: string) => {
    setActionLoading(true);
    try {
      await fetch('/api/admin/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: id, status: 'approved' }),
      });
      router.refresh();
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!rejectPaymentModal || !paymentRejectionReason.trim()) return;
    setActionLoading(true);
    try {
      await fetch('/api/admin/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: rejectPaymentModal.id,
          status: 'rejected',
          rejection_reason: paymentRejectionReason.trim(),
        }),
      });
      setRejectPaymentModal(null);
      setPaymentRejectionReason('');
      router.refresh();
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsNotice(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          upi_id: upiId,
          upi_qr_image_url: upiQrImageUrl,
          payment_instructions: paymentInstructions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');
      setSettingsNotice('Site & UPI settings saved successfully.');
      router.refresh();
    } catch (err: unknown) {
      setSettingsNotice(err instanceof Error ? err.message : 'Error updating settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleRevokeCertificate = async () => {
    if (!revokeCertModal || !revocationReason.trim()) return;
    setActionLoading(true);
    try {
      await fetch('/api/admin/certificate/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificate_id: revokeCertModal.certificate_id,
          reason: revocationReason.trim(),
        }),
      });
      setRevokeCertModal(null);
      setRevocationReason('');
      router.refresh();
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDomainModal) return;
    setActionLoading(true);
    try {
      const isNew = !editDomainModal.id;
      const endpoint = '/api/admin/domains';
      const method = isNew ? 'POST' : 'PUT';

      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDomainModal),
      });

      setEditDomainModal(null);
      router.refresh();
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Students
  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.college && s.college.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { key: 'overview', label: 'Overview', icon: <History className="w-4 h-4" /> },
          { key: 'students', label: `Students (${students.length})`, icon: <Users className="w-4 h-4" /> },
          {
            key: 'reviews',
            label: `Task Reviews (${taskSubmissions.length})`,
            icon: <CheckCircle2 className="w-4 h-4" />,
            badge:
              taskSubmissions.filter((s) => !s.review_status || s.review_status === 'pending_review').length > 0
                ? taskSubmissions.filter((s) => !s.review_status || s.review_status === 'pending_review').length
                : undefined,
          },
          {
            key: 'payments',
            label: `Payments (${payments.filter((p) => p.status === 'pending_verification').length})`,
            icon: <IndianRupee className="w-4 h-4" />,
            badge:
              payments.filter((p) => p.status === 'pending_verification').length > 0
                ? payments.filter((p) => p.status === 'pending_verification').length
                : undefined,
          },
          { key: 'domains', label: `Domains (${domains.length})`, icon: <Compass className="w-4 h-4" /> },
          { key: 'certificates', label: `Certificates (${certificates.length})`, icon: <Award className="w-4 h-4" /> },
          { key: 'settings', label: 'UPI & Site Settings', icon: <Settings className="w-4 h-4" /> },
          { key: 'reports', label: 'Reports & Export', icon: <FileSpreadsheet className="w-4 h-4" /> },
          { key: 'audit', label: 'Audit Logs', icon: <ShieldAlert className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Total Students</span>
              <div className="text-2xl font-bold text-slate-900">{stats.totalStudents}</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Active Sprints</span>
              <div className="text-2xl font-bold text-blue-600">{stats.activeEnrollments}</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Pending Payments</span>
              <div className="text-2xl font-bold text-amber-600">{stats.pendingPayments}</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Completed</span>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.completedEnrollments}
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Certificates</span>
              <div className="text-2xl font-bold text-indigo-600">
                {stats.issuedCertificates}
              </div>
            </div>
          </div>

          {/* Quick Review Queues */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Payments Queue */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Pending Payments Verification ({payments.filter((p) => p.status === 'pending_verification').length})
                </h3>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              {payments.filter((p) => p.status === 'pending_verification').length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">
                  No pending payment submissions awaiting verification.
                </div>
              ) : (
                <div className="space-y-3">
                  {payments
                    .filter((p) => p.status === 'pending_verification')
                    .slice(0, 3)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            {p.student?.full_name || 'Student'}
                          </div>
                          <div className="text-slate-500 font-mono mt-0.5">
                            UTR: {p.upi_reference} &bull; ₹{p.amount}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleApprovePayment(p.id)}
                            isLoading={actionLoading}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              setRejectPaymentModal({
                                id: p.id,
                                studentName: p.student?.full_name,
                                reference: p.upi_reference,
                              })
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Recent Task Submissions Queue */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Recent Milestone Tasks ({taskSubmissions.length})
                </h3>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              {taskSubmissions.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">
                  No task submissions recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {taskSubmissions.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          {t.student?.full_name || 'Student'} ({t.domain?.name || 'Track'})
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 truncate max-w-xs">
                          {t.task?.title || 'Milestone Task'}
                        </div>
                      </div>
                      <a
                        href={t.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-semibold hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STUDENTS TAB */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Enrolled Students</h3>
              <p className="text-xs text-slate-500">
                View student records, enrollment status, and task deliverables
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">College / Degree</th>
                  <th className="py-3 px-4">Current Domain</th>
                  <th className="py-3 px-4">Tasks</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => {
                  const enr = enrollments.find((e) => e.student_id === st.id);
                  const pay = payments.find((p) => p.student_id === st.id);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{st.full_name}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{st.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{st.college || '-'}</div>
                        <div className="text-[11px] text-slate-400">{st.degree || ''}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {enr?.domain?.name ? (
                          <span className="font-semibold text-blue-600">{enr.domain.name}</span>
                        ) : (
                          <span className="text-slate-400">Not Enrolled</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {enr ? `${enr.tasks_completed_count}/5` : '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {pay?.status === 'approved' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            Approved
                          </span>
                        ) : pay?.status === 'pending_verification' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700">
                            Pending
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatISTDate(st.created_at, { dateStyle: 'short' })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudent(st)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer text-[11px]"
                        >
                          View Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TASK REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Student Task Submissions & Code Reviews</h3>
              <p className="text-xs text-slate-500">
                Inspect submitted GitHub projects, test repository health, and leave feedback comments
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search student, task, or repo..."
                  value={taskReviewSearch}
                  onChange={(e) => setTaskReviewSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 w-56 sm:w-64"
                />
              </div>
            </div>
          </div>

          {taskSubmissions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
              No task submissions submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {taskSubmissions
                .filter((sub) => {
                  if (!taskReviewSearch.trim()) return true;
                  const q = taskReviewSearch.toLowerCase();
                  return (
                    sub.student?.full_name?.toLowerCase().includes(q) ||
                    sub.task?.title?.toLowerCase().includes(q) ||
                    sub.github_url?.toLowerCase().includes(q) ||
                    sub.domain?.name?.toLowerCase().includes(q)
                  );
                })
                .map((sub) => {
                  const check = taskCheckingMap[sub.id];
                  return (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">
                              {sub.student?.full_name || 'Student'}
                            </span>
                            <span className="text-slate-400">&bull;</span>
                            <span className="text-slate-600 font-medium">
                              {sub.domain?.name || 'Domain'}
                            </span>
                            <span className="text-slate-400">&bull;</span>
                            <span className="text-blue-700 font-semibold">
                              Task {sub.task?.display_order}: {sub.task?.title}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <a
                              href={sub.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 font-semibold hover:underline flex items-center gap-1 font-mono text-[11px]"
                            >
                              <span>{sub.github_url}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              type="button"
                              onClick={() => handleQuickCheckGithub(sub.id, sub.github_url)}
                              disabled={check?.checking}
                              className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[10px] font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {check?.checking ? (
                                <>
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  <span>Checking...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3 text-blue-600" />
                                  <span>Check Repo</span>
                                </>
                              )}
                            </button>

                            {check && !check.checking && (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  check.valid
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {check.valid
                                  ? `Public Verified (${check.commitCount ?? 'active'} commits)`
                                  : check.message || 'Repo check failed'}
                              </span>
                            )}
                          </div>

                          {sub.notes && (
                            <div className="text-[11px] text-slate-500 italic">
                              Student note: &quot;{sub.notes}&quot;
                            </div>
                          )}

                          {sub.reviewer_feedback && (
                            <div className="p-2.5 rounded-lg bg-white border border-slate-200 mt-2 space-y-1">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                <MessageSquare className="w-3 h-3 text-slate-600" />
                                <span>Current Feedback ({sub.review_status}):</span>
                              </div>
                              <p className="text-slate-700 text-xs">{sub.reviewer_feedback}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              sub.review_status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.review_status === 'changes_requested'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {sub.review_status === 'approved'
                              ? 'Approved'
                              : sub.review_status === 'changes_requested'
                              ? 'Changes Requested'
                              : 'Pending Review'}
                          </span>

                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              setReviewTaskModal(sub);
                              setTaskReviewStatus(
                                sub.review_status === 'changes_requested'
                                  ? 'changes_requested'
                                  : 'approved'
                              );
                              setTaskReviewFeedback(sub.reviewer_feedback || '');
                            }}
                          >
                            Review / Feedback
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <h3 className="font-bold text-base text-slate-900">Payment Verification</h3>
            <p className="text-xs text-slate-500">
              Reconcile ₹100 direct UPI payments against your official bank records
            </p>
          </div>

          <div className="space-y-3">
            {payments.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {p.student?.full_name || 'Student'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'pending_verification'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="text-slate-600 font-mono">
                    UTR / Ref: <strong className="text-slate-900">{p.upi_reference}</strong> &bull; Amount: ₹{p.amount}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Paid on: {p.payment_date} &bull; Domain: {p.domain?.name || '-'}
                  </div>
                  {p.screenshot_url && (
                    <div className="pt-1">
                      <a
                        href={p.screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <span>View Screenshot Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {p.status === 'pending_verification' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleApprovePayment(p.id)}
                      isLoading={actionLoading}
                    >
                      Approve Payment
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        setRejectPaymentModal({
                          id: p.id,
                          studentName: p.student?.full_name,
                          reference: p.upi_reference,
                        })
                      }
                    >
                      Reject Payment
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOMAINS TAB */}
      {activeTab === 'domains' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Manage Domains ({domains.length})</h3>
              <p className="text-xs text-slate-500">
                View, edit, or toggle availability of computer science tracks
              </p>
            </div>
            <Button
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() =>
                setEditDomainModal({
                  name: '',
                  slug: '',
                  description: '',
                  icon_name: 'Code2',
                  sort_order: domains.length + 1,
                  is_active: true,
                })
              }
            >
              Add Domain
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domains.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between text-xs space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{d.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        d.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {d.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {d.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px] text-slate-500">
                  <span>Slug: {d.slug} &bull; Order: {d.sort_order}</span>
                  <button
                    onClick={() => setEditDomainModal(d)}
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATES TAB */}
      {activeTab === 'certificates' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Issued Certificates Registry ({certificates.length})
            </h3>
            <p className="text-xs text-slate-500">
              Review issued certificates or revoke with mandatory justification
            </p>
          </div>

          {certificates.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
              No certificates issued yet. Certificates unlock once students fulfill all 4 criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {certificates.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{c.student_name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.status === 'issued'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <div className="font-mono text-blue-700 font-bold">{c.certificate_id}</div>
                    <div className="text-[11px] text-slate-500">
                      Domain: {c.domain_name} &bull; Issued: {formatISTDate(c.issue_date)}
                    </div>
                    {c.status === 'revoked' && (
                      <div className="text-[11px] text-red-600 font-medium">
                        Revocation Reason: {c.revocation_reason}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewCert(c)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 font-semibold text-slate-700 flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-blue-600" />
                      <span>Preview PDF</span>
                    </button>

                    <a
                      href={`/verify/${c.certificate_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 font-semibold text-slate-700 flex items-center gap-1 text-[11px]"
                    >
                      <span>Public Registry</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {c.status === 'issued' && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setRevokeCertModal(c)}
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              UPI Payment & Platform Configuration
            </h3>
            <p className="text-xs text-slate-500">
              Configure your real receiving UPI ID, upload your actual UPI QR code image, and customize payment instructions
            </p>
          </div>

          {settingsNotice && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{settingsNotice}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-5 max-w-xl">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Real Official UPI ID (e.g. yourname@okhdfcbank, yourupi@sbi)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourupi@bank"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                This exact UPI ID will be shown to students on the /payment screen with a copy button.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                UPI QR Code Image URL or Data URL
              </label>
              <input
                type="text"
                value={upiQrImageUrl}
                onChange={(e) => setUpiQrImageUrl(e.target.value)}
                placeholder="https://.../qr.png or data:image/png;base64,..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Provide an image link or base64 data string of your genuine UPI QR code.
              </p>
            </div>

            {upiQrImageUrl && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={upiQrImageUrl}
                  alt="QR Preview"
                  className="w-24 h-24 object-contain rounded-lg border border-slate-300 bg-white p-1"
                />
                <div className="text-xs text-slate-500">
                  <div className="font-semibold text-slate-800">QR Code Preview</div>
                  <p>This image is displayed to students for direct scanning in UPI apps.</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Student Payment Instructions
              </label>
              <textarea
                rows={3}
                value={paymentInstructions}
                onChange={(e) => setPaymentInstructions(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
              />
            </div>

            <Button
              type="submit"
              isLoading={settingsSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Configuration
            </Button>
          </form>
        </div>
      )}

      {/* REPORTS & CSV EXPORT TAB */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">Program Reports & Data Export</h3>
            <p className="text-xs text-slate-500">
              Download secure CSV reports for operational audit and record keeping
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-sm">Students Export</div>
              <p className="text-xs text-slate-500">All registered student profiles, colleges, and degrees</p>
              <a
                href="/api/admin/reports/export?type=students"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Students CSV</span>
              </a>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-sm">Payments Export</div>
              <p className="text-xs text-slate-500">All UTR references, payment statuses, and review timestamps</p>
              <a
                href="/api/admin/reports/export?type=payments"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Payments CSV</span>
              </a>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-sm">Certificates Export</div>
              <p className="text-xs text-slate-500">Issued and revoked certificate IDs with completion dates</p>
              <a
                href="/api/admin/reports/export?type=certificates"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Certs CSV</span>
              </a>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-sm">Enrollments Export</div>
              <p className="text-xs text-slate-500">Full 7-day enrollment history, domains, and tasks completed</p>
              <a
                href="/api/admin/reports/export?type=enrollments"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Enrollments CSV</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <h3 className="font-bold text-base text-slate-900">Administrative Audit Trail</h3>
            <p className="text-xs text-slate-500">
              Immutable log of role promotions, approvals, revocations, and configuration changes
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Target</th>
                  <th className="py-2.5 px-4">Actor</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-[11px]">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {log.target_table} / {log.target_id}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {log.actor_email || log.actor_id}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatISTDate(log.created_at, { includeTime: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Payment Modal */}
      {rejectPaymentModal && (
        <Modal
          isOpen={true}
          onClose={() => setRejectPaymentModal(null)}
          title="Reject Payment Submission"
          description={`Reject UTR reference ${rejectPaymentModal.reference || ''} with feedback`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rejection Reason *
              </label>
              <textarea
                rows={3}
                required
                value={paymentRejectionReason}
                onChange={(e) => setPaymentRejectionReason(e.target.value)}
                placeholder="e.g. UTR not found in bank statement for ₹100..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setRejectPaymentModal(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleRejectPayment}
                isLoading={actionLoading}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Revoke Certificate Modal */}
      {revokeCertModal && (
        <Modal
          isOpen={true}
          onClose={() => setRevokeCertModal(null)}
          title="Revoke Certificate"
          description={`Revoke official certificate ${revokeCertModal.certificate_id}`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mandatory Revocation Justification *
              </label>
              <textarea
                rows={3}
                required
                value={revocationReason}
                onChange={(e) => setRevocationReason(e.target.value)}
                placeholder="State clearly why this certificate is being revoked..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setRevokeCertModal(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleRevokeCertificate}
                isLoading={actionLoading}
              >
                Revoke Credential
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Domain Edit / Add Modal */}
      {editDomainModal && (
        <Modal
          isOpen={true}
          onClose={() => setEditDomainModal(null)}
          title={editDomainModal.id ? 'Edit Domain' : 'Add New Domain'}
        >
          <form onSubmit={handleSaveDomain} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Domain Name</label>
              <input
                type="text"
                required
                value={editDomainModal.name || ''}
                onChange={(e) =>
                  setEditDomainModal((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Slug</label>
              <input
                type="text"
                required
                disabled={!!editDomainModal.id}
                value={editDomainModal.slug || ''}
                onChange={(e) =>
                  setEditDomainModal((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={editDomainModal.description || ''}
                onChange={(e) =>
                  setEditDomainModal((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={editDomainModal.is_active ?? true}
                onChange={(e) =>
                  setEditDomainModal((prev) => ({ ...prev, is_active: e.target.checked }))
                }
              />
              <label htmlFor="is_active" className="text-xs text-slate-700 font-semibold">
                Active & Available for Enrollment
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setEditDomainModal(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" isLoading={actionLoading}>
                Save Domain
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Review Task Modal */}
      {reviewTaskModal && (
        <Modal
          isOpen={true}
          onClose={() => setReviewTaskModal(null)}
          title={`Review Task: ${reviewTaskModal.task?.title || 'Milestone'}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">{reviewTaskModal.student?.full_name}</span>
                <span className="text-slate-500">{reviewTaskModal.domain?.name}</span>
              </div>
              <div className="text-slate-600">
                <a
                  href={reviewTaskModal.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>{reviewTaskModal.github_url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {reviewTaskModal.notes && (
                <p className="text-[11px] text-slate-500 italic">
                  Note: {reviewTaskModal.notes}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">Review Decision *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTaskReviewStatus('approved')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    taskReviewStatus === 'approved'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Approved
                </button>
                <button
                  type="button"
                  onClick={() => setTaskReviewStatus('changes_requested')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    taskReviewStatus === 'changes_requested'
                      ? 'bg-amber-50 border-amber-500 text-amber-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Changes Requested
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="task_feedback_text" className="block font-semibold text-slate-700">
                Reviewer Comments & Constructive Rubric Feedback *
              </label>
              <textarea
                id="task_feedback_text"
                rows={4}
                required
                value={taskReviewFeedback}
                onChange={(e) => setTaskReviewFeedback(e.target.value)}
                placeholder="e.g. Clean code structure, functional tests verified. Great git commit messages according to our review rubric. Approved!"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 resize-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setReviewTaskModal(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant={taskReviewStatus === 'approved' ? 'success' : 'primary'}
                onClick={handleSaveTaskReview}
                isLoading={actionLoading}
                disabled={!taskReviewFeedback.trim()}
              >
                Save Evaluation
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudent(null)}
          title="Student Record Details"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-slate-900 text-sm">{selectedStudent.full_name}</div>
              <div className="text-slate-500">{selectedStudent.email}</div>
              <div className="text-slate-500">Phone: {selectedStudent.phone || 'N/A'}</div>
              <div className="text-slate-500">College: {selectedStudent.college || 'N/A'}</div>
              <div className="text-slate-500">Degree: {selectedStudent.degree || 'N/A'}</div>
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* PDF Preview Modal for Admin */}
      <PdfPreviewModal
        isOpen={!!previewCert}
        onClose={() => setPreviewCert(null)}
        title={`${previewCert?.domain_name || 'Certificate'} - ${previewCert?.student_name}`}
        pdfUrl={`/api/documents/certificate?enrollmentId=${
          previewCert?.enrollment_id || previewCert?.certificate_id || ''
        }`}
        documentType="Completion Certificate"
        verificationId={previewCert?.certificate_id}
      />
    </div>
  );
};
