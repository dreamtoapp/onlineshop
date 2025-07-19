import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await request.json();

    await db.pushSubscription.upsert({
      where: { userId: session.user.id },
      update: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Push subscription error:', error);
    return Response.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
} 