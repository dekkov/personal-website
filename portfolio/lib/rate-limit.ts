import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Redis client (optional - only if configured)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Create rate limiters (only if Redis is configured)
export const rateLimiters = redis
  ? {
      // Public GET endpoints - generous limits
      publicRead: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
        analytics: true,
      }),

      // Admin write endpoints - stricter limits
      adminWrite: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
        analytics: true,
      }),

      // AI generation endpoint - very strict (expensive operation)
      aiGeneration: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour
        analytics: true,
      }),
    }
  : null;

/**
 * Apply rate limiting to a request
 * @param request - The Next.js request object
 * @param limiter - Which rate limiter to use
 * @returns NextResponse with error if rate limited, null if allowed
 */
export async function checkRateLimit(
  request: NextRequest,
  limiter: 'publicRead' | 'adminWrite' | 'aiGeneration' = 'publicRead'
): Promise<NextResponse | null> {
  // If rate limiting is not configured, allow the request
  if (!rateLimiters) {
    return null;
  }

  // Get identifier (IP address or user identifier)
  const identifier = getIdentifier(request);

  const rateLimiter = rateLimiters[limiter];
  const { success, limit, reset, remaining } = await rateLimiter.limit(identifier);

  // Add rate limit headers to help clients
  const headers = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(reset).toISOString(),
  };

  if (!success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: `Too many requests. Please try again after ${new Date(reset).toISOString()}`,
      },
      {
        status: 429,
        headers,
      }
    );
  }

  return null;
}

/**
 * Get identifier for rate limiting
 * Uses IP address, falling back to a default if not available
 */
function getIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers (in order of preference)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a default identifier
  // In production, consider throwing an error if IP can't be determined
  return 'unknown';
}
