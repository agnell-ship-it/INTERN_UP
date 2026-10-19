import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateCertificatePdf } from '@/lib/pdf-generator';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const enrollmentId = searchParams.get('enrollmentId');

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Enrollment ID is required.' }, { status: 400 });
    }

    const enrollment = await db.getEnrollmentById(enrollmentId);
    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment record not found.' }, { status: 404 });
    }

    // Authorization check: Student can ONLY download their own certificate (unless admin)
    if (enrollment.student_id !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: You cannot access another student’s certificate.' },
        { status: 403 }
      );
    }

    // Single source of truth issue & eligibility check
    const { certificate } = await db.issueCertificate(enrollment.id, user.id);

    if (certificate.status === 'revoked') {
      return NextResponse.json(
        { error: `This certificate has been revoked: ${certificate.revocation_reason || 'Administrative revocation'}` },
        { status: 403 }
      );
    }

    const pdfBytes = await generateCertificatePdf({
      certificateId: certificate.certificate_id,
      studentName: certificate.student_name,
      domainName: certificate.domain_name,
      startDateISO: certificate.start_date,
      endDateISO: certificate.end_date,
      issueDateISO: certificate.issue_date,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="INTERN-UP-Certificate-${certificate.certificate_id}.pdf"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to generate certificate.';
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
