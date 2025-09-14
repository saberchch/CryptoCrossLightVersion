import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple role-based route protection demo using a query param redirect to login
// In real apps, use secure cookies/JWT. Here we only gate client routes by path.

const protectedByRole: { pathStartsWith: string; roles: Array<'admin' | 'educator' | 'moderator' | 'learner'> }[] = [
  { pathStartsWith: '/admin', roles: ['admin'] },
  { pathStartsWith: '/creator', roles: ['educator', 'moderator', 'admin'] },
  { pathStartsWith: '/org', roles: ['admin', 'moderator'] },
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Read role from cookie mirrored by AuthProvider
  let role = request.cookies.get('cc_role')?.value as any;
  // Normalize legacy cookie roles gracefully for existing sessions
  if (role === 'student') role = 'learner';
  if (role === 'professor') role = 'educator';
  if (role === 'organization') role = undefined; // force re-login for org role

  // Redirect logged-in users to dashboard when visiting landing or login
  if (pathname === '/' || pathname === '/login') {
    if (role) {
      const url = new URL('/dashboard', request.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect dashboard for authenticated users only
  if (pathname.startsWith('/dashboard')) {
    if (!role) {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }
    // allow through
  }

  // Allow /creator for educators; anon users will be redirected by role-gate below

  // Role-based gated areas (admin/creator/org)
  const match = protectedByRole.find(rule => pathname.startsWith(rule.pathStartsWith));
  if (!match) return NextResponse.next();

  if (!role || !match.roles.includes(role as any)) {
    const next = encodeURIComponent(pathname + (search || ''));
    const url = new URL(`/login?next=${next}`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/admin/:path*', '/creator/:path*', '/org/:path*'],
};


