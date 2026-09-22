/**
 * GET  /api/magazines   → all magazines
 * POST /api/magazines   → upload a new magazine (admin only, multipart)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { getAllMagazines, insertMagazine } from '@/lib/supabase-db';
import { isAllowedFile, saveFile } from '@/lib/supabase-upload';

export async function GET() {
  try {
    const magazines = await getAllMagazines();
    return NextResponse.json(magazines);
  } catch (e) {
    console.error('[GET /api/magazines]', e);
    return NextResponse.json({ error: 'Failed to fetch magazines' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({});
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    if (!session.adminLoggedIn) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const formData   = await req.formData();
    const title      = formData.get('title')       as string;
    const pdfFile    = formData.get('pdf_file')    as File | null;
    const coverImage = formData.get('cover_image') as File | null;

    if (!title || !pdfFile || !coverImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!isAllowedFile(pdfFile.name) || !isAllowedFile(coverImage.name)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const pdfPath   = await saveFile(pdfFile,    '', 'uploads/magazines');
    const coverPath = await saveFile(coverImage, '', 'uploads/covers');
    const id        = await insertMagazine(title, pdfPath, coverPath);

    revalidatePath('/');
    revalidatePath('/magazine');
    return NextResponse.json({ id, title, pdf_path: pdfPath, cover_path: coverPath }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/magazines]', e);
    return NextResponse.json({ error: 'Failed to add magazine' }, { status: 500 });
  }
}
