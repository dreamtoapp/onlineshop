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

const WhatsAppSchema = z.object({
  whatsappPermanentToken: z.string().trim().optional(),
  whatsappPhoneNumberId: z.string().trim().optional(),
  whatsappApiVersion: z.string().trim().optional(),
  whatsappBusinessAccountId: z.string().trim().optional(),
  whatsappWebhookVerifyToken: z.string().trim().optional(),
  whatsappAppSecret: z.string().trim().optional(),
  whatsappNumber: z.string().trim().optional(),
});

type WhatsAppForm = z.infer<typeof WhatsAppSchema>;

export default function WhatsAppSettingsForm({ company }: { company: any }) {
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<WhatsAppForm>({
    resolver: zodResolver(WhatsAppSchema),
    defaultValues: {
      whatsappPermanentToken: '',
      whatsappPhoneNumberId: company?.whatsappPhoneNumberId || '',
      whatsappApiVersion: company?.whatsappApiVersion || 'v23.0',
      whatsappBusinessAccountId: company?.whatsappBusinessAccountId || '',
      whatsappWebhookVerifyToken: '',
      whatsappAppSecret: '',
      whatsappNumber: company?.whatsappNumber || '',
    },
  });

  const onSubmit = async (values: WhatsAppForm) => {
    try {
      setIsSaving(true);
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => (typeof v === 'string' ? v.trim() !== '' : v !== undefined))
      );
      const result = await updateCompany(payload);
      if (result?.success) {
        await Swal.fire({ icon: 'success', title: 'تم الحفظ', text: 'تم حفظ إعدادات WhatsApp بنجاح' });
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
        <CardTitle>إعدادات WhatsApp</CardTitle>
        <p className="text-sm text-muted-foreground">
          المصدر: Meta for Developers → WhatsApp. يمكنك زيارة
          {' '}
          <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer" className="underline underline-offset-2">Apps Dashboard</a>
          {' '}و
          <a href="https://developers.facebook.com/docs/whatsapp" target="_blank" rel="noreferrer" className="underline underline-offset-2 ml-1">وثائق WhatsApp API</a>.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="whatsappPermanentToken">Permanent Token</Label>
            <Input id="whatsappPermanentToken" placeholder="EA...ZD" {...register('whatsappPermanentToken')} />
            <p className="text-xs text-muted-foreground">من Meta → System Users → Generate Token.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="whatsappPhoneNumberId">Phone Number ID</Label>
            <Input id="whatsappPhoneNumberId" placeholder="123456789" {...register('whatsappPhoneNumberId')} />
            <p className="text-xs text-muted-foreground">من صفحة WhatsApp → Phone Numbers → رقم الهاتف → Phone Number ID.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="whatsappApiVersion">API Version</Label>
            <Input id="whatsappApiVersion" placeholder="v23.0" {...register('whatsappApiVersion')} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="whatsappBusinessAccountId">Business Account ID</Label>
            <Input id="whatsappBusinessAccountId" placeholder="123456789" {...register('whatsappBusinessAccountId')} />
            <p className="text-xs text-muted-foreground">من Business Settings → Business Info.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="whatsappWebhookVerifyToken">Webhook Verify Token</Label>
            <Input id="whatsappWebhookVerifyToken" placeholder="your-verify-token" {...register('whatsappWebhookVerifyToken')} />
            <p className="text-xs text-muted-foreground">اختر قيمة سرية لتأكيد اتصال الويب هوك.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="whatsappAppSecret">App Secret</Label>
            <Input id="whatsappAppSecret" placeholder="app-secret" {...register('whatsappAppSecret')} />
            <p className="text-xs text-muted-foreground">من App → Settings → Basic → App Secret.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="whatsappNumber">Business Phone</Label>
            <Input id="whatsappNumber" placeholder="+9665xxxxxxx" {...register('whatsappNumber')} />
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


