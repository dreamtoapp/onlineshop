'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';

import AppDialog from '@/components/app-dialog';
import FormError from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/icons/Icon';

import {
  SupplierFormData,
  SupplierSchema,
  getSupplierFields,
} from '../helper/supplierZodAndInputs';
import { upsertSupplier } from '../actions/upsertSupplier'; // You'll need to rename this accordingly

interface AddSupplierProps {
  mode: 'new' | 'update';
  defaultValues: SupplierFormData;
  title?: string;
  description?: string;
  iconOnly?: boolean;
}

export default function AddSupplier({
  mode,
  defaultValues,
  title,
  description,
  iconOnly = false,
}: AddSupplierProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(SupplierSchema),
    mode: 'onChange',
    defaultValues: defaultValues ?? {},
  });

  const onSubmit = async (formData: SupplierFormData) => {
    try {
      const result = await upsertSupplier(formData, mode);

      if (result.ok) {
        toast.success(result.msg || 'تم حفظ بيانات المورد بنجاح');
        reset();
        setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.error(result.msg || 'حدث خطأ يرجى المحاولة لاحقاً');
      }
    } catch (err) {
      toast.error('فشل في إرسال البيانات، يرجى المحاولة لاحقاً');
      console.error('فشل في إرسال البيانات:', err);
    }
  };

  return (
    <AppDialog
      trigger={
        <Button
          variant={mode === 'new' ? 'default' : 'outline'}
          size={iconOnly ? 'icon' : 'sm'}
          className={iconOnly ? '' : 'flex items-center gap-2'}
          aria-label={mode === 'new' ? 'إضافة' : 'تعديل'}
        >
          {mode === 'new' ? (
            <>
              <Icon name="Plus" size="xs" />
              {!iconOnly && <span>إضافة</span>}
            </>
          ) : (
            <>
              <Icon name="Edit" size="xs" />
              {!iconOnly && <span>تعديل</span>}
            </>
          )}
        </Button>
      }
      title={title}
      description={description}
      mode={mode}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {getSupplierFields(register, errors).map((section) => (
          <div key={section.section} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {section.section}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.name} className={field.className}>
                  <label className="block text-sm font-medium mb-1" htmlFor={`supplier-${String(field.name)}`}>
                    {field.placeholder}
                    {field.name === 'email' && <span className="text-muted-foreground text-xs"> (اختياري)</span>}
                  </label>
                  <Input
                    id={`supplier-${String(field.name)}`}
                    {...field.register}
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled={isSubmitting}
                    maxLength={field.maxLength}
                  />
                  <FormError message={field.error} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}
        </Button>
      </form>
    </AppDialog>
  );
}
