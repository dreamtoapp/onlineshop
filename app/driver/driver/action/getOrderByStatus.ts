'use server';

import {
  OrderStatus,
} from '@/constant/order-status';

import db from '../../../../lib/prisma';

export async function getOrderByStatus(driverId: string, status: OrderStatus) {
  try {
    const ordersToShip = await db.order.findMany({
      where: { driverId, status },
      select: {
        id: true,
        orderNumber: true,
        customerId: true,
        status: true,
        amount: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            productId: true,
            quantity: true,
            price: true,
          },
        },
        customer: {
          select: {
            phone: true,
            name: true,
          },
        },
        address: {
          select: {
            label: true,
            district: true,
            street: true,
            buildingNumber: true,
            floor: true,
            apartmentNumber: true,
            landmark: true,
            latitude: true,
            longitude: true,
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        shift: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return { ordersToShip };
  } catch (error) {
    console.error('Database error:', error);
    return { error: 'فشل في جلب البيانات. حاول مرة أخرى.' };
  }
}