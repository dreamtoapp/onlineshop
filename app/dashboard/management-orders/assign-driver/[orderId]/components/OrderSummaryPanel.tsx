'use client';

import { useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';
import Image from 'next/image';

import { OrderDetails } from '../actions/get-order-details';

interface OrderSummaryPanelProps {
    order: OrderDetails;
}

// Helper functions for date/time formatting
const formatDate = (dateInput: Date | string) => {
    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) {
            return 'تاريخ غير صحيح';
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        const ampm = hours >= 12 ? 'م' : 'ص';

        return `${day}/${month}/${year} في ${hour12}:${minutes} ${ampm}`;
    } catch {
        return 'تاريخ غير صحيح';
    }
};

const formatTime = (dateInput: Date | string) => {
    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) {
            return 'وقت غير صحيح';
        }

        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        const ampm = hours >= 12 ? 'م' : 'ص';

        return `${hour12}:${minutes} ${ampm}`;
    } catch {
        return 'وقت غير صحيح';
    }
};

// Status badge color mapping using enhanced feature colors
const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'bg-status-pending/10 text-status-pending border-status-pending/30';
        case 'delivered':
            return 'bg-status-delivered/10 text-status-delivered border-status-delivered/30';
        case 'cancelled':
            return 'bg-status-canceled/10 text-status-canceled border-status-canceled/30';
        case 'in_transit':
            return 'bg-feature-commerce/10 text-feature-commerce border-feature-commerce/30';
        default:
            return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
};

// Status text mapping
const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'قيد الإنتظار';
        case 'delivered':
            return 'تم التوصيل';
        case 'cancelled':
            return 'ملغي';
        case 'in_transit':
            return 'في الطريق';
        default:
            return 'حالة غير معروفة';
    }
};

export default function OrderSummaryPanel({ order }: OrderSummaryPanelProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <Card className="shadow-xl border-l-4 border-l-feature-commerce card-hover-effect card-border-glow overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-feature-commerce/5 to-transparent">
                <CardTitle className="flex items-center justify-between text-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-feature-commerce/10">
                            <Icon name="Package" className="h-5 w-5 text-feature-commerce icon-enhanced" />
                        </div>
                        <div>
                            <span className="text-lg font-bold">تفاصيل الطلب</span>
                            <span className="text-sm text-muted-foreground block">#{order.id.slice(0, 8)}</span>
                        </div>
                    </div>

                    {/* Collapse Toggle Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleCollapse}
                        className="h-8 w-8 p-0 hover:bg-feature-commerce/10 transition-all duration-200"
                    >
                        {isCollapsed ? (
                            <Icon name="ChevronDown" className="h-4 w-4 text-feature-commerce icon-enhanced" />
                        ) : (
                            <Icon name="ChevronUp" className="h-4 w-4 text-feature-commerce icon-enhanced" />
                        )}
                    </Button>
                </CardTitle>
            </CardHeader>

            {/* Collapsible Content with Smooth Animation */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0' : 'max-h-none'
                }`}>
                <CardContent className="space-y-6">
                    {/* Order Status */}
                    <div className="bg-gradient-to-r from-feature-commerce/5 to-feature-commerce/10 rounded-xl p-4 border border-feature-commerce/20">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-base flex items-center gap-2">
                                <Icon name="Info" className="h-4 w-4 text-feature-commerce icon-enhanced" />
                                حالة الطلب
                            </h4>
                            <Badge className={`px-3 py-1 rounded-lg font-medium border ${getStatusBadgeColor(order.status)}`}>
                                {getStatusText(order.status)}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-background/70 rounded-lg p-3 text-center border border-border">
                                <Icon name="Calendar" className="h-4 w-4 text-feature-commerce mx-auto mb-1 icon-enhanced" />
                                <p className="text-xs text-muted-foreground mb-1">تاريخ الطلب</p>
                                <p className="font-medium text-feature-commerce">{formatDate(order.createdAt)}</p>
                            </div>

                            <div className="bg-background/70 rounded-lg p-3 text-center border border-border">
                                <Icon name="Clock" className="h-4 w-4 text-feature-commerce mx-auto mb-1 icon-enhanced" />
                                <p className="text-xs text-muted-foreground mb-1">الوقت</p>
                                <p className="font-medium text-feature-commerce">{formatTime(order.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-gradient-to-r from-feature-users/10 to-feature-users/5 rounded-xl p-4 border border-feature-users/20">
                        <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                            <Icon name="User" className="h-4 w-4 text-feature-users icon-enhanced" />
                            معلومات العميل
                        </h4>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-background/70 rounded-lg p-3 border border-border">
                                <span className="text-muted-foreground text-sm">الاسم:</span>
                                <span className="font-medium text-feature-users">{order.customer?.name || 'عميل'}</span>
                            </div>

                            <div className="flex items-center justify-between bg-background/70 rounded-lg p-3 border border-border">
                                <span className="text-muted-foreground text-sm">الهاتف:</span>
                                <span className="font-mono text-feature-users" dir="ltr">{order.customer?.phone || 'غير محدد'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-gradient-to-r from-feature-analytics/10 to-feature-analytics/5 rounded-xl p-4 border border-feature-analytics/20">
                        <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                            <Icon name="MapPin" className="h-4 w-4 text-feature-analytics icon-enhanced" />
                            عنوان التوصيل
                        </h4>

                        <div className="bg-background/70 rounded-lg p-3 border border-border">
                            <p className="text-sm leading-relaxed text-feature-analytics">{order.location?.address || 'عنوان غير محدد'}</p>

                            {(order.location?.latitude && order.location?.longitude) && (
                                <div className="mt-3 pt-3 border-t border-border">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Icon name="MapPin" className="h-3 w-3 icon-enhanced" />
                                        <span>الإحداثيات:</span>
                                        <span className="font-mono text-feature-analytics" dir="ltr">
                                            {order.location.latitude.toFixed(6)}, {order.location.longitude.toFixed(6)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gradient-to-r from-feature-products/10 to-feature-products/5 rounded-xl p-4 border border-feature-products/20">
                        <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                            <Icon name="Package" className="h-4 w-4 text-feature-products icon-enhanced" />
                            منتجات الطلب ({order.items.length})
                        </h4>

                        <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
                            {order.items.map((item) => (
                                <div key={item.id} className="bg-background/70 rounded-lg p-3 border border-border card-hover-effect">
                                    <div className="flex items-start justify-between gap-3">
                                        {/* Product Image */}
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-feature-products/10 flex-shrink-0 border border-feature-products/20">
                                            {item.product.images?.[0] ? (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Icon name="Package" className="h-5 w-5 text-feature-products/50 icon-enhanced" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-medium text-sm mb-1 line-clamp-2 text-feature-products">{item.product.name}</h5>

                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-muted-foreground">الكمية:</span>
                                                    <Badge variant="outline" className="bg-feature-products/10 text-feature-products border-feature-products/30">
                                                        {item.quantity} قطعة
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold text-feature-products">
                                                        {(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                    <span className="text-muted-foreground">د.ك</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="bg-gradient-to-r from-feature-commerce/10 via-feature-commerce/5 to-feature-commerce/10 rounded-xl p-4 border-2 border-feature-commerce/30 card-border-glow">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-lg flex items-center gap-2">
                                <Icon name="CreditCard" className="h-5 w-5 text-feature-commerce icon-enhanced" />
                                إجمالي الطلب
                            </h4>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-feature-commerce">
                                    {order.amount.toFixed(2)}
                                    <span className="text-base font-medium text-muted-foreground ml-1">د.ك</span>
                                </div>
                                <p className="text-xs text-muted-foreground">شامل جميع الرسوم</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                        {/* View Full Order Button */}
                        <Link
                            href={`/dashboard/show-invoice/${order.id}`}
                            className="block"
                        >
                            <Button
                                variant="outline"
                                className="w-full btn-view-outline hover:scale-[1.02] transition-all duration-200"
                                size="lg"
                            >
                                <Icon name="FileText" className="h-4 w-4 ml-2 icon-enhanced" />
                                عرض تفاصيل الطلب كاملة
                            </Button>
                        </Link>

                        {/* Back Button */}
                        <BackButton
                            variant="default"
                            className="w-full btn-professional"
                        />
                    </div>
                </CardContent>
            </div>
        </Card>
    );
} 