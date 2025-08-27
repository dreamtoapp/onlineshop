import { z } from 'zod';

// Driver-specific validation schema
export const DriverSchema = z.object({
  name: z.string().trim().nonempty('الاسم مطلوب'),
  // Make email optional and allow empty string without error
  email: z.preprocess((v) => {
    if (typeof v === 'string') {
      const trimmed = v.trim();
      return trimmed === '' ? undefined : trimmed;
    }
    return v;
  }, z.string().email('صيغة البريد الإلكتروني غير صحيحة').optional()),
  phone: z
    .string()
    .trim()
    .nonempty('رقم الهاتف مطلوب')
    .regex(/^\d{10}$/, 'رقم الهاتف يجب أن يحتوي على 10 أرقام فقط'),
  // Address fields - using Address Book system
  addressLabel: z.string().trim().optional(),
  district: z.string().trim().optional(),
  street: z.string().trim().optional(),
  buildingNumber: z.string().trim().optional(),
  floor: z.string().optional(),
  apartmentNumber: z.string().optional(),
  landmark: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  // Driver-specific vehicle fields
  vehicleType: z.enum(['MOTORCYCLE', 'CAR', 'VAN', 'TRUCK', 'BICYCLE']).optional(),
  vehiclePlateNumber: z.string().trim().optional(),
  vehicleColor: z.string().trim().optional(),
  vehicleModel: z.string().trim().optional(),
  driverLicenseNumber: z.string().trim().optional(),
  experience: z.string().trim().optional(),
  maxOrders: z.string().trim().optional(),
});

export type DriverFormData = z.infer<typeof DriverSchema>; 