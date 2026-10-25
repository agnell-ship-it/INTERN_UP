import { NextResponse } from 'next/server';
import { generateCaptchaChallenge } from '@/lib/captcha';

export async function GET() {
  const challenge = generateCaptchaChallenge();
  return NextResponse.json(challenge, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
