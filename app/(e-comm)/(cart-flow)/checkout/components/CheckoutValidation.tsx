'use client';

import { AlertCircle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface ValidationRule {
  id: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  icon: React.ReactNode;
  isResolved: boolean;
}

interface CheckoutValidationProps {
  user: any;
  selectedAddress: any;
  selectedShiftId: string;
  selectedPaymentMethod: string;
  termsAccepted: boolean;
  cart: any;
}

export default function CheckoutValidation({
  user,
  selectedAddress,
  selectedShiftId,
  selectedPaymentMethod,
  termsAccepted,
  cart
}: CheckoutValidationProps) {

  const [isValidationOpen, setIsValidationOpen] = useState(false);

  // Generate validation rules based on current state
  const generateValidationRules = (): ValidationRule[] => {
    const rules: ValidationRule[] = [];

    // User Info Validation
    if (!user?.name) {
      rules.push({
        id: 'user-name',
        message: 'يجب إدخال الاسم الكامل',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    if (!user?.phone) {
      rules.push({
        id: 'user-phone',
        message: 'يجب إدخال رقم الهاتف',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    if (user?.isOtp !== true) {
      rules.push({
        id: 'user-verification',
        message: 'يجب تفعيل الحساب قبل المتابعة',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    // Address Validation
    if (!selectedAddress) {
      rules.push({
        id: 'address-selection',
        message: 'يجب اختيار عنوان للتوصيل',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    } else {
      // Comprehensive address validation
      const addressIssues = [];

      if (!selectedAddress.latitude || !selectedAddress.longitude) {
        addressIssues.push('إحداثيات صحيحة');
      }
      if (!selectedAddress.district || selectedAddress.district.trim() === '') {
        addressIssues.push('الحي/المنطقة');
      }
      if (!selectedAddress.street || selectedAddress.street.trim() === '') {
        addressIssues.push('اسم الشارع');
      }
      if (!selectedAddress.buildingNumber || selectedAddress.buildingNumber.trim() === '') {
        addressIssues.push('رقم المبنى');
      }

      if (addressIssues.length > 0) {
        rules.push({
          id: 'address-incomplete',
          message: `العنوان المحدد يحتاج إلى: ${addressIssues.join('، ')}`,
          severity: 'error',
          icon: <AlertCircle className="h-4 w-4" />,
          isResolved: false
        });
      }
    }

    // Shift Validation
    if (!selectedShiftId) {
      rules.push({
        id: 'shift-selection',
        message: 'يجب اختيار وقت التوصيل',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    // Payment Method Validation
    if (!selectedPaymentMethod) {
      rules.push({
        id: 'payment-method',
        message: 'يجب اختيار طريقة الدفع',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    // Terms Validation
    if (!termsAccepted) {
      rules.push({
        id: 'terms-acceptance',
        message: 'يجب الموافقة على الشروط والأحكام',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    // Cart Validation
    if (!cart?.items || cart.items.length === 0) {
      rules.push({
        id: 'cart-items',
        message: 'يجب إضافة منتجات للسلة قبل المتابعة',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    return rules;
  };

  const validationRules = generateValidationRules();
  const errorCount = validationRules.filter(rule => rule.severity === 'error').length;

  const isCheckoutReady = errorCount === 0;

  if (validationRules.length === 0) {
    return (
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-emerald-800 mb-1">جاهز للطلب! 🎉</h4>
            <p className="text-base text-emerald-700 font-medium">
              جميع المتطلبات مكتملة. يمكنك المتابعة بأمان.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Smart Integrated Validation Component */}
      <Collapsible open={isValidationOpen} onOpenChange={setIsValidationOpen}>
        <CollapsibleTrigger asChild>
          <button className={`w-full p-4 rounded-xl border transition-all duration-200 ${isCheckoutReady
            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-green-100'
            : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100'
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isCheckoutReady
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-red-100 text-red-600'
                  }`}>
                  {isCheckoutReady ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="text-right">
                  <h4 className={`font-bold text-lg mb-1 ${isCheckoutReady ? 'text-emerald-800' : 'text-red-800'
                    }`}>
                    {isCheckoutReady ? 'جاهز للطلب! 🎉' : 'معلومات مطلوبة'}
                  </h4>
                  <p className={`text-base font-medium ${isCheckoutReady ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                    {isCheckoutReady
                      ? 'جميع المتطلبات مكتملة. انقر لعرض تفاصيل الطلب'
                      : 'انقر لعرض التفاصيل والمساعدة'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Status Badge */}
                {isCheckoutReady ? (
                  <Badge variant="default" className="px-3 py-1 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700">
                    جاهز ✅
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="px-3 py-1 text-sm font-semibold">
                    {errorCount} خطأ
                  </Badge>
                )}
                {/* Collapse/Expand Icon */}
                <div className={`p-2 rounded-lg ${isCheckoutReady
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-red-100 text-red-600'
                  }`}>
                  {isValidationOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-3 mt-3">
          {isCheckoutReady ? (
            /* Success State - Order Summary */
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
              <div className="space-y-4">
                {/* Order Summary */}
                <div className="text-center">
                  <h5 className="font-bold text-lg text-emerald-800 mb-2">ملخص الطلب</h5>
                  <p className="text-base text-emerald-700 font-medium">
                    {cart?.items?.length || 0} منتج • إجمالي {cart?.total?.toFixed(2) || '0.00'} ريال
                  </p>
                </div>

                {/* Order Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-emerald-700 font-medium">
                      الدفع: {selectedPaymentMethod === 'CASH' ? 'عند الاستلام' : selectedPaymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-emerald-700 font-medium">
                      العنوان: محدد
                    </span>
                  </div>
                  {selectedShiftId && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm text-emerald-700 font-medium">
                        وقت التوصيل: محدد
                      </span>
                    </div>
                  )}
                </div>

                {/* Success Message */}
                <div className="text-center p-3 bg-emerald-100 rounded-lg">
                  <p className="text-sm text-emerald-800 font-medium">
                    يمكنك المتابعة بأمان لإتمام الطلب! 🚀
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Error State - Validation Details */
            <div className="space-y-3">
              {validationRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${rule.severity === 'error'
                    ? 'bg-red-50 border-red-200'
                    : rule.severity === 'warning'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-blue-50 border-blue-200'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${rule.severity === 'error'
                      ? 'bg-red-100 text-red-600'
                      : rule.severity === 'warning'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-100 text-blue-600'
                      }`}>
                      {rule.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-base font-medium ${rule.severity === 'error'
                        ? 'text-red-800'
                        : rule.severity === 'warning'
                          ? 'text-amber-800'
                          : 'text-blue-800'
                        }`}>
                        {rule.message}
                      </p>

                      {/* Actionable Suggestions */}
                      {rule.id === 'user-verification' && (
                        <p className="text-sm text-red-600 mt-2">
                          💡 <a href="/auth/verify?redirect=/checkout" className="underline hover:text-red-800">
                            انقر هنا لتفعيل الحساب
                          </a>
                        </p>
                      )}

                      {rule.id === 'address-selection' && (
                        <p className="text-sm text-red-600 mt-2">
                          💡 <a href="/user/addresses?redirect=/checkout" className="underline hover:text-red-800">
                            انقر هنا لإضافة عنوان جديد
                          </a>
                        </p>
                      )}

                      {rule.id === 'terms-acceptance' && (
                        <p className="text-sm text-red-600 mt-2">
                          💡 انقر على مربع &quot;الموافقة على الشروط والأحكام&quot; أعلاه
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
