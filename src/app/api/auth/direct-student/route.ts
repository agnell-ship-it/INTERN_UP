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

  // Ensure active enrollment exists for this demo student
  const activeEnrollment = await db.getActiveEnrollmentByStudentId(student.id);
  if (!activeEnrollment) {
    try {
      await db.createEnrollment(student.id, 'dom_web-development');
    } catch {
      // already exists
    }
  }

  // Create session token with student role and profile details
  const token = createSessionToken(student.id, 'student', {
    email: student.email,
    full_name: student.full_name,
  });

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
