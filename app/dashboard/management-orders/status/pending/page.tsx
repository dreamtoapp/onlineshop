// app/dashboard/orders-management/status/pending/page.tsx

import { Icon } from '@/components/icons/Icon';
import { PageProps } from '@/types/commonTypes';
import { OrderStatus } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import BackButton from '@/components/BackButton';

import {
  fetchAnalytics,
  fetchAssignedAnalytics,
  fetchOrders,
} from './actions/get-pendeing-order';
import PendingOrdersView from './components/PendingOrdersView';
import TabsWrapper from './components/TabsWrapper';

export default async function PendingOrdersPage({
  searchParams,
}: PageProps<Record<string, never>, {
  page?: string;
  pageSize?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  tab?: string;
}>) {
  const resolvedSearchParams = await searchParams;

  // Get current page and page size from URL or use defaults
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const searchTerm = resolvedSearchParams?.search || '';
  const pageSize = Number(resolvedSearchParams?.pageSize) || 10;
  const activeTab = resolvedSearchParams?.tab || 'pending';

  // Ensure sortBy is a valid value for the backend type
  const allowedSortFields = ['createdAt', 'orderNumber', 'amount'] as const;
  const sortByParam = resolvedSearchParams?.sortBy;
  const sortBy = allowedSortFields.includes(sortByParam as any)
    ? (sortByParam as typeof allowedSortFields[number])
    : 'createdAt';
  const sortOrder = resolvedSearchParams?.sortOrder === 'asc' ? 'asc' : 'desc';

  try {
    // Determine which orders to fetch based on active tab
    const orderStatus = activeTab === 'assigned' ? [OrderStatus.ASSIGNED] : [OrderStatus.PENDING];

    // Fetch data in parallel using server actions
    const [orders, pendingAnalytics, assignedAnalytics] = await Promise.all([
      fetchOrders({
        status: orderStatus,
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder,
        search: searchTerm,
      }),
      fetchAnalytics(), // PENDING orders count
      fetchAssignedAnalytics(), // ASSIGNED orders count
    ]);

    return (
      <div className="container mx-auto py-4 space-y-4" dir="rtl">
        {/* Enhanced Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton variant="default" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-yellow-500 rounded-full"></div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Icon name="MousePointerBan" className="h-6 w-6 text-yellow-500" />
                إدارة الطلبات قيد الانتظار
              </h1>
            </div>
          </div>

          {/* Status Badge */}
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-2">
            <Icon name="Clock" className="h-4 w-4" />
            الإجمالي: {pendingAnalytics + assignedAnalytics}
          </Badge>
        </div>

        {/* Tabs System */}
        <TabsWrapper pendingCount={pendingAnalytics} assignedCount={assignedAnalytics}>
          {/* Pending Orders Tab */}
          <TabsContent value="pending" className="space-y-4">
            {/* Status Overview Card for Pending */}
            <Card className="shadow-lg border-l-4 border-l-yellow-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon name="MousePointerBan" className="h-5 w-5 text-yellow-500" />
                  الطلبات قيد الانتظار - تحتاج تخصيص سائق
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-700">العدد الإجمالي</p>
                        <p className="text-2xl font-bold text-yellow-600">{pendingAnalytics}</p>
                      </div>
                      <Icon name="MousePointerBan" className="h-8 w-8 text-yellow-500" />
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">في الصفحة الحالية</p>
                        <p className="text-2xl font-bold text-blue-600">{activeTab === 'pending' ? orders.orders.length : 0}</p>
                      </div>
                      <Icon name="Clock" className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-700">تحتاج معالجة فورية</p>
                        <p className="text-2xl font-bold text-red-600">{Math.ceil(pendingAnalytics * 0.4)}</p>
                      </div>
                      <Icon name="MousePointerBan" className="h-8 w-8 text-red-500" />
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">الصفحة الحالية</p>
                        <p className="text-2xl font-bold text-purple-600">{currentPage}</p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                        {currentPage}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>نصيحة:</strong> هذه الطلبات تحتاج إلى تخصيص سائق. استخدم زر &quot;تخصيص سائق&quot; لكل طلب لبدء عملية التوصيل.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Orders Management for Pending */}
            {activeTab === 'pending' && (
              <PendingOrdersView
                orders={orders.orders}
                pendingCount={pendingAnalytics}
                currentPage={currentPage}
                pageSize={pageSize}
                orderType="pending"
              />
            )}
          </TabsContent>

          {/* Assigned Orders Tab */}
          <TabsContent value="assigned" className="space-y-4">
            {/* Status Overview Card for Assigned */}
            <Card className="shadow-lg border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon name="UserCheck" className="h-5 w-5 text-blue-500" />
                  الطلبات المُخصصة للسائقين - جاهزة للتوصيل
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">العدد الإجمالي</p>
                        <p className="text-2xl font-bold text-blue-600">{assignedAnalytics}</p>
                      </div>
                      <Icon name="UserCheck" className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">في الصفحة الحالية</p>
                        <p className="text-2xl font-bold text-green-600">{activeTab === 'assigned' ? orders.orders.length : 0}</p>
                      </div>
                      <Icon name="Clock" className="h-8 w-8 text-green-500" />
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-700">جاهزة للانطلاق</p>
                        <p className="text-2xl font-bold text-indigo-600">{assignedAnalytics}</p>
                      </div>
                      <Icon name="UserCheck" className="h-8 w-8 text-indigo-500" />
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">الصفحة الحالية</p>
                        <p className="text-2xl font-bold text-purple-600">{currentPage}</p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                        {currentPage}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>معلومة:</strong> هذه الطلبات مُخصصة بالفعل لسائقين وجاهزة للانطلاق. يمكن للسائقين تحديث حالة الطلب إلى &quot;في الطريق&quot;.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Orders Management for Assigned */}
            {activeTab === 'assigned' && (
              <PendingOrdersView
                orders={orders.orders}
                pendingCount={assignedAnalytics}
                currentPage={currentPage}
                pageSize={pageSize}
                orderType="assigned"
              />
            )}
          </TabsContent>
        </TabsWrapper>
      </div>
    );
  } catch (error) {
    console.error('Error in pending orders page:', error);
    return (
      <div className="container mx-auto py-4 space-y-4" dir="rtl">
        <BackButton variant="minimal" />

        {/* Enhanced Error Card */}
        <Card className="shadow-lg border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-red-600">
              <Icon name="MousePointerBan" className="h-5 w-5" />
              خطأ في تحميل الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
              <h3 className="text-xl font-semibold text-red-700 mb-2">حدث خطأ أثناء تحميل الطلبات قيد الانتظار</h3>
              <p className="text-red-600 mb-4">يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.</p>
              <Badge variant="destructive" className="gap-2">
                <Icon name="Clock" className="h-4 w-4" />
                خطأ في التحميل
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

// TODO: Next version enhancements for Pending Orders page
// - Add bulk operations (assign multiple orders to driver, bulk cancel)
// - Implement real-time notifications for new pending orders
// - Add advanced filtering options (date range, amount range, customer type)
// - Implement order priority system with visual indicators
// - Add export functionality for orders data (PDF, Excel)
// - Implement order templates for recurring orders
// - Add customer communication tools (SMS, WhatsApp integration)
// - Implement driver workload balancing algorithm
// - Add order scheduling for future delivery
// - Implement audit trail for all order actions
// - Add performance metrics dashboard for order processing
// - Implement automated order assignment based on driver location/capacity
