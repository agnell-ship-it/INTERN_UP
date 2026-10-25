import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ certificateId: string }> }
) {
  try {
    const clientIp = getClientIp(req);
    // Rate limit: max 30 lookups per minute to prevent brute-force ID guessing
    const rateLimit = checkRateLimit(`verify:${clientIp}`, 30, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before verifying another certificate.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetInSeconds) } }
      );
    }

    const { certificateId } = await context.params;

    if (!certificateId) {
      return NextResponse.json({ error: 'Certificate ID is required.' }, { status: 400 });
    }

    const cert = await db.getCertificateById(certificateId);
    if (!cert) {
      return NextResponse.json(
        { found: false, message: 'Certificate not found in our official registry.' },
        { status: 404 }
      );
    }

    // Return non-sensitive details only
    return NextResponse.json({
      found: true,
      certificate: {
        certificateId: cert.certificate_id,
        recipientName: cert.student_name,
        domain: cert.domain_name,
        startDate: cert.start_date,
        endDate: cert.end_date,
        issueDate: cert.issue_date,
        status: cert.status,
        revocationReason: cert.status === 'revoked' ? cert.revocation_reason : undefined,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Verification lookup failed.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
