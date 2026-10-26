import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { db, isPersistentStorageConfigured } from '@/lib/db';
import { AdminPortalClient } from '@/components/AdminPortalClient';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();

  // Strict server-side authorization guard. Non-admins are sent to the admin
  // sign-in page and are never shown any admin identity or hint.
  if (!user || user.role !== 'admin') {
    redirect('/admin/login');
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
    taskSubmissions,
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
    db.getAllTaskSubmissions(),
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

      {!isPersistentStorageConfigured() && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 text-sm space-y-1">
          <div className="font-extrabold">⚠ Permanent storage is NOT connected</div>
          <p className="text-xs leading-relaxed">
            Student registrations, LinkedIn posts and payments are currently stored in temporary
            server memory and will disappear or appear missing between requests. Add the
            <code className="mx-1 font-mono">UPSTASH_REDIS_REST_URL</code> and
            <code className="mx-1 font-mono">UPSTASH_REDIS_REST_TOKEN</code> environment variables
            in Vercel, then redeploy.
          </p>
        </div>
      )}

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
        taskSubmissions={taskSubmissions}
      />
    </div>
  );
}
