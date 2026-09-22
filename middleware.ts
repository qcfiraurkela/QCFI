import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin dashboard routes
  if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/admin_dashboard')) {
    const sessionCookie = req.cookies.get('qcfi_admin_session');
    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin_dashboard/:path*'],
};
