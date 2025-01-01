import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  try {
    const session = await auth();
    const pathname = request.nextUrl.pathname;

    // Protect dashboard routes
    if (!session && pathname.startsWith('/dashboard')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from auth pages
    if (session && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Redirect to login on error
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/chat/:path*',
    '/api/chat/:path*',
    '/api/companions/:path*',
    '/login',
    '/register'
  ]
};