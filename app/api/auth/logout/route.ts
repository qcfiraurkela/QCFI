/**
 * POST /api/auth/logout
 * Destroys the admin session and clears the cookie.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  // destroy() clears session data AND removes the cookie — must await save after
  session.destroy();
  await session.save();
  return res;
}
