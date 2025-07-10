'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Search, RefreshCw, AlertCircle, TrendingUp, Package, Info } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { fetchOrdersAction } from '../../management-dashboard/action/fetchOrders';
import OrderCard from './OrderCard';
import { Order } from '@/types/databaseTypes';

// Memoize the OrderCard to prevent unnecessary re-renders
const MemoizedOrderCard = memo(OrderCard);

interface OrderCardViewProps {
    initialOrders: Order[];
    status?: string;
}

export default function OrderCardView({ initialOrders = [], status }: OrderCardViewProps) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());

    const pageRef = useRef(page);
    const initialOrdersRef = useRef(initialOrders);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pageSize = 12; // Increased for better performance

    // Optimize initial orders comparison
    useEffect(() => {
        if (initialOrdersRef.current.length !== initialOrders.length || status) {
            initialOrdersRef.current = initialOrders;
            setOrders(initialOrders);
            setFilteredOrders(initialOrders);
            setPage(1);
            pageRef.current = 1;
            setHasMore(initialOrders.length >= pageSize);
            setSearchTerm('');
            setError(null);
        }
    }, [initialOrders, status, pageSize]);

    // Enhanced search functionality with debouncing
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            if (searchTerm.trim() === '') {
                setFilteredOrders(orders);
            } else {
                const filtered = orders.filter(order =>
                    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.customer.phone?.includes(searchTerm) ||
                    order.amount.toString().includes(searchTerm)
                );
                setFilteredOrders(filtered);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, orders]);

    const fetchMoreData = useCallback(async () => {
        if (!hasMore || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const newOrders = await fetchOrdersAction({
                status: status,
                page: pageRef.current + 1,
                pageSize,
            });

            setPage((prev) => {
                const newPage = prev + 1;
                pageRef.current = newPage;
                return newPage;
            });

            if (newOrders.length === 0) {
                setHasMore(false);
            } else {
                setOrders((prev) => {
                    const existingIds = new Set(prev.map((order) => order.id));
                    const filteredOrders = newOrders.filter((order: Order) => !existingIds.has(order.id));
                    const updatedOrders = [...prev, ...filteredOrders];

                    // Update filtered orders if no search term
                    if (searchTerm.trim() === '') {
                        setFilteredOrders(updatedOrders);
                    }

                    return updatedOrders;
                });
                setHasMore(newOrders.length >= pageSize);
                setLastFetchTime(new Date());
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError('فشل في تحميل المزيد من الطلبات. يرجى المحاولة مرة أخرى.');
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [hasMore, isLoading, status, pageSize, searchTerm]);

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setPage(1);
        pageRef.current = 1;
        setHasMore(true);

        try {
            const refreshedOrders = await fetchOrdersAction({
                status: status,
                page: 1,
                pageSize: pageSize * page, // Get all previously loaded data
            });

            setOrders(refreshedOrders);
            setFilteredOrders(refreshedOrders);
            setLastFetchTime(new Date());
        } catch (error) {
            setError('فشل في تحديث البيانات');
        } finally {
            setIsLoading(false);
        }
    }, [status, pageSize, page]);

    // Enhanced loader component
    const Loader = () => (
        <div className="w-full py-8">
            <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
                <CardContent className="flex items-center justify-center gap-3 p-6">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-feature-analytics"></div>
                    <span className="text-feature-analytics font-medium">جاري تحميل المزيد من الطلبات...</span>
                </CardContent>
            </Card>
        </div>
    );

    // Enhanced skeleton loader
    const SkeletonLoader = () => (
        <div className="space-y-6">
            {/* Search skeleton */}
            <Card className="shadow-lg border-l-4 border-l-feature-analytics/20">
                <CardHeader className="pb-4">
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>

            {/* Orders grid skeleton */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="shadow-md border-l-4 border-l-feature-commerce/20">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <div className="flex justify-between">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    // Enhanced end message
    const EndMessage = () => (
        <div className="w-full py-8">
            <Card className="shadow-lg border-l-4 border-l-feature-settings card-hover-effect">
                <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                    <Package className="h-12 w-12 text-feature-settings icon-enhanced" />
                    <div>
                        <h3 className="font-semibold text-feature-settings mb-2">تم تحميل جميع الطلبات</h3>
                        <p className="text-muted-foreground text-sm">
                            {filteredOrders.length > 0
                                ? `تم عرض ${filteredOrders.length} طلب`
                                : 'لا توجد طلبات تطابق المعايير المحددة'
                            }
                        </p>
                    </div>
                    {lastFetchTime && (
                        <Badge variant="outline" className="text-xs">
                            آخر تحديث: {lastFetchTime.toLocaleTimeString('ar-SA')}
                        </Badge>
                    )}
                </CardContent>
            </Card>
        </div>
    );

    // Show skeleton for initial load
    if (!orders.length && isLoading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="space-y-6">
            {/* Enhanced Search and Controls Header */}
            <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Search className="h-5 w-5 text-feature-analytics icon-enhanced" />
                        البحث والتصفية
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="البحث برقم الطلب، اسم العميل، رقم الهاتف، أو المبلغ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pr-10 border-feature-analytics/30 focus:border-feature-analytics"
                            />
                        </div>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleRefresh}
                                    disabled={isLoading}
                                    className="btn-professional hover:bg-feature-analytics-soft"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>تحديث البيانات</TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Search Results Info */}
                    {searchTerm && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Info className="h-4 w-4" />
                            <span>
                                {filteredOrders.length} من {orders.length} طلب يطابق البحث &quot;{searchTerm}&quot;
                            </span>
                            {filteredOrders.length === 0 && (
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => setSearchTerm('')}
                                    className="p-0 h-auto text-feature-analytics"
                                >
                                    مسح البحث
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Performance Hint */}
                    <Alert className="border-feature-analytics/30">
                        <TrendingUp className="h-4 w-4 text-feature-analytics" />
                        <AlertDescription className="text-sm">
                            <strong>نصيحة:</strong> يتم تحميل الطلبات تلقائياً عند التمرير للأسفل. استخدم البحث للعثور على طلبات محددة بسرعة.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            {/* Enhanced Orders Display - NO NESTED SCROLL CONTAINER */}
            <InfiniteScroll
                dataLength={filteredOrders.length}
                next={fetchMoreData}
                hasMore={hasMore && !searchTerm} // Disable infinite scroll during search
                loader={<Loader />}
                endMessage={<EndMessage />}
                scrollThreshold={0.9}
            // Remove scrollableTarget to use window scroll
            >
                {filteredOrders.length === 0 ? (
                    <Card className="shadow-lg border-l-4 border-l-feature-settings card-hover-effect">
                        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
                            <AlertCircle className="h-16 w-16 text-feature-settings/50" />
                            <div>
                                <h3 className="text-lg font-semibold text-feature-settings mb-2">
                                    لا توجد طلبات
                                </h3>
                                <p className="text-muted-foreground">
                                    {searchTerm
                                        ? 'لم يتم العثور على طلبات تطابق البحث المحدد'
                                        : 'لا توجد طلبات في هذا القسم حالياً'
                                    }
                                </p>
                            </div>
                            {searchTerm && (
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchTerm('')}
                                    className="btn-professional"
                                >
                                    مسح البحث
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredOrders.map((order) => (
                            <MemoizedOrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </InfiniteScroll>

            {/* Enhanced Error Handling */}
            {error && (
                <Card className="shadow-lg border-l-4 border-l-red-500 card-hover-effect">
                    <CardContent className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-red-700">{error}</span>
                        </div>
                        <Button
                            onClick={fetchMoreData}
                            variant="outline"
                            size="sm"
                            className="btn-professional hover:bg-red-50"
                        >
                            إعادة المحاولة
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 