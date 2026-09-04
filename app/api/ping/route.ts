import { NextResponse } from 'next/server';

/**
 * GET /api/ping
 * Health-check + keep-alive endpoint.
 * - Returns 200 with a timestamp so Vercel Cron (and external monitors like UptimeRobot)
 *   can confirm the Next.js server is alive.
 * - Simultaneously pings the Render backend to prevent it from spinning down on the free tier.
 */
export async function GET() {
  const now = new Date().toISOString();

  // Ping the Render backend
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
  let backendStatus: 'ok' | 'error' | 'skipped' = 'skipped';

  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/ping`, {
        method: 'GET',
        // short timeout so we don't block the cron for long
        signal: AbortSignal.timeout(8000),
      });
      backendStatus = res.ok ? 'ok' : 'error';
    } catch {
      // Render might be cold-starting; that's fine — the ping itself woke it up
      backendStatus = 'error';
    }
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: now,
    backend: backendStatus,
    message: 'Safarnama is alive 🚀',
  });
}
