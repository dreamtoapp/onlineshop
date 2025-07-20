import {
  FieldErrors,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';

import { AdminFormData } from './adminSchema';

// Admin-specific options
export const ADMIN_LEVEL_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'SUPER_ADMIN', label: 'مشرف رئيسي' },
  { value: 'ADMIN', label: 'مشرف' },
  { value: 'MODERATOR', label: 'مشرف فرعي' },
];

export const PERMISSION_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'USER_MANAGEMENT', label: 'إدارة المستخدمين' },
  { value: 'ORDER_MANAGEMENT', label: 'إدارة الطلبات' },
  { value: 'PRODUCT_MANAGEMENT', label: 'إدارة المنتجات' },
  { value: 'REPORT_VIEWING', label: 'عرض التقارير' },
  { value: 'SYSTEM_SETTINGS', label: 'إعدادات النظام' },
  { value: 'FINANCIAL_MANAGEMENT', label: 'إدارة المالية' },
];

interface Field {
  name: keyof AdminFormData;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  maxLength?: number;
  error?: string;
  className?: string;
  options?: Array<{ value: string; label: string }>;
}

interface FieldSection {
  section: string;
  hint?: boolean;
  fields: Field[];
}

export const getAdminFields = (
  register: UseFormRegister<AdminFormData>,
  errors: FieldErrors<AdminFormData>
): FieldSection[] => [
  {
    section: 'البيانات الشخصية',
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
        name: 'password',
        type: 'text',
        placeholder: 'كلمة المرور',
        register: register('password'),
        error: errors.password?.message,
      },
      {
        name: 'addressLabel',
        type: 'select',
        placeholder: 'نوع العنوان',
        register: register('addressLabel'),
        error: errors.addressLabel?.message,
        options: [
          { value: 'المنزل', label: 'المنزل' },
          { value: 'العمل', label: 'العمل' },
          { value: 'أخرى', label: 'أخرى' },
        ],
      },
      {
        name: 'district',
        type: 'text',
        placeholder: 'الحي',
        register: register('district'),
        error: errors.district?.message,
      },
      {
        name: 'street',
        type: 'text',
        placeholder: 'الشارع',
        register: register('street'),
        error: errors.street?.message,
      },
      {
        name: 'buildingNumber',
        type: 'text',
        placeholder: 'رقم المبنى',
        register: register('buildingNumber'),
        error: errors.buildingNumber?.message,
      },
      {
        name: 'floor',
        type: 'text',
        placeholder: 'الطابق (اختياري)',
        register: register('floor'),
        error: errors.floor?.message,
      },
      {
        name: 'apartmentNumber',
        type: 'text',
        placeholder: 'رقم الشقة (اختياري)',
        register: register('apartmentNumber'),
        error: errors.apartmentNumber?.message,
      },
      {
        name: 'landmark',
        type: 'text',
        placeholder: 'معلم قريب (اختياري)',
        register: register('landmark'),
        error: errors.landmark?.message,
      },
      {
        name: 'deliveryInstructions',
        type: 'textarea',
        placeholder: 'تعليمات التوصيل (اختياري)',
        register: register('deliveryInstructions'),
        error: errors.deliveryInstructions?.message,
        className: "col-span-2",
      },
    ],
  },
  {
    section: 'إعدادات المشرف',
    hint: false,
    fields: [
      {
        name: 'adminLevel',
        type: 'select',
        placeholder: 'مستوى المشرف',
        register: register('adminLevel'),
        error: errors.adminLevel?.message,
        options: ADMIN_LEVEL_OPTIONS,
      },
      {
        name: 'isActive',
        type: 'checkbox',
        placeholder: 'نشط',
        register: register('isActive'),
        error: errors.isActive?.message,
      },
    ],
  },
  {
    section: 'الموقع الجغرافي',
    hint: true,
    fields: [
      {
        name: 'sharedLocationLink',
        type: 'url',
        placeholder: 'رابط الموقع المشترك (اختياري)',
        register: register('sharedLocationLink'),
        error: errors.sharedLocationLink?.message,
        className: "col-span-2",
      },
      {
        name: 'latitude',
        type: 'text',
        placeholder: 'خط العرض',
        register: register('latitude'),
        error: errors.latitude?.message,
      },
      {
        name: 'longitude',
        type: 'text',
        placeholder: 'خط الطول',
        register: register('longitude'),
        error: errors.longitude?.message,
      },
    ],
  },
]; 