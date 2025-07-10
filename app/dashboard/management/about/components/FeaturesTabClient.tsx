"use client";
import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import AddImage from '@/components/AddImage';
import Image from 'next/image';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const featureSchema = z.object({
    title: z.string().min(2, 'العنوان مطلوب'),
    description: z.string().min(2, 'الوصف مطلوب'),
    imageUrl: z.string().url('رابط الصورة غير صالح').optional(),
});

type FeatureFormValues = z.infer<typeof featureSchema>;

type Feature = FeatureFormValues & { id: string };

function extractErrorMessage(error: any): string {
    if (!error) return "حدث خطأ غير متوقع";
    if (typeof error === "string") return error;
    if (error.message) return error.message;
    if (error.error && error.error.fieldErrors) {
        const firstField = Object.values(error.error.fieldErrors)[0];
        if (Array.isArray(firstField) && firstField.length > 0) {
            return firstField[0];
        }
    }
    if (error.code && error.meta && error.meta.cause) return error.meta.cause;
    try {
        return JSON.stringify(error);
    } catch {
        return "حدث خطأ غير متوقع";
    }
}

export default function FeaturesTabClient({ aboutPageId }: { aboutPageId: string | null }) {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [form, setForm] = useState<FeatureFormValues>({ title: '', description: '' });
    const [editId, setEditId] = useState<string | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/api/about/features')
            .then(res => res.json())
            .then(res => {
                if (res.success) setFeatures(res.features);
            });
    }, []);

    useEffect(() => {
        if (editId && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [editId]);

    async function handleAddOrEdit(e: any) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (editId) {
            // Edit mode (require imageUrl)
            if (!form.imageUrl) {
                setError({ fieldErrors: { imageUrl: ['رابط الصورة غير صالح'] } });
                setLoading(false);
                return;
            }
            const res = await fetch('/api/about/features', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editId, ...form, aboutPageId }),
            });
            const result = await res.json();
            if (result.success) {
                setFeatures((prev) => prev.map(f => f.id === editId ? result.feature : f));
                setForm({ title: '', description: '' });
                setEditId(null);
                toast.success('تم تحديث الميزة بنجاح');
            } else {
                setError(result.error);
            }
        } else {
            // Add mode (do not require imageUrl)
            const res = await fetch('/api/about/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, aboutPageId }),
            });
            const result = await res.json();
            if (result.success) {
                setFeatures((prev) => [...prev, result.feature]);
                setForm({ title: '', description: '' });
                toast.success('تمت إضافة الميزة بنجاح');
            } else {
                setError(result.error);
            }
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/about/features', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const result = await res.json();
        if (result.success) {
            setFeatures((prev) => prev.filter(f => f.id !== id));
            if (editId === id) {
                setEditId(null);
                setForm({ title: '', description: '' });
            }
        } else {
            setError(extractErrorMessage(result.error));
        }
        setLoading(false);
    }

    function handleEdit(feature: Feature) {
        setEditId(feature.id);
        setForm({ title: feature.title, description: feature.description, imageUrl: feature.imageUrl });
    }

    function handleCancelEdit() {
        setEditId(null);
        setForm({ title: '', description: '' });
        setError(null);
    }

    return (
        <Card className="p-6 mb-4">
            <h2 className="text-xl font-bold mb-4">إدارة المميزات</h2>
            <form onSubmit={handleAddOrEdit} className="space-y-4 mb-6">
                <div>
                    <label className="block font-bold mb-1">العنوان</label>
                    <Input ref={titleInputRef} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                    {error && typeof error === 'object' && error.fieldErrors?.title && (
                        <p className="text-red-500 text-sm mt-1">{error.fieldErrors.title[0]}</p>
                    )}
                </div>
                <div>
                    <label className="block font-bold mb-1">الوصف</label>
                    <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    {error && typeof error === 'object' && error.fieldErrors?.description && (
                        <p className="text-red-500 text-sm mt-1">{error.fieldErrors.description[0]}</p>
                    )}
                </div>
                <div>
                    <label className="block font-bold mb-1">صورة الميزة</label>
                    {editId ? (
                        <div className="w-32 h-20">
                            <AddImage
                                url={form.imageUrl}
                                alt="صورة الميزة"
                                recordId={editId}
                                table="feature"
                                tableField="imageUrl"
                                onUploadComplete={url => setForm(f => ({ ...f, imageUrl: url }))}
                                autoUpload
                            />
                            {error && typeof error === 'object' && error.fieldErrors?.imageUrl && (
                                <p className="text-red-500 text-sm mt-1">{error.fieldErrors.imageUrl[0]}</p>
                            )}
                        </div>
                    ) : (
                        <Alert variant="default" className="w-64 mt-2">
                            <AlertTitle>إرشادات الصورة</AlertTitle>
                            <AlertDescription>
                                أضف الميزة ثم ارفع الصورة بعد تحديد الميزة للتعديل
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                {error && typeof error === 'object' && error.fieldErrors?.aboutPageId && (
                    <p className="text-red-500 text-sm mt-1">{error.fieldErrors.aboutPageId[0]}</p>
                )}
                {error && typeof error === 'object' && Array.isArray(error.formErrors) && error.formErrors.length > 0 && (
                    <ul className="text-red-500 mb-2">
                        {error.formErrors.map((msg: string, i: number) => <li key={i}>{msg}</li>)}
                    </ul>
                )}
                {error && typeof error === 'string' && (
                    <p className="text-red-500">{error}</p>
                )}
                <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>{editId ? 'تحديث' : 'إضافة'}</Button>
                    {editId && <Button type="button" variant="outline" onClick={handleCancelEdit}>إلغاء</Button>}
                </div>
            </form>
            <ul className="space-y-4">
                {features.map((feature) => (
                    <li key={feature.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="font-bold">{feature.title}</div>
                            <div className="text-sm text-muted-foreground mb-2">{feature.description}</div>
                            {feature.imageUrl && feature.imageUrl.trim() !== '' && (
                                <Image
                                    src={feature.imageUrl}
                                    alt={feature.title}
                                    width={96}
                                    height={64}
                                    className="w-24 h-16 object-cover rounded mt-2"
                                />
                            )}
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(feature)}>تعديل</Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">حذف</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            هل أنت متأكد من حذف هذه الميزة؟ لا يمكن التراجع عن هذا الإجراء.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(feature.id)}>حذف</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
} 