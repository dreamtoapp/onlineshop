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

const PusherSchema = z.object({
  pusherAppId: z.string().trim().optional(),
  pusherKey: z.string().trim().optional(),
  pusherSecret: z.string().trim().optional(),
  pusherCluster: z.string().trim().optional(),
});

type PusherForm = z.infer<typeof PusherSchema>;

export default function PusherSettingsForm({ company }: { company: any }) {
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<PusherForm>({
    resolver: zodResolver(PusherSchema),
    defaultValues: {
      pusherAppId: company?.pusherAppId || '',
      pusherKey: company?.pusherKey || '',
      pusherSecret: '',
      pusherCluster: company?.pusherCluster || '',
    },
  });

  const onSubmit = async (values: PusherForm) => {
    try {
      setIsSaving(true);
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => (typeof v === 'string' ? v.trim() !== '' : v !== undefined))
      );
      const result = await updateCompany(payload);
      if (result?.success) {
        await Swal.fire({ icon: 'success', title: 'تم الحفظ', text: 'تم حفظ إعدادات Pusher بنجاح' });
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
        <CardTitle>إعدادات Pusher</CardTitle>
        <p className="text-sm text-muted-foreground">
          ادخل بيانات لوحة Pusher (App ID, Key, Secret, Cluster). راجع
          {' '}
          <a href="https://dashboard.pusher.com/" target="_blank" rel="noreferrer" className="underline underline-offset-2">Pusher Dashboard</a>.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="pusherAppId">App ID</Label>
            <Input id="pusherAppId" placeholder="" {...register('pusherAppId')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pusherKey">Key</Label>
            <Input id="pusherKey" placeholder="" {...register('pusherKey')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pusherSecret">Secret</Label>
            <Input id="pusherSecret" placeholder="" {...register('pusherSecret')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pusherCluster">Cluster</Label>
            <Input id="pusherCluster" placeholder="mt1" {...register('pusherCluster')} />
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


