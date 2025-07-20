'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

import { AdminFormData } from '../helpers/adminSchema';

interface UpsertResult {
  ok: boolean;
  msg?: string;
  adminId?: string;
}

export async function upsertAdmin(
  formData: AdminFormData,
  mode: 'new' | 'update',
  adminId?: string
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

      latitude,
      longitude,

    } = formData;

    if (mode === 'new') {
      // Check if admin already exists
      const existingAdmin = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
        },
      });

      if (existingAdmin) {
        return {
          ok: false,
          msg: 'يوجد مشرف بنفس البريد الإلكتروني أو رقم الهاتف',
        };
      }

      // Create new admin
      const newAdmin = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password,
          role: UserRole.ADMIN,
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
              latitude,
              longitude,
              isDefault: true,
            },
          },
        },
      });

      revalidatePath('/dashboard/management-users/admin');
      return {
        ok: true,
        msg: 'تم إضافة المشرف بنجاح',
        adminId: newAdmin.id,
      };
    } else {
      // Update existing admin
      if (!adminId) {
        return {
          ok: false,
          msg: 'معرف المشرف مطلوب للتحديث',
        };
      }

      // Check if email/phone is already taken by another user
      const existingAdmin = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
          NOT: {
            id: adminId,
          },
        },
      });

      if (existingAdmin) {
        return {
          ok: false,
          msg: 'يوجد مشرف آخر بنفس البريد الإلكتروني أو رقم الهاتف',
        };
      }

      // Update admin
      const updatedAdmin = await prisma.user.update({
        where: { id: adminId },
        data: {
          name,
          email,
          phone,
          password,
        },
      });

      // Update or create default address
      const existingAddress = await prisma.address.findFirst({
        where: { userId: adminId, isDefault: true },
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
            latitude,
            longitude,
          },
        });
      } else {
        // Create new default address
        await prisma.address.create({
          data: {
            userId: adminId,
            label: addressLabel,
            district,
            street,
            buildingNumber,
            floor,
            apartmentNumber,
            landmark,
            deliveryInstructions,
            latitude,
            longitude,
            isDefault: true,
          },
        });
      }

      revalidatePath('/dashboard/management-users/admin');
      return {
        ok: true,
        msg: 'تم تحديث بيانات المشرف بنجاح',
        adminId: updatedAdmin.id,
      };
    }
  } catch (error) {
    console.error('Error upserting admin:', error);
    return {
      ok: false,
      msg: 'حدث خطأ أثناء حفظ بيانات المشرف',
    };
  }
} 