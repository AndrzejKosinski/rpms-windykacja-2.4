export interface RateLimitOptions {
  limit: number; // Max number of requests
  windowMs: number; // Time window in milliseconds
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitRecord>();

/**
 * Simple in-memory rate limiter.
 * Note: In a serverless environment (like Vercel) or multi-instance setup,
 * this will only limit per-instance. For strict global rate limiting,
 * a distributed store like Redis is required.
 */
export function rateLimit(identifier: string, options: RateLimitOptions): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record) {
    store.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return { success: true, limit: options.limit, remaining: options.limit - 1, reset: now + options.windowMs };
  }

  if (now > record.resetTime) {
    // Window expired, reset
    record.count = 1;
    record.resetTime = now + options.windowMs;
    return { success: true, limit: options.limit, remaining: options.limit - 1, reset: record.resetTime };
  }

  if (record.count >= options.limit) {
    // Rate limit exceeded
    return { success: false, limit: options.limit, remaining: 0, reset: record.resetTime };
  }

  // Increment count
  record.count += 1;
  return { success: true, limit: options.limit, remaining: options.limit - record.count, reset: record.resetTime };
}

/**
 * Helper to get client IP from NextRequest or standard Request.
 * Note: In Next.js App Router, headers can be accessed via request.headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'unknown-ip';
}
