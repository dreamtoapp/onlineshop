'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';

import BackButton from '@/components/BackButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { assignDriverToOrder } from '../actions/assign-driver';
import { DriverDetails } from '../actions/get-drivers';
import DriverSelectionGrid from './DriverSelectionGrid';
import OrderSummaryPanel from './OrderSummaryPanel';
import SmartSuggestions from './SmartSuggestions';

interface AssignDriverClientProps {
    order: any;
    drivers: DriverDetails[];
    orderId: string;
    view?: 'grid' | 'list' | 'map';
    filter?: string;
    sort?: 'distance' | 'rating' | 'availability' | 'performance';
}

export default function AssignDriverClient({
    order,
    drivers,
    orderId,
    view = 'grid'
}: AssignDriverClientProps) {
    const router = useRouter();
    const [isAssigning, setIsAssigning] = useState<string | null>(null);

    const handleAssignDriver = async (driverId: string) => {
        setIsAssigning(driverId);

        try {
            const result = await assignDriverToOrder({
                orderId,
                driverId,
                estimatedDeliveryTime: 45,
                priority: 'normal'
            });

            if (result.success) {
                toast.success("تم التعيين بنجاح", {
                    description: result.message,
                });

                // Redirect back to orders page
                router.push('/dashboard/management-orders');
            } else {
                toast.error("فشل في التعيين", {
                    description: result.message,
                });
            }
        } catch (error) {
            console.error('Assignment error:', error);
            toast.error("خطأ في التعيين", {
                description: "حدث خطأ أثناء تعيين السائق",
            });
        } finally {
            setIsAssigning(null);
        }
    };

    // Status color mapping with enhanced feature colors
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'border-status-pending text-status-pending bg-status-pending/10';
            case 'delivered':
                return 'border-status-delivered text-status-delivered bg-status-delivered/10';
            case 'cancelled':
                return 'border-status-canceled text-status-canceled bg-status-canceled/10';
            case 'in_transit':
                return 'border-feature-commerce text-feature-commerce bg-feature-commerce/10';
            default:
                return 'border-muted-foreground text-muted-foreground bg-muted/30';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/30 font-cairo" dir="rtl">

            {/* Enhanced Header */}
            <div className="bg-card shadow-sm border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-card/95">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <BackButton variant="default" />
                            <div>
                                <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-feature-users/10">
                                        <Icon name="Truck" className="h-6 w-6 text-feature-users icon-enhanced" />
                                    </div>
                                    تعيين سائق للطلب
                                </h1>
                                <p className="text-muted-foreground text-sm mt-1">
                                    اختر أفضل سائق لتوصيل الطلب #{order.orderNumber || order.id.slice(0, 8)}
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden lg:flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-feature-commerce">{order.amount?.toFixed(2) || '0.00'}</p>
                                <p className="text-xs text-muted-foreground">قيمة الطلب (د.ك)</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-feature-products">{order.items?.length || 0}</p>
                                <p className="text-xs text-muted-foreground">عدد المنتجات</p>
                            </div>
                            <div className="w-px h-12 bg-border"></div>
                            <Badge className={`px-3 py-1 font-medium ${getStatusColor(order.status)}`}>
                                {order.status === 'pending' ? 'قيد الانتظار' : order.status}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* Enhanced Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4 mb-6">
                    <Card className="shadow-lg border-l-4 border-l-feature-users card-hover-effect overflow-hidden group">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-feature-users/10 group-hover:bg-feature-users/20 transition-colors">
                                    <Icon name="User" className="h-5 w-5 text-feature-users icon-enhanced" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">السائقون المتاحون</p>
                                    <p className="text-2xl font-bold text-feature-users">
                                        {drivers.filter(d => d.status === 'available').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect overflow-hidden group">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-feature-analytics/10 group-hover:bg-feature-analytics/20 transition-colors">
                                    <Icon name="Star" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">متوسط التقييم</p>
                                    <p className="text-2xl font-bold text-feature-analytics">
                                        {drivers.length > 0
                                            ? (drivers.reduce((sum, d) => sum + (d.rating || 0), 0) / drivers.length).toFixed(1)
                                            : '0.0'
                                        } ⭐
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-l-4 border-l-feature-commerce card-hover-effect overflow-hidden group">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-feature-commerce/10 group-hover:bg-feature-commerce/20 transition-colors">
                                    <Icon name="Clock" className="h-5 w-5 text-feature-commerce icon-enhanced" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">وقت التوصيل المتوقع</p>
                                    <p className="text-2xl font-bold text-feature-commerce">30-45</p>
                                    <p className="text-xs text-muted-foreground">دقيقة</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-l-4 border-l-feature-products card-hover-effect overflow-hidden group">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-feature-products/10 group-hover:bg-feature-products/20 transition-colors">
                                    <Icon name="Truck" className="h-5 w-5 text-feature-products icon-enhanced" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">معدل الإنجاز</p>
                                    <p className="text-2xl font-bold text-feature-products">
                                        {drivers.length > 0
                                            ? (drivers.reduce((sum, d) => sum + (d.completionRate || 0), 0) / drivers.length).toFixed(1)
                                            : '0'
                                        }%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content - Vertical Layout */}
                <div className="flex flex-col gap-6">

                    {/* Section 1 - Order Summary */}
                    <div className="w-full">
                        <OrderSummaryPanel order={order} />
                    </div>

                    {/* Section 2 - Driver Selection Grid */}
                    <div className="w-full">
                        <Card className="shadow-xl border-l-4 border-l-feature-users card-hover-effect overflow-hidden">
                            <CardHeader className="pb-4 bg-gradient-to-r from-feature-users/5 to-transparent">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 rounded-lg bg-feature-users/10">
                                        <Icon name="User" className="h-5 w-5 text-feature-users icon-enhanced" />
                                    </div>
                                    <div>
                                        <span className="text-lg font-bold">جميع السائقين المتاحين</span>
                                        <span className="text-sm text-muted-foreground block">({drivers.length} سائق)</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <DriverSelectionGrid
                                    drivers={drivers}
                                    orderId={orderId}
                                    orderLocation={{
                                        address: order.location?.address || '',
                                        latitude: order.location?.latitude,
                                        longitude: order.location?.longitude,
                                    }}
                                    view={view === 'map' ? 'grid' : view}
                                    onAssignDriver={handleAssignDriver}
                                    isAssigning={isAssigning}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Section 3 - Smart Suggestions */}
                    <div className="w-full">
                        <SmartSuggestions
                            drivers={drivers}
                            isLoading={false}
                            onAssignDriver={handleAssignDriver}
                            isAssigning={isAssigning !== null}
                            orderLocation={{
                                address: order.location?.address || '',
                                latitude: order.location?.latitude,
                                longitude: order.location?.longitude,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 