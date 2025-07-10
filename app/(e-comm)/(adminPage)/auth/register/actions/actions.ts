'use server';

import db from '@/lib/prisma';
import { registerSchema } from '../helpers/registerSchema';

export async function registerUser(_prevState: any, formData: FormData) {
  try {
    const validatedFields = registerSchema.safeParse({
      name: formData.get('name'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
      // Collect all error messages from Zod
      const errorMessages = validatedFields.error.errors.map(e => e.message);
      return {
        success: false,
        message: errorMessages.join('، '), // Join with Arabic comma
      };
    }

    const { name, phone, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'رقم الهاتف مسجل بالفعل. إذا كنت تملك حساباً، يرجى تسجيل الدخول.',
      };
    }

    // Create new user
    await db.user.create({
      data: {
        name,
        phone,
        password,
        role: 'CUSTOMER',
      },
    });

    // Return phone and password for client-side signIn
    return {
      success: true,
      redirectTo: '/user/addresses?welcome=true&message=أضف عنوانك الأول لتسهيل عملية التوصيل',
      phone,
      password,
    };
    
  } catch (error: any) {
    // Enhance error feedback for known DB errors
    if (error.code === 'P2002') {
      // Prisma unique constraint failed
      return {
        success: false,
        message: 'رقم الهاتف مستخدم بالفعل. يرجى استخدام رقم آخر أو تسجيل الدخول.',
      };
    }
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'حدث خطأ غير متوقع أثناء التسجيل. يرجى المحاولة لاحقاً أو التواصل مع الدعم.',
    };
  }
}
