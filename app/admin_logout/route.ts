import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url));
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  session.destroy();
  return res;
}
