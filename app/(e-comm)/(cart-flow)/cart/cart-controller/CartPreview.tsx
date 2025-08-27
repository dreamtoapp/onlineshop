"use client";
import Image from 'next/image';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useCartStore } from './cartStore';
import { Icon } from '@/components/icons/Icon';
import { checkIsLogin } from '@/lib/check-is-login';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import CartQuantityControls from './CartQuantityControls';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface CartPreviewProps {
    closePopover?: () => void;
}

// Internal subcomponent for header
function CartHeader({ isEmpty, clearCart }: { isEmpty: boolean; clearCart: () => void }) {
    return (
        <CardHeader className="pb-4">
            <div className="flex items-center justify_between gap-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Icon name="ShoppingBag" className="h-5 w-5 text-feature-commerce icon-enhanced" />
                    سلة التسوق
                </CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            aria-label="افراغ السلة"
                            disabled={isEmpty}
                        >
                            <Icon name="Trash2" className="h-5 w-5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>تأكيد إفراغ السلة</AlertDialogTitle>
                            <AlertDialogDescription>
                                هل أنت متأكد أنك تريد إفراغ السلة؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction onClick={() => clearCart()} className="bg-destructive text-white hover:bg-destructive/90">افراغ السلة</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardHeader>
    );
}

// Empty state section
function EmptyState({ closePopover }: { closePopover?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10">
            <div className="mb-4 rounded-full bg-feature-commerce-soft p-4 text-feature-commerce">
                <Icon name="ShoppingBag" className="h-10 w-10 icon-enhanced" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">سلتك فارغة!</h3>
            <p className="mt-1 text-sm text-muted-foreground">لم تقم بإضافة أي منتجات بعد.</p>
            <Button asChild className="mt-6 w-full btn-view-outline" onClick={closePopover}>
                <Link href="/">
                    ابدأ التسوق
                    <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
    );
}

// Single cart item row
function CartItemRow({ item }: { item: any }) {
    const lineTotal = item.product.price * item.quantity;
    return (
        <div className="flex items-center gap-3 py-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border shadow-sm">
                <Image
                    src={item.product.imageUrl || '/fallback/dreamToApp2-dark.png'}
                    alt={item.product.name || ''}
                    fill
                    className="object-cover max-h-16"
                    sizes="64px"
                />
            </div>
            <div className="flex-1 overflow-hidden pr-1">
                <h4 className="truncate text-sm font-medium text-foreground mb-1">
                    {item.product.name}
                </h4>
                <p className="text-xs flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">
                        {item.product.price?.toLocaleString()} ر.س
                    </span>
                    <span className="font-bold text-foreground whitespace-nowrap">
                        {lineTotal.toLocaleString()} ر.س
                    </span>
                </p>
                <div className="flex items-center gap-4 mt-2">
                    <CartQuantityControls
                        productId={item.product.id}
                        size="sm"
                        variant="dropdown"
                    />
                </div>
            </div>
        </div>
    );
}

// Subtotal and note
function SummarySection({ total }: { total: number }) {
    return (
        <>
            <Separator className="my-2" />
            <div className="flex items-center justify-between px-1 text-lg font-bold">
                <span>المجموع الفرعي</span>
                <span className="text-feature-commerce">
                    {total.toLocaleString()} ر.س
                </span>
            </div>
            <p className="text-xs text-muted-foreground">الشحن والضرائب تحسب عند إتمام الطلب.</p>
        </>
    );
}

// Action buttons (view cart + checkout)
function CheckoutActions({
    closePopover,
    onCheckoutClick,
    isLoading,
}: {
    closePopover?: () => void;
    onCheckoutClick: () => void;
    isLoading: boolean;
}) {
    return (
        <>
            <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1 btn-view-outline" onClick={closePopover}>
                    <Link href="/cart">عرض السلة</Link>
                </Button>
                <Button
                    className="flex-1 btn-save"
                    onClick={onCheckoutClick}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            جاري التحقق...
                        </div>
                    ) : (
                        'إتمام الطلب'
                    )}
                </Button>
            </div>
        </>
    );
}

// Cart preview using Zustand store for instant updates
export default function CartPreview({ closePopover }: CartPreviewProps) {
    const { cart, getTotalPrice, clearCart } = useCartStore();
    const router = useRouter();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const items = Object.values(cart);
    const total = getTotalPrice();
    const isEmpty = items.length === 0;

    const handleCheckoutClick = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await checkIsLogin();

            if (result) {
                // User is logged in, go to checkout
                closePopover?.();
                router.push('/checkout');
            } else {
                // User is not logged in
                setError('USER_NOT_FOUND');
            }
        } catch (error) {
            setError('SERVICE_ERROR');
        } finally {
            setIsLoading(false);
        }
    };

    // Display error if present
    if (error) {
        return (
            <div className="p-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-right">
                    <h3 className="text-red-800 font-medium mb-2">خطأ في المصادقة</h3>
                    <p className="text-red-600 text-sm mb-3">
                        {error === 'INVALID_SESSION' && 'بيانات الجلسة غير صحيحة'}
                        {error === 'USER_NOT_FOUND' && 'يجب تسجيل الدخول لإتمام عملية الطلب'}
                        {error === 'USER_DEACTIVATED' && 'حساب المستخدم معطل'}
                        {error === 'SERVICE_ERROR' && 'حدث خطأ غير متوقع'}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setError(null)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                            إعادة المحاولة
                        </button>
                        {error === 'USER_NOT_FOUND' && (
                            <button
                                onClick={() => setShowLoginPrompt(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                تسجيل الدخول
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Card className="shadow-lg border-l-4 border-feature-commerce card-hover-effect card-border-glow max-h-[calc(100vh-100px)] w-full flex flex-col h-full">

                <CartHeader isEmpty={isEmpty} clearCart={clearCart} />
                <CardContent className="flex-1 flex flex-col min-h-0">
                    {isEmpty ? (
                        <EmptyState closePopover={closePopover} />
                    ) : (
                        <div className="flex-1 flex flex-col min-h-0 gap-4">
                            <ScrollArea className="flex-1 min-h-0 max-h-full pr-1 overflow-y-auto">
                                {items.map((item) => (
                                    <CartItemRow key={item.product.id} item={item} />
                                ))}
                            </ScrollArea>
                            <SummarySection total={total} />
                            <CheckoutActions
                                closePopover={closePopover}
                                onCheckoutClick={handleCheckoutClick}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Login prompt dialog when unauthenticated */}
            <AlertDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>تسجيل الدخول مطلوب</AlertDialogTitle>
                        <AlertDialogDescription>
                            يجب تسجيل الدخول لإتمام عملية الطلب. سيتم إعادتك إلى صفحة الإتمام بعد تسجيل الدخول.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                closePopover?.();
                                router.push('/auth/login?callbackUrl=%2Fcheckout');
                            }}
                        >
                            تسجيل الدخول
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}