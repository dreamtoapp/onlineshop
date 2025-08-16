import {
  ShoppingCart,
  Tag,
  Truck,
  Receipt,
  Percent,
  Sparkles,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '../../../../../lib/formatCurrency';
import CartItemsToggle from './client/CartItemsToggle';
import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';

interface PlatformSettings {
  taxPercentage: number;
  shippingFee: number;
  minShipping: number;
}

interface MiniCartSummaryProps {
  platformSettings: PlatformSettings;
}

export default function MiniCartSummary({ platformSettings }: MiniCartSummaryProps) {
  // Use Zustand cart for live updates
  const { cart: zustandCart } = useCartStore();
  const items = Object.values(zustandCart);
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  const deliveryFee = subtotal >= platformSettings.minShipping ? 0 : platformSettings.shippingFee;
  const taxAmount = subtotal * (platformSettings.taxPercentage / 100); // Tax on subtotal only
  const total = subtotal + deliveryFee + taxAmount;
  const totalItems = items.length; // Count unique products, not total quantity
  const savings = subtotal >= platformSettings.minShipping ? platformSettings.shippingFee : 0; // Show savings if free delivery

  // Handle empty cart
  if (!items.length) {
    return (
      <Card className="group relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-slate-50/50 hover:shadow-2xl transition-all duration-300 ease-out">
        {/* Decorative gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Status indicator bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

        <CardHeader className="pb-6 relative">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl transition-all duration-200 group-hover:scale-110">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              ملخص الطلب
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="relative">
          <div className="text-center py-8">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl mb-4">
              <p className="text-orange-800 font-medium mb-2">السلة فارغة</p>
              <p className="text-sm text-orange-600">يجب إضافة منتجات للمتابعة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-slate-50/50 hover:shadow-2xl transition-all duration-300 ease-out sticky top-6">
      {/* Decorative gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Status indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />

      <CardHeader className="pb-6 relative">
        <CardTitle className="flex items-center gap-3 text-2xl font-extrabold text-slate-800 mb-4">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl transition-all duration-200 group-hover:scale-110">
            <ShoppingCart className="h-7 w-7" />
          </div>
          <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            ملخص الطلب
          </span>
        </CardTitle>

        <div className="flex items-center gap-3 flex-wrap">
          <Badge className="px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-full font-semibold text-base">
            {totalItems} منتج
          </Badge>
          {savings > 0 && (
            <Badge className="px-3 py-1.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full font-semibold flex items-center gap-1.5 text-base">
              <Sparkles className="h-3 w-3" />
              توصيل مجاني!
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* Pricing Breakdown */}
        <div className="space-y-4">
          {/* Subtotal */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Tag className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold text-slate-600">الإجمالي الفرعي</span>
            </div>
            <span className="font-bold text-lg text-slate-800">{formatCurrency(subtotal)}</span>
          </div>

          {/* Delivery Fee */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Truck className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold text-slate-600">رسوم التوصيل</span>
              {deliveryFee === 0 && (
                <Badge className="px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm font-semibold rounded-full">
                  مجاني
                </Badge>
              )}
            </div>
            <span className={`font-bold text-lg ${deliveryFee === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
              {deliveryFee === 0 ? (
                <span className="flex items-center gap-2">
                  <span className="line-through text-slate-400 text-base">{formatCurrency(platformSettings.shippingFee)}</span>
                  <span className="text-emerald-600">مجاني</span>
                </span>
              ) : (
                formatCurrency(deliveryFee)
              )}
            </span>
          </div>

          {/* Free Delivery Progress */}
          {deliveryFee > 0 && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-base font-semibold text-blue-800">التوصيل المجاني</span>
                </div>
                <span className="text-blue-600 font-bold text-xl">
                  {Math.round((subtotal / platformSettings.minShipping) * 100)}%
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-blue-700 mb-2">
                  <span className="font-medium">أضف {formatCurrency(platformSettings.minShipping - subtotal)}</span>
                  <Badge className="px-2 py-1 bg-blue-100 text-blue-700 border border-blue-200 text-sm font-semibold rounded-full">
                    {formatCurrency(platformSettings.minShipping)} الحد الأدنى
                  </Badge>
                </div>
              </div>

              <div className="w-full bg-blue-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min((subtotal / platformSettings.minShipping) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Tax */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Percent className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold text-slate-600">ضريبة القيمة المضافة ({platformSettings.taxPercentage}%)</span>
            </div>
            <span className="font-bold text-lg text-slate-800">{formatCurrency(taxAmount)}</span>
          </div>

          <Separator className="my-6" />

          {/* Total */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <Receipt className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-blue-800">الإجمالي النهائي</span>
              </div>
              <span className="text-2xl font-bold text-blue-800">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Client-side Cart Items Toggle */}
        <CartItemsToggle items={items.map(item => ({ ...item, id: item.product.id }))} />

        {/* Security Notice */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-semibold text-emerald-800">معاملة آمنة</span>
          </div>
          <p className="text-sm text-emerald-700 text-center">جميع بياناتك محمية ومشفرة</p>
        </div>
      </CardContent>
    </Card>
  );
}
