// Resume download API route

import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { track } from '@vercel/analytics/server';

export async function GET(request: NextRequest) {
  try {
    // CSRF Protection: Referer validation for GET requests
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');
    const allowedReferers = [
      process.env.NEXT_PUBLIC_SITE_URL,
      `https://${host}`,
      `http://${host}`,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ].filter(Boolean);

    // Allow direct access (no referer) but log it
    if (referer) {
      const isAllowed = allowedReferers.some((allowed) => allowed && referer.startsWith(allowed));
      if (!isAllowed) {
        console.warn(`Blocked resume download from unauthorized referer: ${referer}`);
        return NextResponse.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }
    }

    // Track download
    await track('resume_download', {
      referrer: referer ?? 'direct',
    });

    // Secure file path construction (prevent path traversal)
    const publicDir = resolve(process.cwd(), 'public');
    const filePath = resolve(publicDir, 'resume.pdf');

    // Ensure the resolved path is within the public directory
    if (!filePath.startsWith(publicDir)) {
      console.error('Path traversal attempt detected');
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    try {
      const fileBuffer = readFileSync(filePath);

      // Return with proper security headers
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Resume.pdf"',
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'private, max-age=3600',
        },
      });
    } catch (fileError) {
      // If resume.pdf doesn't exist, return 404
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Resume download error:', error);
    return NextResponse.json(
      { error: 'Failed to download resume' },
      { status: 500 }
    );
  }
}
