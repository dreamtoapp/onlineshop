import { createOrderNotification } from '@/app/(e-comm)/(adminPage)/user/notifications/actions/createOrderNotification';
import { ORDER_NOTIFICATION_TEMPLATES } from '@/app/(e-comm)/(adminPage)/user/notifications/types/notificationTypes';
import { PushNotificationService } from '@/lib/push-notification-service';

import { OrderNotificationType } from '@/app/(e-comm)/(adminPage)/user/notifications/types/notificationTypes';

interface NotificationData {
  userId: string;
  orderId: string;
  orderNumber: string;
  driverName?: string;
  notificationType: OrderNotificationType;
}

interface NotificationResult {
  success: boolean;
  inAppSuccess: boolean;
  pushSuccess: boolean;
  error?: string;
  details?: {
    inAppResult?: any;
    pushResult?: boolean;
  };
}

/**
 * Stable, reusable notification helper
 * This function handles both in-app and push notifications with proper error handling
 */
export async function sendOrderNotification(data: NotificationData): Promise<NotificationResult> {
  const { userId, orderId, orderNumber, driverName, notificationType } = data;
  
  console.log('🚀 [NOTIFICATION HELPER] Starting notification process...');
  console.log('📋 [NOTIFICATION HELPER] Notification details:', {
    userId,
    orderId,
    orderNumber,
    driverName,
    notificationType
  });

  let inAppSuccess = false;
  let pushSuccess = false;
  let inAppResult: any = null;
  let pushResult: boolean = false;
  let error: string | undefined;

  try {
    // Step 1: Create template based on notification type
    let template;
    switch (notificationType) {
      case 'order_shipped':
        template = ORDER_NOTIFICATION_TEMPLATES.ORDER_SHIPPED(orderNumber, driverName);
        break;
      case 'trip_started':
        template = ORDER_NOTIFICATION_TEMPLATES.TRIP_STARTED?.(orderNumber, driverName) || {
          title: '🚗 بدأ السائق رحلته',
          body: `السائق ${driverName || 'غير معروف'} بدأ توصيل طلبك رقم ${orderNumber}`
        };
        break;
      case 'order_delivered':
        template = ORDER_NOTIFICATION_TEMPLATES.ORDER_DELIVERED?.(orderNumber) || {
          title: '✅ تم توصيل طلبك',
          body: `تم توصيل طلبك رقم ${orderNumber} بنجاح!`
        };
        break;
      default:
        throw new Error(`Unknown notification type: ${notificationType}`);
    }

    console.log('📝 [NOTIFICATION HELPER] Template created:', template);

    // Step 2: Send in-app notification (fallback)
    console.log('📱 [NOTIFICATION HELPER] Creating in-app notification...');
    try {
      inAppResult = await createOrderNotification({
        userId,
        orderId,
        orderNumber,
        driverName,
        ...template
      });
      
      inAppSuccess = inAppResult.success;
      console.log('📱 [NOTIFICATION HELPER] In-app notification result:', inAppResult);
    } catch (inAppError) {
      console.error('❌ [NOTIFICATION HELPER] In-app notification failed:', inAppError);
      inAppSuccess = false;
    }

    // Step 3: Send push notification
    console.log('🔔 [NOTIFICATION HELPER] Sending push notification...');
    try {
      // Map notification type to push service type
      const pushNotificationType = notificationType === 'order_delivered' ? 'delivered' : notificationType;
      
      pushResult = await PushNotificationService.sendOrderNotification(
        userId,
        orderId,
        orderNumber,
        pushNotificationType as any,
        driverName
      );
      
      pushSuccess = pushResult;
      console.log('🔔 [NOTIFICATION HELPER] Push notification result:', pushResult);
    } catch (pushError) {
      console.error('❌ [NOTIFICATION HELPER] Push notification failed:', pushError);
      pushSuccess = false;
    }

    // Step 4: Determine overall success
    const overallSuccess = inAppSuccess || pushSuccess; // Success if at least one works
    
    if (overallSuccess) {
      console.log(`✅ [NOTIFICATION HELPER] Notification sent successfully for ${notificationType}`);
    } else {
      error = 'Both in-app and push notifications failed';
      console.error('❌ [NOTIFICATION HELPER] All notification methods failed');
    }

    return {
      success: overallSuccess,
      inAppSuccess,
      pushSuccess,
      error,
      details: {
        inAppResult,
        pushResult
      }
    };

  } catch (mainError) {
    console.error('❌ [NOTIFICATION HELPER] Critical error in notification process:', mainError);
    return {
      success: false,
      inAppSuccess: false,
      pushSuccess: false,
      error: mainError instanceof Error ? mainError.message : 'Unknown error',
      details: {
        inAppResult,
        pushResult
      }
    };
  }
}

/**
 * Quick test function to verify notification system is working
 */
export async function testNotificationSystem(userId: string): Promise<NotificationResult> {
  console.log('🧪 [NOTIFICATION HELPER] Testing notification system...');
  
  return await sendOrderNotification({
    userId,
    orderId: 'test-order-id',
    orderNumber: 'TEST-NOTIFICATION',
    driverName: 'Test Driver',
    notificationType: 'order_shipped'
  });
} 