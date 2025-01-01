import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function adminMiddleware(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || token.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
}

export const config = {
  matcher: ['/api/admin/:path*', '/admin/:path*']
};