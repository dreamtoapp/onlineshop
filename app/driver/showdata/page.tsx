import {
  ORDER_STATUS,
  OrderStatus,
} from '@/constant/order-status';

import { getOrderByStatus } from '../actions/getOrderByStatus';
import { getActiveTrip } from '../actions/getActiveTrip';
import AssignedOrderCard from '../components/AssignedOrderCard';

async function page({
  searchParams,
}: {
  searchParams: Promise<{ driverId: string; status: string }>;
}) {
  const { driverId, status } = await searchParams;
  // Convert status string to OrderStatus type
  let normalizedStatus: OrderStatus;
  switch (status) {
    case 'ASSIGNED':
    case ORDER_STATUS.ASSIGNED:
      normalizedStatus = ORDER_STATUS.ASSIGNED;
      break;
    case 'PENDING':
    case ORDER_STATUS.PENDING:
      normalizedStatus = ORDER_STATUS.PENDING;
      break;
    case 'IN_TRANSIT':
    case ORDER_STATUS.IN_TRANSIT:
    case 'IN_WAY': // legacy support
      normalizedStatus = ORDER_STATUS.IN_TRANSIT;
      break;
    case 'DELIVERED':
    case ORDER_STATUS.DELIVERED:
      normalizedStatus = ORDER_STATUS.DELIVERED;
      break;
    case 'CANCELED':
    case ORDER_STATUS.CANCELED:
      normalizedStatus = ORDER_STATUS.CANCELED;
      break;
    default:
      normalizedStatus = ORDER_STATUS.ASSIGNED;
  }
  const orders = await getOrderByStatus(driverId, normalizedStatus);
  const activeTrip = await getActiveTrip(driverId);
  let title = '';
  if (status === ORDER_STATUS.IN_TRANSIT) {
    title = '    📦 قائمة التسليم ';
  }
  if (status === ORDER_STATUS.DELIVERED) {
    title = '    📦 تم التسليم ';
  }
  if (status === ORDER_STATUS.CANCELED) {
    title = '    📦 ملغي ';
  }

  return (
    <div className='flex min-h-screen flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-center font-bold'>
          {title}({orders?.ordersToShip?.length || 0})
        </h1>
      </div>

      {Array.isArray(orders?.ordersToShip) && orders.ordersToShip.length > 0 ? (
        orders.ordersToShip.map((order: any) => (
          <AssignedOrderCard
            key={order.id}
            order={order}
            driverId={driverId}
            activeTrip={activeTrip}
          />
        ))
      ) : (
        <div className='text-center text-muted-foreground mt-8'>لا توجد طلبات مُخصصة</div>
      )}
    </div>
  );
}

export default page;
