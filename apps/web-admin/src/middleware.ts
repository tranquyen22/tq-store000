import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('tq_token')?.value;
  const userRole = request.cookies.get('tq_role')?.value;

  const url = request.nextUrl.clone();

  // If no token found, redirect to login page
  if (!token && !url.pathname.startsWith('/login')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Multi-Role Auto Redirection Logic strictly based on 5 Roles
  if (userRole) {
    switch (userRole) {
      case 'customer':
        return NextResponse.redirect(new URL('http://localhost:3001/dashboard', request.url));

      case 'shop_owner':
      case 'shop_staff':
        return NextResponse.redirect(new URL('http://localhost:3002/dashboard', request.url));

      case 'driver':
        return NextResponse.redirect(new URL('http://localhost:3003/online', request.url));

      case 'super_admin':
      case 'employee':
        // Super Admin & Employee stay on web-admin portal
        if (url.pathname === '/login') {
          url.pathname = '/';
          return NextResponse.redirect(url);
        }
        return NextResponse.next();

      default:
        break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
