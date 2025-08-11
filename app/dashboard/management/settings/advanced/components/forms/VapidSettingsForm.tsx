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

const VapidSchema = z.object({
  vapidPublicKey: z.string().trim().optional(),
  vapidPrivateKey: z.string().trim().optional(),
  vapidSubject: z.string().trim().optional(),
  vapidEmail: z.string().trim().optional(),
});

type VapidForm = z.infer<typeof VapidSchema>;

export default function VapidSettingsForm({ company }: { company: any }) {
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<VapidForm>({
    resolver: zodResolver(VapidSchema),
    defaultValues: {
      vapidPublicKey: company?.vapidPublicKey || '',
      vapidPrivateKey: '',
      vapidSubject: company?.vapidSubject || '',
      vapidEmail: company?.vapidEmail || '',
    },
  });

  const onSubmit = async (values: VapidForm) => {
    try {
      setIsSaving(true);
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => (typeof v === 'string' ? v.trim() !== '' : v !== undefined))
      );
      const result = await updateCompany(payload);
      if (result?.success) {
        await Swal.fire({ icon: 'success', title: 'تم الحفظ', text: 'تم حفظ إعدادات Web Push بنجاح' });
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
        <CardTitle>إعدادات Web Push (VAPID)</CardTitle>
        <p className="text-sm text-muted-foreground">
          المفاتيح تستخدم لتوقيع إشعارات الويب. للمزيد راجع
          {' '}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Push_API" target="_blank" rel="noreferrer" className="underline underline-offset-2">Push API</a>.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="vapidPublicKey">Public Key</Label>
            <Input id="vapidPublicKey" placeholder="BASE64..." {...register('vapidPublicKey')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vapidPrivateKey">Private Key</Label>
            <Input id="vapidPrivateKey" placeholder="BASE64..." {...register('vapidPrivateKey')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vapidSubject">Subject</Label>
            <Input id="vapidSubject" placeholder="mailto:admin@domain.com" {...register('vapidSubject')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vapidEmail">Contact Email</Label>
            <Input id="vapidEmail" placeholder="admin@domain.com" {...register('vapidEmail')} />
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


