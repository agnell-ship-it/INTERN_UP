import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSessionToken } from '@/lib/auth';
import { isValidEmail, isValidPassword } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, password, phone, college, degree, graduation_year } = body;

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

    // Hash password securely
    const { salt, hash } = hashPassword(password);

    // CRITICAL SECURITY RULE: Registration ALWAYS creates a student account.
    // Never accept role from user input.
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const profile = await db.createProfile({
      id: userId,
      email: cleanEmail,
      full_name: full_name.trim(),
      phone: phone?.trim() || '',
      college: college?.trim() || '',
      degree: degree?.trim() || '',
      graduation_year: graduation_year?.trim() || '',
      role: 'student',
      email_verified: true, // Auto-verified for streamlined onboarding
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
