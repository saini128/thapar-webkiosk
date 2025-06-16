import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('auth-token', '', {
    path: '/',
    expires: new Date(0), // expires immediately
  });

  return response;
}
