"use client";

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import InfoTooltip from '@/components/InfoTooltip';
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
  const [showSecrets, setShowSecrets] = useState(false);
  const [credLoading, setCredLoading] = useState(true);
  const [credError, setCredError] = useState<string | null>(null);
  const [cred, setCred] = useState<{
    cloudName: string | null;
    apiKeyMasked: string | null;
    apiSecretMasked: string | null;
    configured: boolean;
    source: 'db' | 'env';
  } | null>(null);
  const [usage, setUsage] = useState<{
    storage?: { usage: number | null; limit: number | null; percent: number | null };
    bandwidth?: { usage: number | null; limit: number | null; percent: number | null };
    transformations?: { usage: number | null; limit: number | null; percent: number | null };
    lastUpdated?: string | null;
  } | null>(null);

  const formatBytes = (v?: number | null): string => {
    if (typeof v !== 'number' || !isFinite(v)) return '--';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = v;
    let i = 0;
    while (value >= 1024 && i < units.length - 1) {
      value /= 1024;
      i++;
    }
    const digits = value < 10 ? 2 : value < 100 ? 1 : 0;
    return `${value.toFixed(digits)} ${units[i]}`;
  };

  const ONE_GB = 1024 * 1024 * 1024;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CloudinaryForm>({
    resolver: zodResolver(CloudinarySchema),
    defaultValues: {
      cloudinaryCloudName: company?.cloudinaryCloudName || '',
      cloudinaryApiKey: company?.cloudinaryApiKey || '',
      cloudinaryApiSecret: company?.cloudinaryApiSecret || '',
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

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setCredLoading(true);
        setCredError(null);
        const res = await fetch('/api/cloudinary/credentials', { cache: 'no-store' });
        if (!res.ok) throw new Error('FAILED_TO_LOAD_CLOUDINARY_CREDENTIALS');
        const data = await res.json();
        if (isMounted) setCred(data);
        // Fetch usage only when configured
        if (data?.configured) {
          try {
            const u = await fetch('/api/cloudinary/usage', { cache: 'no-store' });
            if (u.ok) {
              const usageData = await u.json();
              if (isMounted) setUsage(usageData);
            }
          } catch { }
        }
      } catch (e) {
        if (isMounted) setCredError('تعذر تحميل حالة إعدادات Cloudinary');
      } finally {
        if (isMounted) setCredLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>إعدادات الوسائط</CardTitle>
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
        <div className="mb-4 grid gap-2 rounded-md border p-4">
          <div className="text-sm font-medium">حالة إعدادات الوسائط</div>
          {credLoading ? (
            <p className="text-sm text-muted-foreground">جاري التحميل...</p>
          ) : credError ? (
            <Alert variant="destructive"><AlertDescription>{credError}</AlertDescription></Alert>
          ) : cred ? (
            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
              {usage && (
                <div className="md:col-span-2 mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                  <div className="rounded border p-2">
                    <div className="text-xs text-muted-foreground">Storage</div>
                    <div className="text-sm">
                      {formatBytes(usage.storage?.usage)} / {formatBytes(usage.storage?.limit)} ({usage.storage?.percent ?? '--'}%)
                    </div>
                  </div>
                  <div className="rounded border p-2">
                    <div className="text-xs text-muted-foreground">Bandwidth</div>
                    <div className="text-sm">
                      {formatBytes(usage.bandwidth?.usage)} / {formatBytes(usage.bandwidth?.limit)} ({usage.bandwidth?.percent ?? '--'}%)
                    </div>
                  </div>
                  <div className="rounded border p-2">
                    <div className="text-xs text-muted-foreground">Transformations</div>
                    <div className="text-sm">
                      {usage.transformations?.usage ?? '--'} / {usage.transformations?.limit ?? '--'} ({usage.transformations?.percent ?? '--'}%)
                    </div>
                  </div>
                </div>
              )}
              {usage && (
                <div className="md:col-span-2 mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">الحصة المجانية (1 GB)</span>
                    <span className="text-muted-foreground">
                      {formatBytes(usage.storage?.usage)} / {formatBytes(ONE_GB)}
                    </span>
                  </div>
                  {(() => {
                    const used = typeof usage.storage?.usage === 'number' ? usage.storage?.usage : 0;
                    const percent = Math.min(100, Math.round((used / ONE_GB) * 100));
                    const color = percent < 80 ? 'bg-green-500' : percent < 95 ? 'bg-amber-500' : 'bg-red-500';
                    return (
                      <div className="h-2 w-full rounded bg-neutral-200">
                        <div className={`h-2 rounded ${color}`} style={{ width: `${percent}%` }} />
                      </div>
                    );
                  })()}
                  <p className="mt-1 text-xs text-muted-foreground">
                    لديك 1 جيجابايت مجانًا لرفع الوسائط. في حال تجاوزتها سيتم إيقاف الرفع حتى الترقية.
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <form className="grid gap-4 max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="cloudinaryCloudName" className="mb-0">Cloudinary ID (Cloud name) <span className="ml-2 inline-flex items-center rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">مهم</span></Label>
              <InfoTooltip
                side="right"
                iconSize={14}
                content={
                  "هذه القيم الخاصة بالوسائط (Cloud name / API Key / API Secret) ضرورية لنجاح الرفع. لا تشاركها مع أي طرف، وأي تغيير عليها قد يوقف الرفع حتى التصحيح."
                }
                tone="critical"
              />
            </div>
            <Input id="cloudinaryCloudName" placeholder="مثال: demo" {...register('cloudinaryCloudName')} />
            <p className="text-xs text-muted-foreground">
              موجود في Cloudinary Console → Settings → Account → Cloud name.
            </p>
            {errors.cloudinaryCloudName && (
              <Alert variant="destructive"><AlertDescription>{errors.cloudinaryCloudName.message}</AlertDescription></Alert>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cloudinaryApiKey">API Key <span className="ml-2 inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">حسّاس</span></Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowSecrets(v => !v)}>
                {showSecrets ? 'إخفاء القيم' : 'إظهار القيم'}
              </Button>
            </div>
            <Input id="cloudinaryApiKey" type={showSecrets ? 'text' : 'password'} placeholder="مثال: 1234567890" {...register('cloudinaryApiKey')} />
            <p className="text-xs text-muted-foreground">
              موجود في Cloudinary Console → Settings → Access Keys → API Key.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cloudinaryApiSecret">API Secret <span className="ml-2 inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">غاية في الحساسية</span></Label>
            <Input id="cloudinaryApiSecret" type={showSecrets ? 'text' : 'password'} placeholder="مثال: abcdefghij" {...register('cloudinaryApiSecret')} />
            <p className="text-xs text-muted-foreground">
              موجود في Cloudinary Console → Settings → Access Keys → API Secret.
            </p>
          </div>

          {false && (
            <div className="grid gap-2">
              <Label htmlFor="cloudinaryUploadPreset">Upload Preset</Label>
              <Input id="cloudinaryUploadPreset" placeholder="مثال: E-comm" {...register('cloudinaryUploadPreset')} />
              <p className="text-xs text-muted-foreground">
                يفضّل استخدام Upload preset مخصص للتطبيق (Unsigned/ Signed حسب الحاجة).
              </p>
            </div>
          )}

          {false && (
            <div className="grid gap-2">
              <Label htmlFor="cloudinaryClientFolder">Folder Name</Label>
              <Input id="cloudinaryClientFolder" placeholder="مثال: amwag" {...register('cloudinaryClientFolder')} />
              <p className="text-xs text-muted-foreground">
                مسار مجلد العميل لتنظيم الملفات (مثال: E-comm/clientA/products).
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSaving}>{isSaving ? 'جاري الحفظ...' : 'حفظ'}</Button>
            <Button type="button" variant="outline" onClick={() => reset()} disabled={isSaving}>إعادة تعيين</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


