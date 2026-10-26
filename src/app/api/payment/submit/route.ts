import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { isValidUpiReference } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { enrollment_id, upi_reference, payment_date, screenshot_url } = await req.json();

    if (!enrollment_id || !upi_reference || !payment_date) {
      return NextResponse.json(
        { error: 'Enrollment ID, UTR reference number, and payment date are required.' },
        { status: 400 }
      );
    }

    if (screenshot_url) {
      const ok =
        typeof screenshot_url === 'string' &&
        screenshot_url.startsWith('data:image/') &&
        screenshot_url.length <= 600_000;
      if (!ok) {
        return NextResponse.json(
          { error: 'Screenshot must be an image smaller than ~400KB. Please re-select it.' },
          { status: 400 }
        );
      }
    }

    // Validate UTR / Reference
    const refCheck = isValidUpiReference(upi_reference);
    if (!refCheck.isValid) {
      return NextResponse.json({ error: refCheck.message }, { status: 400 });
    }

    // Payment unlocks once all 5 tasks are submitted
    const taskSubmissions = await db.getTaskSubmissionsByEnrollmentId(enrollment_id);
    const validTasksCount = taskSubmissions.filter(
      (t) => t.github_url && t.github_url.trim().length > 0
    ).length;

    if (validTasksCount < 5) {
      return NextResponse.json(
        {
          error: `Payment is only unlocked when you are ready to receive your certificate. Please complete and submit all 5 tasks first (${validTasksCount}/5 submitted).`,
        },
        { status: 400 }
      );
    }

    const payment = await db.submitPayment(
      enrollment_id,
      user.id,
      upi_reference,
      payment_date,
      screenshot_url
    );

    try {
      const { saveProgressToCookie } = await import('@/lib/progress-cookie');
      await saveProgressToCookie({
        studentId: user.id,
        payment,
      });
    } catch {
      // Fallback
    }

    return NextResponse.json({
      success: true,
      payment,
      message:
        'Payment details submitted successfully. Status is Pending Verification. The administrator will manually verify the payment in bank records.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Payment submission failed.';
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
