import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple authentication for admin endpoints
 *
 * Set ADMIN_API_KEY in your environment variables
 *
 * Usage in API routes:
 * ```
 * const authResult = await verifyAdminAuth(request);
 * if (authResult) return authResult;
 * ```
 */

export function verifyAdminAuth(request: NextRequest): NextResponse | null {
  const adminApiKey = process.env.ADMIN_API_KEY;

  // If no API key is configured, allow access (for development)
  // In production, you MUST set ADMIN_API_KEY
  if (!adminApiKey) {
    if (process.env.NODE_ENV === 'production') {
      console.error('WARNING: ADMIN_API_KEY not set in production!');
    }
    return null; // Allow access
  }

  // Check Authorization header
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json(
      { error: 'Unauthorized - Missing authorization header' },
      { status: 401 }
    );
  }

  // Support both "Bearer token" and plain token formats
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (token !== adminApiKey) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid API key' },
      { status: 401 }
    );
  }

  // Authentication successful
  return null;
}

/**
 * Check if a request has valid admin credentials
 * Returns true if authenticated, false otherwise
 */
export function isAdminAuthenticated(request: NextRequest): boolean {
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey) {
    return process.env.NODE_ENV !== 'production';
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  return token === adminApiKey;
}
