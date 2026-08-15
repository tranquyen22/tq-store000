import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from '@tq-platform/types';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('tq_access_token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  const userRole = request.cookies.get('tq_user_role')?.value as UserRole | undefined;

  const { pathname } = request.nextUrl;

  // Allow public access to login page & static files
  if (pathname.startsWith('/login') || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Redirect to login if unauthenticated
  if (!token || !userRole) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based Automatic Redirection Logic
  switch (userRole) {
    case UserRole.CUSTOMER:
      return NextResponse.redirect(new URL('https://customer.tqplatform.vn', request.url));

    case UserRole.SHOP_OWNER:
      return NextResponse.redirect(new URL('https://shop.tqplatform.vn', request.url));

    case UserRole.DRIVER:
      // Drivers must use the Expo Mobile Driver App (app-driver)
      return NextResponse.redirect(new URL('/driver-notice', request.url));

    case UserRole.SUPER_ADMIN:
    case UserRole.ADMIN:
    case UserRole.STAFF:
      // Authorized to enter Admin Portal (web-admin)
      return NextResponse.next();

    default:
      return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
