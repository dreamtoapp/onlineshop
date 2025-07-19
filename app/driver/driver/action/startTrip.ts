'use server';
import db from '@/lib/prisma';
import { OrderInWay } from '@prisma/client';
import { createOrderNotification, ORDER_NOTIFICATION_TEMPLATES } from '@/app/(e-comm)/(adminPage)/user/notifications/actions/createOrderNotification';

type Result<T = OrderInWay> =
  | { success: true; data: T }
  | { success: false; error: string };

const isValidId = (id: string) => /^[0-9a-f]{24}$/.test(id);

export const startTrip = async (
  orderId: string,
  driverId: string,
  latitude: string,
  longitude: string,
): Promise<Result> => {
  if (!isValidId(orderId) || !isValidId(driverId)) {
    return { success: false, error: 'Invalid ID format' };
  }

  try {
    // Check if driver already has an active trip
    const existingTrip = await db.orderInWay.findFirst({
      where: { driverId },
    });

    if (existingTrip) {
      return {
        success: false,
        error: 'يوجد رحلة نشطة بالفعل. يجب إغلاق الرحلة الحالية أولاً',
      };
    }

    // Get order and customer details for notification
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true, // Customer info (User who placed the order)
        driver: true // Driver info (User who is the driver)
      }
    });

    if (!order) {
      return { success: false, error: 'الطلب غير موجود' };
    }

    if (!order.driver) {
      return { success: false, error: 'لم يتم تعيين سائق لهذا الطلب' };
    }

    // Create trip record
    const record = await db.orderInWay.create({
      data: {
        orderId,
        driverId,
        latitude,
        longitude,
        orderNumber: order.orderNumber, // Add order number to track
      },
    });

    // Update order status to IN_TRANSIT when trip starts
    await db.order.update({
      where: { id: orderId },
      data: { status: 'IN_TRANSIT' },
    });

    // 🚨 CREATE REAL-TIME NOTIFICATION FOR CUSTOMER
    if (order.customerId) {
      try {
        const { PushNotificationService } = await import('@/lib/push-notification-service');
        
        const notificationTemplate = ORDER_NOTIFICATION_TEMPLATES.TRIP_STARTED(
          order.orderNumber || `#${orderId.slice(-6)}`,
          order.driver?.name || 'السائق'
        );

        // Create in-app notification
        const notificationResult = await createOrderNotification({
          userId: order.customerId,
          orderId: order.id,
          orderNumber: order.orderNumber || undefined,
          driverName: order.driver?.name ?? undefined,
          title: notificationTemplate.title,
          body: notificationTemplate.body,
          actionUrl: `/user/orders/${order.id}/track`
        });

        // Send push notification
        await PushNotificationService.sendOrderNotification(
          order.customerId,
          order.id,
          order.orderNumber || `#${orderId.slice(-6)}`,
          'trip_started',
          order.driver?.name || undefined
        );

        if (!notificationResult.success) {
          console.error('Failed to send trip start notification:', notificationResult.error);
          // Don't fail the trip start if notification fails
        } else {
          console.log(`✅ Trip start notifications sent to user ${order.customerId}`);
        }
      } catch (error) {
        console.error('Failed to send trip start notifications:', error);
        // Don't fail the trip start if notification fails
      }
    }

    console.log(`🚗 Trip started: Driver ${order.driver?.name || 'Unknown'} began trip for order ${order.orderNumber}`);

    return { success: true, data: record };
  } catch (error) {
    console.error('Error starting trip:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'فشل بدء الرحلة'
    };
  }
};

export const updateCoordinates = async (
  orderId: string,
  driverId: string,
  latitude: string,
  longitude: string,
): Promise<Result> => {
  if (!isValidId(orderId) || !isValidId(driverId)) {
    return { success: false, error: 'Invalid ID format' };
  }

  try {
    const updated = await db.orderInWay.update({
      where: { orderId_driverId: { orderId, driverId } },
      data: { latitude, longitude },
    });

    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Update failed'
    };
  }
};
