import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { insertHeroImage, getUploadDir } from '@/lib/db';
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
    const file = formData.get('hero_image') as File | null;
    if (file && isAllowedFile(file.name)) {
      const dir = getUploadDir('hero_images');
      const dbPath = await saveFile(file, dir, 'uploads/hero_images');
      insertHeroImage(dbPath);
    }
  } catch (e) {
    console.error('Error in /add_hero:', e);
  }

  return NextResponse.redirect(new URL('/admin/dashboard', req.url));
}
