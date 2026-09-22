import { SessionOptions } from 'iron-session';

export interface SessionData {
  adminLoggedIn?: boolean;
}

export const sessionOptions: SessionOptions = {
  // 32+ character secret — change this before going live
  password: 'qcfi_raurkela_nextjs_super_secret_key_2026!',
  cookieName: 'qcfi_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
  },
};
