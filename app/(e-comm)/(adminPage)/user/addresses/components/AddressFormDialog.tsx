import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddressForm from './AddressForm';
import type { Address } from '@prisma/client';
import { MapPin } from 'lucide-react';
import type { AddressInput } from '../helpers';


interface AddressFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingAddress: Address | null;
  userId: string;
  onSubmit: (data: AddressInput) => void;
  onCancel: () => void;
}

export default function AddressFormDialog({
  isOpen,
  onOpenChange,
  editingAddress,
  onSubmit,
  onCancel
}: AddressFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <MapPin className="h-5 w-5" />
            </div>
            {editingAddress ? 'تعديل العنوان' : 'إضافة عنوان جديد'}
          </DialogTitle>
        </DialogHeader>
        <AddressForm
          address={editingAddress ? {
            label: editingAddress.label,
            district: editingAddress.district,
            street: editingAddress.street,
            buildingNumber: editingAddress.buildingNumber,
            floor: editingAddress.floor === null ? undefined : editingAddress.floor,
            apartmentNumber: editingAddress.apartmentNumber === null ? undefined : editingAddress.apartmentNumber,
            landmark: editingAddress.landmark === null ? undefined : editingAddress.landmark,
            deliveryInstructions: editingAddress.deliveryInstructions === null ? undefined : editingAddress.deliveryInstructions,
            latitude: editingAddress.latitude === null ? undefined : editingAddress.latitude,
            longitude: editingAddress.longitude === null ? undefined : editingAddress.longitude,
            isDefault: editingAddress.isDefault,
          } : undefined}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
