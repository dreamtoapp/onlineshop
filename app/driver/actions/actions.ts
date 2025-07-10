'use server';

import db from '@/lib/prisma';
import { UserRole } from '@prisma/client';

interface Driver {
  id: string;
  name: string;
  phone: string;
}

// Authenticate driver using User table with role check
export async function authenticateDriver(
  formData: FormData,
): Promise<{ driver?: Driver; error?: string }> {
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  try {
    const driver = await db.user.findFirst({
      where: { phone, password, role: UserRole.DRIVER },
      select: { id: true, name: true, phone: true },
    });

    if (!driver) {
      return { error: 'رقم الجوال أو كلمة المرور غير صحيحة' };
    }

    // Ensure name and phone are strings (not null)
    return {
      driver: {
        id: driver.id,
        name: driver.name ?? '',
        phone: driver.phone ?? '',
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'فشل التحقق. الرجاء المحاولة لاحقًا.' };
  }
}

export async function loginDriver(phone: string, password: string) {
  try {
    const driver = await db.user.findFirst({
      where: { phone, password, role: UserRole.DRIVER },
    });

    if (!driver) {
      throw new Error('Invalid credentials');
    }

    return driver;
  } catch (error) {
    console.error('Error logging in driver:', error);
    throw error;
  }
}
