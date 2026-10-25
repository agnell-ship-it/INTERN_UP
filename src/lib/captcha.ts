import crypto from 'crypto';

const CAPTCHA_SECRET =
  process.env.SESSION_SECRET || 'internup-anti-bot-cryptographic-salt-2026';

export interface CaptchaChallenge {
  question: string;
  token: string;
  expiresInSeconds: number;
}

/**
 * Generates a cryptographic anti-bot challenge.
 * Returns question text for the user, plus an HMAC-signed token.
 */
export function generateCaptchaChallenge(): CaptchaChallenge {
  // Generate random math or character challenge
  const modes = ['math', 'code'] as const;
  const mode = modes[Math.floor(Math.random() * modes.length)];

  let question: string;
  let answer: string;

  if (mode === 'math') {
    const a = Math.floor(Math.random() * 20) + 5;
    const b = Math.floor(Math.random() * 15) + 3;
    question = `Solve anti-bot challenge: What is ${a} + ${b}?`;
    answer = String(a + b);
  } else {
    // 4-character uppercase alphanumeric code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    question = `Security verification: Enter the 4 characters: ${code.split('').join(' ')}`;
    answer = code;
  }

  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
  const payload = JSON.stringify({ answer: answer.toLowerCase().trim(), expiresAt });
  const payloadB64 = Buffer.from(payload).toString('base64url');

  const signature = crypto
    .createHmac('sha256', CAPTCHA_SECRET)
    .update(payloadB64)
    .digest('base64url');

  const token = `${payloadB64}.${signature}`;

  return {
    question,
    token,
    expiresInSeconds: 300,
  };
}

/**
 * Validates the user's answer against the HMAC-signed captcha token.
 */
export function verifyCaptchaSolution(
  token: string | undefined | null,
  userAnswer: string | undefined | null
): { isValid: boolean; message?: string } {
  if (!token || !userAnswer) {
    return {
      isValid: false,
      message: 'Security CAPTCHA verification required. Please solve the challenge.',
    };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { isValid: false, message: 'Invalid security challenge token format.' };
  }

  const [payloadB64, signature] = parts;

  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', CAPTCHA_SECRET)
    .update(payloadB64)
    .digest('base64url');

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return { isValid: false, message: 'Invalid or forged CAPTCHA verification token.' };
  }

  try {
    const raw = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const data = JSON.parse(raw);

    if (Date.now() > data.expiresAt) {
      return { isValid: false, message: 'CAPTCHA challenge has expired. Please refresh and try again.' };
    }

    const cleanInput = userAnswer.trim().toLowerCase().replace(/\s+/g, '');
    const cleanExpected = String(data.answer).trim().toLowerCase().replace(/\s+/g, '');

    if (cleanInput !== cleanExpected) {
      return {
        isValid: false,
        message: 'Incorrect CAPTCHA answer. Please try again.',
      };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, message: 'Unable to parse CAPTCHA token.' };
  }
}
