import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = await db.getSiteSettings();
    return NextResponse.json({ settings });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch settings.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { upi_id, upi_qr_image_url, payment_instructions, support_email, founder_name } = body;

    const updates: Record<string, string> = {};
    if (upi_id !== undefined) updates.upi_id = upi_id.trim();
    if (upi_qr_image_url !== undefined) updates.upi_qr_image_url = upi_qr_image_url;
    if (payment_instructions !== undefined) updates.payment_instructions = payment_instructions.trim();
    if (support_email !== undefined) updates.support_email = support_email.trim();
    if (founder_name !== undefined) updates.founder_name = founder_name.trim();

    const updatedSettings = await db.updateSiteSettings(updates, admin.id);

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      message: 'Site & UPI payment settings updated successfully.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unauthorized or settings update failed.';
    return NextResponse.json({ error: errorMsg }, { status: 403 });
  }
}
