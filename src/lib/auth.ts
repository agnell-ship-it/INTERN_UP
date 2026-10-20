import crypto from 'crypto';
import { cookies } from 'next/headers';
import { Profile } from '@/types';
import { db } from './db';

const SESSION_COOKIE_NAME = 'internup_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'internup-secure-session-fallback-secret-2026';

// PBKDF2 password hashing helper
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}

// Session Token helper
export function createSessionToken(
  userId: string,
  role: string,
  extra?: { email?: string; full_name?: string }
): string {
  const payload = JSON.stringify({
    userId,
    role,
    email: extra?.email,
    full_name: extra?.full_name,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days session
  });
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');

  const encoded = Buffer.from(payload).toString('base64url');
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string): {
  userId: string;
  role: string;
  email?: string;
  full_name?: string;
} | null {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;

    const payload = Buffer.from(encoded, 'base64url').toString('utf-8');
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const data = JSON.parse(payload);
    if (Date.now() > data.expiresAt) {
      return null;
    }

    return {
      userId: data.userId,
      role: data.role,
      email: data.email,
      full_name: data.full_name,
    };
  } catch {
    return null;
  }
}

/**
 * Gets currently authenticated user profile from session cookie (Server Component / Route Handler)
 */
export async function getCurrentUser(): Promise<Profile | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const session = verifySessionToken(sessionCookie.value);
    if (!session || !session.userId) {
      return null;
    }

    let profile = await db.getProfileById(session.userId);
    if (!profile && session.email) {
      // Re-hydrate profile if running across serverless cold-start containers
      profile = {
        id: session.userId,
        email: session.email,
        full_name: session.full_name || 'Student',
        role: (session.role as 'student' | 'admin') || 'student',
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      try {
        await db.createProfile(profile);
      } catch {
        // Safe fallback
      }
    }
    return profile;
  } catch {
    return null;
  }
}

/**
 * Enforces admin authorization. Throws or returns null if not an authorized administrator.
 */
export async function requireAdmin(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized: Administrator access required.');
  }
  return user;
}

/**
 * Enforces student authorization. Returns current user if authenticated.
 */
export async function requireStudent(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized: Authentication required.');
  }
  return user;
}
