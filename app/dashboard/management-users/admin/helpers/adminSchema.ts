import { z } from 'zod';

// Admin-specific validation schema
export const AdminSchema = z.object({
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
  // Admin-specific fields
  adminLevel: z.enum(['SUPER_ADMIN', 'ADMIN', 'MODERATOR']),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean(),
  // Location fields
  sharedLocationLink: z.string().url('رابط غير صالح').optional().or(z.literal('')),
  latitude: z
    .string()
    .trim()
    .regex(
      /^-?([0-8]?[0-9](\.\d+)?|90(\.0+)?)$/,
      'صيغة خط العرض غير صحيحة'
    )
    .optional()
    .or(z.literal('')),
  longitude: z
    .string()
    .trim()
    .regex(
      /^-?((1[0-7][0-9]|[0-9]?[0-9])(\.\d+)?|180(\.0+)?)$/,
      'صيغة خط الطول غير صحيحة'
    )
    .optional()
    .or(z.literal('')),
});

export type AdminFormData = z.infer<typeof AdminSchema>; 