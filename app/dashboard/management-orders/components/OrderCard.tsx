'use client';
import React, { useMemo } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Icon } from '@/components/icons/Icon';

import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import {
    Button,
    buttonVariants,
} from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    ORDER_STATUS,
    OrderStatus,
} from '@/constant/order-status';
// import { iconVariants } from '@/lib/utils';
import { Order } from '@/types/databaseTypes';

// Enhanced status styles following the design system with feature colors
const STATUS_STYLES = {
    [ORDER_STATUS.PENDING]: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    [ORDER_STATUS.IN_TRANSIT]: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    [ORDER_STATUS.DELIVERED]: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    [ORDER_STATUS.CANCELED]: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    [ORDER_STATUS.ASSIGNED]: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
};

const STATUS_TRANSLATIONS = {
    [ORDER_STATUS.PENDING]: 'قيد الانتظار',
    [ORDER_STATUS.IN_TRANSIT]: 'في الطريق',
    [ORDER_STATUS.DELIVERED]: 'تم التسليم',
    [ORDER_STATUS.CANCELED]: 'ملغي',
    [ORDER_STATUS.ASSIGNED]: 'في السيارة',
    Default: 'غير محدد',
};

// Enhanced status icons with proper feature colors
const StatusIcon = ({ status }: { status: OrderStatus }) => {
    const icons: Record<OrderStatus, React.ReactNode> = {
        [ORDER_STATUS.PENDING]: <Icon name="Clock" className="h-4 w-4 text-yellow-600" />,
        [ORDER_STATUS.IN_TRANSIT]: <Icon name="Truck" className="h-4 w-4 text-blue-600" />,
        [ORDER_STATUS.DELIVERED]: <Icon name="CheckCircle" className="h-4 w-4 text-green-600" />,
        [ORDER_STATUS.CANCELED]: <Icon name="X" className="h-4 w-4 text-red-600" />,
        [ORDER_STATUS.ASSIGNED]: <Icon name="Box" className="h-4 w-4 text-blue-600" />,
    };
    return icons[status.toUpperCase() as OrderStatus] || <Icon name="Package" className="h-4 w-4 text-muted-foreground" />;
};

// Enhanced order header with better typography and layout
const OrderHeader = ({ order, statusStyle }: { order: Order, statusStyle: string }) => {
    const createdAt = useMemo(
        () => formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar }),
        [order.createdAt],
    );
    const updatedAt = useMemo(
        () => formatDistanceToNow(new Date(order.updatedAt), { addSuffix: true, locale: ar }),
        [order.updatedAt],
    );

    return (
        <CardHeader className="flex flex-col pb-4 space-y-3">
            <div className="flex items-center justify-between">
                <Badge className={`flex items-center gap-2 px-3 py-1 transition-colors ${statusStyle}`}>
                    <StatusIcon status={order.status as OrderStatus} />
                    <span className="font-medium">
                        {STATUS_TRANSLATIONS[order.status as OrderStatus] || STATUS_TRANSLATIONS.Default}
                    </span>
                </Badge>
                <div className="text-left">
                    <CardTitle className="text-xl font-bold text-feature-commerce flex items-center gap-1">
                        <Icon name="CreditCard" className="h-4 w-4" />
                        {order.amount.toFixed(2)} ر.س
                    </CardTitle>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                            <Icon name="Calendar" className="h-3 w-3" />
                            <span>{createdAt}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>تاريخ الإنشاء: {new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                            <Icon name="RefreshCw" className="h-3 w-3" />
                            <span>{updatedAt}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>آخر تحديث: {new Date(order.updatedAt).toLocaleDateString('ar-SA')}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </CardHeader>
    );
};

// Enhanced customer actions with better tooltips and accessibility
const CustomerCardAction = ({
    phone,
}: {
    phone: string;
}) => (
    <div className="flex items-center gap-2">
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="btn-professional h-8 w-8 hover:bg-feature-users-soft"
                    disabled={!phone}
                >
                    <Icon name="Phone" className="h-3 w-3" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{phone || 'رقم الهاتف غير متوفر'}</p>
            </TooltipContent>
        </Tooltip>
    </div>
);

// Enhanced order content with better layout and information hierarchy
const OrderContent = ({ order }: { order: Order }) => (
    <CardContent className="space-y-4 text-foreground">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Icon name="List" className="h-4 w-4 text-feature-commerce" />
                <CardTitle className="text-sm font-semibold text-feature-commerce">
                    {order.orderNumber}
                </CardTitle>
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={`/dashboard/show-invoice/${order.id}`}
                        className={buttonVariants({
                            variant: 'outline',
                            size: 'icon',
                            className: 'btn-view-outline h-8 w-8',
                        })}
                    >
                        <Icon name="ReceiptText" className="h-3 w-3" />
                    </Link>
                </TooltipTrigger>
                <TooltipContent>عرض الفاتورة</TooltipContent>
            </Tooltip>
        </div>

        <div className="flex items-center justify-between">
            <CardDescription className="flex items-center gap-2 text-sm">
                <Icon name="User" className="h-4 w-4 text-feature-users" />
                <span className="font-medium">{order.customer.name || 'عميل غير معروف'}</span>
            </CardDescription>
            <CustomerCardAction
                phone={order.customer.phone || ''}
            />
        </div>

        {order.driverId && (
            <div className="flex items-center gap-2 p-2 bg-feature-suppliers-soft rounded-lg">
                <Icon name="Truck" className="h-4 w-4 text-feature-suppliers" />
                <span className="text-sm font-medium text-feature-suppliers">
                    السائق: {order.driverId}
                </span>
            </div>
        )}

        {order.status === ORDER_STATUS.CANCELED && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <Icon name="AlertCircle" className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-sm font-medium text-red-700">الطلب ملغي</p>
                    <p className="text-sm text-red-600">تم إلغاء هذا الطلب</p>
                </div>
            </div>
        )}
    </CardContent>
);

// Main OrderCard component with enhanced styling
interface OrderCardProps {
    order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
    const statusStyle = STATUS_STYLES[order.status as OrderStatus] || STATUS_STYLES[ORDER_STATUS.PENDING];

    // Determine border color based on status following feature color system
    const getBorderColor = (status: string) => {
        switch (status) {
            case ORDER_STATUS.PENDING:
                return 'border-l-yellow-500';
            case ORDER_STATUS.IN_TRANSIT:
                return 'border-l-blue-500';
            case ORDER_STATUS.DELIVERED:
                return 'border-l-green-500';
            case ORDER_STATUS.CANCELED:
                return 'border-l-red-500';
            case ORDER_STATUS.ASSIGNED:
                return 'border-l-blue-500';
            default:
                return 'border-l-feature-commerce';
        }
    };

    const borderColor = getBorderColor(order.status);

    return (
        <Card className={`
            shadow-lg border-l-4 ${borderColor} card-hover-effect card-border-glow
            transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
            bg-gradient-to-br from-background to-muted/20
        `}>
            <OrderHeader order={order} statusStyle={statusStyle} />
            <OrderContent order={order} />

            {/* Enhanced footer with action hints */}
            <CardFooter className="pt-4 border-t border-muted/30">
                <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <div className={`h-2 w-2 rounded-full ${order.status === ORDER_STATUS.DELIVERED ? 'bg-green-500' :
                            order.status === ORDER_STATUS.IN_TRANSIT ? 'bg-blue-500 animate-pulse' :
                                order.status === ORDER_STATUS.PENDING ? 'bg-yellow-500 animate-pulse' :
                                    order.status === ORDER_STATUS.ASSIGNED ? 'bg-blue-500 animate-pulse' :
                                        'bg-red-500'
                            }`} />
                        <span>انقر للتفاصيل</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        #{order.id.slice(-6)}
                    </Badge>
                </div>
            </CardFooter>
        </Card>
    );
} 