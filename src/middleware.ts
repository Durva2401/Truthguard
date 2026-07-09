import { NextRequest, NextResponse } from 'next/server';

/* ═══════════════════════════════════════════
   Auth gate — sign-in is the first page.
   Unauthenticated visitors are redirected to
   /login before they can reach any app page.

   Runs on the Edge runtime, so it only checks
   for the presence of the session cookie.
   Full HMAC verification happens server-side
   in /api/auth/me (Node runtime).
═══════════════════════════════════════════ */

const SESSION_COOKIE = 'tg_session';

// Routes reachable without a session.
const PUBLIC_PATHS = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));

  // Signed-in users shouldn't sit on the auth pages — send them home.
  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Everything else requires a session.
  if (!hasSession && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    // Remember where they were headed so we can bounce back after login.
    if (pathname !== '/') {
      loginUrl.searchParams.set('from', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next internals, auth API, and static assets.
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
