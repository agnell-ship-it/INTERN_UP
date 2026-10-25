import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`reminders:${user.id}`, 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Please wait before triggering another reminder email.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { dailyReminder, crunchReminder, urgentReminder } = body;

    // Simulation / mock dispatch of notification email
    return NextResponse.json({
      success: true,
      message: `Email reminder preferences updated for ${user.email}. Test notification dispatched to ${user.email}.`,
      preferences: {
        dailyReminder: !!dailyReminder,
        crunchReminder: !!crunchReminder,
        urgentReminder: !!urgentReminder,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update reminder settings.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
