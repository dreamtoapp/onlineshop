'use client';

import { Button } from '@/components/ui/button';
import { Loader2, MapPin } from 'lucide-react';
import { AddressInput } from '../helpers';

interface AddressFormFooterProps {
  isSubmitting: boolean;
  onCancel: () => void;
  address?: AddressInput;
}

export function AddressFormFooter({ isSubmitting, onCancel, address }: AddressFormFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border bg-background">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="px-6"
        disabled={isSubmitting}
      >
        إلغاء
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="px-6"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            جاري الحفظ...
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4 ml-2" />
            {address ? 'تحديث العنوان' : 'إضافة العنوان'}
          </>
        )}
      </Button>
    </div>
  );
}
