'use server';

import {
  ORDER_STATUS,
} from '@/constant/order-status';

import db from '@/lib/prisma';

export const deleverOrder = async (orderId: string) => {
  await db.order.update({
    where: { id: orderId },
    data: { status: ORDER_STATUS.DELIVERED },
  });
  await db.orderInWay.delete({
    where: { orderId: orderId },
  });
};