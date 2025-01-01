import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // If the user is not authenticated and trying to access a protected route
  if (!session && path.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is authenticated and trying to access auth pages
  if (session && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Update the matcher configuration
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