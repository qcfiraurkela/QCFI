/**
 * GET  /api/events   → all events with their additional images
 * POST /api/events   → create a new event (admin only, multipart)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import {
  getAllEventsWithImages,
  insertEvent,
  insertEventImage,
} from '@/lib/supabase-db';
import { isAllowedFile, saveFile } from '@/lib/supabase-upload';

export async function GET() {
  try {
    const data = await getAllEventsWithImages();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (e) {
    console.error('[GET /api/events]', e);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({});
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    if (!session.adminLoggedIn) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const formData    = await req.formData();
    const name        = formData.get('name')        as string;
    const event_date  = formData.get('event_date')  as string;
    const title       = formData.get('title')       as string;
    const description = formData.get('description') as string;
    const mainImage   = formData.get('main_image')  as File | null;

    if (!name || !event_date || !title || !description || !mainImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!isAllowedFile(mainImage.name)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const mainPath = await saveFile(mainImage, '', 'uploads/event_images');
    const eventId  = await insertEvent(name, event_date, title, description, mainPath);

    const additionalImages = formData.getAll('additional_images') as File[];
    for (const img of additionalImages) {
      if (img.size > 0 && isAllowedFile(img.name)) {
        const imgPath = await saveFile(img, '', 'uploads/event_images');
        await insertEventImage(eventId, imgPath);
      }
    }

    revalidatePath('/events');
    const newRow = { id: eventId, name, event_date, title, description, main_image_path: mainPath };
    return NextResponse.json(newRow, { status: 201 });
  } catch (e) {
    console.error('[POST /api/events]', e);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
