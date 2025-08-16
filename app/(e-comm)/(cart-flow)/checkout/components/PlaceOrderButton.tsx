import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, AlertCircle, Loader2, Sparkles } from "lucide-react";
import InfoTooltip from '@/components/InfoTooltip';
import { createDraftOrder } from '../actions/orderActions';
import { UserProfile } from './UserInfoCard';
import { AddressWithDefault } from "./AddressBook";
import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';

export interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
    } | null;
}

export interface CartData {
    items: CartItem[];
}

interface PlaceOrderButtonProps {
    cart?: CartData;
    user: UserProfile;
    selectedAddress: AddressWithDefault | null;
    shiftId: string;
    paymentMethod: string;
    termsAccepted: boolean;

}

export default function PlaceOrderButton({ cart, user, selectedAddress, shiftId, paymentMethod, termsAccepted }: PlaceOrderButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use Zustand cart for real-time updates and discounts
    const { cart: zustandCart } = useCartStore();
    const zustandItems = Object.values(zustandCart);

    // Use Zustand cart if available, otherwise fall back to props cart
    const items = zustandItems.length > 0 ? zustandItems : (cart?.items || []);
    const hasItems = items.length > 0;





    // Validation: all 3 conditions
    const isAccountActivated = user.isOtp === true;
    const hasValidLocation = selectedAddress && selectedAddress.latitude && selectedAddress.longitude;
    const isValid = hasItems && isAccountActivated && hasValidLocation && termsAccepted;

    // Info message for why the button is disabled
    let infoMessage = '';
    if (!isAccountActivated) infoMessage = 'يرجى تفعيل الحساب أولاً';
    else if (!hasValidLocation) infoMessage = 'يرجى تحديد موقع العنوان';
    else if (!termsAccepted) infoMessage = 'يجب الموافقة على الشروط والأحكام';
    else if (!hasItems) infoMessage = 'يجب إضافة منتجات للسلة أولاً';

    // Simple sync function
    const syncZustandToDatabase = async () => {
        try {
            const { syncZustandQuantityToDatabase } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');

            // Sync all Zustand items to database (replaces quantities, doesn't add)
            for (const [productId, item] of Object.entries(zustandCart)) {
                await syncZustandQuantityToDatabase(productId, item.quantity);
            }

            console.log('✅ Zustand cart synced to database');
        } catch (error) {
            console.error('❌ Failed to sync Zustand to database:', error);
            throw new Error('فشل في مزامنة السلة مع قاعدة البيانات');
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError(null);

        // Frontend validation for shiftId
        if (!shiftId) {
            setError('يرجى اختيار وقت التوصيل');
            setLoading(false);
            return;
        }
        try {
            // Simple sync: Update database cart with Zustand data
            await syncZustandToDatabase();

            const formData = new FormData();
            formData.append('fullName', user.name || '');
            formData.append('phone', user.phone || '');
            formData.append('addressId', selectedAddress?.id || '');
            formData.append('shiftId', shiftId);
            formData.append('paymentMethod', paymentMethod);
            formData.append('termsAccepted', termsAccepted ? 'true' : 'false');

            const orderNumber = await createDraftOrder(formData);
            router.push(`/happyorder?orderid=${orderNumber}`);
        } catch (err: any) {
            if (err?.validationErrors) setError(err.validationErrors.join('، '));
            else setError(err?.message || 'حدث خطأ أثناء تنفيذ الطلب');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Place Order Button with Info Tooltip */}
            <div className="space-y-4">
                <Button
                    className={`w-full h-14 text-xl font-bold transition-all duration-300 transform ${isValid && !loading
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        } rounded-xl shadow-lg`}
                    disabled={!isValid || loading}
                    onClick={handlePlaceOrder}
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                            جاري تنفيذ الطلب...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-5 w-5 ml-2" />
                            {isValid ? (
                                <span className="flex items-center gap-2">
                                    تنفيذ الطلب
                                    <Sparkles className="h-4 w-4" />
                                </span>
                            ) : (
                                'تنفيذ الطلب'
                            )}
                        </>
                    )}
                </Button>

                {!isValid && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-amber-800 mb-1">مطلوب لاتمام عملية الشراء</h4>
                            <p className="text-base text-amber-700 font-medium">{infoMessage}</p>
                        </div>
                        <InfoTooltip content={infoMessage} />
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-red-800 mb-1">خطأ في الطلب</h4>
                            <p className="text-base text-red-700 font-medium">
                                {Array.isArray(error) ? error.join('، ') : error}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 