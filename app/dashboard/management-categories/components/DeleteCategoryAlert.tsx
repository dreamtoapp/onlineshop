'use client';

import { useState } from 'react';

import {
  Loader2,
  Trash,
} from 'lucide-react';
import Swal from 'sweetalert2';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { deleteCategory } from '../actions/deleteCategory';

interface DeleteCategoryAlertProps {
  categoryId: string;
}

export default function DeleteCategoryAlert({ categoryId }: DeleteCategoryAlertProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const result = await deleteCategory(categoryId);

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف بنجاح',
          text: 'تم إزالة بيانات التصنيف من النظام',
          confirmButtonText: 'تم',
          confirmButtonAriaLabel: 'تأكيد استلام رسالة النجاح',
        });
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'تعذر الحذف',
        text: result.message || 'حدث خطأ أثناء محاولة الحذف. يرجى المحاولة لاحقًا',
        confirmButtonText: 'حسنا',
        confirmButtonAriaLabel: 'تأكيد استلام رسالة الخطأ',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'خطأ غير متوقع',
        text: 'حدث عطل تقني غير متوقع. يرجى إبلاغ الدعم الفني',
        confirmButtonText: 'تم الإبلاغ',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='size-10 flex flex-row-reverse hover:bg-destructive/90 hover:text-destructive-foreground'
          aria-label='فتح نافذة حذف التصنيف'
        >
          <Trash className='h-4 w-4 text-destructive' aria-hidden />
        </Button>
      </DialogTrigger>

      <DialogContent
        className='border-destructive/30 bg-background/95 backdrop-blur-sm'
        role='dialog'
        aria-labelledby='deleteConfirmationHeading'
        dir='rtl'
      >
        <DialogTitle id='deleteConfirmationHeading'>تأكيد الحذف النهائي للتصنيف</DialogTitle>

        <DialogHeader>
          <DialogTitle className='text-right text-xl font-bold text-destructive'>
            ⚠️ تأكيد الحذف النهائي
          </DialogTitle>

          <DialogDescription className='text-right text-sm text-muted-foreground/90'>
            سيتم حذف جميع بيانات التصنيف بما في ذلك:
          </DialogDescription>

          <div className='text-right text-muted-foreground/90'>
            <ul className='list-disc space-y-2 pr-4'>
              <li>المنتجات المرتبطة</li>
              <li>سجل الفئات الفرعية</li>
              <li>بيانات الوصف والترتيب</li>
            </ul>
          </div>
        </DialogHeader>

        <DialogFooter className='flex flex-row-reverse gap-3'>
          <DialogClose asChild>
            <Button
              variant='secondary'
              className='bg-muted/80 hover:bg-accent'
              aria-label='إلغاء عملية الحذف'
            >
              إلغاء الحذف
            </Button>
          </DialogClose>

          <Button
            onClick={handleDelete}
            disabled={isProcessing}
            className='bg-destructive/90 text-destructive-foreground hover:bg-destructive'
            aria-describedby='deleteConfirmationHeading'
          >
            {isProcessing ? (
              <>
                <Loader2 className='ml-2 h-4 w-4 animate-spin' aria-hidden />
                <span>جارِ تنفيذ العملية...</span>
              </>
            ) : (
              'تأكيد الحذف الدائم'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
