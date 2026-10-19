import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { payment_id, status, rejection_reason } = body;

    if (!payment_id || (status !== 'approved' && status !== 'rejected')) {
      return NextResponse.json(
        { error: 'Payment ID and valid status ("approved" or "rejected") are required.' },
        { status: 400 }
      );
    }

    if (status === 'rejected' && (!rejection_reason || rejection_reason.trim().length === 0)) {
      return NextResponse.json(
        { error: 'A rejection reason is required when rejecting a payment.' },
        { status: 400 }
      );
    }

    const updated = await db.reviewPayment(
      payment_id,
      status,
      admin.id,
      rejection_reason?.trim()
    );

    if (!updated) {
      return NextResponse.json({ error: 'Payment record not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      payment: updated,
      message: `Payment has been successfully marked as ${status}.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unauthorized or review failed.';
    return NextResponse.json({ error: errorMsg }, { status: 403 });
  }
}
