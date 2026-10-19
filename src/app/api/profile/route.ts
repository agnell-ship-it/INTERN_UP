import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ user });
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { full_name, phone, college, degree, graduation_year } = body;

    if (full_name && (typeof full_name !== 'string' || full_name.trim().length < 2)) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    const updated = await db.updateProfile(user.id, {
      full_name: full_name?.trim() || user.full_name,
      phone: phone !== undefined ? phone.trim() : user.phone,
      college: college !== undefined ? college.trim() : user.college,
      degree: degree !== undefined ? degree.trim() : user.degree,
      graduation_year: graduation_year !== undefined ? graduation_year.trim() : user.graduation_year,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update profile.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
