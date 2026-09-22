/**
 * GET  /api/hero  → returns all hero images
 * POST /api/hero  → uploads a new hero image (admin only)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { getAllHeroImages, insertHeroImage } from '@/lib/supabase-db';
import { isAllowedFile, saveFile } from '@/lib/supabase-upload';

export async function GET() {
  try {
    const images = await getAllHeroImages();
    return NextResponse.json(images, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (e) {
    console.error('[GET /api/hero]', e);
    return NextResponse.json({ error: 'Failed to fetch hero images' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({});
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    if (!session.adminLoggedIn) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('hero_image') as File | null;

    if (!file || !isAllowedFile(file.name)) {
      return NextResponse.json({ error: 'Invalid or missing file' }, { status: 400 });
    }

    const dbPath = await saveFile(file, '', 'uploads/hero_images');
    const id     = await insertHeroImage(dbPath);
    revalidatePath('/');
    return NextResponse.json({ id, image_path: dbPath }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/hero]', e);
    return NextResponse.json({ error: 'Failed to upload hero image' }, { status: 500 });
  }
}
