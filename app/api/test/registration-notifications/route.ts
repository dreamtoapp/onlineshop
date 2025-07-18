import { NextResponse } from 'next/server';
import { createSystemNotification, SYSTEM_NOTIFICATIONS } from '@/helpers/systemNotifications';
import { auth } from '@/auth';

// 🧪 Test endpoint to verify registration notification flow
export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Must be logged in to test notifications'
      }, { status: 401 });
    }

    // Simulate the 3 registration notifications
    const notifications = [];

    // 1️⃣ Welcome notification
    const welcome = await createSystemNotification({
      userId: session.user.id,
      title: SYSTEM_NOTIFICATIONS.WELCOME.title,
      body: SYSTEM_NOTIFICATIONS.WELCOME.body,
      actionUrl: '/'
    });
    notifications.push(welcome);

    // 2️⃣ Add address notification 
    const address = await createSystemNotification({
      userId: session.user.id,
      title: SYSTEM_NOTIFICATIONS.ADD_ADDRESS.title,
      body: SYSTEM_NOTIFICATIONS.ADD_ADDRESS.body,
      actionUrl: '/user/addresses'
    });
    notifications.push(address);

    // 3️⃣ Account activation notification
    const activate = await createSystemNotification({
      userId: session.user.id,
      title: SYSTEM_NOTIFICATIONS.ACTIVATE_ACCOUNT.title,
      body: SYSTEM_NOTIFICATIONS.ACTIVATE_ACCOUNT.body,
      actionUrl: '/auth/verify'
    });
    notifications.push(activate);

    return NextResponse.json({
      success: true,
      message: 'Created 3 test registration notifications',
      notifications: notifications.map(n => ({
        id: n.id,
        title: n.title,
        type: n.type
      }))
    });

  } catch (error) {
    console.error('❌ Test registration notifications failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create test notifications'
    }, { status: 500 });
  }
} 