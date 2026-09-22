import { SessionOptions } from 'iron-session';

export interface SessionData {
  adminLoggedIn?: boolean;
}

// SESSION_SECRET must be 32+ chars, set in .env.local
// Falls back to a dev-only string — will warn but not crash
const SESSION_SECRET =
  process.env.SESSION_SECRET ?? 'qcfi_raurkela_dev_only_secret_key_2026!!';

export const sessionOptions: SessionOptions = {
  password: SESSION_SECRET,
  cookieName: 'qcfi_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
  },
};
