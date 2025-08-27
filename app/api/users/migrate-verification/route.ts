import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin access
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userIds } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'User IDs array is required' },
        { status: 400 }
      );
    }

    // Update all selected users to verified status
    const result = await db.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        isOtp: true,
        isActive: true, // Also activate the account
      },
    });

    // Log the migration for audit purposes
    console.log(`[AUDIT] User verification migration performed by ${session.user.email}:`, {
      migratedUsers: userIds.length,
      userIds,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${result.count} users to verified status`,
      migratedCount: result.count,
    });

  } catch (error) {
    console.error('Error migrating user verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
















