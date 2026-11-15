import { NextResponse } from 'next/server';
import { store } from '@/lib/storage';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { type } = body;

    const validTypes = ['love', 'laugh', 'shock', 'support', 'tea'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ success: false, error: 'Invalid reaction type' }, { status: 400 });
    }

    const updated = store.reactToConfession(id, type);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Confession not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
