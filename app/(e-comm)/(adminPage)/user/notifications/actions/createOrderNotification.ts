"use server";

import db from '@/lib/prisma';
import { pusherServer } from '@/lib/pusherServer';

interface CreateOrderNotificationParams {
  userId: string;
  orderId: string;
  orderNumber?: string;
  driverName?: string;
  title: string;
  body: string;
  actionUrl?: string;
}

/**
 * Creates a new ORDER notification and sends real-time update
 */
export async function createOrderNotification({
  userId,
  orderId,
  orderNumber,
  driverName,
  title,
  body,
  actionUrl
}: CreateOrderNotificationParams) {
  try {
    // Create notification in database
    const notification = await db.userNotification.create({
      data: {
        userId,
        title,
        body,
        type: 'ORDER',
        read: false,
        actionUrl: actionUrl || `/user/orders/${orderId}`
      }
    });

    // Send real-time notification via Pusher
    await pusherServer.trigger(
      `user-${userId}`, // Private channel for this user
      'new-notification',
      {
        id: notification.id,
        title: notification.title,
        body: notification.body,
        type: notification.type,
        read: notification.read,
        createdAt: notification.createdAt.toISOString(),
        actionUrl: notification.actionUrl,
        metadata: {
          orderId,
          orderNumber,
          driverName
        }
      }
    );

    console.log(`📱 Real-time notification sent to user ${userId}: ${title}`);

    return { success: true, notification };
  } catch (error) {
    console.error('Error creating ORDER notification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create notification' 
    };
  }
}

/**
 * Pre-built notification templates for common ORDER events
 */
export const ORDER_NOTIFICATION_TEMPLATES = {
  TRIP_STARTED: (orderNumber: string, driverName: string) => ({
    title: 'بدأ السائق في التوجه إليك 🚗',
    body: `السائق ${driverName} بدأ رحلة توصيل طلبك ${orderNumber}. سيصل إليك قريباً!`,
  }),
  
  DRIVER_ASSIGNED: (orderNumber: string, driverName: string) => ({
    title: 'تم تعيين سائق للتوصيل',
    body: `تم تعيين السائق ${driverName} لتوصيل طلبك ${orderNumber}. سيبدأ التوصيل قريباً.`,
  }),
  
  ORDER_DELIVERED: (orderNumber: string) => ({
    title: 'تم توصيل طلبك بنجاح ✅',
    body: `تم توصيل طلبك ${orderNumber} بنجاح. شكراً لاختيارك متجرنا!`,
  }),
  
  ORDER_CANCELLED: (orderNumber: string, reason?: string) => ({
    title: 'تم إلغاء طلبك',
    body: `تم إلغاء طلبك ${orderNumber}${reason ? ` - ${reason}` : ''}. سيتم استرداد المبلغ إلى محفظتك.`,
  })
}; 