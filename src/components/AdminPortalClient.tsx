'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AdminAuditLog,
  Certificate,
  Domain,
  Enrollment,
  LinkedInSubmission,
  Payment,
  Profile,
  SiteSettings,
  Task,
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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatISTDate } from '@/lib/date-utils';

interface AdminPortalClientProps {
  stats: {
    totalStudents: number;
    activeEnrollments: number;
    completedEnrollments: number;
    pendingLinkedIn: number;
    pendingPayments: number;
    issuedCertificates: number;
    totalDomains: number;
    totalTasks: number;
  };
  students: Profile[];
  enrollments: Enrollment[];
  domains: Domain[];
  pendingLinkedIn: (LinkedInSubmission & { student?: Profile; domain?: Domain })[];
  payments: (Payment & { student?: Profile; domain?: Domain })[];
  certificates: Certificate[];
  siteSettings: SiteSettings;
  auditLogs: AdminAuditLog[];
}

export const AdminPortalClient: React.FC<AdminPortalClientProps> = ({
  stats,
  students,
  enrollments,
  domains,
  pendingLinkedIn,
  payments,
  certificates,
  siteSettings,
  auditLogs,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'students'
    | 'linkedin'
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

  // Settings State
  const [upiId, setUpiId] = useState(siteSettings.upi_id || '');
  const [upiQrImageUrl, setUpiQrImageUrl] = useState(siteSettings.upi_qr_image_url || '');
  const [paymentInstructions, setPaymentInstructions] = useState(
    siteSettings.payment_instructions || ''
  );
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null);

  // Review Modals
  const [rejectLinkedInModal, setRejectLinkedInModal] = useState<{
    id: string;
    studentName?: string;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [rejectPaymentModal, setRejectPaymentModal] = useState<{
    id: string;
    studentName?: string;
    reference?: string;
  } | null>(null);
  const [paymentRejectionReason, setPaymentRejectionReason] = useState('');

  // Revoke Certificate Modal
  const [revokeCertModal, setRevokeCertModal] = useState<Certificate | null>(null);
  const [revocationReason, setRevocationReason] = useState('');

  // Domain Editing / Adding
  const [editDomainModal, setEditDomainModal] = useState<Partial<Domain> | null>(null);

  // Handlers
  const handleApproveLinkedIn = async (id: string) => {
    setActionLoading(true);
    try {
      await fetch('/api/admin/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: id, status: 'approved' }),
      });
      router.refresh();
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectLinkedIn = async () => {
    if (!rejectLinkedInModal || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      await fetch('/api/admin/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: rejectLinkedInModal.id,
          status: 'rejected',
          rejection_reason: rejectionReason.trim(),
        }),
      });
      setRejectLinkedInModal(null);
      setRejectionReason('');
      router.refresh();
    } finally {
      setActionLoading(false);
    }
  };

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
            key: 'linkedin',
            label: `LinkedIn (${pendingLinkedIn.length})`,
            icon: <Share2 className="w-4 h-4" />,
            badge: pendingLinkedIn.length > 0 ? pendingLinkedIn.length : undefined,
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Total Students</span>
              <div className="text-2xl font-bold text-slate-900">{stats.totalStudents}</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Active Sprints</span>
              <div className="text-2xl font-bold text-blue-600">{stats.activeEnrollments}</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Pending LinkedIn</span>
              <div className="text-2xl font-bold text-amber-600">{stats.pendingLinkedIn}</div>
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

            {/* Pending LinkedIn Submissions Queue */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Pending LinkedIn Reviews ({pendingLinkedIn.length})
                </h3>
                <button
                  onClick={() => setActiveTab('linkedin')}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              {pendingLinkedIn.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">
                  No pending LinkedIn submissions awaiting review.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingLinkedIn.slice(0, 3).map((l) => (
                    <div
                      key={l.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate max-w-[200px]">
                        <div className="font-bold text-slate-900 truncate">
                          {l.student?.full_name || 'Student'}
                        </div>
                        <a
                          href={l.post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 truncate mt-0.5"
                        >
                          <span className="truncate">{l.post_url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleApproveLinkedIn(l.id)}
                          isLoading={actionLoading}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            setRejectLinkedInModal({
                              id: l.id,
                              studentName: l.student?.full_name,
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

      {/* LINKEDIN REVIEWS TAB */}
      {activeTab === 'linkedin' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <h3 className="font-bold text-base text-slate-900">LinkedIn Announcement Queue</h3>
            <p className="text-xs text-slate-500">
              Open and verify student announcement posts before approving
            </p>
          </div>

          {pendingLinkedIn.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
              All LinkedIn submissions have been reviewed!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingLinkedIn.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-slate-900">
                      {sub.student?.full_name || 'Student'} ({sub.domain?.name})
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={sub.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>Open LinkedIn Post URL</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    {sub.notes && (
                      <div className="text-[11px] text-slate-500">Notes: {sub.notes}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleApproveLinkedIn(sub.id)}
                      isLoading={actionLoading}
                    >
                      Approve Post
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        setRejectLinkedInModal({
                          id: sub.id,
                          studentName: sub.student?.full_name,
                        })
                      }
                    >
                      Reject with Reason
                    </Button>
                  </div>
                </div>
              ))}
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

      {/* Reject LinkedIn Modal */}
      {rejectLinkedInModal && (
        <Modal
          isOpen={true}
          onClose={() => setRejectLinkedInModal(null)}
          title="Reject LinkedIn Submission"
          description={`Provide a clear reason for ${rejectLinkedInModal.studentName || 'student'}`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rejection Reason *
              </label>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Post is private or URL cannot be accessed..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setRejectLinkedInModal(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleRejectLinkedIn}
                isLoading={actionLoading}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
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
    </div>
  );
};
