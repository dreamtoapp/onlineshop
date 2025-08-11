"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2';

import { updateCompany } from '../../actions/updateCompany';

const AnalyticsSchema = z.object({
  gtmContainerId: z.string().trim().optional(),
});

type AnalyticsForm = z.infer<typeof AnalyticsSchema>;

export default function AnalyticsSettingsForm({ company }: { company: any }) {
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<AnalyticsForm>({
    resolver: zodResolver(AnalyticsSchema),
    defaultValues: {
      gtmContainerId: company?.gtmContainerId || '',
    },
  });

  const onSubmit = async (values: AnalyticsForm) => {
    try {
      setIsSaving(true);
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => (typeof v === 'string' ? v.trim() !== '' : v !== undefined))
      );
      const result = await updateCompany(payload);
      if (result?.success) {
        await Swal.fire({ icon: 'success', title: 'تم الحفظ', text: 'تم حفظ إعدادات التحليلات (GTM) بنجاح' });
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
        <CardTitle>إعدادات التحليلات (GTM)</CardTitle>
        <p className="text-sm text-muted-foreground">
          استخدم معرّف الحاوية بالشكل GTM-XXXXXXX. للتفاصيل راجع
          {' '}
          <a href="https://tagmanager.google.com/" className="underline underline-offset-2" target="_blank" rel="noreferrer">Google Tag Manager</a>.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="gtmContainerId">GTM Container ID</Label>
            <Input id="gtmContainerId" placeholder="GTM-XXXXXXX" {...register('gtmContainerId')} />
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


