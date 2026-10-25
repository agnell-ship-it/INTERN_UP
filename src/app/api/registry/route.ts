import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`registry:${clientIp}`, 60, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Registry rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const domain = searchParams.get('domain') || '';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const certificates = await db.searchCertificatesRegistry({
      query,
      domain,
      limit,
    });

    return NextResponse.json({
      success: true,
      total: certificates.length,
      certificates,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to search registry.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
