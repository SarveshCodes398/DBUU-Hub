import { NextResponse } from 'next/server';
import { store } from '@/lib/storage';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    let posts = store.getRecruitments();

    if (category && category !== 'all') {
      posts = posts.filter(p => p.category === category);
    }

    return NextResponse.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch recruitment posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, eventName, organizer, department, category, description, rolesNeeded, requirements, perks, spots, deadline, eventDate } = body;

    if (!title || !eventName || !organizer || !rolesNeeded?.length) {
      return NextResponse.json({ success: false, error: 'Missing mandatory recruitment fields' }, { status: 400 });
    }

    const created = store.addRecruitment({
      title,
      eventName,
      organizer,
      department: department || 'General University Club',
      category: category || 'cultural',
      description,
      rolesNeeded,
      requirements: requirements || [],
      perks: perks || [],
      spots: Number(spots) || 10,
      deadline: deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      eventDate: eventDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      isUrgent: Boolean(body.isUrgent)
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
