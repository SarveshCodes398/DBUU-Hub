import { NextResponse } from 'next/server';
import { store } from '@/lib/storage';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { content, authorAlias } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Comment cannot be empty' }, { status: 400 });
    }

    const comment = store.addComment(id, content, authorAlias);
    if (!comment) {
      return NextResponse.json({ success: false, error: 'Confession not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
