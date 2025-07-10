'use server';
import { cacheData } from '@/lib/cache';
import db from '@/lib/prisma';
import { Order } from '@/types/cardType';

// Define the argument type for clarity
type FetchOrdersArgs = {
  status?: string;
  page?: number;
  pageSize?: number;
};

// Cached fetchOrdersAction
export const fetchOrdersAction = cacheData<
  [FetchOrdersArgs?], // Args type: An array containing zero or one FetchOrdersArgs object
  Order[], // Return type
  (args?: FetchOrdersArgs) => Promise<Order[]> // Update T to reflect optional arg
>(
  // Modify implementation to accept optional arg and handle undefined
  async (args?: FetchOrdersArgs) => {
    const { status, page = 1, pageSize = 10 } = args || {}; // Handle undefined args before destructuring
    try {
      // Create a where clause for status filtering
      let whereClause = {};

      if (status) {
        // Use the status directly as a string value
        whereClause = { status };
      }

      const orders = await db.order.findMany({
        where: whereClause,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          status: true,
          isTripStart: true,
          resonOfcancel: true,
          amount: true,
          createdAt: true,
          updatedAt: true,
          customerId: true,
          shiftId: true,
          driverId: true,
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
          shift: {
            select: {
              id: true,
              name: true,
            },
          },
          customer: {
            select: {
              id: true,
              phone: true,
              name: true,
              address: true,
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
        },
        orderBy: { updatedAt: 'desc' },
      });

      const transformedOrders = orders.map(order => {
        console.log("Order before transformation:", order);
        const transformedOrder: Order = {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          isTripStart: order.isTripStart,
          // resonOfcancel: order.resonOfcancel,
          amount: order.amount,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          // paymentMethod: null,
          // deliveredAt: null,
          items: order.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            product: item.product ? {
              name: item.product.name,
              price: item.product.price,
              images: [], // Assuming no images are available here
            } : { name: '', price: 0, images: [] }
          })),
          customer: {
            phone: order.customer?.phone || "",
            name: order.customer?.name || "",
            email: "", // Assuming no email is available here
            address: order.customer?.address || undefined,
            latitude: order.customer?.latitude || "",
            longitude: order.customer?.longitude || ""
          },
          driver: order.driver ? {
            id: order.driver.id,
            name: order.driver.name,
            phone: order.driver.phone
          } : null,
          orderInWay: null, // Assuming no data for orderInWay
          driverId: order.driverId || null,
          // shiftId: order.shiftId
        };
        console.log("Transformed order:", transformedOrder);
        return transformedOrder;
      });

      console.log("Transformed orders:", transformedOrders);
      return transformedOrders as any;
    } catch (error) {
      throw new Error('Failed to fetch orders.');
    }
  },
  ['fetchOrders'], // Cache key
  { revalidate: 3600 },
);
