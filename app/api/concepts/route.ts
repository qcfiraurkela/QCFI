/**
 * GET  /api/concepts   → all quality concepts with their images
 * POST /api/concepts   → create a new concept (admin only, multipart)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import {
  getAllConceptsWithImages,
  insertConcept,
  insertConceptImage,
} from '@/lib/supabase-db';
import { isAllowedFile, saveFile } from '@/lib/supabase-upload';

export async function GET() {
  try {
    const data = await getAllConceptsWithImages();
    return NextResponse.json(data);
  } catch (e) {
    console.error('[GET /api/concepts]', e);
    return NextResponse.json({ error: 'Failed to fetch concepts' }, { status: 500 });
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
    const title       = formData.get('title')       as string;
    const description = formData.get('description') as string;

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const conceptId = await insertConcept(title, description);
    const images    = formData.getAll('concept_images') as File[];

    for (const img of images) {
      if (img.size > 0 && isAllowedFile(img.name)) {
        const imgPath = await saveFile(img, '', 'uploads/concept_images');
        await insertConceptImage(conceptId, imgPath);
      }
    }

    revalidatePath('/');
    revalidatePath('/quality-concepts');
    return NextResponse.json({ id: conceptId, title, description }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/concepts]', e);
    return NextResponse.json({ error: 'Failed to add concept' }, { status: 500 });
  }
}
