import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import BackButton from '@/components/BackButton';

import OrderAnalyticsDashboard from '../../components/OrderAnalyticsDashboard';
import type { GetOrderAnalyticsResult } from '../../actions/get-order-analytics';

interface OrderAnalyticsViewProps {
    analyticsResult: GetOrderAnalyticsResult;
}

export default function OrderAnalyticsView({
    analyticsResult
}: OrderAnalyticsViewProps) {
    return (
        <div className="container mx-auto py-8 space-y-6">
            <BackButton variant="default" />

            <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-feature-analytics rounded-full"></div>
                <h1 className="text-3xl font-bold text-foreground">تحليلات الطلبات المتقدمة</h1>
            </div>

            <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <TrendingUp className="h-5 w-5 text-feature-analytics icon-enhanced" />
                        التقارير والإحصائيات
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <OrderAnalyticsDashboard analyticsData={analyticsResult} />
                </CardContent>
            </Card>
        </div>
    );
} 