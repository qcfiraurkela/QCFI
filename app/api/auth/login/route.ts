/**
 * POST /api/auth/login
 * Validates admin credentials from environment variables.
 * Never hardcode credentials in source.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function POST(req: NextRequest) {
  const ADMIN_LOGIN_ID = (process.env.ADMIN_LOGIN_ID || 'qcfi.in').trim();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qcfi@2006';

  try {
    const body = await req.json();
    const { login_id, password } = body as { login_id?: string; password?: string };

    if (
      typeof login_id === 'string' &&
      typeof password === 'string' &&
      login_id.trim() === ADMIN_LOGIN_ID &&
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
