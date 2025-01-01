import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function adminMiddleware(req: NextRequest) {
  try {
    const token = await getToken({ req });
    
    // Add null check before accessing token properties
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check for role
    if (token.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // If all checks pass, allow the request to continue
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const config = {
  matcher: ['/api/admin/:path*', '/admin/:path*']
};