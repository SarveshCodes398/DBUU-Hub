import { NextResponse } from 'next/server';
import { store } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const confessions = store.getConfessions();
    return NextResponse.json(
      { success: true, count: confessions.length, data: confessions },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
        }
      }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch confessions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, category, authorAlias } = body;

    if (!content || !category) {
      return NextResponse.json({ success: false, error: 'Content and category are required' }, { status: 400 });
    }

    if (content.length < 5 || content.length > 1000) {
      return NextResponse.json({ success: false, error: 'Confession must be between 5 and 1000 characters' }, { status: 400 });
    }

    // Notice: Any personal student data (like email, ip, roll) is NEVER stored or bound to the confession
    const created = store.addConfession(content, category, authorAlias);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
