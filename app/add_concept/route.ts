import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { insertConcept, insertConceptImage } from '@/lib/supabase-db';
import { isAllowedFile, saveFile } from '@/lib/supabase-upload';

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
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (title && description) {
      const conceptId = await insertConcept(title, description);
      const images = formData.getAll('concept_images') as File[];

      for (const img of images) {
        if (img.size > 0 && isAllowedFile(img.name)) {
          const imgPath = await saveFile(img, '', 'uploads/concept_images');
          await insertConceptImage(conceptId, imgPath);
        }
      }
    }
  } catch (e) {
    console.error('Error in /add_concept:', e);
  }

  return NextResponse.redirect(new URL('/admin/dashboard', req.url));
}
