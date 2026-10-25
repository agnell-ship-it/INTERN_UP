import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`verify-email:${clientIp}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many verification attempts. Please wait ${rateLimit.resetInSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { code, token } = body;
    const input = (code || token || '').trim();

    if (!input) {
      return NextResponse.json(
        { error: 'Please enter your 6-digit email verification code.' },
        { status: 400 }
      );
    }

    const result = await db.verifyEmailByTokenOrCode(input);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      email: result.email,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Verification failed.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
