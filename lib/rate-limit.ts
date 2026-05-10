// In-memory IP rate limit. Swap for Upstash Redis in prod (see ARCHITECTURE.md).
// 10 requests per IP per hour by default; survives within a single Node process only.
const HITS = new Map<string, number[]>();

export function checkRateLimit(ip: string, limit = 10, windowMs = 60 * 60 * 1000): {
  ok: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const arr = (HITS.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    return { ok: false, remaining: 0, resetAt: arr[0] + windowMs };
  }
  arr.push(now);
  HITS.set(ip, arr);
  return { ok: true, remaining: limit - arr.length, resetAt: now + windowMs };
}

export function ipFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
