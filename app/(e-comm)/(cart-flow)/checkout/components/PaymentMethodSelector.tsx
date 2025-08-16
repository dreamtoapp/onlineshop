'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote, CheckCircle, Lock, Shield, Check } from "lucide-react";
import Image from "next/image";

interface PaymentMethodSelectorProps {
    selectedPaymentMethod: string;
    onSelectPayment: (method: string) => void;
}

export default function PaymentMethodSelector({ selectedPaymentMethod, onSelectPayment }: PaymentMethodSelectorProps) {
    return (
        <Card className="group relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-slate-50/50 hover:shadow-2xl transition-all duration-300 ease-out">
            {/* Decorative gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Status indicator bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />

            <CardHeader className="pb-6 relative">
                <CardTitle className="flex items-center gap-3 text-2xl font-extrabold text-slate-800">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl transition-all duration-200 group-hover:scale-110">
                        <CreditCard className="h-7 w-7" />
                    </div>
                    <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        طريقة الدفع
                    </span>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8 relative">
                {/* COD - Primary Payment Method for Saudi Arabia */}
                <div
                    className={`group/payment p-8 border-2 rounded-xl cursor-pointer transition-all duration-300 ease-out active:scale-[0.98] active:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 ${selectedPaymentMethod === 'CASH'
                        ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 shadow-lg shadow-emerald-100/50'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/30 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-green-50/50'
                        }`}
                    onClick={() => onSelectPayment('CASH')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectPayment('CASH');
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="الدفع عند الاستلام - متاح ومحدد"
                    aria-pressed={selectedPaymentMethod === 'CASH'}
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-6">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ease-out ${selectedPaymentMethod === 'CASH'
                                ? 'bg-emerald-100 text-emerald-600 shadow-md shadow-emerald-200/50'
                                : 'bg-slate-100 text-slate-600 group-hover/payment:bg-emerald-100 group-hover/payment:text-emerald-600 group-hover/payment:shadow-md group-hover/payment:shadow-emerald-200/50'
                                }`}>
                                <Banknote className="h-7 w-7 transition-transform duration-300 group-hover/payment:scale-110" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-extrabold text-2xl mb-3 text-slate-800 transition-colors duration-300 group-hover/payment:text-slate-900">الدفع عند الاستلام</h3>
                                <p className="text-lg text-slate-600 leading-relaxed transition-colors duration-300 group-hover/payment:text-slate-700 mb-4">
                                    طريقة الدفع الأكثر أمانًا
                                    <span className="text-base text-blue-600 font-semibold mr-2 transition-colors duration-300 group-hover/payment:text-blue-700">(كاش أو شبكة)</span>
                                </p>

                                {/* Security Badges */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100 text-emerald-700 rounded-lg text-base font-semibold">
                                        <Shield className="h-5 w-5" />
                                        <span>آمن 100%</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg text-base font-semibold">
                                        <Lock className="h-5 w-5" />
                                        <span>مشفر</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {selectedPaymentMethod === 'CASH' && (
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full shadow-md shadow-emerald-200/50 transition-all duration-300 ease-out animate-in zoom-in-50" aria-hidden="true">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-lg text-emerald-700 transition-all duration-300 group-hover/payment:text-emerald-800">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg transition-all duration-300 group-hover/payment:bg-emerald-200 group-hover/payment:scale-110">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                            <span className="font-medium">ادفع بالضبط عند وصول الطلب</span>
                        </div>
                        <div className="flex items-center gap-4 text-lg text-emerald-700 transition-all duration-300 group-hover/payment:text-emerald-800">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg transition-all duration-300 group-hover/payment:bg-emerald-200 group-hover/payment:scale-110">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                            <span className="font-medium">فحص المنتجات قبل الدفع</span>
                        </div>
                        <div className="flex items-center gap-4 text-lg text-emerald-700 transition-all duration-300 group-hover/payment:text-emerald-800">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg transition-all duration-300 group-hover/payment:bg-emerald-200 group-hover/payment:scale-110">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                            <span className="font-medium">لا توجد رسوم إضافية</span>
                        </div>
                    </div>
                </div>

                {/* Visual Separator */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-base">
                        <span className="bg-white px-4 text-slate-500 font-medium">طرق دفع إضافية</span>
                    </div>
                </div>

                {/* Additional Payment Methods - Coming Soon */}
                <div className="space-y-6">
                    <h4 className="text-2xl font-bold text-slate-700 text-center">طرق دفع إضافية (قريبًا)</h4>

                    {/* Payment Methods Row */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Mada Card - Coming Soon */}
                        <div
                            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border-2 border-slate-300 cursor-not-allowed opacity-60 transition-all duration-300 ease-out hover:opacity-70 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                            aria-label="بطاقة مدى - متاحة قريباً"
                            aria-disabled="true"
                            role="button"
                            tabIndex={-1}
                        >
                            <div className="relative mb-3 transition-transform duration-300 ease-out">
                                <Image
                                    src="/assets/mada.svg"
                                    alt="Mada Card - Coming Soon"
                                    width={56}
                                    height={42}
                                    className="object-contain grayscale transition-all duration-300 ease-out"
                                />
                            </div>
                            <Badge variant="secondary" className="text-base bg-slate-400 text-slate-700 transition-colors duration-300 ease-out mb-3 font-semibold">
                                قريباً
                            </Badge>
                            <div className="flex items-center gap-2 text-base text-slate-500">
                                <Shield className="h-4 w-4" />
                                <span className="font-medium">آمن</span>
                            </div>
                        </div>

                        {/* Mastercard - Coming Soon */}
                        <div
                            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border-2 border-slate-300 cursor-not-allowed opacity-60 transition-all duration-300 ease-out hover:opacity-70 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                            aria-label="Mastercard - متاحة قريباً"
                            aria-disabled="true"
                            role="button"
                            tabIndex={-1}
                        >
                            <div className="relative mb-3 transition-transform duration-300 ease-out">
                                <Image
                                    src="/assets/Mastercard.svg"
                                    alt="Mastercard - Coming Soon"
                                    width={56}
                                    height={42}
                                    className="object-contain grayscale transition-all duration-300 ease-out"
                                />
                            </div>
                            <Badge variant="secondary" className="text-base bg-slate-400 text-slate-700 transition-colors duration-300 ease-out mb-3 font-semibold">
                                قريباً
                            </Badge>
                            <div className="flex items-center gap-2 text-base text-slate-500">
                                <Shield className="h-4 w-4" />
                                <span className="font-medium">آمن</span>
                            </div>
                        </div>

                        {/* Visa - Coming Soon */}
                        <div
                            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border-2 border-slate-300 cursor-not-allowed opacity-60 transition-all duration-300 ease-out hover:opacity-70 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                            aria-label="Visa - متاحة قريباً"
                            aria-disabled="true"
                            role="button"
                            tabIndex={-1}
                        >
                            <div className="relative mb-3 transition-transform duration-300 ease-out">
                                <Image
                                    src="/assets/Visa.svg"
                                    alt="Visa - Coming Soon"
                                    width={56}
                                    height={42}
                                    className="object-contain grayscale transition-all duration-300 ease-out"
                                />
                            </div>
                            <Badge variant="secondary" className="text-base bg-slate-400 text-slate-700 transition-colors duration-300 ease-out mb-3 font-semibold">
                                قريباً
                            </Badge>
                            <div className="flex items-center gap-2 text-base text-slate-500">
                                <Shield className="h-4 w-4" />
                                <span className="font-medium">آمن</span>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon Notice */}
                    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-base text-blue-700 font-medium">
                            🚀 نعمل على إضافة المزيد من طرق الدفع لراحتك
                        </p>
                    </div>
                </div>

                {/* Visual Separator */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-base">
                        <span className="bg-white px-4 text-slate-500 font-medium">معلومات الأمان</span>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="space-y-6">
                    {/* Main Security Message */}
                    <div className="flex items-center gap-4 text-lg text-slate-600">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Lock className="h-4 w-4" />
                        </div>
                        <span className="font-semibold">جميع المدفوعات آمنة ومشفرة طبقاً لأعلى معايير الأمان</span>
                    </div>

                    {/* Trust Marks Row */}
                    <div className="flex flex-wrap items-center gap-6">
                        {/* SSL Certificate */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-base font-semibold text-green-700">SSL مشفر</span>
                        </div>

                        {/* PCI Compliance */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <Shield className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-base font-semibold text-blue-700">PCI متوافق</span>
                        </div>

                        {/* Data Protection */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                <Lock className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-base font-semibold text-purple-700">حماية البيانات</span>
                        </div>
                    </div>

                    {/* Additional Security Info */}
                    <div className="text-base text-slate-500 leading-relaxed p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="font-medium">نحن نستخدم أحدث تقنيات التشفير لحماية معلوماتك الشخصية وبيانات الدفع. جميع المعاملات تتم عبر قنوات آمنة ومشفرة.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 