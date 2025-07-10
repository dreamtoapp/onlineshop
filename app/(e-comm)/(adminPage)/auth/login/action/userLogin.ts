'use server';

import { signIn } from '../../../../../../auth';
import db from '../../../../../../lib/prisma';

export const userLogin = async (
  _state: { success: boolean; message: string } | null,
  formData: FormData
): Promise<{ success: boolean; message: string } | null> => {
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  const redirect = formData.get('redirect') as string || '/';
  
  // Validate input data
  if (!phone || !password) {
    return { success: false, message: 'جميع الحقول مطلوبة' };
  }

  // Check if the user already exists
  if (!phone) return null;
  const existingUser = await db.user.findUnique({ where: { phone } });
  if (!existingUser) {
    return { success: false, message: 'المعلومات غير صحيحة' };
  }

  if (existingUser.password !== password) {
    return { success: false, message: 'المعلومات غير صحيحة' };
  }

  await signIn('credentials', {
    phone,
    password,
    redirectTo: redirect,
  });

  return { success: true, message: 'تم تسجيل الدخول بنجاح' };
};
