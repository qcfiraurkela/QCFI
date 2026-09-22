import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware runs on the Edge runtime — no Node.js crypto available.
 * We check for the session cookie's presence as the first gate.
 * The actual session validity is verified server-side in each route/page.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage =
    pathname.startsWith('/admin/dashboard') ||
    pathname.startsWith('/admin_dashboard');

  const isAdminAction =
    pathname.startsWith('/add_') ||
    pathname.startsWith('/delete_') ||
    pathname === '/admin_logout';

  if (isAdminPage || isAdminAction) {
    const sessionCookie = req.cookies.get('qcfi_admin_session');
    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin_dashboard/:path*',
    '/add_:path*',
    '/delete_:path*',
    '/admin_logout',
  ],
};
