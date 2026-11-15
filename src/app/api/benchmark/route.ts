import { NextResponse } from 'next/server';

let requestCounter = 0;

export async function GET(req: Request) {
  const start = performance.now();
  requestCounter++;

  const { searchParams } = new URL(req.url);
  const payloadSize = parseInt(searchParams.get('payload') || '10', 10);
  const delay = parseInt(searchParams.get('delay') || '0', 10);

  if (delay > 0) {
    await new Promise((r) => setTimeout(r, Math.min(delay, 2000)));
  }

  // Generate lightweight mock synthetic load chunk
  const dummyPayload = Array.from({ length: Math.min(payloadSize, 500) }, (_, i) => ({
    id: i,
    hash: Math.random().toString(36).substring(2, 10),
    timestamp: Date.now(),
  }));

  const duration = (performance.now() - start).toFixed(2);

  return NextResponse.json({
    status: 'ONLINE',
    region: process.env.VERCEL_REGION || 'local-edge',
    instanceRequestCount: requestCounter,
    executionTimeMs: Number(duration),
    memoryUsageMB: process.memoryUsage ? Math.round(process.memoryUsage().heapUsed / 1024 / 1024) : 'N/A',
    samplePayloadCount: dummyPayload.length,
    concurrencyHealthy: true,
    serverTimestamp: new Date().toISOString(),
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-DBUU-Vercel-Bench': 'active'
    }
  });
}
