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

const AuthSchema = z.object({
  authCallbackUrl: z.string().trim().optional(),
});

type AuthForm = z.infer<typeof AuthSchema>;

export default function AuthSettingsForm({ company }: { company: any }) {
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<AuthForm>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      authCallbackUrl: company?.authCallbackUrl || '',
    },
  });

  const detectFromBrowser = () => {
    try {
      const origin = window.location.origin;
      setValue('authCallbackUrl', origin, { shouldDirty: true });
    } catch {
      // ignore if not in browser
    }
  };

  const onSubmit = async (values: AuthForm) => {
    try {
      setIsSaving(true);
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => (typeof v === 'string' ? v.trim() !== '' : v !== undefined))
      );
      const result = await updateCompany(payload);
      if (result?.success) {
        await Swal.fire({ icon: 'success', title: 'تم الحفظ', text: 'تم حفظ عنوان العودة للمصادقة' });
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
        <CardTitle>إعدادات المصادقة</CardTitle>
        <p className="text-sm text-muted-foreground">
          هذا العنوان يُستخدم لروابط العودة الخاصة بالمصادقة في NextAuth.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="authCallbackUrl">Auth Callback URL</Label>
            <div className="flex gap-2">
              <Input id="authCallbackUrl" placeholder="https://your-domain.com" {...register('authCallbackUrl')} />
              <Button type="button" variant="secondary" onClick={detectFromBrowser}>اكتشاف تلقائي</Button>
            </div>
            <p className="text-xs text-muted-foreground">سيتم استخدام عنوان الموقع الحالي تلقائيًا. عدّل القيمة إذا كنت تستخدم نطاقًا مخصصًا خلف Proxy.</p>
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


