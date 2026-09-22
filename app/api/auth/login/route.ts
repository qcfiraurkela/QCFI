/**
 * POST /api/auth/login
 * Validates hardcoded admin credentials (same as Flask app).
 * Sets an iron-session cookie on success.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

// Hardcoded credentials — identical to the Flask app
const ADMIN_LOGIN_ID = process.env.ADMIN_LOGIN_ID || 'qcfi.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qcfi@2006';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { login_id, password } = body as { login_id: string; password: string };

    if (login_id === ADMIN_LOGIN_ID && password === ADMIN_PASSWORD) {
      const res = NextResponse.json({ ok: true });
      const session = await getIronSession<SessionData>(req, res, sessionOptions);
      session.adminLoggedIn = true;
      await session.save();
      return res;
    }

    return NextResponse.json(
      { ok: false, error: 'Invalid Credentials. Please try again.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
}
