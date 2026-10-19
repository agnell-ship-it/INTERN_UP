import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'students';

    let csvContent = '';
    let filename = `intern-up-${type}-${Date.now()}.csv`;

    if (type === 'students') {
      const students = await db.getAllStudents();
      csvContent = 'ID,Full Name,Email,Phone,College,Degree,Graduation Year,Created At\n';
      students.forEach((s) => {
        csvContent += `"${s.id}","${escapeCsv(s.full_name)}","${escapeCsv(s.email)}","${escapeCsv(s.phone || '')}","${escapeCsv(s.college || '')}","${escapeCsv(s.degree || '')}","${escapeCsv(s.graduation_year || '')}","${s.created_at}"\n`;
      });
    } else if (type === 'payments') {
      const payments = await db.getAllPayments();
      csvContent = 'Payment ID,Student Name,Student Email,Domain,Amount,UTR Reference,Payment Date,Status,Reviewed At\n';
      payments.forEach((p) => {
        csvContent += `"${p.id}","${escapeCsv(p.student?.full_name || '')}","${escapeCsv(p.student?.email || '')}","${escapeCsv(p.domain?.name || '')}","${p.amount}","${escapeCsv(p.upi_reference)}","${p.payment_date}","${p.status}","${p.reviewed_at || ''}"\n`;
      });
    } else if (type === 'certificates') {
      const certificates = await db.getAllCertificates();
      csvContent = 'Certificate ID,Student Name,Domain,Start Date,End Date,Issue Date,Status,Revocation Reason\n';
      certificates.forEach((c) => {
        csvContent += `"${c.certificate_id}","${escapeCsv(c.student_name)}","${escapeCsv(c.domain_name)}","${c.start_date}","${c.end_date}","${c.issue_date}","${c.status}","${escapeCsv(c.revocation_reason || '')}"\n`;
      });
    } else if (type === 'enrollments') {
      const enrollments = await db.getAllEnrollments();
      csvContent = 'Enrollment ID,Student Name,Student Email,Domain,Enrolled At,Deadline,Status,Tasks Completed\n';
      enrollments.forEach((e) => {
        csvContent += `"${e.id}","${escapeCsv(e.student?.full_name || '')}","${escapeCsv(e.student?.email || '')}","${escapeCsv(e.domain?.name || '')}","${e.enrolled_at}","${e.deadline}","${e.status}","${e.tasks_completed_count}"\n`;
      });
    } else {
      return NextResponse.json({ error: 'Invalid report type.' }, { status: 400 });
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unauthorized or export failed.';
    return NextResponse.json({ error: errorMsg }, { status: 403 });
  }
}

function escapeCsv(val: string): string {
  if (!val) return '';
  return val.replace(/"/g, '""');
}
