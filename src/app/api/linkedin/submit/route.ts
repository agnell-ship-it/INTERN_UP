import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { isValidLinkedInUrl } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { enrollment_id, post_url, notes } = await req.json();

    if (!enrollment_id || !post_url) {
      return NextResponse.json(
        { error: 'Enrollment ID and LinkedIn post URL are required.' },
        { status: 400 }
      );
    }

    const urlCheck = isValidLinkedInUrl(post_url);
    if (!urlCheck.isValid) {
      return NextResponse.json({ error: urlCheck.message }, { status: 400 });
    }

    const submission = await db.submitLinkedIn(
      enrollment_id,
      user.id,
      post_url,
      notes
    );

    try {
      const { saveProgressToCookie } = await import('@/lib/progress-cookie');
      await saveProgressToCookie({
        studentId: user.id,
        linkedInSubmission: submission,
      });
    } catch {
      // Fallback
    }

    return NextResponse.json({
      success: true,
      submission,
      message: 'LinkedIn announcement submitted for administrator review.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'LinkedIn submission failed.';
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
