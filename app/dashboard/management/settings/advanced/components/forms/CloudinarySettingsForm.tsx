"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Swal from 'sweetalert2';

import { updateCompany } from '../../actions/updateCompany';

const CloudinarySchema = z.object({
  cloudinaryCloudName: z.string().trim().optional(),
  cloudinaryApiKey: z.string().trim().optional(),
  cloudinaryApiSecret: z.string().trim().optional(),
  cloudinaryUploadPreset: z.string().trim().optional(),
  cloudinaryClientFolder: z.string().trim().optional(),
});

type CloudinaryForm = z.infer<typeof CloudinarySchema>;

export default function CloudinarySettingsForm({ company }: { company: any }) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CloudinaryForm>({
    resolver: zodResolver(CloudinarySchema),
    defaultValues: {
      cloudinaryCloudName: company?.cloudinaryCloudName || '',
      cloudinaryUploadPreset: company?.cloudinaryUploadPreset || '',
      cloudinaryClientFolder: company?.cloudinaryClientFolder || '',
    },
  });

  const onSubmit = async (values: CloudinaryForm) => {
    try {
      setIsSaving(true);
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => (typeof v === 'string' ? v.trim() !== '' : v !== undefined))
      );

      const result = await updateCompany(payload);
      if (result?.success) {
        await Swal.fire({ icon: 'success', title: 'تم الحفظ', text: 'تم حفظ إعدادات Cloudinary بنجاح' });
      } else {
        await Swal.fire({ icon: 'error', title: 'تعذر الحفظ', text: result?.message || 'فشل في حفظ الإعدادات' });
      }
    } catch {
      await Swal.fire({ icon: 'error', title: 'خطأ غير متوقع', text: 'حدث خطأ غير متوقع، حاول مرة أخرى' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>إعدادات Cloudinary</CardTitle>
        <p className="text-sm text-muted-foreground">
          لإدارة المفاتيح وإعدادات الحساب يمكنك زيارة
          {' '}
          <a href="https://cloudinary.com/console" target="_blank" rel="noreferrer" className="underline underline-offset-2">
            Cloudinary Console
          </a>
          {' '}— ولمزيد من التفاصيل راجع
          {' '}
          <a href="https://cloudinary.com/documentation" target="_blank" rel="noreferrer" className="underline underline-offset-2">
            وثائق Cloudinary
          </a>
          .
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="cloudinaryCloudName">Cloud Name</Label>
            <Input id="cloudinaryCloudName" placeholder="مثال: demo" {...register('cloudinaryCloudName')} />
            <p className="text-xs text-muted-foreground">
              موجود في Cloudinary Console → Settings → Account → Cloud name.
            </p>
            {errors.cloudinaryCloudName && (
              <Alert variant="destructive"><AlertDescription>{errors.cloudinaryCloudName.message}</AlertDescription></Alert>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cloudinaryApiKey">API Key</Label>
            <Input id="cloudinaryApiKey" placeholder="مثال: 1234567890" {...register('cloudinaryApiKey')} />
            <p className="text-xs text-muted-foreground">
              موجود في Cloudinary Console → Settings → Access Keys → API Key.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cloudinaryApiSecret">API Secret</Label>
            <Input id="cloudinaryApiSecret" placeholder="مثال: abcdefghij" {...register('cloudinaryApiSecret')} />
            <p className="text-xs text-muted-foreground">
              موجود في Cloudinary Console → Settings → Access Keys → API Secret.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cloudinaryUploadPreset">Upload Preset</Label>
            <Input id="cloudinaryUploadPreset" placeholder="مثال: E-comm" {...register('cloudinaryUploadPreset')} />
            <p className="text-xs text-muted-foreground">
              يفضّل استخدام Upload preset مخصص للتطبيق (Unsigned/ Signed حسب الحاجة).
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cloudinaryClientFolder">Client Folder</Label>
            <Input id="cloudinaryClientFolder" placeholder="مثال: amwag" {...register('cloudinaryClientFolder')} />
            <p className="text-xs text-muted-foreground">
              مسار مجلد العميل لتنظيم الملفات (مثال: E-comm/clientA/products).
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSaving}>{isSaving ? 'جاري الحفظ...' : 'حفظ'}</Button>
            <Button type="button" variant="outline" onClick={() => reset()} disabled={isSaving}>إعادة تعيين</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


