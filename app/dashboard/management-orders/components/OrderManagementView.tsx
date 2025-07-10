import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import BackButton from '@/components/BackButton';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';

import OrderCardView from './OrderCardView';
import OrderDashboardHeader from './OrderDashboardHeader';
import type { GetOrderAnalyticsResult, OrderAnalyticsData } from '../actions/get-order-analytics';
import type { Order } from '@/types/databaseTypes';

interface OrderManagementViewProps {
    analyticsResult: GetOrderAnalyticsResult;
    initialOrders: Order[];
    statusFilter?: string;
}

export default function OrderManagementView({
    analyticsResult,
    initialOrders,
    statusFilter
}: OrderManagementViewProps) {
    // Extract analytics data from result
    const analyticsData: OrderAnalyticsData = analyticsResult.success ? analyticsResult.data! : {
        totalOrders: 0,
        ordersByStatus: [],
        totalRevenue: 0,
        todayOrdersByStatus: [],
        unfulfilledOrders: 0,
        returnsCount: 0,
        salesTrends: [],
        topProducts: [],
        topCustomers: []
    };

    return (
        <div className="container mx-auto py-4 space-y-4">
            {/* Compact Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <BackButton variant="minimal" />
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1 bg-feature-commerce rounded-full"></div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Icon name="Package" className="h-6 w-6 text-feature-commerce" />
                            إدارة الطلبات
                        </h1>
                    </div>
                </div>

                {/* Quick Action Button */}
                <Link href="/dashboard/management-orders/analytics">
                    <Button variant="outline" className="gap-2">
                        <Icon name="BarChart3" className="h-4 w-4" />
                        التحليلات التفصيلية
                    </Button>
                </Link>
            </div>

            {/* Dashboard Header with Status Cards */}
            <OrderDashboardHeader
                initialFilter={statusFilter || 'All'}
                totalOrders={analyticsData.totalOrders || 0}
                pendingOrders={analyticsData.ordersByStatus?.find(s => s.status === 'PENDING')?._count?.status || 0}
                deliveredOrders={analyticsData.ordersByStatus?.find(s => s.status === 'DELIVERED')?._count?.status || 0}
                inWaydOrders={analyticsData.ordersByStatus?.find(s => s.status === 'IN_TRANSIT')?._count?.status || 0}
                cancelOrders={analyticsData.ordersByStatus?.find(s => s.status === 'CANCELED')?._count?.status || 0}
            />

            {/* Orders Management Card */}
            <Card className="shadow-lg border-l-4 border-l-feature-commerce">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon name="List" className="h-5 w-5 text-feature-commerce" />
                        إدارة الطلبات اليومية
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <OrderCardView initialOrders={initialOrders} status={statusFilter} />
                </CardContent>
            </Card>
        </div>
    );
} 