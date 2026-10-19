import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateOfferLetterPdf } from '@/lib/pdf-generator';

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

    // Authorization check: Student can ONLY download their own offer letter (unless admin)
    if (enrollment.student_id !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: You cannot access another student’s offer letter.' },
        { status: 403 }
      );
    }

    const student = enrollment.student || (await db.getProfileById(enrollment.student_id));
    const domain = enrollment.domain || (await db.getDomainById(enrollment.domain_id));

    if (!student || !domain) {
      return NextResponse.json({ error: 'Incomplete student or domain data.' }, { status: 400 });
    }

    // Record or retrieve document ID
    const record = await db.recordOfferLetterDownload(enrollment.id, student.id);

    const pdfBytes = await generateOfferLetterPdf({
      documentId: record.document_id,
      studentName: student.full_name,
      studentEmail: student.email,
      domainName: domain.name,
      enrollmentDateISO: enrollment.enrolled_at,
      startDateISO: enrollment.start_date,
      deadlineDateISO: enrollment.deadline,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="INTERN-UP-Offer-Letter-${record.document_id}.pdf"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to generate offer letter.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
