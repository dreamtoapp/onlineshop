"use server";

import db from "@/lib/prisma";
import { checkIsLogin } from "@/lib/check-is-login";
import { getCart } from "@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions";
import { redirect } from "next/navigation";
import { z } from "zod";
import { pusherServer } from '@/lib/pusherServer';
import { OrderNumberGenerator } from "@/helpers/orderNumberGenerator";

// Updated validation schema for AddressBook system
const checkoutSchema = z.object({
  // Personal information (will update user profile if needed)
  fullName: z.string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم طويل جداً")
    .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\u0020-\u007E]+$/, "يرجى إدخال اسم صحيح"),
  
  phone: z.string()
    .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
    .max(15, "رقم الهاتف طويل جداً")
    .regex(/^[+]?[0-9\s\-\(\)]+$/, "رقم الهاتف غير صحيح")
    .transform(phone => phone.replace(/\s/g, '')), // Remove spaces
  
  // AddressBook reference
  addressId: z.string().min(1, "يرجى اختيار عنوان التوصيل"),
  
  // Delivery and payment options
  shiftId: z.string().min(1, "يرجى اختيار وقت التوصيل"),
  paymentMethod: z.enum(["CASH", "CARD", "WALLET"], {
    errorMap: () => ({ message: "يرجى اختيار طريقة الدفع" })
  }),
  
  // Terms acceptance
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "يجب الموافقة على الشروط والأحكام"
  })
});

export async function createDraftOrder(formData: FormData) {
  try {
    const user = await checkIsLogin();
    const cart = await getCart();
    
    if (!cart || !cart.items || cart.items.length === 0) {
      throw { code: 'REDIRECT_TO_HAPPYORDER', message: 'redirect to happyorder' };
    }

    // Ensure user is authenticated
    if (!user?.id) {
      redirect("/auth/login");
    }

    // Parse and validate all form data
    const validatedData = checkoutSchema.parse({
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      addressId: formData.get("addressId"),
      shiftId: formData.get("shiftId"),
      paymentMethod: formData.get("paymentMethod"),
      termsAccepted: formData.get("termsAccepted") === "true"
    });

    // Verify the address exists and belongs to the user
    const address = await db.address.findFirst({
      where: {
        id: validatedData.addressId,
        userId: user.id
      }
    });

    if (!address) {
      throw new Error("العنوان المحدد غير صحيح أو غير موجود");
    }

    // Update user information if it's different from what's stored
    const updateUserData: any = {};
    if (user.name !== validatedData.fullName) {
      updateUserData.name = validatedData.fullName;
    }
    if (user.phone !== validatedData.phone) {
      updateUserData.phone = validatedData.phone;
    }

    // Update user information if needed
    if (Object.keys(updateUserData).length > 0) {
      await db.user.update({
        where: { id: user.id },
        data: updateUserData
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
      0
    );
    
    const deliveryFee = subtotal >= 200 ? 0 : 25; // Free delivery over 200 SAR
    const taxRate = 0.15;
    const taxAmount = (subtotal + deliveryFee) * taxRate;
    const total = subtotal + deliveryFee + taxAmount;

    // Verify shift exists and is available
    const shift = await db.shift.findUnique({
      where: { id: validatedData.shiftId }
    });

    if (!shift) {
      throw new Error("وقت التوصيل المحدد غير متاح");
    }

    // Generate unique order number
    const orderNumber = await OrderNumberGenerator.generateOrderNumber();

    // Create order with new AddressBook system
    const order = await db.order.create({
      data: {
        orderNumber,
        customerId: user.id,
        addressId: validatedData.addressId, // Use addressId from AddressBook
        status: "PENDING",
        amount: total,
        paymentMethod: validatedData.paymentMethod,
        shiftId: validatedData.shiftId,
        deliveryInstructions: address.deliveryInstructions, // Use delivery instructions from address
        items: {
          createMany: {
            data: cart.items.map((ci) => ({
              productId: ci.productId,
              quantity: ci.quantity ?? 1,
              price: ci.product?.price ?? 0,
            })),
          },
        },
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true // Include address details
      }
    });

    // Pusher: Notify dashboard of new order
    try {
      await pusherServer.trigger('orders', 'new-order', {
        orderId: order.orderNumber,
        customer: validatedData.fullName,
        total,
        createdAt: order.createdAt,
      });
    } catch (err) {
      console.error('Pusher trigger failed:', err);
      // Optionally: fallback to DB notification or alert admin
    }

    // Clear cart after successful order creation
    // for (const item of cart.items) {
    //   await db.cartItem.delete({ where: { id: item.id } });
    // }
    // revalidateTag("cart");

    // Create notification for admin
    await db.userNotification.create({
      data: {
        title: 'طلب جديد',
        body: `طلب جديد #${order.orderNumber} بقيمة ${total.toFixed(2)} ر.س من ${validatedData.fullName}`,
        type: 'ORDER',
        read: false,
        userId: user.id,
      },
    });

    // Instead of redirect, return orderId
    return order.orderNumber;
    
  } catch (error) {
    console.error("Order creation error:", error);
    
    if (error instanceof z.ZodError) {
      // Return validation errors as an array for better UX
      const errorMessages = error.errors.map(err => err.message);
      throw { validationErrors: errorMessages };
    }
    
    throw new Error("حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى");
  }
} 