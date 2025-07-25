import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function POST(request: NextRequest) {
  console.log('Push subscription request received');
  try {
    const session = await auth();
    console.log('[DEBUG] Session user:', session?.user);
    if (!session?.user?.id) {
      console.log('[DEBUG] Unauthorized request');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let subscription;
    try {
      subscription = await request.json();
      console.log('[DEBUG] Incoming subscription:', subscription);
    } catch (parseError) {
      console.error('[DEBUG] JSON parse error:', parseError);
      return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      console.log('[DEBUG] Invalid subscription data:', subscription);
      return Response.json({ error: 'Invalid subscription data' }, { status: 400 });
    }

    const upsertResult = await db.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userName: session.user.name || null,
        role: session.user.role || null,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userName: session.user.name || null,
        role: session.user.role || null
      }
    });
    console.log('[DEBUG] Upsert result in database:', upsertResult);

    return Response.json({ success: true });
  } catch (error) {
    console.error('[DEBUG] Push subscription error:', error);
    return Response.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
} 