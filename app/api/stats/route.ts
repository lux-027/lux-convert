import { NextResponse } from 'next/server';
import { addConverted, getTotal } from '@/lib/statsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ total: await getTotal() }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { count?: unknown };
  const count = Math.min(25, Math.max(1, Math.floor(Number(body.count) || 1)));
  return NextResponse.json({ total: await addConverted(count) });
}
