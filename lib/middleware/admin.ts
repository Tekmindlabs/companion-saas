import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function adminMiddleware(req: NextRequest) {
  try {
    // Add a check for NEXTAUTH_SECRET
    if (!process.env.NEXTAUTH_SECRET) {
      throw new Error('NEXTAUTH_SECRET is not defined');
    }

    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (token.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Return a more specific error response
    return new NextResponse('Authentication error', { status: 401 });
  }
}

export const config = {
  matcher: ['/api/admin/:path*', '/admin/:path*']
};