'use server';

import { revalidatePath } from 'next/cache';


import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

import { CustomerFormData } from '../helpers/customerSchema';

interface UpsertResult {
  ok: boolean;
  msg?: string;
  userId?: string;
}

export async function upsertCustomer(
  formData: CustomerFormData,
  mode: 'new' | 'update',
  userId?: string
): Promise<UpsertResult> {
  try {
    const {
      name,
      email,
      phone,
      addressLabel,
      district,
      street,
      buildingNumber,
      floor,
      apartmentNumber,
      landmark,
      deliveryInstructions,
      password,

    } = formData;

    if (mode === 'new') {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
        },
      });

      if (existingUser) {
        return {
          ok: false,
          msg: 'يوجد مستخدم بنفس البريد الإلكتروني أو رقم الهاتف',
        };
      }

      // Create new customer
      const newCustomer = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password,
          role: UserRole.CUSTOMER,
          // Create default address using Address Book system
          addresses: {
            create: {
              label: addressLabel,
              district,
              street,
              buildingNumber,
              floor,
              apartmentNumber,
              landmark,
              deliveryInstructions,

              isDefault: true,
            },
          },
        },
      });

      revalidatePath('/dashboard/management-users/customer');
      return {
        ok: true,
        msg: 'تم إضافة العميل بنجاح',
        userId: newCustomer.id,
      };
    } else {
      // Update existing customer
      if (!userId) {
        return {
          ok: false,
          msg: 'معرف المستخدم مطلوب للتحديث',
        };
      }

      // Check if email/phone is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return {
          ok: false,
          msg: 'يوجد مستخدم آخر بنفس البريد الإلكتروني أو رقم الهاتف',
        };
      }

      // Update customer
      const updatedCustomer = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          phone,
          password,
        },
      });

      // Update or create default address
      const existingAddress = await prisma.address.findFirst({
        where: { userId, isDefault: true },
      });

      if (existingAddress) {
        // Update existing default address
        await prisma.address.update({
          where: { id: existingAddress.id },
          data: {
            label: addressLabel,
            district,
            street,
            buildingNumber,
            floor,
            apartmentNumber,
            landmark,
            deliveryInstructions,
          },
        });
      } else {
        // Create new default address
        await prisma.address.create({
          data: {
            userId,
            label: addressLabel,
            district,
            street,
            buildingNumber,
            floor,
            apartmentNumber,
            landmark,
            deliveryInstructions,
            isDefault: true,
          },
        });
      }

      revalidatePath('/dashboard/management-users/customer');
      return {
        ok: true,
        msg: 'تم تحديث بيانات العميل بنجاح',
        userId: updatedCustomer.id,
      };
    }
  } catch (error) {
    console.error('Error upserting customer:', error);
    return {
      ok: false,
      msg: 'حدث خطأ أثناء حفظ بيانات العميل',
    };
  }
} 