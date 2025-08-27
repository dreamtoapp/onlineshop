import { Button, buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from '@/components/link';
import { Icon } from '@/components/icons/Icon';

interface AddressHeaderProps {
  onAddAddress: () => void;
}

export default function AddressHeader({ onAddAddress }: AddressHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">إدارة العناوين</h1>
        <p className="text-muted-foreground">أضف أو عدّل عناوين التوصيل الخاصة بك</p>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/" className={buttonVariants({ variant: "default" })}>
          <Icon name='ShoppingBag' className="h-4 w-4 ml-2" />
          تسوق الان
        </Link>
        <Button onClick={onAddAddress} className="btn-add">
          <Plus className="h-4 w-4 ml-2" />
          إضافة عنوان
        </Button>
      </div>
    </div>
  );
}














