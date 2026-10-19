import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in to enroll in an internship domain.' },
        { status: 401 }
      );
    }

    const { domain_id } = await req.json();
    if (!domain_id) {
      return NextResponse.json(
        { error: 'Domain ID is required.' },
        { status: 400 }
      );
    }

    const enrollment = await db.createEnrollment(user.id, domain_id);

    return NextResponse.json({
      success: true,
      enrollment,
      message: 'Successfully enrolled! Your 7-calendar-day internship program has commenced.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Enrollment failed.';
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
