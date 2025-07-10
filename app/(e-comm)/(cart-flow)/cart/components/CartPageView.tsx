"use client";

import { getCart } from "@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import CartItemQuantityControls from "./CartItemQuantityControls";
import Link from "next/link";
import Image from "next/image";
import { useCheckIsLogin } from '@/hooks/use-check-islogin';
import { useCartStore } from '../cart-controller/cartStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

// Add type for cart items (server and guest)
type GuestCartItem = { product: any; quantity: number };
type ServerCartItem = { id: string; product: any; quantity: number };

// Add type guard outside the component
function isServerItem(item: ServerCartItem | GuestCartItem): item is ServerCartItem {
    return (item as ServerCartItem).id !== undefined;
}

export function useCheckoutHandler(isAuthenticated: boolean) {
    const router = useRouter();
    const handleCheckout = () => {
        if (!isAuthenticated) {
            // Show alert handled in UI
            return false;
        }
        router.push('/checkout');
        return true;
    };
    return handleCheckout;
}

function CartPageSkeleton() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-8 text-sm">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-24 h-6 rounded" />
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-24 h-6 rounded" />
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-24 h-6 rounded" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Cart Items Skeleton */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="shadow-lg rounded-xl p-6 bg-card">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="h-6 w-40 rounded" />
                            <Skeleton className="h-8 w-24 rounded" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 bg-feature-commerce-soft/30 rounded-lg border border-feature-commerce/20">
                                    <Skeleton className="w-24 h-24 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-6 w-32 rounded" />
                                        <Skeleton className="h-4 w-24 rounded" />
                                        <Skeleton className="h-6 w-20 rounded" />
                                    </div>
                                    <div className="flex flex-col gap-2 justify-center items-end">
                                        <Skeleton className="h-10 w-32 rounded" />
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Order Summary Skeleton */}
                <div className="xl:col-span-4">
                    <div className="sticky top-4">
                        <div className="shadow-lg rounded-xl p-6 space-y-6 bg-card">
                            <Skeleton className="h-6 w-32 rounded mb-4" />
                            <Skeleton className="h-4 w-40 rounded" />
                            <Skeleton className="h-4 w-32 rounded" />
                            <Skeleton className="h-4 w-28 rounded" />
                            <Skeleton className="h-8 w-40 rounded mt-4" />
                            <Skeleton className="h-12 w-full rounded mt-4" />
                            <Skeleton className="h-12 w-full rounded" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-20 xl:hidden" />
        </div>
    );
}

export default function CartPageView() {
    const { isAuthenticated, isLoading } = useCheckIsLogin();
    const { cart, fetchServerCart } = useCartStore();
    const [serverCart, setServerCart] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            setLoading(true);
            getCart().then((data) => {
                setServerCart(data);
                setLoading(false);
            });
        }
    }, [isAuthenticated]);

    // Guest: use Zustand cart
    const items: (ServerCartItem | GuestCartItem)[] = isAuthenticated ? (serverCart?.items || []) : Object.values(cart);
    const subtotal = items.reduce((sum: number, item: ServerCartItem | GuestCartItem) => sum + ((item.product?.price || 0) * (item.quantity || 1)), 0);
    const shipping = subtotal > 200 ? 0 : 25;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;

    const handleRemoved = async () => {
        setLoading(true);
        const data = await getCart();
        setServerCart(data);
        await fetchServerCart();
        setLoading(false);
    };

    if (isLoading || loading) {
        return <CartPageSkeleton />;
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-8 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-feature-commerce text-white flex items-center justify-center text-sm font-bold">1</div>
                    <span className="font-medium text-feature-commerce">مراجعة السلة</span>
                </div>
                <ArrowLeft className="h-4 w-4 text-muted-foreground mx-2" />
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-muted-foreground text-muted-foreground flex items-center justify-center text-sm">2</div>
                    <span className="text-muted-foreground">الدفع</span>
                </div>
                <ArrowLeft className="h-4 w-4 text-muted-foreground mx-2" />
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-muted-foreground text-muted-foreground flex items-center justify-center text-sm">3</div>
                    <span className="text-muted-foreground">التأكيد</span>
                </div>
            </div>

            {items.length === 0 ? (
                <Card className="shadow-lg border-l-4 border-feature-commerce">
                    <CardContent className="py-12">
                        <div className="text-center text-muted-foreground flex flex-col gap-6">
                            <div className="w-24 h-24 mx-auto bg-feature-commerce-soft rounded-full flex items-center justify-center">
                                <ShoppingCart className="h-12 w-12 text-feature-commerce" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">سلتك فارغة</h3>
                                <p className="text-sm text-muted-foreground mb-6">ابدأ التسوق واكتشف منتجاتنا المميزة</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                                <Button asChild className="btn-view flex-1">
                                    <Link href="/">تصفح المنتجات</Link>
                                </Button>
                                <Button asChild variant="outline" className="flex-1 border-feature-commerce text-feature-commerce hover:bg-feature-commerce-soft">
                                    <Link href="/categories">تصفح الفئات</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Cart Items - Takes full width on mobile, 8/12 on desktop */}
                    <div className="xl:col-span-8 space-y-6">
                        <Card className="shadow-lg border-l-4 border-feature-commerce">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <ShoppingCart className="h-5 w-5 text-feature-commerce icon-enhanced" />
                                        سلة التسوق ({items.length} منتج)
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {items.map((item: ServerCartItem | GuestCartItem) => (
                                    <div
                                        key={isServerItem(item) ? item.id : item.product?.id}
                                        className="flex flex-col sm:flex-row gap-4 p-4 bg-feature-commerce-soft/30 rounded-lg border border-feature-commerce/20 hover:border-feature-commerce/40 transition-colors"
                                    >
                                        {/* Product Info */}
                                        <div className="flex gap-4 flex-1">
                                            <Image
                                                src={item.product?.imageUrl || '/fallback/product-fallback.avif'}
                                                alt={item.product?.name || 'صورة المنتج'}
                                                width={96}
                                                height={96}
                                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-border flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <div>
                                                    <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-2 text-foreground" title={item.product?.name}>
                                                        {item.product?.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs text-feature-commerce bg-feature-commerce-soft px-2 py-1 rounded-full border border-feature-commerce/20">
                                                            {item.product?.type === 'accessories' ? 'إكسسوارات' : item.product?.type}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Price Info */}
                                                <div className="space-y-1">
                                                    <div className="text-sm text-muted-foreground">
                                                        {item.product?.price?.toLocaleString()} ر.س × {item.quantity}
                                                    </div>
                                                    <div className="text-lg font-bold text-feature-commerce">
                                                        {((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()} ر.س
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex justify-end sm:justify-center sm:items-start">
                                            <CartItemQuantityControls
                                                itemId={isServerItem(item) ? item.id : item.product?.id}
                                                productId={item.product?.id}
                                                isServerItem={isServerItem(item)}
                                                currentQuantity={item.quantity}
                                                productName={item.product?.name}
                                                onRemoved={isAuthenticated ? handleRemoved : undefined}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary - Takes full width on mobile, 4/12 on desktop */}
                    <div className="xl:col-span-4">
                        <div className="sticky top-4">
                            <Card className="shadow-lg border-l-4 border-feature-commerce">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg text-feature-commerce">ملخص الطلب</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">المجموع الفرعي ({items.length} منتج)</span>
                                            <span className="font-medium text-foreground">{subtotal.toLocaleString()} ر.س</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                الشحن
                                                {shipping === 0 && <span className="text-xs bg-feature-commerce-soft text-feature-commerce px-2 py-0.5 rounded-full">مجاني</span>}
                                            </span>
                                            <span className="font-medium text-foreground">
                                                {shipping === 0 ? 'مجاني' : `${shipping} ر.س`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
                                            <span className="font-medium text-foreground">{tax.toFixed(2)} ر.س</span>
                                        </div>
                                        {subtotal < 200 && (
                                            <div className="text-xs text-feature-commerce bg-feature-commerce-soft p-3 rounded-lg border border-feature-commerce/20">
                                                أضف {(200 - subtotal).toLocaleString()} ر.س للحصول على شحن مجاني
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t border-feature-commerce/20 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-foreground">الإجمالي</span>
                                            <span className="text-2xl font-bold text-feature-commerce">{total.toLocaleString()} ر.س</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3 pt-2">
                                        <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    className="w-full btn-save text-lg py-3 h-12"
                                                    onClick={() => {
                                                        if (!isAuthenticated) {
                                                            setShowLoginDialog(true);
                                                        } else {
                                                            router.push('/checkout');
                                                        }
                                                    }}
                                                >
                                                    متابعة للدفع
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent dir="rtl">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>تسجيل الدخول أو إنشاء حساب</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        يجب عليك تسجيل الدخول أو إنشاء حساب لإتمام الطلب. هذا يضمن حفظ طلبك وتتبع الشحن بسهولة.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="flex-row-reverse gap-3">
                                                    <Button variant="outline" onClick={() => setShowLoginDialog(false)}>إلغاء</Button>
                                                    <Button variant="default" onClick={() => { setShowLoginDialog(false); router.push('/auth/login'); }}>تسجيل الدخول</Button>
                                                    <Button variant="default" onClick={() => { setShowLoginDialog(false); router.push('/auth/register'); }}>إنشاء حساب جديد</Button>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <Button asChild variant="outline" className="w-full border-feature-commerce text-feature-commerce hover:bg-feature-commerce-soft">
                                            <Link href="/">متابعة التسوق</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Sticky Checkout */}
            {items.length > 0 && (
                <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-feature-commerce/20 p-4">
                    <div className="flex items-center gap-4 max-w-sm mx-auto">
                        <div className="flex-1">
                            <div className="text-sm text-muted-foreground">الإجمالي</div>
                            <div className="text-lg font-bold text-feature-commerce">{total.toLocaleString()} ر.س</div>
                        </div>
                        <Button asChild className="btn-save px-6 py-3 text-base">
                            <Link href="/checkout">متابعة للدفع</Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* Bottom padding for mobile sticky button */}
            <div className="h-20 xl:hidden" />
        </div>
    );
} 