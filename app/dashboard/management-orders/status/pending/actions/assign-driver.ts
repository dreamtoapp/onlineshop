'use server';

import { revalidatePath } from 'next/cache';
import { OrderStatus } from '@prisma/client';

import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function assignDriver(orderId: string, driverId: string) {


  try {
    const session = await auth();

    if (!session?.user) {
      return {
        state: 'error',
        message: 'You must be logged in to assign a driver.',
      };
    }

    if (!orderId || !driverId) {
      return {
        state: 'error',
        message: 'Missing order or driver ID.',
      };
    }

    // Check if the driver (user) exists and has role 'DRIVER'
    const driver = await db.user.findUnique({ where: { id: driverId } });
    if (!driver || driver.role !== 'DRIVER') {
      return {
        state: 'error',
        message: 'Driver (user) not found or not a driver.',
      };
    }
    // Update the order with the driver ID
    await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        driverId: driverId,
        status: OrderStatus.ASSIGNED,
      },
    });

    revalidatePath('/dashboard/orders-management/status/pending');
    return {
      state: 'success',
      message: 'Driver assigned successfully!',
    };
  } catch (error: any) {
    console.error('Error assigning driver:', error);
    return {
      state: 'error',
      message: error.message || 'Failed to assign driver.',
    };
  }
}

export async function unassignDriverFromOrder(orderId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لإلغاء تعيين السائق',
      };
    }

    if (!orderId) {
      return {
        success: false,
        message: 'معرف الطلب مطلوب',
      };
    }

    // Check if the order exists and is assigned
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { driver: true }
    });

    if (!order) {
      return {
        success: false,
        message: 'الطلب غير موجود',
      };
    }

    console.log('Order found:', {
      id: order.id,
      status: order.status,
      driverId: order.driverId,
      driverName: order.driver?.name
    });

    if (order.status !== OrderStatus.ASSIGNED) {
      return {
        success: false,
        message: `لا يمكن إلغاء تعيين طلب بحالة: ${order.status}. يجب أن تكون الحالة: ASSIGNED`,
      };
    }

    // Update the order to remove driver and set status back to PENDING
    await db.order.update({
      where: { id: orderId },
      data: {
        driverId: null,
        status: OrderStatus.PENDING,
      },
    });

    // Revalidate the pending orders page to reflect changes
    revalidatePath('/dashboard/management-orders/status/pending');

    return {
      success: true,
      message: `تم إلغاء تعيين السائق ${order.driver?.name || ''} بنجاح`,
    };

  } catch (error: any) {
    console.error('Error unassigning driver:', error);
    return {
      success: false,
      message: error.message || 'فشل في إلغاء تعيين السائق',
    };
  }
}
