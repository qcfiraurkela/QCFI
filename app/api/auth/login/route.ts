/**
 * POST /api/auth/login
 * Validates admin credentials from environment variables.
 * Never hardcode credentials in source.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

// Credentials must come from environment — no hardcoded fallback in production.
const ADMIN_LOGIN_ID = process.env.ADMIN_LOGIN_ID;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req: NextRequest) {
  // Fail fast if env vars are not configured
  if (!ADMIN_LOGIN_ID || !ADMIN_PASSWORD) {
    console.error('[auth/login] ADMIN_LOGIN_ID or ADMIN_PASSWORD env vars not set.');
    return NextResponse.json(
      { ok: false, error: 'Server configuration error.' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { login_id, password } = body as { login_id?: string; password?: string };

    if (
      typeof login_id === 'string' &&
      typeof password === 'string' &&
      login_id === ADMIN_LOGIN_ID &&
      password === ADMIN_PASSWORD
    ) {
      const res = NextResponse.json({ ok: true });
      const session = await getIronSession<SessionData>(req, res, sessionOptions);
      session.adminLoggedIn = true;
      await session.save();
      return res;
    }

    return NextResponse.json(
      { ok: false, error: 'Invalid credentials. Please try again.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
}
