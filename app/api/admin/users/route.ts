import { NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/middleware/admin';
import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/services/audit-log';

export async function GET(req: Request) {
  try {
    await adminMiddleware(req);
    
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await adminMiddleware(req);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return new NextResponse('User ID required', { status: 400 });
    }

    await db.user.delete({
      where: { id: userId }
    });

    await createAuditLog({
      action: 'DELETE_USER',
      userId: userId,
      details: { userId }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}