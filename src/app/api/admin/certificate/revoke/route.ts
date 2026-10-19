import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { certificate_id, reason } = await req.json();

    if (!certificate_id || !reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'Certificate ID and reason for revocation are required.' },
        { status: 400 }
      );
    }

    const revoked = await db.revokeCertificate(certificate_id, reason.trim(), admin.id);
    if (!revoked) {
      return NextResponse.json({ error: 'Certificate record not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      certificate: revoked,
      message: `Certificate ${certificate_id} has been revoked.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unauthorized or revocation failed.';
    return NextResponse.json({ error: errorMsg }, { status: 403 });
  }
}
