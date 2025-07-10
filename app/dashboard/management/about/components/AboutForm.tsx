import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import AddImage from '@/components/AddImage';

const aboutSchema = z.object({
    heroTitle: z.string().min(2, 'العنوان الرئيسي مطلوب'),
    heroSubtitle: z.string().min(2, 'الوصف الرئيسي مطلوب'),
    heroImageUrl: z.string().url('رابط الصورة غير صالح'),
    missionTitle: z.string().min(2, 'عنوان الرسالة مطلوب'),
    missionText: z.string().min(2, 'نص الرسالة مطلوب'),
    ctaTitle: z.string().min(2, 'عنوان الدعوة مطلوب'),
    ctaText: z.string().min(2, 'نص الدعوة مطلوب'),
    ctaButtonText: z.string().min(2, 'نص زر الدعوة مطلوب'),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export type AboutFormDefaultValues = Partial<AboutFormValues> & { id?: string };

export default function AboutForm({ defaultValues, onSubmit, onCancel }: {
    defaultValues?: AboutFormDefaultValues;
    onSubmit: (values: AboutFormValues) => void;
    onCancel?: () => void;
}) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<AboutFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="heroTitle" className="block font-bold mb-1">العنوان الرئيسي</label>
                <Input id="heroTitle" {...register('heroTitle')} aria-invalid={!!errors.heroTitle} />
                {errors.heroTitle && <p className="text-red-500 text-sm mt-1">{errors.heroTitle.message}</p>}
            </div>
            <div>
                <label htmlFor="heroSubtitle" className="block font-bold mb-1">الوصف الرئيسي</label>
                <Textarea id="heroSubtitle" {...register('heroSubtitle')} aria-invalid={!!errors.heroSubtitle} />
                {errors.heroSubtitle && <p className="text-red-500 text-sm mt-1">{errors.heroSubtitle.message}</p>}
            </div>
            <div>
                <label htmlFor="heroImageUrl" className="block font-bold mb-1">رابط صورة الهيرو</label>
                <div className="w-40 h-24">
                    <AddImage
                        url={watch('heroImageUrl')}
                        alt="صورة الهيرو"
                        recordId={defaultValues?.id || ''}
                        table="aboutPageContent"
                        tableField="heroImageUrl"
                        onUploadComplete={url => setValue('heroImageUrl', url, { shouldValidate: true })}
                        autoUpload
                    />
                </div>
                {errors.heroImageUrl && <p className="text-red-500 text-sm mt-1">{errors.heroImageUrl.message}</p>}
            </div>
            <div>
                <label htmlFor="missionTitle" className="block font-bold mb-1">عنوان الرسالة</label>
                <Input id="missionTitle" {...register('missionTitle')} aria-invalid={!!errors.missionTitle} />
                {errors.missionTitle && <p className="text-red-500 text-sm mt-1">{errors.missionTitle.message}</p>}
            </div>
            <div>
                <label htmlFor="missionText" className="block font-bold mb-1">نص الرسالة</label>
                <Textarea id="missionText" {...register('missionText')} aria-invalid={!!errors.missionText} />
                {errors.missionText && <p className="text-red-500 text-sm mt-1">{errors.missionText.message}</p>}
            </div>
            <div>
                <label htmlFor="ctaTitle" className="block font-bold mb-1">عنوان الدعوة</label>
                <Input id="ctaTitle" {...register('ctaTitle')} aria-invalid={!!errors.ctaTitle} />
                {errors.ctaTitle && <p className="text-red-500 text-sm mt-1">{errors.ctaTitle.message}</p>}
            </div>
            <div>
                <label htmlFor="ctaText" className="block font-bold mb-1">نص الدعوة</label>
                <Textarea id="ctaText" {...register('ctaText')} aria-invalid={!!errors.ctaText} />
                {errors.ctaText && <p className="text-red-500 text-sm mt-1">{errors.ctaText.message}</p>}
            </div>
            <div>
                <label htmlFor="ctaButtonText" className="block font-bold mb-1">نص زر الدعوة</label>
                <Input id="ctaButtonText" {...register('ctaButtonText')} aria-invalid={!!errors.ctaButtonText} />
                {errors.ctaButtonText && <p className="text-red-500 text-sm mt-1">{errors.ctaButtonText.message}</p>}
            </div>
            <div className="flex gap-4 mt-6">
                <Button type="submit" disabled={isSubmitting} className="bg-feature-suppliers text-white font-bold px-8 py-2 rounded">
                    حفظ
                </Button>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} className="font-bold px-8 py-2 rounded">
                        إلغاء
                    </Button>
                )}
            </div>
        </form>
    );
} 