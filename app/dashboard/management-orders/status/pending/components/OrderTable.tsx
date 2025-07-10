// app/dashboard/orders-management/status/pending/components/OrderTable.tsx
'use client';

import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  FileText,
  Phone,
  MapPin,
  Package,
  Clock,
  AlertCircle,
  MousePointerBan,
} from 'lucide-react';

import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Order } from '@/types/databaseTypes';
import { Separator } from '@/components/ui/separator';

import AssignToDriver from './AssignToDriver';
import CancelOrderDialog from './CancelOrderDialog';
import UnassignDriver from './UnassignDriver';

interface OrderTableProps {
  orders: Order[];
  currentPage: number;
  pageSize: number;
  updatePage: (page: number) => void;
  totalPages: number;
  sortBy?: 'createdAt' | 'amount' | 'orderNumber';
  sortOrder?: 'asc' | 'desc';
  orderType?: 'pending' | 'assigned';
}

export default function OrderTable({
  orders,
  currentPage,
  updatePage,
  totalPages,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  orderType = 'pending',
}: OrderTableProps) {
  // Note: sortBy and sortOrder are not currently used in the implementation
  // They are kept for future feature development
  void sortBy;
  void sortOrder;

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => updatePage(i)}
          className="h-8 w-8"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="flex gap-1">
          {pages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Enhanced Admin Order Card with full information
  const AdminOrderCard = ({ order }: { order: Order }) => {
    // Calculate order age for priority
    const orderAge = Date.now() - new Date(order.createdAt).getTime();
    const isUrgent = orderAge > 24 * 60 * 60 * 1000; // older than 24 hours
    const isHighValue = order.amount > 500; // high value order

    return (
      <Card className={cn(
        "border-l-4 border rounded-lg overflow-hidden",
        isUrgent ? "border-l-status-urgent bg-status-urgent-soft" : "border-l-status-pending bg-status-pending-soft"
      )}>
        <CardHeader className="pb-3 bg-card border-b rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <Link href={`/dashboard/show-invoice/${order.id}`} className="text-primary font-semibold">
                طلب #{order.orderNumber}
              </Link>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {isUrgent && (
                <Badge variant="destructive" className="gap-1 shadow-sm text-xs rounded-md">
                  <AlertCircle className="h-3 w-3" />
                  عاجل
                </Badge>
              )}
              {isHighValue && (
                <Badge className="bg-status-high-value text-white gap-1 shadow-sm text-xs rounded-md">
                  <DollarSign className="h-3 w-3" />
                  قيمة عالية
                </Badge>
              )}
              <Badge variant="outline" className="bg-status-pending-soft text-status-pending border-status-pending gap-1 shadow-sm text-xs rounded-md">
                <MousePointerBan className="h-3 w-3" />
                {orderType === 'assigned' ? 'مُخصص للسائق' : 'قيد الانتظار'}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 bg-card p-4">
          {/* Customer Information Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b pb-2">
                <User className="h-4 w-4 text-status-priority" />
                معلومات العميل
              </h4>
              <div className="space-y-2 pr-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">الاسم:</span>
                  <span className="text-sm text-foreground font-medium">{order.customer.name || 'غير معروف'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-status-high-value" />
                  <span className="text-sm text-foreground font-medium">{order.customer.phone || 'غير متوفر'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 text-feature-analytics mt-1" />
                  <div className="text-xs">
                    <p className="text-foreground font-medium">العنوان غير متوفر</p>
                    <p className="text-muted-foreground">المدينة غير محددة</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Information Section (for assigned orders) */}
            {orderType === 'assigned' && order.driver ? (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b pb-2">
                  <User className="h-4 w-4 text-blue-500" />
                  معلومات السائق المُخصص
                </h4>
                <div className="space-y-2 pr-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">الاسم:</span>
                    <span className="text-sm text-foreground font-medium">{order.driver.name || 'غير معروف'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-blue-500" />
                    <span className="text-sm text-foreground font-medium">{order.driver.phone || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">الحالة:</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                      {order.driver.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b pb-2">
                  <Package className="h-4 w-4 text-feature-settings" />
                  تفاصيل الطلب الإضافية
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-xs font-semibold text-muted-foreground">المبلغ الإجمالي:</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-status-high-value" />
                      <span className="font-bold text-lg text-status-high-value">{order.amount} ر.س</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-xs font-semibold text-muted-foreground">طريقة الدفع:</span>
                    <Badge variant="outline" className="bg-status-priority-soft text-status-priority border-status-priority gap-1 text-xs self-start rounded-md">
                      <CreditCard className="h-3 w-3" />
                      {order.paymentMethod}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-xs font-semibold text-muted-foreground">عدد الأصناف:</span>
                    <Badge variant="outline" className="bg-feature-analytics-soft text-feature-analytics border-feature-analytics gap-1 text-xs self-start rounded-md">
                      <Package className="h-3 w-3" />
                      {order.items?.length || 0} صنف
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Time and Priority Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
              <Calendar className="h-4 w-4 text-status-priority" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">تاريخ الطلب</p>
                <p className="text-sm font-bold text-foreground">
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
              <Clock className="h-4 w-4 text-feature-settings" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">مدة الانتظار</p>
                <p className={cn(
                  "text-sm font-bold",
                  isUrgent ? "text-status-urgent" : "text-status-pending"
                )}>
                  {Math.floor(orderAge / (1000 * 60 * 60))} ساعة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
              <AlertCircle className={cn(
                "h-4 w-4",
                isUrgent ? "text-status-urgent" : isHighValue ? "text-status-high-value" : "text-status-pending"
              )} />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">الأولوية</p>
                <p className={cn(
                  "text-sm font-bold",
                  isUrgent ? "text-status-urgent" : isHighValue ? "text-status-high-value" : "text-status-pending"
                )}>
                  {isUrgent ? "عاجل" : isHighValue ? "مهم" : "عادي"}
                </p>
              </div>
            </div>
          </div>

          {/* Items Preview (if available) */}
          {order.items && order.items.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-feature-products" />
                  أصناف الطلب
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 border rounded-lg">
                      <Package className="h-3 w-3 text-feature-products" />
                      <span className="text-xs flex-1 font-medium text-foreground">{item.product?.name || `صنف ${index + 1}`}</span>
                      <Badge variant="outline" className="text-xs bg-feature-products-soft text-feature-products border-feature-products rounded-md">
                        {item.quantity || 1}
                      </Badge>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-xs text-muted-foreground p-2 font-medium">
                      +{order.items.length - 3} أصناف أخرى
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Admin Notes Section */}
          <Separator />
          <div className="bg-status-pending-soft border-2 border-status-pending rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-status-pending mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-status-pending mb-2">ملاحظات إدارية</p>
                <ul className="text-xs text-status-pending space-y-1">
                  <li className="font-medium">• يحتاج مراجعة وموافقة فورية</li>
                  {isHighValue && <li className="font-medium text-status-high-value">• طلب عالي القيمة - يتطلب تأكيد إضافي</li>}
                  {isUrgent && <li className="font-medium text-status-urgent">• طلب متأخر - أولوية قصوى</li>}
                  <li className="font-medium">• تحقق من توفر الأصناف قبل الموافقة</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t bg-muted/30 p-4 rounded-b-lg">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href={`/dashboard/show-invoice/${order.id}`}
              className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-bold bg-primary text-primary-foreground shadow-md gap-2 w-full sm:w-auto"
            >
              <Search className="h-4 w-4" />
              عرض التفاصيل
            </Link>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            {orderType === 'assigned' ? (
              <UnassignDriver
                orderId={order.id}
                driverName={order.driver?.name || undefined}
              />
            ) : (
              <AssignToDriver orderId={order.id} />
            )}
            <CancelOrderDialog orderId={order.id} />
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Orders Grid */}
      {orders.length === 0 ? (
        <Card className="border-dashed border-2 border-muted bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-20 w-20 text-muted-foreground/50 mb-6" />
            <h3 className="text-xl font-bold text-foreground mb-3">
              {orderType === 'assigned' ? 'لا توجد طلبات مُخصصة للسائقين' : 'لا توجد طلبات قيد الانتظار'}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {orderType === 'assigned'
                ? 'جميع الطلبات المُخصصة تم تسليمها أو لا توجد طلبات مُخصصة حالياً'
                : 'جميع الطلبات تمت معالجتها أو لا توجد طلبات جديدة في الوقت الحالي'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <AdminOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {orders.length > 0 && (
        <Card className="border shadow-sm">
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-muted/30">
            <div className="text-sm font-medium text-muted-foreground">
              عرض <span className="font-bold text-foreground">{orders.length}</span> من إجمالي <span className="font-bold text-foreground">{Math.ceil(totalPages * orders.length)}</span> طلب
            </div>
            {renderPagination()}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
