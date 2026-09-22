import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { deleteHeroImage } from '@/lib/supabase-db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getIronSession<SessionData>(req, NextResponse.next(), sessionOptions);
  if (!session.adminLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  const id = parseInt(params.id, 10);
  if (!isNaN(id)) await deleteHeroImage(id);
  return NextResponse.redirect(new URL('/admin/dashboard', req.url));
}
