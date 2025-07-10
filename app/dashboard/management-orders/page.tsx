
import { getOrderAnalytics } from './actions/get-order-analytics';
import { fetchOrdersAction } from '../management-dashboard/action/fetchOrders';
import OrderManagementView from './components/OrderManagementView';

export default async function OrdersManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status || undefined;

  // Fetch data in parallel
  const [analyticsResult, filteredOrders] = await Promise.all([
    getOrderAnalytics(),
    fetchOrdersAction({
      status: statusFilter,
      page: 1,
      pageSize: 10,
    }),
  ]);



  return (
    <OrderManagementView
      analyticsResult={analyticsResult}
      initialOrders={filteredOrders ?? []}
      statusFilter={statusFilter}
    />
  );
}

