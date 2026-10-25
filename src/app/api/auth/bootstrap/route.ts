import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { COMPANY_INFO } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    // 1. Must be an authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          error:
            'Authentication required. Please register and sign in with the designated administrator account first.',
        },
        { status: 401 }
      );
    }

    // 2. Check if bootstrap already completed permanently or locked
    const settings = await db.getSiteSettings();
    const isLocked = settings.is_bootstrap_completed || process.env.DISABLE_BOOTSTRAP === 'true';
    if (isLocked) {
      return NextResponse.json(
        {
          error:
            'Initial administrator bootstrap route has been permanently locked and disabled for security.',
        },
        { status: 403 }
      );
    }

    // 3. Match email strictly against designated administrator email (case-insensitive)
    const designated = COMPANY_INFO.initialAdminEmail.toLowerCase().trim();
    const currentEmail = user.email.toLowerCase().trim();

    if (currentEmail !== designated) {
      // Record unauthorized attempt in audit log
      await db.createAuditLog(
        user.id,
        'UNAUTHORIZED_BOOTSTRAP_ATTEMPT',
        'profiles',
        user.id,
        { attempted_email: currentEmail, designated }
      );

      return NextResponse.json(
        {
          error: `Unauthorized: Only the designated administrator (${designated}) can execute the initial bootstrap.`,
        },
        { status: 403 }
      );
    }

    // 4. Execute one-time promotion and permanently close bootstrap
    const result = await db.bootstrapAdmin(currentEmail, user.id);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Bootstrap procedure failed.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
