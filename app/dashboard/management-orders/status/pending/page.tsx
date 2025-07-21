// app/dashboard/orders-management/status/pending/page.tsx

import { Icon } from '@/components/icons/Icon';
import { PageProps } from '@/types/commonTypes';
import { OrderStatus } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';

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
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-status-pending rounded-full"></div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Icon name="MousePointerBan" className="h-6 w-6 text-status-pending" />
                إدارة الطلبات قيد الانتظار
              </h1>
            </div>
          </div>

          {/* Status Badge */}
          <Badge variant="outline" className="bg-status-pending-soft text-status-pending border-status-pending gap-2">
            <Icon name="Clock" className="h-4 w-4" />
            الإجمالي: {pendingAnalytics + assignedAnalytics}
          </Badge>
        </div>

        {/* Tabs System */}
        <TabsWrapper pendingCount={pendingAnalytics} assignedCount={assignedAnalytics}>
          {/* Pending Orders Tab */}
          <TabsContent value="pending" className="space-y-4">
            {/* Status Overview Card for Pending */}
            <Card className="shadow-lg border-l-4 border-l-status-pending">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center gap-2 justify-between" dir="rtl">
                  <CardTitle className="flex items-center gap-2 text-lg mb-0">
                    <Icon name="MousePointerBan" className="h-5 w-5 text-status-pending" />
                    الطلبات قيد الانتظار
                  </CardTitle>
                  {/* Compact badges row beside the title */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-xs bg-status-pending-soft text-status-pending border-status-pending min-w-[90px]">
                      <Icon name="MousePointerBan" className="h-4 w-4" />
                      <span>العدد الإجمالي</span>
                      <span className="font-bold">{pendingAnalytics}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-xs bg-feature-analytics-soft text-feature-analytics border-feature-analytics min-w-[90px]">
                      <Icon name="Clock" className="h-4 w-4" />
                      <span>في الصفحة الحالية</span>
                      <span className="font-bold">{activeTab === 'pending' ? orders.orders.length : 0}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-xs bg-status-urgent-soft text-status-urgent border-status-urgent min-w-[90px]">
                      <Icon name="MousePointerBan" className="h-4 w-4" />
                      <span>تحتاج معالجة فورية</span>
                      <span className="font-bold">{Math.ceil(pendingAnalytics * 0.4)}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-xs bg-neutral-soft-background text-neutral-foreground border-neutral-foreground min-w-[90px]">
                      <span>الصفحة الحالية</span>
                      <span className="font-bold">{currentPage}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">

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
            <Card className="shadow-lg border-l-4 border-l-feature-analytics">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon name="UserCheck" className="h-5 w-5 text-feature-analytics" />
                  الطلبات المُخصصة للسائقين - جاهزة للتوصيل
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-feature-analytics-soft rounded-lg p-4 border border-feature-analytics">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-feature-analytics">العدد الإجمالي</p>
                        <p className="text-2xl font-bold text-feature-analytics">{assignedAnalytics}</p>
                      </div>
                      <Icon name="UserCheck" className="h-8 w-8 text-feature-analytics" />
                    </div>
                  </div>

                  <div className="bg-success-soft-background rounded-lg p-4 border border-success-fg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-success-fg">في الصفحة الحالية</p>
                        <p className="text-2xl font-bold text-success-fg">{activeTab === 'assigned' ? orders.orders.length : 0}</p>
                      </div>
                      <Icon name="Clock" className="h-8 w-8 text-success-fg" />
                    </div>
                  </div>

                  <div className="bg-info-soft-background rounded-lg p-4 border border-info-fg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-info-fg">جاهزة للانطلاق</p>
                        <p className="text-2xl font-bold text-info-fg">{assignedAnalytics}</p>
                      </div>
                      <Icon name="UserCheck" className="h-8 w-8 text-info-fg" />
                    </div>
                  </div>

                  <div className="bg-neutral-soft-background rounded-lg p-4 border border-neutral-foreground">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-foreground">الصفحة الحالية</p>
                        <p className="text-2xl font-bold text-neutral-foreground">{currentPage}</p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-neutral-foreground flex items-center justify-center text-white font-bold">
                        {currentPage}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-info-soft-background border border-info-fg rounded-lg">
                  <p className="text-sm text-info-fg">
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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-yellow-500 rounded-full"></div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon name="MousePointerBan" className="h-6 w-6 text-yellow-500" />
              خطأ في تحميل الطلبات
            </h1>
          </div>
        </div>

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
