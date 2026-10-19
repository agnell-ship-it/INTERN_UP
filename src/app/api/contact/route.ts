import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail } from '@/lib/validation';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter your name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      return NextResponse.json(
        { error: 'Please enter a subject (at least 3 characters).' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please enter your message (at least 10 characters).' },
        { status: 400 }
      );
    }

    // Record incoming contact inquiry in audit log
    await db.createAuditLog(
      'public_user',
      'CONTACT_INQUIRY_RECEIVED',
      'inquiries',
      `inq_${Date.now()}`,
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message_length: message.trim().length,
      }
    );

    return NextResponse.json({
      success: true,
      message:
        'Thank you! Your message has been received. Our team will get back to you at your email address within 24-48 hours.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to send message.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
