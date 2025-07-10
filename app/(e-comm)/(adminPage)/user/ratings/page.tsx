import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Star, TrendingUp, Award, Filter, Search, Calendar, Package, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { Suspense } from 'react';

import { auth } from '@/auth';
import RatingDisplay from './components/RatingDisplay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BackButton from '@/components/BackButton';
import Link from '@/components/link';

import { getUserReviews } from '@/app/(e-comm)/(home-page-sections)/product/actions/rating';

export const metadata = {
    title: 'تقييماتي ومراجعاتي | المتجر الإلكتروني',
    description: 'عرض وإدارة تقييماتك ومراجعاتك للمنتجات',
};

// Enhanced Statistics Component
function RatingsStatistics({ reviews }: { reviews: any[] }) {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : '0.0';
    const verifiedReviews = reviews.filter(review => review.isVerified).length;
    const recentReviews = reviews.filter(review => {
        const reviewDate = new Date(review.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return reviewDate >= thirtyDaysAgo;
    }).length;

    const stats = [
        {
            label: "إجمالي التقييمات",
            value: totalReviews,
            icon: <MessageCircle className="w-5 h-5" />,
            color: "text-feature-analytics",
            bgColor: "bg-feature-analytics/10",
            borderColor: "border-feature-analytics/20"
        },
        {
            label: "متوسط التقييم",
            value: averageRating,
            icon: <Star className="w-5 h-5" />,
            color: "text-feature-suppliers",
            bgColor: "bg-feature-suppliers/10",
            borderColor: "border-feature-suppliers/20"
        },
        {
            label: "مراجعات مؤكدة",
            value: verifiedReviews,
            icon: <Award className="w-5 h-5" />,
            color: "text-feature-commerce",
            bgColor: "bg-feature-commerce/10",
            borderColor: "border-feature-commerce/20"
        },
        {
            label: "مراجعات حديثة",
            value: recentReviews,
            icon: <TrendingUp className="w-5 h-5" />,
            color: "text-feature-products",
            bgColor: "bg-feature-products/10",
            borderColor: "border-feature-products/20"
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <Card key={index} className={`border-l-4 ${stat.borderColor} hover:shadow-md transition-all duration-300 card-hover-effect`}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="flex-1">
                                <div className={`text-2xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Enhanced Review Card Component
function ReviewCard({ review, index }: { review: any; index: number }) {
    const isRecent = () => {
        const reviewDate = new Date(review.createdAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return reviewDate >= sevenDaysAgo;
    };

    return (
        <Card
            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-feature-analytics/30 card-hover-effect group"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Product Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <Image
                            src={review.product?.imageUrl || '/fallback/product-fallback.avif'}
                            alt={review.product?.name || 'منتج'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isRecent() && (
                            <div className="absolute top-2 right-2 bg-feature-products text-white text-xs px-2 py-1 rounded-full shadow-sm">
                                جديد
                            </div>
                        )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg hover:text-feature-analytics transition-colors duration-200">
                                    <Link
                                        href={`/product/${review.product?.slug || review.productId}`}
                                        className="flex items-center gap-2 group/link"
                                    >
                                        {review.product?.name || 'منتج غير متوفر'}
                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" />
                                    </Link>
                                </h3>
                                {review.product?.price && (
                                    <div className="text-sm text-muted-foreground">
                                        السعر: {review.product.price.toLocaleString('ar-SA')} ر.س
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(review.createdAt), 'd MMMM yyyy', { locale: ar })}
                            </div>
                        </div>

                        {/* Rating and Badges */}
                        <div className="flex flex-wrap items-center gap-3">
                            <RatingDisplay rating={review.rating} showCount={false} size='sm' />
                            <Badge
                                variant='outline'
                                className={
                                    review.isVerified
                                        ? 'border-feature-commerce/30 bg-feature-commerce/10 text-feature-commerce'
                                        : 'border-feature-suppliers/30 bg-feature-suppliers/10 text-feature-suppliers'
                                }
                            >
                                {review.isVerified ? 'مشتري مؤكد' : 'غير مؤكد'}
                            </Badge>
                            {isRecent() && (
                                <Badge variant="secondary" className="bg-feature-products/10 text-feature-products border-feature-products/20">
                                    مراجعة حديثة
                                </Badge>
                            )}
                        </div>

                        {/* Comment */}
                        {review.comment && (
                            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                                <p className="text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            <Button
                                variant='outline'
                                size='sm'
                                className='border-feature-analytics/20 text-feature-analytics hover:bg-feature-analytics/10 btn-view-outline'
                                asChild
                            >
                                <Link href={`/product/${review.product?.slug || review.productId}`}>
                                    <Package className="w-4 h-4 mr-2" />
                                    عرض المنتج
                                </Link>
                            </Button>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='text-feature-products hover:bg-feature-products/10'
                                asChild
                            >
                                <Link href={`/user/wishlist`}>
                                    <Heart className="w-4 h-4 mr-2" />
                                    إضافة للمفضلة
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Loading Component
function ReviewsLoading() {
    return (
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                            <div className="h-24 w-24 bg-muted rounded-xl"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-6 bg-muted rounded w-3/4"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                                <div className="h-16 bg-muted rounded"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Empty State Component
function EmptyState() {
    return (
        <Card className="border-dashed border-2 border-border/50">
            <CardContent className="py-16 text-center">
                <div className="mx-auto mb-6 p-6 bg-feature-analytics/10 rounded-full w-fit">
                    <Star className="w-12 h-12 text-feature-analytics" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">لا توجد تقييمات بعد</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                    لم تقم بتقييم أي منتجات بعد. يمكنك تقييم المنتجات التي اشتريتها من صفحة سجل المشتريات أو تصفح المنتجات الجديدة.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="btn-add">
                        <Link href='/user/purchase-history'>
                            <Package className="w-4 h-4 mr-2" />
                            سجل المشتريات
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="btn-view-outline">
                        <Link href='/'>
                            <Search className="w-4 h-4 mr-2" />
                            تصفح المنتجات
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default async function UserRatingsPage() {
    // Get the current user
    const session = await auth();

    // Redirect to login if not authenticated
    if (!session?.user) {
        redirect('/auth/login?redirect=/user/ratings');
    }

    // Get the user's reviews
    const userId = session.user.id;
    if (!userId) {
        redirect('/auth/login?redirect=/user/ratings');
    }

    const reviews = await getUserReviews(userId);

    return (
        <div className='container mx-auto max-w-6xl py-8 px-4'>
            {/* Enhanced Header */}
            <div className="mb-8">
                <BackButton variant="default" className="mb-6" />

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-feature-analytics/10 border border-feature-analytics/20">
                            <Star className="w-8 h-8 text-feature-analytics" />
                        </div>
                        <div>
                            <h1 className='text-3xl lg:text-4xl font-bold text-foreground'>تقييماتي ومراجعاتي</h1>
                            <p className="text-muted-foreground mt-1">إدارة وعرض تقييماتك للمنتجات</p>
                        </div>
                    </div>

                    {reviews.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-feature-analytics/10 text-feature-analytics border-feature-analytics/20">
                                {reviews.length} تقييم
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Statistics */}
                {reviews.length > 0 && <RatingsStatistics reviews={reviews} />}
            </div>

            {/* Main Content */}
            <Suspense fallback={<ReviewsLoading />}>
                {reviews.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-6">
                        {/* Filters Section */}
                        <Card className="border-feature-settings/20 bg-feature-settings/5">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Filter className="w-5 h-5 text-feature-settings" />
                                    تصفية التقييمات
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">البحث في المنتجات</label>
                                        <Input
                                            placeholder="ابحث في منتجاتك..."
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">تصفية حسب التقييم</label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="جميع التقييمات" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">جميع التقييمات</SelectItem>
                                                <SelectItem value="5">⭐⭐⭐⭐⭐ (5 نجوم)</SelectItem>
                                                <SelectItem value="4">⭐⭐⭐⭐ (4 نجوم)</SelectItem>
                                                <SelectItem value="3">⭐⭐⭐ (3 نجوم)</SelectItem>
                                                <SelectItem value="2">⭐⭐ (2 نجوم)</SelectItem>
                                                <SelectItem value="1">⭐ (1 نجمة)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">نوع المراجعة</label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="جميع الأنواع" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">جميع الأنواع</SelectItem>
                                                <SelectItem value="verified">مراجعات مؤكدة</SelectItem>
                                                <SelectItem value="unverified">غير مؤكدة</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">الترتيب</label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="الأحدث أولاً" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="newest">الأحدث أولاً</SelectItem>
                                                <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                                                <SelectItem value="highest">أعلى تقييم</SelectItem>
                                                <SelectItem value="lowest">أقل تقييم</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">تقييماتك ({reviews.length})</h2>
                            </div>

                            <div className="space-y-4">
                                {reviews.map((review: any, index: number) => (
                                    <ReviewCard key={review.id} review={review} index={index} />
                                ))}
                            </div>
                        </div>

                        {/* Pagination placeholder for future enhancement */}
                        {reviews.length > 10 && (
                            <Card className="border-dashed">
                                <CardContent className="py-8 text-center">
                                    <p className="text-muted-foreground">
                                        عرض {reviews.length} من إجمالي التقييمات
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </Suspense>
        </div>
    );
} 