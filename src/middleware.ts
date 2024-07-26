import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup', '/', '/verify/:path*'],
};

const secret = process.env.NEXT_AUTH_SECRET

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });	
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith('/signin') ||
      url.pathname.startsWith('/signup') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signup', request.url));
  }

  return NextResponse.next();
}