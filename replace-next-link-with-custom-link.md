# Migration: Replace `next/link` with Custom `@/components/link`

## Overview
Replace all direct imports of `next/link` with your custom `@/components/link` component for consistent prefetch and navigation behavior across your app.

---

## Files to Update
Replace:
```tsx
import Link from 'next/link';
```
with:
```tsx
import Link from '@/components/link';
```
in the following files:

- [x] components/mdx-components.tsx
- [x] app/dashboard/management-tracking/page.tsx
- [x] app/dashboard/management-suppliers/components/SupplierCard.tsx
- [x] app/dashboard/management-reports/page.tsx
- [x] app/dashboard/management-products/new/components/ProductFormFallback.tsx
- [x] app/dashboard/management-products/components/ProductCard.tsx
- [x] app/dashboard/management-products/components/PaginationControls.tsx
- [x] app/dashboard/management-orders/assign-driver/[orderId]/components/OrderSummaryPanel.tsx
- [x] app/dashboard/management-categories/components/CategoryCard.tsx
- [x] app/(e-comm)/bestsellers/compnents/BestSellerProductCard.tsx
- [x] app/(e-comm)/homepage/component/Header/HeaderUnified.tsx
- [x] app/(e-comm)/homepage/component/slider/HomepageHeroSlider.tsx
- [x] app/(e-comm)/homepage/component/Header/MobileBottomNav.tsx
- [x] app/(e-comm)/homepage/component/Fotter/Fotter.tsx
- [x] app/(e-comm)/homepage/component/offer/FeaturedPromotions.tsx
- [x] app/(e-comm)/homepage/component/Header/NotificationDropdown.tsx
- [x] app/(e-comm)/homepage/component/Header/UserMenuTrigger.tsx
- [x] app/(e-comm)/(home-page-sections)/product/not-found.tsx
- [x] app/(e-comm)/homepage/component/category/CategoryList.tsx
- [x] app/(e-comm)/(home-page-sections)/product/cards/QuickViewButton.tsx
- [x] app/(e-comm)/(cart-flow)/cart/cart-controller/CartDropdown.tsx
- [x] app/(e-comm)/(home-page-sections)/product/cards/ProductCard.tsx
- [x] app/(e-comm)/(adminPage)/user/purchase-history/components/PurchaseHistoryPageClient.tsx
- [x] app/(e-comm)/(home-page-sections)/categories/[slug]/page.tsx
- [x] app/(e-comm)/(home-page-sections)/categories/page.tsx
- [x] app/(e-comm)/(adminPage)/contact/components/SuccessMessage.tsx
- [x] app/dashboard/management-seo/product/components/ProductSeoTable.tsx
- [x] app/dashboard/management-seo/category/components/CategorySeoTable.tsx
- [x] app/(e-comm)/(cart-flow)/cart/components/CartPageView.tsx
- [x] app/(e-comm)/(cart-flow)/checkout/components/UserInfoCard.tsx

---

## Migration Steps

1. Replace all imports of `next/link` with your custom link component as shown above.
2. Ensure all usages of `<Link ...>` are compatible with your custom component’s props.
3. Test navigation and prefetching behavior in your app to confirm everything works as expected.

---

**Tip:** Your custom link component optimizes prefetching and is fully compatible with Next.js navigation. 