'use client';

import { useState } from 'react';
import { Icon } from '@/components/icons/Icon';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { DriverDetails } from '../actions/get-drivers';

// TODO: Replace with actual data from database
// This should come from Order table where driverId matches
interface DriverOrderStats {
    deliveredOrders: number;
    cancelledOrders: number;
    totalOrders: number;
    recentOrders: {
        id: string;
        orderNumber: string;
        status: 'delivered' | 'cancelled';
        amount: number;
        customerName: string;
        date: string;
        reason?: string; // For cancelled orders
    }[];
}

// TODO: Move this to a separate service/action file
// This should query the actual Order table in the database
const getDriverOrderStats = (driverId: string): DriverOrderStats => {
    // TODO: Implement actual database query
    // Example query:
    // SELECT 
    //   COUNT(CASE WHEN status = 'DELIVERED' THEN 1 END) as deliveredOrders,
    //   COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelledOrders,
    //   COUNT(*) as totalOrders
    // FROM Order WHERE driverId = ? AND status IN ('DELIVERED', 'CANCELLED')

    // Create deterministic dummy data based on driver ID to prevent hydration mismatch
    const hash = driverId.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);

    const seed = Math.abs(hash);
    const deliveredOrders = (seed % 30) + 20; // 20-49 orders
    const cancelledOrders = (seed % 5) + 1;   // 1-5 orders

    // Dummy data for demonstration
    const dummyStats: DriverOrderStats = {
        deliveredOrders,
        cancelledOrders,
        totalOrders: 0, // Will be calculated
        recentOrders: [
            {
                id: '1',
                orderNumber: 'ORD-001',
                status: 'delivered',
                amount: 25.50,
                customerName: 'أحمد محمد',
                date: '2024-01-15',
            },
            {
                id: '2',
                orderNumber: 'ORD-002',
                status: 'delivered',
                amount: 18.75,
                customerName: 'فاطمة علي',
                date: '2024-01-14',
            },
            {
                id: '3',
                orderNumber: 'ORD-003',
                status: 'cancelled',
                amount: 32.00,
                customerName: 'محمد أحمد',
                date: '2024-01-13',
                reason: 'العميل غير متاح'
            },
            {
                id: '4',
                orderNumber: 'ORD-004',
                status: 'delivered',
                amount: 45.25,
                customerName: 'سارة محمود',
                date: '2024-01-12',
            },
            {
                id: '5',
                orderNumber: 'ORD-005',
                status: 'cancelled',
                amount: 28.50,
                customerName: 'عبد الله حسن',
                date: '2024-01-11',
                reason: 'منتج غير متوفر'
            }
        ]
    };

    dummyStats.totalOrders = dummyStats.deliveredOrders + dummyStats.cancelledOrders;
    return dummyStats;
};

interface DriverCardProps {
    driver: DriverDetails;
    orderId: string;
    orderLocation: {
        address: string;
        latitude?: number;
        longitude?: number;
    } | null;
    isAssigning: boolean;
    onAssign: () => void;
    view?: 'grid' | 'list';
}

export default function DriverCard({
    driver,
    orderId,
    orderLocation,
    isAssigning,
    onAssign,
    view = 'grid'
}: DriverCardProps) {
    // Note: orderId and orderLocation are not currently used in the implementation
    // They are kept for future feature development
    void orderId;
    void orderLocation;
    const [showDeliveredOrders, setShowDeliveredOrders] = useState(false);
    const [showCancelledOrders, setShowCancelledOrders] = useState(false);

    // TODO: Replace with actual API call
    const orderStats = getDriverOrderStats(driver.id);

    // Note: These helper functions are not currently used but kept for future features
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'busy':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'offline':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available':
                return 'متاح';
            case 'busy':
                return 'مشغول';
            case 'offline':
                return 'غير متصل';
            default:
                return 'غير معروف';
        }
    };

    // Simplified function to get delivery status display - only two states
    const getDeliveryStatusDisplay = (driver: DriverDetails) => {
        // TODO: Implement proper logic to determine if driver is on active delivery mission
        // This should check if driver has active delivery orders from Order table
        // Current implementation uses currentOrders > 0 as proxy
        const isOnDelivery = driver.currentOrders > 0;

        if (isOnDelivery) {
            return {
                text: 'غير متاح (في مهمة توصيل)',
                color: 'bg-status-canceled/10 text-status-canceled border-status-canceled/20',
                icon: '🚚'
            };
        } else {
            return {
                text: 'متاح',
                color: 'bg-status-delivered/10 text-status-delivered border-status-delivered/20',
                icon: '✅'
            };
        }
    };

    const getAvailabilityColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'available':
                return 'bg-status-delivered/10 text-status-delivered border-status-delivered/20';
            case 'busy':
                return 'bg-status-pending/10 text-status-pending border-status-pending/20';
            case 'off_duty':
                return 'bg-muted/10 text-muted-foreground border-border';
            default:
                return 'bg-muted/10 text-muted-foreground border-border';
        }
    };

    const getPerformanceColor = (rate: number) => {
        if (rate >= 90) return 'text-status-delivered';
        if (rate >= 70) return 'text-feature-users';
        if (rate >= 50) return 'text-status-pending';
        return 'text-status-canceled';
    };

    // Mark unused functions to avoid TypeScript warnings
    void getStatusBadgeColor;
    void getStatusText;
    void getAvailabilityColor;
    void getPerformanceColor;

    // TODO: Implement proper rating system
    const getRatingDisplay = (rating: number) => {
        if (rating === 0) {
            return (
                <div className="flex items-center gap-1">
                    <Icon name="AlertTriangle" className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">لا يوجد تقييم</span>
                </div>
            );
        }

        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                    <Icon
                        key={i}
                        name="Star"
                        className={`h-3 w-3 ${i < fullStars
                            ? 'fill-yellow-400 text-yellow-400'
                            : i === fullStars && hasHalfStar
                                ? 'fill-yellow-200 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
                <span className="text-sm text-muted-foreground mr-1">
                    ({rating.toFixed(1)})
                </span>
            </div>
        );
    };

    // Delivered Orders Dialog
    const DeliveredOrdersModal = () => {
        const deliveredOrders = orderStats.recentOrders.filter(order => order.status === 'delivered');

        return (
            <Dialog open={showDeliveredOrders} onOpenChange={setShowDeliveredOrders}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 rounded-lg bg-status-delivered/10">
                                <Icon name="Package" className="h-6 w-6 text-status-delivered" />
                            </div>
                            <div>
                                <span>الطلبات المُسلمة - {driver.name}</span>
                                <p className="text-sm text-muted-foreground font-normal">
                                    إجمالي الطلبات المُسلمة: {orderStats.deliveredOrders}
                                </p>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-6">
                        {deliveredOrders.length > 0 ? (
                            deliveredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/10 transition-colors duration-150"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-status-delivered/10">
                                            <Icon name="Package" className="h-4 w-4 text-status-delivered" />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium">{order.orderNumber}</span>
                                                <Badge className="text-xs bg-status-delivered/10 text-status-delivered border-status-delivered/20">
                                                    مُسلم
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                العميل: {order.customerName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-left">
                                        <p className="font-semibold">{order.amount.toFixed(2)} د.ك</p>
                                        <p className="text-xs text-muted-foreground">{order.date}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Icon name="Package" className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>لا توجد طلبات مُسلمة</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    // Cancelled Orders Dialog
    const CancelledOrdersModal = () => {
        const cancelledOrders = orderStats.recentOrders.filter(order => order.status === 'cancelled');

        return (
            <Dialog open={showCancelledOrders} onOpenChange={setShowCancelledOrders}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 rounded-lg bg-status-canceled/10">
                                <Icon name="XCircle" className="h-6 w-6 text-status-canceled" />
                            </div>
                            <div>
                                <span>الطلبات الملغاة - {driver.name}</span>
                                <p className="text-sm text-muted-foreground font-normal">
                                    إجمالي الطلبات الملغاة: {orderStats.cancelledOrders}
                                </p>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-6">
                        {cancelledOrders.length > 0 ? (
                            cancelledOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/10 transition-colors duration-150"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-status-canceled/10">
                                            <Icon name="XCircle" className="h-4 w-4 text-status-canceled" />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium">{order.orderNumber}</span>
                                                <Badge className="text-xs bg-status-canceled/10 text-status-canceled border-status-canceled/20">
                                                    ملغي
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                العميل: {order.customerName}
                                            </p>
                                            {order.reason && (
                                                <p className="text-xs text-status-canceled">
                                                    السبب: {order.reason}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-left">
                                        <p className="font-semibold">{order.amount.toFixed(2)} د.ك</p>
                                        <p className="text-xs text-muted-foreground">{order.date}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Icon name="XCircle" className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>لا توجد طلبات ملغاة</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    if (view === 'list') {
        return (
            <Card className="shadow-sm border transition-colors duration-200 hover:border-border">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">

                        {/* Driver Avatar & Basic Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={driver.profileImage} alt={driver.name} />
                                <AvatarFallback className="bg-feature-users text-white font-medium">
                                    {driver.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-base truncate">{driver.name}</h3>
                                    <Badge className={`text-xs rounded-md border ${getDeliveryStatusDisplay(driver).color}`}>
                                        <span className="mr-1">{getDeliveryStatusDisplay(driver).icon}</span>
                                        {getDeliveryStatusDisplay(driver).text}
                                    </Badge>
                                </div>

                                <div className="mb-1">
                                    {getRatingDisplay(driver.rating)}
                                </div>

                                <p className="text-sm text-muted-foreground" dir="ltr">
                                    {driver.phone}
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden md:flex items-center gap-6 text-sm">
                            <div className="text-center">
                                <p className="text-muted-foreground text-xs">الطلبات</p>
                                <p className="font-medium">
                                    {driver.currentOrders}/{driver.maxOrders}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex-shrink-0 flex gap-2">

                            <Button
                                onClick={onAssign}
                                disabled={isAssigning || driver.status !== 'available'}
                                className="btn-add"
                                size="sm"
                            >
                                {isAssigning ? (
                                    <>
                                        <Icon name="Loader2" className="h-4 w-4 ml-2 animate-spin" />
                                        جاري التعيين...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="CheckCircle" className="h-4 w-4 ml-2" />
                                        تعيين
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>

                {/* Order Dialogs */}
                <DeliveredOrdersModal />
                <CancelledOrdersModal />
            </Card>
        );
    }

    // Grid view (default)
    return (
        <Card className="shadow-md overflow-hidden relative border transition-colors duration-200 hover:border-border">
            <CardContent className="p-5">
                <div className="space-y-4">

                    {/* Header with Avatar and Status */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar className="h-14 w-14">
                                    <AvatarImage src={driver.profileImage} alt={driver.name} />
                                    <AvatarFallback className="bg-feature-users text-white font-semibold text-lg">
                                        {driver.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                {driver.status === 'available' && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-status-delivered rounded-full flex items-center justify-center border-2 border-background">
                                        <div className="w-2 h-2 bg-background rounded-full"></div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="font-bold text-lg mb-1">{driver.name}</h3>
                                {getRatingDisplay(driver.rating)}
                            </div>
                        </div>

                        <Badge className={`text-xs rounded-lg px-3 py-1 font-medium border ${getDeliveryStatusDisplay(driver).color}`}>
                            <span className="mr-1">{getDeliveryStatusDisplay(driver).icon}</span>
                            {getDeliveryStatusDisplay(driver).text}
                        </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 bg-muted/10 rounded-lg p-3">
                        <div className="flex items-center gap-3 text-sm">
                            <Icon name="Phone" className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono" dir="ltr">{driver.phone}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <Icon name="Truck" className="h-4 w-4 text-muted-foreground" />
                            <span>{driver.vehicle.type}</span>
                            {driver.vehicle.plateNumber && (
                                <span className="text-muted-foreground">• {driver.vehicle.plateNumber}</span>
                            )}
                        </div>
                    </div>

                    {/* Order Statistics - Clickable */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setShowDeliveredOrders(true)}
                            className="h-16 flex flex-col items-center justify-center bg-status-delivered/5 border border-status-delivered/20 rounded-lg transition-colors duration-150 hover:bg-status-delivered/10 focus:outline-none focus:ring-2 focus:ring-status-delivered/30"
                        >
                            <div className="flex items-center gap-2">
                                <Icon name="Package" className="h-4 w-4 text-status-delivered" />
                                <span className="font-bold text-status-delivered text-lg">
                                    {orderStats.deliveredOrders}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground">مُسلمة</span>
                        </button>

                        <button
                            onClick={() => setShowCancelledOrders(true)}
                            className="h-16 flex flex-col items-center justify-center bg-status-canceled/5 border border-status-canceled/20 rounded-lg transition-colors duration-150 hover:bg-status-canceled/10 focus:outline-none focus:ring-2 focus:ring-status-canceled/30"
                        >
                            <div className="flex items-center gap-2">
                                <Icon name="XCircle" className="h-4 w-4 text-status-canceled" />
                                <span className="font-bold text-status-canceled text-lg">
                                    {orderStats.cancelledOrders}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground">ملغاة</span>
                        </button>
                    </div>



                    {/* Action Buttons */}
                    <Button
                        onClick={onAssign}
                        disabled={isAssigning || driver.status !== 'available'}
                        className={`w-full h-10 text-sm font-semibold transition-colors duration-150 ${driver.status === 'available'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        size="sm"
                    >
                        {isAssigning ? (
                            <>
                                <Icon name="Loader2" className="h-4 w-4 ml-2 animate-spin" />
                                جاري...
                            </>
                        ) : driver.status !== 'available' ? (
                            <>
                                <Icon name="AlertTriangle" className="h-4 w-4 ml-2" />
                                غير متاح
                            </>
                        ) : (
                            <>
                                <Icon name="CheckCircle" className="h-4 w-4 ml-2" />
                                تعيين
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>

            {/* Order Dialogs */}
            <DeliveredOrdersModal />
            <CancelledOrdersModal />
        </Card>
    );
} 