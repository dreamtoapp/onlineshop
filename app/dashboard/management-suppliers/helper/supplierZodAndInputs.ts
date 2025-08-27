import {
  FieldErrors,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { z } from 'zod';

// مخطط التحقق
export const SupplierSchema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim().nonempty('الاسم مطلوب'),
  email: z.string().trim().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: 'صيغة البريد الإلكتروني غير صحيحة'
  }).optional(),
  phone: z.string().trim().nonempty('رقم الهاتف مطلوب'),
  address: z.string().trim().nonempty('العنوان مطلوب'),
  type: z.string(),
  // VAT/TIN in Saudi Arabia is 15 digits; allow empty/undefined if not provided
  taxNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\d{15}$/.test(val), {
      message: 'الرقم الضريبي يجب أن يكون 15 رقمًا',
    }),
});

export type SupplierFormData = z.infer<typeof SupplierSchema>;

interface Field {
  name: keyof SupplierFormData;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  maxLength?: number;
  error?: string;
  className?: string;
  latitude?: string;
  longitude?: string;
  sharedLocationLink?: string;
}

interface FieldSection {
  section: string;
  hint?: boolean;
  fields: Field[];
}

// دالة توليد الحقول بناءً على المتغيرات
export const getSupplierFields = (
  register: UseFormRegister<SupplierFormData>,
  errors: FieldErrors<SupplierFormData>
): FieldSection[] => [
    {
      section: 'بيانات المورد',
      hint: false,
      fields: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'الاسم',
          register: register('name'),
          error: errors.name?.message,
        },
        {
          name: 'taxNumber',
          type: 'text',
          placeholder: 'الرقم الضريبي',
          register: register('taxNumber', {
            setValueAs: (v) => (typeof v === 'string' ? v.replace(/\D/g, '').slice(0, 15) : v),
          }),
          maxLength: 15,
          error: (errors as any).taxNumber?.message,
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'البريد الإلكتروني',
          register: register('email'),
          error: errors.email?.message,
        },
        {
          name: 'phone',
          type: 'tel',
          placeholder: 'رقم الهاتف',
          register: register('phone'),
          maxLength: 10,
          error: errors.phone?.message,
        },
        {
          name: 'address',
          type: 'text',
          placeholder: 'العنوان',
          register: register('address'),
          error: errors.address?.message,
          className: 'col-span-2',
        },
      ],
    },
  ];
