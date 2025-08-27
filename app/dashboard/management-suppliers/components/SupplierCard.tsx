'use client';

import Link from 'next/link';
import { toast } from 'sonner';

import AddImage from '@/components/AddImage';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { Supplier } from '@/types/databaseTypes';

import DeleteSupplierAlert from './DeleteSupplierAlert';
import AddSupplier from './SupplierUpsert';

interface SupplierCardProps {
  supplier: Supplier;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAnalytics?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function SupplierCard({
  supplier,
}: SupplierCardProps) {
  const {
    id,
    name,
    email,
    phone,
    type,
    address,

    // products,
    createdAt,
  } = supplier;

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-md overflow-hidden">


      <div className="relative w-full aspect-square overflow-hidden rounded-none bg-muted/20">
        <AddImage
          url={supplier.logo ?? ""}
          alt={`${supplier.name}'s profile`}
          recordId={supplier.id}
          table="supplier"
          tableField='logo'
          onUploadComplete={() => toast.success("تم رفع الصورة بنجاح")}
        />


      </div>

      <div className="flex flex-1 flex-col p-4 space-y-2 min-h-[160px] relative">
        <div className='flex items-center justify-between'>
          <h3 className="text-lg font-semibold truncate" title={name}>
            {name}
          </h3>
        </div>
        {email && (
          <a
            href={`mailto:${email}`}
            className="text-sm text-muted-foreground truncate flex items-center gap-2 hover:underline"
            title={email}
            role="button"
            aria-label="إرسال بريد للمورد"
          >
            <Icon name="Mail" className="h-4 w-4" />
            {email}
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="text-sm text-muted-foreground flex items-center gap-2 hover:underline"
            aria-label="الاتصال بالمورد"
          >
            <Icon name="Phone" className="h-4 w-4" />
            {phone}
          </a>
        )}
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Icon name="Receipt" className={`h-4 w-4 ${supplier.taxNumber ? '' : 'text-destructive'}`} />
          {supplier.taxNumber || '—'}
        </p>
        <span className="absolute bottom-2 left-4 text-[10px] text-muted-foreground">
          {formatDate(createdAt)}
        </span>
      </div>

      {/* Footer with all action icons (ordered: View, Analytics, Edit, Delete) */}

      <footer className="flex justify-around border-t px-4 py-2 bg-muted items-center">
        {/* View */}
        <Button asChild variant="ghost" size="icon" aria-label="عرض">
          <Link href={`/dashboard/management-suppliers/view/${id}`}>
            <Icon name="Eye" className="h-5 w-5" />
          </Link>
        </Button>

        {/* Analytics */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="تحليلات"
          onClick={() => alert("comeing soon")}
        >
          <Icon name="BarChart2" className="h-5 w-5" />
        </Button>

        {/* Divider */}
        <div className="h-6 w-px bg-border/60" aria-hidden />

        {/* Edit */}
        <AddSupplier
          mode='update'
          iconOnly
          title={"تعديل مورد"}
          description={"يرجى إدخال بيانات المورد"}
          defaultValues={{
            id,
            type,
            name,
            email,
            phone,
            address,
            taxNumber: supplier.taxNumber ?? '',
          }} />

        {/* Delete */}
        <DeleteSupplierAlert supplierId={id} />
      </footer>

    </div>
  );
}
