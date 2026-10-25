import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { submission_id, feedback, status } = body;

    if (!submission_id || (status !== 'approved' && status !== 'changes_requested')) {
      return NextResponse.json(
        { error: 'Submission ID and valid status ("approved" or "changes_requested") are required.' },
        { status: 400 }
      );
    }

    if (!feedback || feedback.trim().length === 0) {
      return NextResponse.json(
        { error: 'Reviewer feedback comments are required.' },
        { status: 400 }
      );
    }

    const updated = await db.reviewTaskSubmission(
      submission_id,
      feedback.trim(),
      status,
      admin.id
    );

    if (!updated) {
      return NextResponse.json({ error: 'Task submission not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      submission: updated,
      message: `Task submission review saved: ${status}.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unauthorized or review failed.';
    return NextResponse.json({ error: errorMsg }, { status: 403 });
  }
}
