'use client';
import { useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Drivers } from './Drivers';
import { approveDriverToOrder } from '../actions/approveOrder-toDtiver';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Icon } from '@/components/icons/Icon';

interface driverProp {
  orderNo: string;
  driverList?: {
    id: string;
    name: string;
  }[];
}

function ConfirmDriver({ orderNo, driverList }: driverProp) {
  const [selectedDriverId, setSelectedDriverId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDriverApproval = useCallback(async () => {
    if (!selectedDriverId) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'يرجى اختيار سائق أولاً',
        confirmButtonText: 'موافق'
      });
      return;
    }

    setIsLoading(true);

    try {
      const isDone = await approveDriverToOrder(orderNo, selectedDriverId);
      Swal.fire({
        icon: isDone.success ? 'success' : 'error',
        title: 'إسناد طلبية للسائق',
        text: isDone.message,
        confirmButtonText: 'موافق'
      });
      if (isDone.success) router.push('/dashboard');
    } catch (error) {
      console.error('Failed to assign driver:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء إسناد الطلبية للسائق',
        confirmButtonText: 'موافق'
      });
    } finally {
      setIsLoading(false);
    }
  }, [orderNo, selectedDriverId, router]);

  const memoizedDrivers = useMemo(
    () => (
      <Drivers
        drivers={driverList || []}
        selectedDriverId={selectedDriverId}
        setSelectedDriverId={setSelectedDriverId}
      />
    ),
    [driverList, selectedDriverId],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-edit w-full sm:w-auto flex items-center gap-2 shadow-md">
          <Icon name="Truck" className="h-4 w-4" />
          تحديد السائق
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Icon name="Truck" className="h-5 w-5 text-feature-commerce icon-enhanced" />
            إسناد الطلبية للسائق
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            طلبية رقم: <span className="font-medium text-foreground">{orderNo}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Driver Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="UserCheck" className="h-4 w-4 text-feature-users" />
              <span className="text-sm font-medium text-foreground">اختر السائق المناسب:</span>
            </div>

            {driverList && driverList.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {memoizedDrivers}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <Icon name="AlertTriangle" className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700">لا يوجد سائقين متاحين حالياً</span>
              </div>
            )}
          </div>

          {/* Selected Driver Preview */}
          {selectedDriverId && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2">
                <Icon name="UserCheck" className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  السائق المختار: {driverList?.find(d => d.id === selectedDriverId)?.name}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <DialogTrigger asChild>
            <Button variant="outline" className="btn-cancel-outline flex-1">
              إلغاء
            </Button>
          </DialogTrigger>
          <Button
            disabled={isLoading || !selectedDriverId}
            onClick={handleDriverApproval}
            className="btn-add flex-1"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                جارٍ التأكيد...
              </>
            ) : (
              <>
                <Icon name="UserCheck" className="h-4 w-4" />
                تأكيد العملية
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDriver;
