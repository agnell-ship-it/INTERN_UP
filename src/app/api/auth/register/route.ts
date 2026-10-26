import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { hashPassword, createSessionToken } from '@/lib/auth';
import { isValidEmail, isValidPassword } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyCaptchaSolution } from '@/lib/captcha';
import { COMPANY_INFO } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    // Rate limit: max 5 registrations per 15 minutes per IP
    const rateLimit = checkRateLimit(`register:${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Registration rate limit reached. For security, please wait ${rateLimit.resetInSeconds} seconds before creating another account.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.resetInSeconds) },
        }
      );
    }

    const body = await req.json();
    const {
      full_name,
      email,
      password,
      phone,
      college,
      degree,
      graduation_year,
      captchaToken,
      captchaAnswer,
    } = body;

    // Verify anti-bot CAPTCHA if challenge passed
    if (captchaToken || captchaAnswer) {
      const captchaCheck = verifyCaptchaSolution(captchaToken, captchaAnswer);
      if (!captchaCheck.isValid) {
        return NextResponse.json(
          { error: captchaCheck.message || 'Anti-bot verification failed.' },
          { status: 400 }
        );
      }
    }

    // Server-side validation
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const passwordCheck = isValidPassword(password);
    if (!passwordCheck.isValid) {
      return NextResponse.json(
        { error: passwordCheck.message || 'Invalid password.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if account already exists
    const existing = await db.getProfileByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    // Generate 6-digit email verification code and secure token
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = crypto.randomBytes(16).toString('hex');
    await db.saveEmailVerificationToken(cleanEmail, verificationToken, verificationCode, 1440);

    // Hash password securely
    const { salt, hash } = hashPassword(password);

    // CRITICAL SECURITY RULE: Registration ALWAYS creates a student account.
    // Never accept role from user input.
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const isOwner = cleanEmail === COMPANY_INFO.initialAdminEmail.toLowerCase().trim();

    const profile = await db.createProfile({
      id: userId,
      email: cleanEmail,
      full_name: full_name.trim(),
      phone: phone?.trim() || '',
      college: college?.trim() || '',
      degree: degree?.trim() || '',
      graduation_year: graduation_year?.trim() || '',
      role: 'student',
      email_verified: true, // Auto-verified for seamless onboarding without verification codes
    });

    // Save auth credential
    await db.saveUserCredentials(userId, salt, hash);

    // Create session token
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
        email_verified: true,
      },
      emailVerification: {
        required: false,
        code: verificationCode,
        token: verificationToken,
        message: 'Registration successful.',
      },
    });

    // Set secure HTTP-only session cookie
    response.cookies.set('internup_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Registration failed.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
