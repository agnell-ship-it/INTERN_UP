import { NextRequest, NextResponse } from 'next/server';
import { verifyGitHubRepository } from '@/lib/github-checker';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`check-github:${clientIp}`, 30, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit reached for GitHub repository checks. Please wait a minute.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'GitHub repository URL is required.' }, { status: 400 });
    }

    const result = await verifyGitHubRepository(url);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to inspect GitHub repository.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
