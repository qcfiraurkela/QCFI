import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { insertEvent, insertEventImage, getUploadDir } from '@/lib/db';
import { isAllowedFile, saveFile } from '@/lib/upload';

export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/admin/dashboard', req.url));
}

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(req, NextResponse.next(), sessionOptions);
  if (!session.adminLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const event_date = formData.get('event_date') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const mainImage = formData.get('main_image') as File | null;

    if (name && event_date && title && description && mainImage && isAllowedFile(mainImage.name)) {
      const dir = getUploadDir('event_images');
      const mainPath = await saveFile(mainImage, dir, 'uploads/event_images');
      const eventId = insertEvent(name, event_date, title, description, mainPath);

      const additionalImages = formData.getAll('additional_images') as File[];
      for (const img of additionalImages) {
        if (img.size > 0 && isAllowedFile(img.name)) {
          const imgPath = await saveFile(img, dir, 'uploads/event_images');
          insertEventImage(eventId, imgPath);
        }
      }
    }
  } catch (e) {
    console.error('Error in /add_event:', e);
  }

  return NextResponse.redirect(new URL('/admin/dashboard', req.url));
}
