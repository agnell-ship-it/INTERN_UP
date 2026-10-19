import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { isValidEmail } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const profile = await db.getProfileByEmail(cleanEmail);

    // Generic safe response to prevent email enumeration attacks
    if (!profile) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a reset link has been generated.',
      });
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    await db.savePasswordResetToken(cleanEmail, resetToken, 60); // valid 60 min

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a reset link has been generated.',
      // In development mode, provide the direct reset token for quick testing
      devResetUrl: process.env.NODE_ENV !== 'production' ? `/reset-password?token=${resetToken}` : undefined,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Password reset request failed.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
