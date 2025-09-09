import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple role-based route protection demo using a query param redirect to login
// In real apps, use secure cookies/JWT. Here we only gate client routes by path.

const protectedByRole: { pathStartsWith: string; roles: Array<'admin' | 'professor' | 'organization' | 'student'> }[] = [
  { pathStartsWith: '/admin', roles: ['admin'] },
  { pathStartsWith: '/creator', roles: ['professor'] },
  { pathStartsWith: '/org', roles: ['organization'] },
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const match = protectedByRole.find(rule => pathname.startsWith(rule.pathStartsWith));
  if (!match) return NextResponse.next();

  // Read role from localStorage is not possible on edge; use a cookie for demo.
  // AuthProvider will mirror localStorage to a cookie named 'cc_role'.
  const role = request.cookies.get('cc_role')?.value;
  if (!role || !match.roles.includes(role as any)) {
    const next = encodeURIComponent(pathname + (search || ''));
    const url = new URL(`/login?next=${next}`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/creator/:path*', '/org/:path*'],
};


