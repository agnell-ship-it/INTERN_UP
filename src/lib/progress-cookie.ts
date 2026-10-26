import crypto from 'crypto';
import { cookies } from 'next/headers';
import { Enrollment, LinkedInSubmission, Payment, TaskSubmission } from '@/types';

const PROGRESS_COOKIE_NAME = 'internup_progress';
const SESSION_SECRET = process.env.SESSION_SECRET || 'internup-secure-session-fallback-secret-2026';

export interface StudentProgressState {
  studentId: string;
  enrollment?: Enrollment;
  taskSubmissions: TaskSubmission[];
  linkedInSubmission?: LinkedInSubmission | null;
  payment?: Payment | null;
}

export function signProgressPayload(payload: StudentProgressState): string {
  const jsonStr = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(jsonStr)
    .digest('hex');
  const encoded = Buffer.from(jsonStr, 'utf-8').toString('base64url');
  return `${encoded}.${signature}`;
}

export function verifyProgressPayload(token: string): StudentProgressState | null {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;

    const jsonStr = Buffer.from(encoded, 'base64url').toString('utf-8');
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(jsonStr)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    return JSON.parse(jsonStr) as StudentProgressState;
  } catch {
    return null;
  }
}

export async function getProgressFromCookie(): Promise<StudentProgressState | null> {
  if (process.env.VITEST) return null;
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(PROGRESS_COOKIE_NAME);
    if (!cookie || !cookie.value) return null;
    return verifyProgressPayload(cookie.value);
  } catch {
    return null;
  }
}

export async function saveProgressToCookie(
  update: Partial<StudentProgressState> & { studentId: string }
): Promise<void> {
  if (process.env.VITEST) return;
  try {
    const current = (await getProgressFromCookie()) || {
      studentId: update.studentId,
      taskSubmissions: [],
      linkedInSubmission: null,
      payment: null,
    };

    const merged: StudentProgressState = {
      studentId: update.studentId,
      enrollment: update.enrollment !== undefined ? update.enrollment : current.enrollment,
      taskSubmissions:
        update.taskSubmissions !== undefined
          ? update.taskSubmissions
          : current.taskSubmissions || [],
      linkedInSubmission:
        update.linkedInSubmission !== undefined
          ? update.linkedInSubmission
          : current.linkedInSubmission,
      payment: update.payment !== undefined ? update.payment : current.payment,
    };

    const token = signProgressPayload(merged);
    const cookieStore = await cookies();
    cookieStore.set(PROGRESS_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
  } catch {
    // Graceful fallback outside Next.js request context
  }
}
