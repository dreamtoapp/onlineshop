import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Heart, ShoppingCart, Filter, Search, Grid3X3, List, Trash2, Package, TrendingUp, Eye, Share2, CheckCircle, XCircle } from 'lucide-react';
import { Suspense } from 'react';

import { getUserWishlist } from '@/app/(e-comm)/(home-page-sections)/product/actions/wishlist';
import { auth } from '@/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import BackButton from '@/components/BackButton';
import Link from '@/components/link';
import RatingDisplay from '../ratings/components/RatingDisplay';

export const metadata = {
    title: 'قائمة المفضلة | المتجر الإلكتروني',
    description: 'عرض وإدارة منتجاتك المفضلة',
};

// Enhanced Statistics Component
function WishlistStatistics({ products }: { products: any[] }) {
    const totalProducts = products.length;
    const inStockProducts = products.filter(product => product.inStock).length;
    const outOfStockProducts = totalProducts - inStockProducts;
    const totalValue = products.reduce((sum, product) => sum + product.price, 0);

    const stats = [
        {
            label: "إجمالي المنتجات",
            value: totalProducts,
            icon: <Heart className="w-5 h-5" />,
            color: "text-feature-products",
            bgColor: "bg-feature-products/10",
            borderColor: "border-feature-products/20"
        },
        {
            label: "متوفر",
            value: inStockProducts,
            icon: <CheckCircle className="w-5 h-5" />,
            color: "text-feature-commerce",
            bgColor: "bg-feature-commerce/10",
            borderColor: "border-feature-commerce/20"
        },
        {
            label: "غير متوفر",
            value: outOfStockProducts,
            icon: <XCircle className="w-5 h-5" />,
            color: "text-feature-suppliers",
            bgColor: "bg-feature-suppliers/10",
            borderColor: "border-feature-suppliers/20"
        },
        {
            label: "إجمالي القيمة",
            value: `${totalValue.toLocaleString('ar-SA')} ر.س`,
            icon: <TrendingUp className="w-5 h-5" />,
            color: "text-feature-analytics",
            bgColor: "bg-feature-analytics/10",
            borderColor: "border-feature-analytics/20"
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
                                <div className={`text-lg font-bold ${stat.color}`}>
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

// Enhanced Product Card Component
function WishlistProductCard({ product, index, viewMode = 'grid' }: { product: any; index: number; viewMode?: 'grid' | 'list' }) {
    const isOutOfStock = !product.inStock;

    if (viewMode === 'list') {
        return (
            <Card
                className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-feature-products/30 card-hover-effect group"
                style={{ animationDelay: `${index * 100}ms` }}
            >
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Product Image */}
                        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-border shadow-sm group-hover:shadow-md transition-shadow duration-300">
                            <Image
                                src={product.imageUrl || '/fallback/product-fallback.avif'}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isOutOfStock && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">غير متوفر</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <Checkbox className="bg-background border-2" />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg hover:text-feature-products transition-colors duration-200">
                                        <Link href={`/product/${product.slug}`} className="group/link">
                                            {product.name}
                                        </Link>
                                    </h3>
                                    {product.supplier && (
                                        <p className="text-sm text-muted-foreground">
                                            بواسطة: {product.supplier.name}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-feature-products">
                                        {product.price.toLocaleString('ar-SA')} ر.س
                                    </div>
                                    {product.oldPrice && (
                                        <div className="text-sm line-through text-muted-foreground">
                                            {product.oldPrice.toLocaleString('ar-SA')} ر.س
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Rating and Stock Status */}
                            <div className="flex flex-wrap items-center gap-3">
                                {product.rating > 0 && (
                                    <RatingDisplay rating={product.rating} showCount={false} size='sm' />
                                )}
                                <Badge
                                    variant={isOutOfStock ? 'destructive' : 'default'}
                                    className={isOutOfStock ? 'bg-feature-suppliers/10 text-feature-suppliers border-feature-suppliers/20' : 'bg-feature-commerce/10 text-feature-commerce border-feature-commerce/20'}
                                >
                                    {isOutOfStock ? 'غير متوفر' : 'متوفر'}
                                </Badge>
                                {product.isNew && (
                                    <Badge variant="secondary" className="bg-feature-analytics/10 text-feature-analytics border-feature-analytics/20">
                                        جديد
                                    </Badge>
                                )}
                            </div>

                            {/* Description */}
                            {product.shortDescription && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {product.shortDescription}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="btn-add"
                                    disabled={isOutOfStock}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    إضافة للسلة
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="btn-view-outline"
                                    asChild
                                >
                                    <Link href={`/product/${product.slug}`}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        عرض التفاصيل
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-feature-suppliers hover:bg-feature-suppliers/10"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    إزالة
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:bg-muted"
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    مشاركة
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Grid view
    return (
        <Card
            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-feature-products/30 card-hover-effect group overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative">
                {/* Product Image */}
                <div className="relative h-48 w-full overflow-hidden">
                    <Image
                        src={product.imageUrl || '/fallback/product-fallback.avif'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">غير متوفر</span>
                        </div>
                    )}
                    <div className="absolute top-2 right-2">
                        <Checkbox className="bg-background border-2" />
                    </div>
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && (
                            <Badge className="bg-feature-analytics text-white border-0">
                                جديد
                            </Badge>
                        )}
                        {product.discount && (
                            <Badge className="bg-feature-suppliers text-white border-0">
                                خصم {product.discount}%
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Product Details */}
                <CardContent className="p-4 space-y-3">
                    <div>
                        <h3 className="font-semibold text-base hover:text-feature-products transition-colors duration-200 line-clamp-2">
                            <Link href={`/product/${product.slug}`}>
                                {product.name}
                            </Link>
                        </h3>
                        {product.supplier && (
                            <p className="text-sm text-muted-foreground">
                                {product.supplier.name}
                            </p>
                        )}
                    </div>

                    {/* Rating */}
                    {product.rating > 0 && (
                        <RatingDisplay rating={product.rating} showCount={false} size='sm' />
                    )}

                    {/* Price */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-feature-products">
                                {product.price.toLocaleString('ar-SA')} ر.س
                            </span>
                            {product.oldPrice && (
                                <span className="text-sm line-through text-muted-foreground">
                                    {product.oldPrice.toLocaleString('ar-SA')} ر.س
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Stock Status */}
                    <Badge
                        variant={isOutOfStock ? 'destructive' : 'default'}
                        className={`w-full justify-center ${isOutOfStock ? 'bg-feature-suppliers/10 text-feature-suppliers border-feature-suppliers/20' : 'bg-feature-commerce/10 text-feature-commerce border-feature-commerce/20'}`}
                    >
                        {isOutOfStock ? 'غير متوفر' : 'متوفر'}
                    </Badge>

                    {/* Actions */}
                    <div className="space-y-2">
                        <Button
                            className="w-full btn-add"
                            size="sm"
                            disabled={isOutOfStock}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            إضافة للسلة
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 btn-view-outline"
                                asChild
                            >
                                <Link href={`/product/${product.slug}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    عرض
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-feature-suppliers hover:bg-feature-suppliers/10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}

// Loading Component
function WishlistLoading({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) {
    if (viewMode === 'list') {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <div className="h-32 w-32 bg-muted rounded-xl"></div>
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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted"></div>
                    <CardContent className="p-4 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-6 bg-muted rounded w-full"></div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Empty State Component
function EmptyWishlist() {
    return (
        <Card className="border-dashed border-2 border-border/50">
            <CardContent className="py-16 text-center">
                <div className="mx-auto mb-6 p-6 bg-feature-products/10 rounded-full w-fit">
                    <Heart className="w-12 h-12 text-feature-products" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">قائمة المفضلة فارغة</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                    لم تقم بإضافة أي منتجات إلى المفضلة بعد. تصفح متجرنا واكتشف المنتجات الرائعة وأضفها إلى مفضلتك!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="btn-add">
                        <Link href='/'>
                            <Search className="w-4 h-4 mr-2" />
                            تصفح المنتجات
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="btn-view-outline">
                        <Link href='/categories'>
                            <Grid3X3 className="w-4 h-4 mr-2" />
                            عرض الفئات
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default async function WishlistPage() {
    // Get the current user
    const session = await auth();

    // Redirect to login if not authenticated
    if (!session?.user) {
        redirect('/auth/login?redirect=/user/wishlist');
    }

    const wishlistProducts = await getUserWishlist();

    return (
        <div className='container mx-auto max-w-7xl py-8 px-4'>
            {/* Enhanced Header */}
            <div className="mb-8">
                <BackButton variant="default" className="mb-6" />

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-feature-products/10 border border-feature-products/20">
                            <Heart className="w-8 h-8 text-feature-products" />
                        </div>
                        <div>
                            <h1 className='text-3xl lg:text-4xl font-bold text-foreground'>قائمة المفضلة</h1>
                            <p className="text-muted-foreground mt-1">المنتجات التي أعجبتك</p>
                        </div>
                    </div>

                    {wishlistProducts.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-feature-products/10 text-feature-products border-feature-products/20">
                                {wishlistProducts.length} منتج
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Statistics */}
                {wishlistProducts.length > 0 && <WishlistStatistics products={wishlistProducts} />}
            </div>

            {/* Main Content */}
            <Suspense fallback={<WishlistLoading />}>
                {wishlistProducts.length === 0 ? (
                    <EmptyWishlist />
                ) : (
                    <div className="space-y-6">
                        {/* Filters and View Controls */}
                        <Card className="border-feature-settings/20 bg-feature-settings/5">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Filter className="w-5 h-5 text-feature-settings" />
                                    تصفية وعرض المنتجات
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">البحث</label>
                                        <Input
                                            placeholder="ابحث في مفضلتك..."
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">الفئة</label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="جميع الفئات" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">جميع الفئات</SelectItem>
                                                <SelectItem value="electronics">إلكترونيات</SelectItem>
                                                <SelectItem value="fashion">أزياء</SelectItem>
                                                <SelectItem value="home">منزل</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">الحالة</label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="جميع المنتجات" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">جميع المنتجات</SelectItem>
                                                <SelectItem value="in-stock">متوفر</SelectItem>
                                                <SelectItem value="out-of-stock">غير متوفر</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">الترتيب</label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="الأحدث" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="newest">الأحدث</SelectItem>
                                                <SelectItem value="oldest">الأقدم</SelectItem>
                                                <SelectItem value="price-low">السعر: منخفض إلى مرتفع</SelectItem>
                                                <SelectItem value="price-high">السعر: مرتفع إلى منخفض</SelectItem>
                                                <SelectItem value="name">الاسم</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="btn-view-outline">
                                            <Grid3X3 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="btn-view-outline">
                                            <List className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Bulk Actions */}
                                <Separator className="my-4" />
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Checkbox />
                                        <span className="text-sm">تحديد الكل</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="btn-add">
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            إضافة المحدد للسلة
                                        </Button>
                                        <Button variant="outline" size="sm" className="btn-delete">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            حذف المحدد
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Products Grid */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">منتجاتك المفضلة ({wishlistProducts.length})</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {wishlistProducts.map((product, index) => (
                                    <WishlistProductCard key={product.id} product={product} index={index} viewMode="grid" />
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <Card className="border-feature-analytics/20 bg-feature-analytics/5">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-feature-analytics" />
                                    إجراءات سريعة
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Button className="btn-add h-auto p-4 flex-col gap-2">
                                        <ShoppingCart className="w-6 h-6" />
                                        <span>إضافة الكل للسلة</span>
                                        <span className="text-xs opacity-80">المنتجات المتوفرة فقط</span>
                                    </Button>
                                    <Button variant="outline" className="btn-view-outline h-auto p-4 flex-col gap-2">
                                        <Share2 className="w-6 h-6" />
                                        <span>مشاركة المفضلة</span>
                                        <span className="text-xs opacity-80">شارك قائمتك مع الأصدقاء</span>
                                    </Button>
                                    <Button variant="outline" className="btn-delete h-auto p-4 flex-col gap-2">
                                        <Trash2 className="w-6 h-6" />
                                        <span>مسح المفضلة</span>
                                        <span className="text-xs opacity-80">حذف جميع المنتجات</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </Suspense>
        </div>
    );
} 