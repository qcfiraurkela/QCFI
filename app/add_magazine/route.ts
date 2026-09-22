import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { insertMagazine, getUploadDir } from '@/lib/db';
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
    const title = formData.get('title') as string;
    const pdfFile = formData.get('pdf_file') as File | null;
    const coverImage = formData.get('cover_image') as File | null;

    if (title && pdfFile && coverImage && isAllowedFile(pdfFile.name) && isAllowedFile(coverImage.name)) {
      const pdfDir = getUploadDir('magazines');
      const coverDir = getUploadDir('covers');
      const pdfPath = await saveFile(pdfFile, pdfDir, 'uploads/magazines');
      const coverPath = await saveFile(coverImage, coverDir, 'uploads/covers');
      insertMagazine(title, pdfPath, coverPath);
    }
  } catch (e) {
    console.error('Error in /add_magazine:', e);
  }

  return NextResponse.redirect(new URL('/admin/dashboard', req.url));
}
