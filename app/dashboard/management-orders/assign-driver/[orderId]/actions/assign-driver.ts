'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

interface AssignDriverParams {
  orderId: string;
  driverId: string;
  estimatedDeliveryTime?: number; // in minutes
  priority?: 'normal' | 'high' | 'urgent';
  notes?: string;
}

interface AssignDriverResult {
  success: boolean;
  message: string;
  data?: {
    orderId: string;
    driverId: string;
    estimatedDeliveryTime: number;
    assignedAt: Date;
  };
  error?: string;
}

export async function assignDriverToOrder({
  orderId,
  driverId,
  estimatedDeliveryTime = 45,
  priority = 'normal',
  notes
}: AssignDriverParams): Promise<AssignDriverResult> {
  // Note: priority and notes are not currently used in the implementation
  // They are kept for future feature development
  void priority;
  void notes;
  try {
    // Validate inputs
    if (!orderId || !driverId) {
      return {
        success: false,
        message: 'معرف الطلب أو السائق مطلوب',
        error: 'MISSING_PARAMETERS'
      };
    }

    // Check if order exists and is assignable
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        driver: true,
        customer: {
          select: { name: true, phone: true }
        }
      }
    });

    if (!order) {
      return {
        success: false,
        message: 'الطلب غير موجود',
        error: 'ORDER_NOT_FOUND'
      };
    }

    // Debug logging
    console.log('Assignment attempt:', {
      orderId,
      orderStatus: order.status,
      currentDriverId: order.driverId,
      currentDriverName: order.driver?.name,
      newDriverId: driverId,
      orderNumber: order.orderNumber
    });

    if (order.driver && order.driver.id === driverId) {
      return {
        success: false,
        message: `الطلب مُعيّن بالفعل لنفس السائق ${order.driver.name || 'غير معروف'}`,
        error: 'ORDER_ALREADY_ASSIGNED_TO_SAME_DRIVER'
      };
    }

    // Allow reassignment if order is assigned to a different driver
    if (order.driver && order.driver.id !== driverId) {
      console.log(`Reassigning order ${orderId} from driver ${order.driver.name} (${order.driver.id}) to new driver ${driverId}`);
    }

    if (!['PENDING', 'ASSIGNED'].includes(order.status)) {
      return {
        success: false,
        message: `لا يمكن تعيين سائق لهذا الطلب. الحالة الحالية: ${order.status}`,
        error: 'INVALID_ORDER_STATUS'
      };
    }

    // Check if driver exists and is available
    const driver = await prisma.user.findUnique({
      where: { 
        id: driverId,
        role: 'DRIVER'
      },
      include: {
        driverOrders: {
          where: {
            status: {
              in: [OrderStatus.ASSIGNED, OrderStatus.IN_TRANSIT]
            },
            // Exclude current order if it's being reassigned
            id: {
              not: orderId
            }
          }
        }
      }
    });

    if (!driver) {
      return {
        success: false,
        message: 'السائق غير موجود أو غير نشط',
        error: 'DRIVER_NOT_FOUND'
      };
    }

    // Check if driver is active
    if (!driver.isActive) {
      return {
        success: false,
        message: 'السائق غير نشط حالياً',
        error: 'DRIVER_INACTIVE'
      };
    }

    // Check driver capacity (configurable max orders)
    const maxOrders = 5; // Increased from 3 to 5 orders per driver
    
    // Debug: Log current driver orders for troubleshooting
    console.log(`Driver ${driver.name} (${driverId}) current orders:`, {
      totalOrders: driver.driverOrders.length,
      orderIds: driver.driverOrders.map(o => ({ id: o.id, status: o.status, orderNumber: o.orderNumber })),
      maxAllowed: maxOrders
    });
    
    if (driver.driverOrders.length >= maxOrders) {
      return {
        success: false,
        message: `السائق وصل للحد الأقصى من الطلبات (${maxOrders}). الطلبات الحالية: ${driver.driverOrders.length}`,
        error: 'DRIVER_AT_CAPACITY'
      };
    }

    // Calculate estimated delivery time
    const currentTime = new Date();

    // Perform the assignment in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update order with driver assignment
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          driverId: driverId,
          status: OrderStatus.ASSIGNED,
          // Note: estimatedDeliveryTime, assignedAt, priority, driverNotes not in schema
          updatedAt: currentTime,
        }
      });

      // Create assignment notification/log if needed
      // Note: orderStatusHistory table not found in schema
      // You may need to create a different logging mechanism

      return updatedOrder;
    });

    // TODO: Send notifications to driver and customer
    // await sendDriverNotification(driverId, orderId);
    // await sendCustomerNotification(order.customer?.phone, order.orderNumber);

    // Revalidate relevant pages
    revalidatePath('/dashboard/management-orders');
    revalidatePath(`/dashboard/management-orders/status/pending`);
    revalidatePath(`/dashboard/management-orders/assign-driver/${orderId}`);
    revalidatePath('/dashboard/management-orders/status/in-way');
    revalidatePath('/dashboard/management-orders/status/delivered');
    revalidatePath('/dashboard/management-orders/status/canceled');

    return {
      success: true,
      message: `تم تعيين السائق ${driver.name || 'غير معروف'} بنجاح`,
      data: {
        orderId: result.id,
        driverId: driverId,
        estimatedDeliveryTime: estimatedDeliveryTime,
        assignedAt: currentTime,
      }
    };

  } catch (error) {
    console.error('Error assigning driver to order:', error);
    
    return {
      success: false,
      message: 'حدث خطأ أثناء تعيين السائق',
      error: 'ASSIGNMENT_FAILED'
    };
  }
}

export async function unassignDriverFromOrder(orderId: string): Promise<AssignDriverResult> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { driver: true }
    });

    if (!order) {
      return {
        success: false,
        message: 'الطلب غير موجود',
        error: 'ORDER_NOT_FOUND'
      };
    }

    if (!order.driver) {
      return {
        success: false,
        message: 'الطلب غير مُعيّن لأي سائق',
        error: 'ORDER_NOT_ASSIGNED'
      };
    }

    // Perform unassignment in transaction
    await prisma.$transaction(async (tx) => {
      // Update order
      await tx.order.update({
        where: { id: orderId },
        data: {
          driverId: null,
          status: OrderStatus.PENDING,
          updatedAt: new Date(),
        }
      });

      // Log the unassignment if needed
      // Note: orderStatusHistory table not found in schema
    });

    revalidatePath('/dashboard/management-orders');
    revalidatePath(`/dashboard/management-orders/status/pending`);

    return {
      success: true,
      message: 'تم إلغاء تعيين السائق بنجاح'
    };

  } catch (error) {
    console.error('Error unassigning driver:', error);
    
    return {
      success: false,
      message: 'حدث خطأ أثناء إلغاء تعيين السائق',
      error: 'UNASSIGNMENT_FAILED'
    };
  }
}

export async function bulkAssignDriver({
  orderIds,
  driverId,
  priority = 'normal'
}: {
  orderIds: string[];
  driverId: string;
  priority?: 'normal' | 'high' | 'urgent';
}): Promise<AssignDriverResult> {
  try {
    if (!orderIds.length || !driverId) {
      return {
        success: false,
        message: 'معرفات الطلبات أو السائق مطلوبة',
        error: 'MISSING_PARAMETERS'
      };
    }

    const driver = await prisma.user.findUnique({
      where: { 
        id: driverId,
        role: 'DRIVER'
      },
      include: {
        driverOrders: {
          where: {
            status: {
              in: [OrderStatus.ASSIGNED, OrderStatus.IN_TRANSIT]
            }
          }
        }
      }
    });

    if (!driver) {
      return {
        success: false,
        message: 'السائق غير موجود أو غير نشط',
        error: 'DRIVER_NOT_FOUND'
      };
    }

    // Check if driver is active
    if (!driver.isActive) {
      return {
        success: false,
        message: 'السائق غير نشط حالياً',
        error: 'DRIVER_INACTIVE'
      };
    }

    const maxOrders = 5;
    const currentOrders = driver.driverOrders.length;
    
    if (currentOrders + orderIds.length > maxOrders) {
      return {
        success: false,
        message: `السائق لا يمكنه تحمل ${orderIds.length} طلبات إضافية. الحد الأقصى: ${maxOrders}`,
        error: 'DRIVER_CAPACITY_EXCEEDED'
      };
    }

    let successCount = 0;
    const errors: string[] = [];

    // Process each order
    for (const orderId of orderIds) {
      const result = await assignDriverToOrder({
        orderId,
        driverId,
        priority,
        estimatedDeliveryTime: 45
      });

      if (result.success) {
        successCount++;
      } else {
        errors.push(`${orderId}: ${result.message}`);
      }
    }

    if (successCount === orderIds.length) {
      redirect('/dashboard/management-orders');
    }

    return {
      success: successCount > 0,
      message: `تم تعيين ${successCount} من ${orderIds.length} طلبات بنجاح`,
      error: errors.length > 0 ? errors.join('; ') : undefined
    };

  } catch (error) {
    console.error('Error in bulk assignment:', error);
    
    return {
      success: false,
      message: 'حدث خطأ أثناء التعيين المجمع',
      error: 'BULK_ASSIGNMENT_FAILED'
    };
  }
} 