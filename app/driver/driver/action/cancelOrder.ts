'use server';

import {
  ORDER_STATUS,
} from '@/constant/order-status';

import db from '@/lib/prisma';

export const cancelOrder = async (orderId: string, reson: string) => {
  await db.order.update({
    where: { id: orderId },
    data: { status: ORDER_STATUS.CANCELED, resonOfcancel: reson },
  });
  await db.orderInWay.delete({
    where: { orderId: orderId },
  });
};