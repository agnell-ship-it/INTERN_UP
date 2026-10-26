import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, createSessionToken } from '@/lib/auth';
import { isValidEmail } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

/**
 * Administrator-only sign-in. Student accounts are rejected here, and
 * administrator accounts are rejected by the student /api/auth/login endpoint.
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`admin-login:${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${rateLimit.resetInSeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetInSeconds) } }
      );
    }

    const { email, password } = await req.json();
    if (!email || !password || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
    }

    const profile = await db.getProfileByEmail(String(email).trim().toLowerCase());
    // Generic message for every failure mode so account existence is never leaked
    const denied = NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });

    if (!profile || profile.role !== 'admin') return denied;

    const credential = await db.getUserCredentials(profile.id);
    if (!credential || !verifyPassword(password, credential.salt, credential.hash)) {
      return denied;
    }

    const token = createSessionToken(profile.id, 'admin', {
      email: profile.email,
      full_name: profile.full_name,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set('internup_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // admin sessions are shorter: 1 day
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
