import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, createSessionToken } from '@/lib/auth';
import { isValidEmail } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyCaptchaSolution } from '@/lib/captcha';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    // Rate limit: max 10 login requests per 15 minutes per IP
    const rateLimit = checkRateLimit(`login:${clientIp}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. For security, please wait ${rateLimit.resetInSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.resetInSeconds) },
        }
      );
    }

    const body = await req.json();
    const { email, password, captchaToken, captchaAnswer } = body;

    // Verify CAPTCHA challenge if submitted
    if (captchaToken || captchaAnswer) {
      const captchaCheck = verifyCaptchaSolution(captchaToken, captchaAnswer);
      if (!captchaCheck.isValid) {
        return NextResponse.json(
          { error: captchaCheck.message || 'Anti-bot verification failed.' },
          { status: 400 }
        );
      }
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const profile = await db.getProfileByEmail(cleanEmail);
    if (!profile) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Strict separation: administrator accounts may only sign in via /admin/login
    if (profile.role === 'admin') {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const credential = await db.getUserCredentials(profile.id);
    if (!credential) {
      return NextResponse.json(
        { error: 'Invalid authentication credentials.' },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(password, credential.salt, credential.hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(profile.id, profile.role, {
      email: profile.email,
      full_name: profile.full_name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
      },
    });

    response.cookies.set('internup_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Login failed.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
