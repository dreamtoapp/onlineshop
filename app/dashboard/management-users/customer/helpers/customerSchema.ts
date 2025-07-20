import { z } from 'zod';

// Customer-specific validation schema
export const CustomerSchema = z.object({
  name: z.string().trim().nonempty('الاسم مطلوب'),
  email: z.string().trim().email('صيغة البريد الإلكتروني غير صحيحة'),
  phone: z
    .string()
    .trim()
    .nonempty('رقم الهاتف مطلوب')
    .regex(/^\d{10}$/, 'رقم الهاتف يجب أن يحتوي على 10 أرقام فقط'),
  // Address fields - using Address Book system
  addressLabel: z.string().trim().nonempty('نوع العنوان مطلوب'),
  district: z.string().trim().nonempty('الحي مطلوب'),
  street: z.string().trim().nonempty('الشارع مطلوب'),
  buildingNumber: z.string().trim().nonempty('رقم المبنى مطلوب'),
  floor: z.string().optional(),
  apartmentNumber: z.string().optional(),
  landmark: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export type CustomerFormData = z.infer<typeof CustomerSchema>; 