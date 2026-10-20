import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';

export async function GET(req: Request) {
  const studentEmail = 'student@example.com';
  let student = await db.getProfileByEmail(studentEmail);

  if (!student) {
    student = await db.createProfile({
      id: 'usr_demo_student_1',
      email: studentEmail,
      full_name: 'Demo Student',
      phone: '+91 9876543210',
      college: 'National Institute of Technology',
      degree: 'B.Tech Computer Science',
      graduation_year: '2026',
      role: 'student',
      email_verified: true,
    });
  }

  // Create session token with student role
  const token = createSessionToken(student.id, 'student');

  // Redirect directly to the Student Dashboard
  const redirectUrl = new URL('/dashboard', req.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set({
    name: 'internup_session',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
}
