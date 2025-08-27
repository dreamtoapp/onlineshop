'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
// import { useState } from 'react';

import AppDialog from '@/components/app-dialog';
import FormError from '@/components/form-error';
// import InfoTooltip from '@/components/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/icons/Icon';

import { zodResolver } from '@hookform/resolvers/zod';

import { upsertAdmin } from '../actions/upsertAdmin';
import {
    AdminFormData,
    AdminSchema,
} from '../helpers/adminSchema';
import { getAdminFields } from '../helpers/adminFields';

interface AdminUpsertProps {
    mode: 'new' | 'update'
    defaultValues: AdminFormData;
    title?: string;
    description?: string;
    adminId?: string;
}

export default function AdminUpsert({
    mode,
    defaultValues,
    title,
    description,
    adminId
}: AdminUpsertProps) {
    // Collapsible removed for admin dialog

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        getValues,
        watch,
    } = useForm<AdminFormData>({
        resolver: zodResolver(AdminSchema) as any,
        mode: 'onChange',
        defaultValues: {
            name: defaultValues.name || '',
            email: defaultValues.email || '',
            phone: defaultValues.phone || '',

            password: defaultValues.password || '',


        },
    });

    const onSubmit = async (formData: any) => {
        try {
            const result = await upsertAdmin(formData as AdminFormData, mode, adminId);

            if (result.ok) {
                toast.success(result.msg || 'تم حفظ بيانات المشرف بنجاح');
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
            trigger={<Button variant={mode === "new" ? 'default' : 'outline'} size='sm' className='flex items-center gap-2'>
                {mode === 'new' ? (
                    <>
                        <Icon name="Plus" size="xs" /> <span>إضافة مشرف</span>
                    </>
                ) : (
                    <>
                        <Icon name="Edit" size="xs" /> <span>تعديل</span>
                    </>
                )}
            </Button>}
            title={title || (mode === 'new' ? 'إضافة مشرف جديد' : 'تعديل بيانات المشرف')}
            description={description || 'يرجى إدخال بيانات المشرف'}
            mode={mode}
            footer={
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                    form="admin-form"
                >
                    {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}
                </Button>
            }
        >
            <form id="admin-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {getAdminFields(register, errors).map((section) => (
                    <div key={section.section} className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">
                            {section.section}
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {section.fields.map((field) => {
                                // Handle select fields
                                if (field.type === 'select' && field.options) {
                                    return (
                                        <div key={field.name} className={field.className}>
                                            <label className="block text-sm font-medium mb-1" htmlFor={`admin-${String(field.name)}`}>
                                                {field.placeholder}
                                            </label>
                                            <Select
                                                onValueChange={(value) => setValue(field.name as any, value)}
                                                defaultValue={getValues(field.name as any)}
                                                disabled={isSubmitting}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={field.placeholder} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {field.options.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormError message={field.error} />
                                        </div>
                                    );
                                }

                                // Handle checkbox fields
                                if (field.type === 'checkbox') {
                                    return (
                                        <div key={field.name} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={field.name}
                                                checked={watch(field.name as any)}
                                                onCheckedChange={(checked) => setValue(field.name as any, checked)}
                                                disabled={isSubmitting}
                                            />
                                            <label
                                                htmlFor={field.name}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {field.placeholder}
                                            </label>
                                            <FormError message={field.error} />
                                        </div>
                                    );
                                }

                                // Handle regular input fields
                                return (
                                    <div key={field.name} className={field.className}>
                                        <label className="block text-sm font-medium mb-1" htmlFor={`admin-${String(field.name)}`}>
                                            {field.placeholder}
                                        </label>
                                        <Input
                                            id={`admin-${String(field.name)}`}
                                            {...field.register}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            disabled={isSubmitting}
                                            maxLength={field.maxLength}
                                        />
                                        <FormError message={field.error} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </form>
        </AppDialog>
    );
} 