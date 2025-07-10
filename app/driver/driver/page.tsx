import { OrderStatus } from '@prisma/client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';

import DriverHeader from '../components/DriverHeader';

import ActiveTrip from './component/ActiveTrip';
import { getActiveTrip } from './action/getActiveTrip';
import { getOrderCount } from './action/getOrderCount';

const NoActiveOrder = () => (
  <Card className='mx-auto mt-8 w-full max-w-md'>
    <CardHeader className='text-center'>
      <Icon name="Rocket" className='mx-auto h-12 w-12 text-primary' />
      <CardTitle>لا يوجد رحلة نشطة</CardTitle>
      <CardDescription>سيتم عرض تفاصيل الرحلة هنا عندما تصبح متاحة</CardDescription>
    </CardHeader>
  </Card>
);

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ driverId: string; status: string; name: string }>;
}) {
  try {
    const { driverId, name } = await searchParams;

    // Parallel data fetching for better performance
    const [activeTrip, orderCount] = await Promise.all([
      getActiveTrip(driverId),
      getOrderCount(driverId),
    ]);

    // Patch: convert status string to OrderStatus enum if needed
    if (activeTrip && activeTrip.status) {
      // Normalize status values to proper enum values
      switch (activeTrip.status) {
        case OrderStatus.PENDING:
          activeTrip.status = OrderStatus.PENDING;
          break;
        case OrderStatus.IN_TRANSIT:
          activeTrip.status = OrderStatus.IN_TRANSIT;
          break;
        case OrderStatus.DELIVERED:
          activeTrip.status = OrderStatus.DELIVERED;
          break;
        case OrderStatus.CANCELED:
          activeTrip.status = OrderStatus.CANCELED;
          break;
        default:
          activeTrip.status = OrderStatus.PENDING;
      }
    }

    const totalCount =
      (orderCount.counts?.inWay || 0) +
      (orderCount.counts?.canceled || 0) +
      (orderCount.counts?.delivered || 0);

    return (
      <div className='flex min-h-screen w-full flex-col items-center justify-center'>
        <DriverHeader
          orderCount={totalCount}
          drivername={name}
          inWayOrders={orderCount.counts?.inWay || 0}
          canceledOrders={orderCount.counts?.canceled || 0}
          deliveredOrders={orderCount.counts?.delivered || 0}
          driverId={driverId}
        />

        {activeTrip ? <ActiveTrip order={activeTrip} /> : <NoActiveOrder />}
      </div>
    );
  } catch {
    return (
      <Alert variant='destructive'>
        <AlertTitle>حدث خطأ</AlertTitle>
        <AlertDescription>فشل في تحميل البيانات، يرجى التحقق من الاتصال بالإنترنت</AlertDescription>
      </Alert>
    );
  }
}

// Add loading state skeleton

export default Page;
