// Analytics tracking API route

import { NextRequest, NextResponse } from 'next/server';
import { track } from '@vercel/analytics/server';
import { trackingEventSchema } from '@/lib/validation';
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
      console.warn(`Blocked tracking request from unauthorized origin: ${origin}`);
      return NextResponse.json(
        { success: false, error: 'Unauthorized origin' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate tracking data
    const { event, properties } = trackingEventSchema.parse(body);

    // Sanitize properties: limit size and ensure safe types
    const sanitizedProps: Record<string, string | number | boolean> = properties
      ? Object.fromEntries(
          Object.entries(properties)
            .slice(0, 10) // Max 10 properties
            .map(([key, value]) => [
              key.slice(0, 50), // Max 50 chars per key
              typeof value === 'string'
                ? value.slice(0, 200) // Max 200 chars per string value
                : value,
            ])
        )
      : {};

    // Track with Vercel Analytics
    await track(event, sanitizedProps);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid tracking data' },
        { status: 400 }
      );
    }

    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
