// Contact form API route

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { contactFormSchema } from '@/lib/validation';
import { escapeHtml, sanitizeTextWithBreaks } from '@/lib/sanitize';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // CSRF Protection: Origin validation
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL,
      `https://${host}`,
      `http://${host}`,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ].filter(Boolean);

    if (origin && !allowedOrigins.includes(origin)) {
      console.warn(`Blocked request from unauthorized origin: ${origin}`);
      return NextResponse.json(
        { success: false, error: 'Unauthorized origin' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    // Honeypot check - silent fail for bots
    if (body.honeypot) {
      return NextResponse.json({ success: true });
    }

    // Validate data
    const data = contactFormSchema.parse(body);

    // Send email with sanitized content to prevent XSS
    const result = await sendEmail({
      to: process.env.CONTACT_EMAIL || 'your-email@example.com',
      subject: `Portfolio Contact: ${escapeHtml(data.name)}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${sanitizeTextWithBreaks(data.message)}</p>
      `,
    });

    if (!result.success) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      // In development, show details; in production, hide internal structure
      const isDev = process.env.NODE_ENV === 'development';

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input. Please check your data.',
          ...(isDev && { details: error.flatten() }),
        },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
