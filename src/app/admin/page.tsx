import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { COMPANY_INFO } from '@/lib/constants';
import { AdminPortalClient } from '@/components/AdminPortalClient';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();

  // Strict Server-Side Authorization Guard
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900">Administrator Access Required</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              This area is restricted to authorized platform administrators. Ordinary student accounts
              cannot access administrative functions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 text-left space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Owner Bootstrap Setup:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              If you are the platform owner (
              <span className="font-mono text-blue-700">{COMPANY_INFO.initialAdminEmail}</span>),
              please ensure you have registered and run the one-time secure bootstrap procedure.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/admin/bootstrap"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
            >
              <span>Go to Initial Admin Bootstrap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/login"
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Sign in with another account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch all admin data
  const [
    stats,
    students,
    enrollments,
    domains,
    pendingLinkedIn,
    payments,
    certificates,
    siteSettings,
    auditLogs,
  ] = await Promise.all([
    db.getAdminStats(),
    db.getAllStudents(),
    db.getAllEnrollments(),
    db.getAllDomains(false), // includes active and inactive
    db.getAllPendingLinkedIn(),
    db.getAllPayments(),
    db.getAllCertificates(),
    db.getSiteSettings(),
    db.getAuditLogs(100),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
              ADMINISTRATIVE PORTAL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            INTERN-UP Management Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Signed in as {user.full_name} ({user.email}) &bull; Administrator Role Verified
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            Student View
          </Link>
        </div>
      </div>

      {/* Main Admin Portal Client */}
      <AdminPortalClient
        stats={stats}
        students={students}
        enrollments={enrollments}
        domains={domains}
        pendingLinkedIn={pendingLinkedIn}
        payments={payments}
        certificates={certificates}
        siteSettings={siteSettings}
        auditLogs={auditLogs}
      />
    </div>
  );
}
