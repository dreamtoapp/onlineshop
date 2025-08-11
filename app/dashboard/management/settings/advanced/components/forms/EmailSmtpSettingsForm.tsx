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

const EmailSchema = z.object({
  emailUser: z.string().trim().optional(),
  emailPass: z.string().trim().optional(),
  smtpHost: z.string().trim().optional(),
  smtpPort: z.string().trim().optional(),
  smtpUser: z.string().trim().optional(),
  smtpPass: z.string().trim().optional(),
  smtpFrom: z.string().trim().optional(),
});

type EmailForm = z.infer<typeof EmailSchema>;

export default function EmailSmtpSettingsForm({ company }: { company: any }) {
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<EmailForm>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      emailUser: company?.emailUser || '',
      emailPass: '',
      smtpHost: company?.smtpHost || '',
      smtpPort: company?.smtpPort || '',
      smtpUser: company?.smtpUser || '',
      smtpPass: '',
      smtpFrom: company?.smtpFrom || '',
    },
  });

  const onSubmit = async (values: EmailForm) => {
    try {
      setIsSaving(true);
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => (typeof v === 'string' ? v.trim() !== '' : v !== undefined))
      );
      const result = await updateCompany(payload);
      if (result?.success) {
        await Swal.fire({ icon: 'success', title: 'تم الحفظ', text: 'تم حفظ إعدادات البريد/SMTP بنجاح' });
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
        <CardTitle>إعدادات البريد/SMTP</CardTitle>
        <p className="text-sm text-muted-foreground">
          يُفضّل استخدام كلمة مرور تطبيق (App Password) عند الاعتماد على Gmail. راجع مزود البريد لمعرفة بيانات SMTP الصحيحة.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="emailUser">Email User</Label>
            <Input id="emailUser" placeholder="example@mail.com" {...register('emailUser')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emailPass">Email Password / App Password</Label>
            <Input id="emailPass" placeholder="app-password" {...register('emailPass')} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input id="smtpHost" placeholder="smtp.gmail.com" {...register('smtpHost')} />
            <p className="text-xs text-muted-foreground">مثال Gmail: smtp.gmail.com — المنفذ 587.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input id="smtpPort" placeholder="587" {...register('smtpPort')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="smtpUser">SMTP User</Label>
            <Input id="smtpUser" placeholder="example@mail.com" {...register('smtpUser')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="smtpPass">SMTP Password</Label>
            <Input id="smtpPass" placeholder="smtp-password" {...register('smtpPass')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="smtpFrom">SMTP From</Label>
            <Input id="smtpFrom" placeholder="" {...register('smtpFrom')} />
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


