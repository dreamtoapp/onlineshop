import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from '@/components/link';
import { useRouter } from 'next/navigation';
import { checkIsLogin } from '@/lib/check-is-login';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

// Types
type GuestCartItem = { product: any; quantity: number };
type ServerCartItem = { id: string; product: any; quantity: number };

interface OrderSummaryProps {
  items: (ServerCartItem | GuestCartItem)[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  taxPercentage: number;
  onCheckout: () => void;
  showLoginDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
}

// Free Shipping Banner Component
function FreeShippingBanner({ subtotal }: { subtotal: number }) {
  if (subtotal >= 100) return null;

  return (
    <div className="text-xs text-feature-commerce bg-feature-commerce-soft p-3 rounded-lg border border-feature-commerce/20">
      أضف {(100 - subtotal).toLocaleString()} ر.س للحصول على شحن مجاني
    </div>
  );
}

// Order Details Component
function OrderDetails({
  items,
  subtotal,
  shipping,
  tax,
  taxPercentage
}: {
  items: (ServerCartItem | GuestCartItem)[];
  subtotal: number;
  shipping: number;
  tax: number;
  taxPercentage: number;
}) {
  return (
    <div className="space-y-3 text-sm">

      <div className="flex justify-between">
        <span className="text-muted-foreground">المجموع الفرعي ({items.length} منتج)</span>
        <span className="font-medium text-foreground">{subtotal.toLocaleString()} ر.س</span>
      </div>

      <div className="flex justify-between">
        <span className="text-muted-foreground">ضريبة القيمة المضافة ({taxPercentage}%)</span>
        <span className="font-medium text-foreground">{tax.toFixed(2)} ر.س</span>
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

      <FreeShippingBanner subtotal={subtotal} />
    </div>
  );
}

// Total Amount Component
function TotalAmount({ total }: { total: number }) {
  return (
    <div className="border-t border-feature-commerce/20 pt-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-foreground">الإجمالي</span>
        <span className="text-2xl font-bold text-feature-commerce">{total.toLocaleString()} ر.س</span>
      </div>
    </div>
  );
}

// Action Buttons Component
function ActionButtons({
  onCheckout,
  setShowLoginDialog,
}: {
  onCheckout: () => void;
  showLoginDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckoutClick = async () => {
    setIsLoading(true);
    try {
      const user = await checkIsLogin();
      if (user) {
        onCheckout();
      } else {
        setShowLoginDialog(true);
      }
    } catch (error) {
      setShowLoginDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Checkout button with loading state */}
      <Button
        className="w-full btn-save text-lg py-3 h-12"
        onClick={handleCheckoutClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            جاري التحقق...
          </div>
        ) : (
          'متابعة للدفع'
        )}
      </Button>

      <Button asChild variant="outline" className="w-full border-feature-commerce text-feature-commerce hover:bg-feature-commerce-soft">
        <Link href="/">متابعة التسوق</Link>
      </Button>
    </div>
  );
}

// Main Order Summary Component
export default function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  total,
  taxPercentage,
  onCheckout,
  showLoginDialog,
  setShowLoginDialog
}: OrderSummaryProps) {
  const router = useRouter();

  return (
    <>
      <div className="sticky top-4">
        <Card className="shadow-lg border-l-4 border-feature-commerce">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-feature-commerce">ملخص الطلب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <OrderDetails
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              taxPercentage={taxPercentage}
            />
            <TotalAmount total={total} />
            <ActionButtons
              onCheckout={onCheckout}
              showLoginDialog={showLoginDialog}
              setShowLoginDialog={setShowLoginDialog}
            />
          </CardContent>
        </Card>
      </div>

      {/* Login prompt dialog when unauthenticated */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
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
                setShowLoginDialog(false);
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