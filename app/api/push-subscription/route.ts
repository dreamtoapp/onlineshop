import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let subscription;
    try {
      subscription = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return Response.json({ error: 'Invalid subscription data' }, { status: 400 });
    }

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