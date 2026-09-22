/**
 * GET /api/auth/check
 * Returns { loggedIn: true/false } — used by client components to gate UI.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function GET(req: NextRequest) {
  // Must use the SAME response object that getIronSession will write cookies to.
  const res = NextResponse.json({ loggedIn: false });
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  // Return a fresh response with the correct loggedIn value
  return NextResponse.json({ loggedIn: !!session.adminLoggedIn });
}
