import {
  ORDER_STATUS,
} from '@/constant/order-status';

import db from '@/lib/prisma';

export async function getOrderCount(driverId: string) {
  try {
    const [inWayCount, canceledCount, deliveredCount] = await Promise.all([
      // عدد الطلبات في حالة التوصيل (InWay)
      db.order.count({
        where: {
          driverId,
          status: ORDER_STATUS.IN_TRANSIT,
        },
      }),

      // عدد الطلبات الملغاة (canceled)
      db.order.count({
        where: {
          driverId,
          status: ORDER_STATUS.CANCELED,
        },
      }),

      // عدد الطلبات المكتملة (delivered)
      db.order.count({
        where: {
          driverId,
          status: ORDER_STATUS.DELIVERED,
        },
      }),
    ]);

    return {
      counts: {
        inWay: inWayCount,
        canceled: canceledCount,
        delivered: deliveredCount,
      },
    };
  } catch (error) {
    console.error('Database error:', error);
    return { error: 'فشل في جلب البيانات. حاول مرة أخرى.' };
  }
}