import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { isValidPassword } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const { token, new_password } = await req.json();

    if (!token || !new_password) {
      return NextResponse.json(
        { error: 'Token and new password are required.' },
        { status: 400 }
      );
    }

    const check = isValidPassword(new_password);
    if (!check.isValid) {
      return NextResponse.json(
        { error: check.message || 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const { salt, hash } = hashPassword(new_password);
    const result = await db.verifyAndResetPassword(token, salt, hash);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Password reset failed.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
