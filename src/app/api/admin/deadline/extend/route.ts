import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { enrollment_id, additional_days, reason } = await req.json();

    if (!enrollment_id || !additional_days || !reason) {
      return NextResponse.json(
        { error: 'Enrollment ID, additional days, and justification reason are required.' },
        { status: 400 }
      );
    }

    const days = Number(additional_days);
    if (isNaN(days) || days < 1 || days > 30) {
      return NextResponse.json(
        { error: 'Additional days must be a number between 1 and 30.' },
        { status: 400 }
      );
    }

    const updated = await db.extendDeadline(enrollment_id, days, admin.id, reason.trim());
    if (!updated) {
      return NextResponse.json({ error: 'Enrollment not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      enrollment: updated,
      message: `Deadline extended by ${days} calendar days and recorded in audit log.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unauthorized or extension failed.';
    return NextResponse.json({ error: errorMsg }, { status: 403 });
  }
}
