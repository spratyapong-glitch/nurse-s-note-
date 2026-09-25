import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Update session expiration if present
  const res = await updateSession(request);

  const sessionCookie = request.cookies.get('session')?.value;
  let session = null;
  if (sessionCookie) {
    session = await decrypt(sessionCookie).catch(() => null);
  }

  const { pathname } = request.nextUrl;

  // Protect these routes
  const isProtectedRoute = pathname.startsWith('/evaluation') || pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect logged-in users away from the login page
  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return res || NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
