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

    // Validate UTR / Reference
    const refCheck = isValidUpiReference(upi_reference);
    if (!refCheck.isValid) {
      return NextResponse.json({ error: refCheck.message }, { status: 400 });
    }

    const payment = await db.submitPayment(
      enrollment_id,
      user.id,
      upi_reference,
      payment_date,
      screenshot_url
    );

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
