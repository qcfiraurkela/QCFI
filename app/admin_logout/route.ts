/**
 * GET /admin_logout → redirects to login after destroying session.
 * NOTE: Logout via GET is kept for legacy redirect compatibility
 * but the preferred path is POST /api/auth/logout from the dashboard.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function GET(req: NextRequest) {
  const loginUrl = new URL('/admin/login', req.url);
  const res = NextResponse.redirect(loginUrl);
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  session.destroy();
  await session.save();
  return res;
}
