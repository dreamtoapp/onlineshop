"use client";
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { toast } from 'sonner';

const faqSchema = z.object({
    question: z.string().min(2, 'السؤال مطلوب'),
    answer: z.string().min(2, 'الإجابة مطلوبة'),
});

type FAQFormValues = z.infer<typeof faqSchema>;

type FAQ = FAQFormValues & { id: string };

export default function FAQTabClient({ aboutPageId }: { aboutPageId: string | null }) {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [form, setForm] = useState<FAQFormValues>({ question: '', answer: '' });
    const [editId, setEditId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/about/faq')
            .then(res => res.json())
            .then(res => {
                if (res.success) setFaqs(res.faqs);
            });
    }, []);

    async function handleAddOrEdit(e: any) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (editId) {
            // Edit mode
            const res = await fetch('/api/about/faq', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editId, ...form }),
            });
            const result = await res.json();
            if (result.success) {
                setFaqs((prev) => prev.map(f => f.id === editId ? result.faq : f));
                setForm({ question: '', answer: '' });
                setEditId(null);
                toast.success('تم تحديث السؤال بنجاح');
            } else {
                setError(result.error?.toString() || 'فشل في التعديل');
            }
        } else {
            // Add mode
            if (!aboutPageId) {
                setError('لا يمكن إضافة سؤال قبل تحميل بيانات الصفحة');
                setLoading(false);
                return;
            }
            const res = await fetch('/api/about/faq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, aboutPageId }),
            });
            const result = await res.json();
            if (result.success) {
                setFaqs((prev) => [...prev, result.faq]);
                setForm({ question: '', answer: '' });
                toast.success('تمت إضافة السؤال بنجاح');
            } else {
                setError(result.error?.toString() || 'فشل في الإضافة');
            }
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/about/faq', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const result = await res.json();
        if (result.success) {
            setFaqs((prev) => prev.filter(f => f.id !== id));
            if (editId === id) {
                setEditId(null);
                setForm({ question: '', answer: '' });
            }
        } else {
            setError(result.error?.toString() || 'فشل في الحذف');
        }
        setLoading(false);
    }

    function handleEdit(faq: FAQ) {
        setEditId(faq.id);
        setForm({ question: faq.question, answer: faq.answer });
    }

    function handleCancelEdit() {
        setEditId(null);
        setForm({ question: '', answer: '' });
        setError(null);
    }

    return (
        <Card className="p-6 mb-4">
            <h2 className="text-xl font-bold mb-4">إدارة الأسئلة الشائعة</h2>
            <form onSubmit={handleAddOrEdit} className="space-y-4 mb-6">
                <div>
                    <label className="block font-bold mb-1">السؤال</label>
                    <Input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
                </div>
                <div>
                    <label className="block font-bold mb-1">الإجابة</label>
                    <Textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>{editId ? 'تحديث' : 'إضافة'}</Button>
                    {editId && <Button type="button" variant="outline" onClick={handleCancelEdit}>إلغاء</Button>}
                </div>
            </form>
            <Accordion type="multiple" className="w-full">
                {faqs.map((faq) => (
                    <AccordionItem value={faq.id} key={faq.id}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2">
                                <div>{faq.answer}</div>
                                <div className="flex gap-2 mt-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(faq)}>تعديل</Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(faq.id)}>حذف</Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </Card>
    );
} 