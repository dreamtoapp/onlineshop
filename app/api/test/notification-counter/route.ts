import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSystemNotification } from '@/helpers/systemNotifications';
import { getUnreadNotificationCount } from '@/app/(e-comm)/(adminPage)/user/notifications/actions/getUserNotifications';

// 🧪 Test endpoint to verify notification counter flow
export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Must be logged in to test notifications'
      }, { status: 401 });
    }

    // Get initial count
    const initialCount = await getUnreadNotificationCount(session.user.id);

    // Create a test notification
    const notification = await createSystemNotification({
      userId: session.user.id,
      title: '🧪 اختبار العداد',
      body: 'إشعار تجريبي للتأكد من تحديث العداد في الرأس',
      actionUrl: '/user/notifications'
    });

    // Get new count
    const newCount = await getUnreadNotificationCount(session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Test notification created for counter verification',
      data: {
        notificationId: notification.id,
        initialCount,
        newCount,
        increment: newCount - initialCount
      }
    });

  } catch (error) {
    console.error('❌ Counter test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test notification counter'
    }, { status: 500 });
  }
} 