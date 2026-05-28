import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/queue', '/patients'];
const publicRoutes = ['/', '/login'];

export function proxy(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(r => pathname === r || pathname.startsWith(r + '/'));
  const isPublic = publicRoutes.includes(pathname);

  if (token && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
