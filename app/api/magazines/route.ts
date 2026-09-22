/**
 * GET  /api/magazines   → all magazines
 * POST /api/magazines   → upload a new magazine (admin only, multipart)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { getAllMagazines, insertMagazine } from '@/lib/supabase-db';
import { isAllowedFile, saveFile } from '@/lib/supabase-upload';

export async function GET() {
  const magazines = await getAllMagazines();
  return NextResponse.json(magazines);
}

export async function POST(req: NextRequest) {
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

  const id = await insertMagazine(title, pdfPath, coverPath);
  return NextResponse.json({ id }, { status: 201 });
}
