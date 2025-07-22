'use server';

import {
  ORDER_STATUS,
} from '@/constant/order-status';

import { revalidatePath } from 'next/cache';
import db from '@/lib/prisma';
import { PushNotificationService } from '@/lib/push-notification-service';
import { pusherServer } from '@/lib/pusherServer';

export const cancelOrder = async (orderId: string, reson: string) => {
  await db.order.update({
    where: { id: orderId },
    data: { status: ORDER_STATUS.CANCELED, resonOfcancel: reson },
  });
  // Safely delete OrderInWay record if it exists
  const existingOrderInWay = await db.orderInWay.findUnique({
    where: { orderId: orderId },
  });
  
  if (existingOrderInWay) {
    await db.orderInWay.delete({
      where: { orderId: orderId },
    });
    console.log('✅ [CANCEL] OrderInWay record deleted successfully');
  } else {
    console.log('ℹ️ [CANCEL] OrderInWay record not found (order was never in transit)');
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    select: {
      orderNumber: true,
      driver: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!order) {
    return;
  }

  const { driver } = order;
  const driverId = driver?.id || '';
  const driverName = driver?.name || '';

  // Get all admin users
  const adminUsers = await db.user.findMany({
    where: { role: { in: ['ADMIN', 'MARKETER'] } },
    select: { id: true }
  });

  // Send Pusher notification to each admin dashboard
  console.log('📡 [CANCEL] Sending Pusher notifications to', adminUsers.length, 'admin users');
  await Promise.all(adminUsers.map(admin =>
    pusherServer.trigger(`admin-${admin.id}`, 'new-order', {
      orderId,
      orderNumber: order.orderNumber,
      reson,
      driverId,
      driverName,
      type: 'cancelled',
    })
  ));
  console.log('✅ [CANCEL] Pusher notifications sent successfully');

  // Send web-push notification to each admin (if subscription exists)
  await Promise.all(adminUsers.map(admin =>
    PushNotificationService.sendOrderNotification(
      admin.id,
      orderId,
      order.orderNumber,
      'cancelled',
      driverName
    )
  ));

  // Revalidate driver page to refresh data
  revalidatePath('/driver/showdata');
};