import { NextResponse } from 'next/server';
import db from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    // Check if user is authenticated and has admin access
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all users with isOtp: false (unverified)
    const unverifiedUsers = await db.user.findMany({
      where: {
        isOtp: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        isOtp: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      users: unverifiedUsers,
      count: unverifiedUsers.length,
    });

  } catch (error) {
    console.error('Error fetching unverified users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
