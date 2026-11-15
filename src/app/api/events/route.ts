import { NextResponse } from 'next/server';
import { store } from '@/lib/storage';

export async function GET() {
  try {
    const events = store.getEvents();
    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subtitle, category, date, time, venue, image, description, prizePool, tags } = body;

    if (!title || !date || !venue) {
      return NextResponse.json({ success: false, error: 'Title, date, and venue are required' }, { status: 400 });
    }

    const defaultImg = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';

    const created = store.addEvent({
      title: title.trim(),
      subtitle: subtitle?.trim() || 'Student Organized College Event',
      category: category || 'Campus Event',
      date,
      time: time || 'TBA',
      venue: venue.trim(),
      image: image?.trim() || defaultImg,
      description: description?.trim() || 'Organized by DBUU students. Open for all students.',
      prizePool: prizePool?.trim() || undefined,
      tags: Array.isArray(tags) && tags.length ? tags : ['DBUU', 'Campus', 'StudentEvent']
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
