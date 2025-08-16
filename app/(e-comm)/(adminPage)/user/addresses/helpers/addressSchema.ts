import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().min(1, 'نوع العنوان مطلوب'),
  district: z.string().min(1, 'الحي مطلوب'),
  street: z.string().min(1, 'الشارع مطلوب'),
  buildingNumber: z.string().min(1, 'رقم المبنى مطلوب'),
  floor: z.string().optional(),
  apartmentNumber: z.string().optional(),
  landmark: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
