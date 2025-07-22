'use server';

import {
  ORDER_STATUS,
} from '@/constant/order-status';

import db from '@/lib/prisma';
import { createOrderNotification } from '@/app/(e-comm)/(adminPage)/user/notifications/actions/createOrderNotification';
import { ORDER_NOTIFICATION_TEMPLATES } from '@/app/(e-comm)/(adminPage)/user/notifications/types/notificationTypes';

export const deleverOrder = async (orderId: string) => {
  const existingOrder = await db.order.update({
    where: { id: orderId },
    data: { status: ORDER_STATUS.DELIVERED },
  });
  await db.orderInWay.delete({
    where: { orderId: orderId },
  });
  // 🔔 CREATE NOTIFICATION FOR CUSTOMER
  try {
    const { PushNotificationService } = await import('@/lib/push-notification-service');
    
    const template = ORDER_NOTIFICATION_TEMPLATES.ORDER_DELIVERED(
      existingOrder.orderNumber || `#${orderId.slice(-6)}`
    );
    
    // Create in-app notification
    await createOrderNotification({
      userId: existingOrder.customerId,
      orderId: orderId,
      orderNumber: existingOrder.orderNumber || orderId.slice(-6),
      ...template
    });
    
    // Send push notification
    await PushNotificationService.sendOrderNotification(
      existingOrder.customerId,
      orderId,
      existingOrder.orderNumber || `#${orderId.slice(-6)}`,
      'delivered'
    );
    
    console.log(`✅ Delivery notifications sent for order ${existingOrder.orderNumber}`);
  } catch (error) {
    console.error('Failed to send delivery notifications:', error);
  }
};