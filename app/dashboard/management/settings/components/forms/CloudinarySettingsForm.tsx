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
import { toast } from 'sonner';

import { saveCompany } from '../../actions/saveCompnay';

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
      // Only send non-empty fields to avoid overwriting secrets with empty strings
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => typeof v === 'string' ? v.trim() !== '' : v !== undefined)
      );

      const result = await saveCompany(payload);
      if (result?.success) {
        toast.success('تم حفظ إعدادات Cloudinary بنجاح');
      } else {
        toast.error(result?.message || 'فشل في حفظ الإعدادات');
      }
    } catch (e) {
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>إعدادات Cloudinary</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="cloudinaryCloudName">Cloud Name</Label>
            <Input id="cloudinaryCloudName" placeholder="مثال: demo" {...register('cloudinaryCloudName')} />
            {errors.cloudinaryCloudName && (
              <Alert variant="destructive"><AlertDescription>{errors.cloudinaryCloudName.message}</AlertDescription></Alert>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cloudinaryApiKey">API Key</Label>
            <Input id="cloudinaryApiKey" placeholder="مثال: 1234567890" {...register('cloudinaryApiKey')} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cloudinaryApiSecret">API Secret</Label>
            <Input id="cloudinaryApiSecret" placeholder="مثال: abcdefghij" {...register('cloudinaryApiSecret')} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cloudinaryUploadPreset">Upload Preset</Label>
            <Input id="cloudinaryUploadPreset" placeholder="مثال: E-comm" {...register('cloudinaryUploadPreset')} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cloudinaryClientFolder">Client Folder</Label>
            <Input id="cloudinaryClientFolder" placeholder="مثال: amwag" {...register('cloudinaryClientFolder')} />
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


