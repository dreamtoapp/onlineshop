# 🎯 Arabic Selectors Reference Guide

This document contains all the Arabic text selectors used in the application for E2E testing. Use these exact selectors to avoid test failures.

## 📋 Quick Reference

### Add to Cart Buttons
- **Primary**: `أضف إلى السلة`
- **Alternative**: `أضف للسلة`
- **Success State**: `تمت الإضافة`
- **Out of Stock**: `غير متوفر` / `نفد المخز`

### Cart Related
- **Cart**: `السلة`
- **Shopping Cart**: `سلة التسوق`
- **Cart Title**: `عربة التسوق`
- **View Cart**: `عرض السلة`
- **Empty Cart**: `السلة فارغة`
- **No Items**: `لا توجد عناصر`

### Checkout Related
- **Checkout**: `الدفع`
- **Proceed to Checkout**: `متابعة للدفع`
- **Complete Order**: `إتمام الطلب`
- **Place Order**: `تنفيذ الطلب`
- **Processing Order**: `جاري تنفيذ الطلب...`
- **Ready for Order**: `جاهز للطلب`

### Order Related
- **Order**: `طلب`
- **Order Number**: `رقم الطلب`
- **Order Confirmed**: `تم تأكيد الطلب!`
- **Order Received**: `لقد تلقينا طلبك بنجاح`
- **Order Details**: `عرض التفاصيل`

### Navigation
- **Product Page**: `صفحة المنتج`
- **Continue Shopping**: `متابعة التسوق`
- **Back to Shopping**: `العودة للتسوق`

### Quantity Controls
- **Increase Quantity**: `زيادة الكمية`
- **Decrease Quantity**: `تقليل الكمية`
- **Quantity**: `الكمية`
- **Remove from Cart**: `حذف من السلة`

### Payment
- **Total**: `الإجمالي`
- **Subtotal**: `المجموع الفرعي`
- **Shipping**: `الشحن`
- **Tax**: `الضريبة`

### Status
- **Available**: `متوفر`
- **Unavailable**: `غير متوفر`
- **In Stock**: `متوفر`

### Buttons
- **Cancel**: `إلغاء`
- **Confirm**: `تأكيد`
- **Save**: `حفظ`
- **Edit**: `تعديل`
- **Delete**: `حذف`
- **Remove**: `حذف`
- **View**: `عرض`
- **Track**: `تتبع`

### Messages
- **Success**: `تم`
- **Error**: `خطأ`
- **Required**: `مطلوب`
- **Invalid**: `غير صحيح`
- **Failed**: `فشل`
- **Completed**: `مكتمل`
- **Confirmed**: `مؤكد`
- **Added**: `تم الإضافة`

### Terms
- **Terms and Conditions**: `الشروط والأحكام`
- **Accept Terms**: `يجب الموافقة على الشروط والأحكام`

### Address
- **Delivery Address**: `عنوان التوصيل`
- **Add Address**: `إضافة عنوان جديد`
- **No Address**: `لم يتم إضافة عنوان بعد`
- **Address Required**: `يجب إضافة عنوان للتوصيل قبل المتابعة في عملية الشراء`

### User Account
- **Profile**: `الملف الشخصي`
- **Orders**: `طلباتي`
- **Wishlist**: `المفضلة`
- **Notifications**: `الإشعارات`
- **Logout**: `تسجيل الخروج`

### Admin
- **Dashboard**: `لوحة التحكم`
- **All Orders**: `جميع الطلبات`
- **Products**: `المنتجات`
- **Customers**: `العملاء`
- **Users**: `المستخدمين`
- **Analytics**: `التحليلات`

### Tracking
- **Track Order**: `تتبع الطلب`
- **Order Tracking**: `تتبع حالة الطلب`
- **Tracking Reports**: `تقارير التتبع`
- **Driver Tracking**: `تتبع السائق`
- **Active Tracking**: `قيد التتبع`
- **Waiting**: `في الانتظار`

### Login/Register
- **Login**: `تسجيل الدخول`
- **Register**: `إنشاء حساب`
- **Phone Number**: `رقم الهاتف`
- **Password**: `كلمة المرور`
- **Confirm Code**: `تأكيد الرمز`
- **Resend Code**: `إعادة إرسال الرمز`
- **Verifying**: `جاري التحقق...`

### Common
- **Loading**: `جاري التحميل...`
- **Please Wait**: `يرجى الانتظار`
- **Try Again**: `إعادة المحاولة`
- **Help**: `مساعدة؟`
- **Close**: `إغلاق`
- **Next**: `التالي`
- **Previous**: `السابق`
- **Finish**: `إنهاء`
- **Submit**: `إرسال`
- **Send**: `إرسال`
- **Search**: `بحث`
- **Filter**: `تصفية`
- **Sort**: `ترتيب`
- **View All**: `عرض الكل`
- **Show More**: `عرض المزيد`
- **Show Less**: `عرض أقل`

## 🧪 Usage in Tests

### Example Usage
```typescript
import { ARABIC_SELECTORS } from '../../utils/test-helpers';

// Find Add to Cart button
const addToCartButton = page.getByText(new RegExp(`${ARABIC_SELECTORS.addToCart}|${ARABIC_SELECTORS.addToCartAlt}`, 'i'));

// Find Checkout button
const checkoutButton = page.getByText(new RegExp(`checkout|${ARABIC_SELECTORS.proceedToCheckout}`, 'i'));

// Find Place Order button
const placeOrderButton = page.getByText(new RegExp(`place order|${ARABIC_SELECTORS.placeOrder}`, 'i'));
```

### Helper Function
```typescript
// Use the helper function for better reliability
const element = await findElementByArabicText(page, ARABIC_SELECTORS.addToCart, 'add to cart');
```

## 🔧 Best Practices

1. **Always use the exact Arabic text** from this reference
2. **Include English fallbacks** for better test reliability
3. **Use RegExp with case-insensitive flag** (`i`)
4. **Test both variations** when multiple options exist
5. **Use helper functions** from `test-helpers.ts` when possible

## 🚨 Common Issues

### Selector Not Found
- Check if the Arabic text matches exactly
- Verify the element is visible before interacting
- Use `page.waitForSelector()` for dynamic content

### Test Flakiness
- Add appropriate waits after interactions
- Use `networkidle` wait state for page loads
- Check for loading states before proceeding

### Mobile vs Desktop
- Some selectors may differ between mobile and desktop
- Test on both viewport sizes
- Use responsive selectors when possible

## 📝 Maintenance

When updating the application:
1. **Update this reference** with any new Arabic text
2. **Test all selectors** to ensure they still work
3. **Update test files** if selectors change
4. **Document any new patterns** or variations

---

**Last Updated**: January 2025
**Version**: 1.0
**Maintainer**: E2E Testing Team 