import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from '@/components/link';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';

// Types
type GuestCartItem = { product: any; quantity: number };
type ServerCartItem = { id: string; product: any; quantity: number };

interface OrderSummaryProps {
  items: (ServerCartItem | GuestCartItem)[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
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
  tax
}: {
  items: (ServerCartItem | GuestCartItem)[];
  subtotal: number;
  shipping: number;
  tax: number;
}) {
  return (
    <div className="space-y-3 text-sm">

      <div className="flex justify-between">
        <span className="text-muted-foreground">المجموع الفرعي ({items.length} منتج)</span>
        <span className="font-medium text-foreground">{subtotal.toLocaleString()} ر.س</span>
      </div>

      <div className="flex justify-between">
        <span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
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

// Login Dialog Component
function LoginDialog({
  showLoginDialog,
  setShowLoginDialog,
  onCheckout
}: {
  showLoginDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
  onCheckout: () => void;
}) {
  const router = useRouter();

  return (
    <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
      <AlertDialogTrigger asChild>
        <Button
          className="w-full btn-save text-lg py-3 h-12"
          onClick={onCheckout}
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
  );
}

// Action Buttons Component
function ActionButtons({
  onCheckout,
  showLoginDialog,
  setShowLoginDialog
}: {
  onCheckout: () => void;
  showLoginDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
}) {
  return (
    <div className="space-y-3 pt-2">
      <LoginDialog
        showLoginDialog={showLoginDialog}
        setShowLoginDialog={setShowLoginDialog}
        onCheckout={onCheckout}
      />
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
  onCheckout,
  showLoginDialog,
  setShowLoginDialog
}: OrderSummaryProps) {
  return (
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
  );
} 