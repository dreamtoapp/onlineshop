'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '../../../../components/ui/button';
import { startTrip } from '../action/startTrip';
import { Icon } from '@/components/icons/Icon';

interface Props {
  orderId: string;
  driverId: string;
  latitude: string;
  longitude: string;
  driverName: string;
}

function StartTrip({ orderId, driverId, latitude, longitude, driverName }: Props) {
  const router = useRouter();

  const handleStartTrip = async () => {
    try {
      if (!orderId) {
        toast.error('لا يوجد سائق لهذا الطلب');
        return;
      }

      const result = await startTrip(
        orderId,
        driverId,
        latitude,
        longitude,
      );

      if (!result.success) {
        toast.error(result.error ?? 'حدث خطأ غير متوقع'); // Use nullish coalescing
        return;
      }

      router.push(`/driver-trip/driver?driverId=${driverId}&status=InWay&name=${driverName}`);
    } catch (error) { // Remove explicit any type
      let errorMessage = 'فشل في الحصول على الموقع';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <Button onClick={handleStartTrip} className='flex h-12 w-1/2 items-center gap-4'>
      <p>ابداء الرحلة</p>
      <Icon name="Rocket" size="xl" className="text-white" />
    </Button>
  );
}

export default StartTrip;
