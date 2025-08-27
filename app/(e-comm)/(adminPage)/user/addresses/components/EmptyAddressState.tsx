import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';

interface EmptyAddressStateProps {
  onAddAddress: () => void;
}

export default function EmptyAddressState({ onAddAddress }: EmptyAddressStateProps) {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">لا توجد عناوين</h3>
        <p className="text-muted-foreground mb-4">
          أضف عنوانك الأول لتسهيل عملية التوصيل
        </p>
        <Button onClick={onAddAddress} className="btn-add">
          <Plus className="h-4 w-4 ml-2" />
          إضافة عنوان جديد
        </Button>
      </CardContent>
    </Card>
  );
}














