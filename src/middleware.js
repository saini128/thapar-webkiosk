import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/utils/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname.startsWith('/login');

  const token = request.cookies.get('auth-token')?.value || null;
  const jwtData = token ? await verifyJWT(token) : null;

  if (!jwtData && !isLoginPage) {
    console.log('Redirecting to /login because user is not authenticated');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (jwtData && isLoginPage) {
    console.log('Redirecting to / because user is already authenticated');
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login'],
};
