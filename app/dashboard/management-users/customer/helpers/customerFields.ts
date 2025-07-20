import { UseFormReturn } from 'react-hook-form';
import { CustomerFormData } from './customerSchema';

interface Field {
  name: string;
  type: string;
  placeholder: string;
  register: any;
  error?: string;
  className?: string;
  options?: Array<{ value: string; label: string }>;
}

interface FieldSection {
  section: string;
  hint?: boolean;
  fields: Field[];
}

export function getCustomerFields(
  register: UseFormReturn<CustomerFormData>['register'],
  errors: UseFormReturn<CustomerFormData>['formState']['errors']
): FieldSection[] {
  return [
    {
      section: 'البيانات الشخصية',
      hint: false,
      fields: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'اسم العميل',
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
          error: errors.phone?.message,
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'كلمة المرور',
          register: register('password'),
          error: errors.password?.message,
        },
      ],
    },
    {
      section: 'معلومات العنوان',
      hint: false,
      fields: [
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


  ];
} 