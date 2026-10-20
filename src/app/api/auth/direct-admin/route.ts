import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';
import { COMPANY_INFO } from '@/lib/constants';

export async function GET(req: Request) {
  const adminEmail = COMPANY_INFO.initialAdminEmail.toLowerCase().trim();
  let admin = await db.getProfileByEmail(adminEmail);

  if (!admin) {
    admin = await db.createProfile({
      id: 'usr_owner_target_1',
      email: adminEmail,
      full_name: 'Agnel Vishwak',
      role: 'admin',
      email_verified: true,
    });
  } else if (admin.role !== 'admin') {
    admin = (await db.updateProfile(admin.id, { role: 'admin' as any })) || admin;
  }

  // Ensure credentials are seeded with Agnel@2007
  await db.saveUserCredentials(
    admin.id,
    'a1b2c3d4e5f60718293a4b5c6d7e8f90',
    'fabaa29ce40c20817a68df52fd765c1fb39ee17e5a57379edb26171bfcdaf9a181162f9641a8f92ce4ab26a0f1444a2b0cacb9868de0ffcab64a4b388c05ae4c'
  );

  const token = createSessionToken(admin.id, 'admin');

  // Redirect directly to the Admin Portal
  const redirectUrl = new URL('/admin', req.url);
  const response = NextResponse.redirect(redirectUrl);

  // Set the internup_session cookie
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
