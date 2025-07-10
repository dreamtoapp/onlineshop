# Global Icon System Refactor Plan

> **Description:**
> This checklist tracks the migration of all icon usage in the codebase to a centralized global Icon component. The goal is to ensure:
> - Consistency: All icons look and behave the same across the app.
> - Maintainability: Update or replace an icon in one place, and it updates everywhere.
> - Performance: Only import the icons you use (tree-shaking), reducing bundle size.
> - Theming: Easily control color, size, and style globally.
> - Accessibility: Centralize ARIA and accessibility props.
> 
> All direct imports from icon libraries (like lucide-react and react-icons) should be removed from components, and replaced with the `<Icon />` system for a modern, maintainable, and scalable icon architecture.

## Why Centralize Icons?
- **Consistency:** All icons look and behave the same across the app.
- **Maintainability:** Update or replace an icon in one place, and it updates everywhere.
- **Performance:** Only import the icons you use (tree-shaking), reducing bundle size.
- **Theming:** Easily control color, size, and style globally.
- **Accessibility:** Centralize ARIA and accessibility props.

---

## Refactor Action Plan

### 1. Create a Global Icon System
- [x] Create this folder: `components/icons/`
- [x] Add a single `Icon.tsx` component here (see below for example).
- [x] The component should accept a `name` prop (icon name as string), plus size, color, etc.
- [x] Internally, it should map the name to the correct Lucide icon component and any react-icons as needed.
- [x] Use `iconVariants` for consistent styling (now local to Icon.tsx).

### 2. Refactor All Icon Usages
- [ ] Search for all direct imports from `lucide-react` and `react-icons` across the codebase.
- [ ] Replace them with the new `<Icon name="..." />` usage.
- [ ] Remove all direct Lucide and react-icons imports from components.

### 3. Update Documentation
- [x] Keep this README up to date with usage and migration notes.

---

## Example: Icon Component

```tsx
// components/icons/Icon.tsx
import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import React from 'react';
import { cva } from 'class-variance-authority';

const iconMap = {
  ...LucideIcons,
  ...FaIcons,
};

export function Icon({ name, size = 'md', variant = 'default', ...props }) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent className={cva({ size, variant }).className} {...props} />;
}
```

**Usage:**
```tsx
<Icon name="Star" size="lg" variant="primary" />
<Icon name="FaCartPlus" size="md" />
```

---

## Migration Checklist (Full Deep Search)

Refactor all icon usages in these files/components (and any others found):

### Lucide Icons
- [x] `app/(e-comm)/about/components/WhyChooseUsSection.tsx`
- [x] `app/(e-comm)/cart/component/MiniCartItem.tsx`
- [x] `app/(e-comm)/product/[slug]/page.tsx`
- [x] `app/(e-comm)/product/not-found.tsx`
- [x] `app/(e-comm)/user/purchase-history/page.tsx`
- [x] `app/dashboard/fallback-alerts/FallbackAlertsLayout.tsx`
- [x] `app/dashboard/management-dashboard/components/AppSidebar.tsx`
- [x] `app/dashboard/management-dashboard/components/Sidebar.tsx`
- [x] `app/dashboard/management-dashboard/components/SidebarHeader.tsx`
- [x] `app/dashboard/management-products/analytics/[id]/actions/AnalyticsActions.tsx`
- [x] `app/dashboard/management-reports/milestones/component/MilestonesReportClient.tsx`
- [x] `components/InfoTooltip.tsx`
- [x] `components/admin/FallbackAlertsLayout.tsx`
- [x] `components/ecomm/Fotter/QuickLinks.tsx`
- [x] `components/ecomm/Fotter/SocialMedia.tsx`
- [x] `components/product/gallery/ProductImageGallery.tsx`
- [x] `components/rating/RatingDisplay.tsx`
- [x] `components/ThemeToggle.txt`
- [x] `components/ui/accordion.tsx`
- [x] `components/ui/checkbox.tsx`
- [x] `components/ui/dropdown-menu.tsx`
- [x] `components/ui/input-otp.tsx`
- [x] `components/ui/pagination.tsx`
- [x] `components/ui/sidebar.tsx`
- [x] `components/warinig-msg.tsx`
- [x] `app/driver/components/DriverHeader.tsx`
- [x] `app/dashboard/management-dashboard/helpers/mainMenu.ts` (menu config: refactor to use icon names as strings)

### Additional Lucide-react Imports (Deep Search)

- [x] `components/ui/sheet.tsx`
- [x] `components/ui/NotificationBell.tsx`
- [x] `components/ui/dialog.tsx`
- [x] `components/SupportPingButton.tsx`
- [x] `components/rating/RatingPreview.tsx`
- [x] `components/rating/RatingModal.tsx`
- [x] `components/rating/RateProductButton.tsx`
- [x] `components/product/cards/ProductCardActions.tsx`
- [x] `components/product/cards/WishlistButton.tsx`
- [x] `components/product/cards/QuickViewButton.tsx`
- [x] `components/product/cards/ProductListWithScroll.tsx`
- [x] `components/product/cards/ProductCardMedia.tsx`
- [x] `components/product/cards/ProductCard.tsx`
- [x] `components/product/cards/NotificationSection.tsx`
- [x] `components/product/cards/ImageCarousel.tsx`
- [x] `components/product/cards/CompareButton.tsx`
- [x] `components/notifications/NotificationDropdown.tsx`
- [x] `components/image-upload.tsx`
- [x] `components/GoogleMap.tsx`
- [x] `components/examples/WhatsAppOTPExample.tsx`
- [x] `components/ecomm/MobileProductGrid.tsx`
- [x] `components/ecomm/Header/MobileBottomNav.tsx`
- [x] `components/ecomm/Header/SearchBar.tsx`
- [x] `components/ecomm/Header/UserMenuTrigger.tsx`
- [x] `components/ecomm/Header/ClearCartButton.tsx`
- [x] `components/ecomm/Header/CartPreview.tsx`
- [x] `components/ecomm/Header/CartIconClient.tsx`
- [x] `components/ecomm/Fotter/Fotter.tsx`
- [x] `components/cart/StoreAddToCartButton.tsx`
- [x] `components/cart/AddToCartButton.tsx`
- [x] `components/BackButton.tsx`
- [x] `components/AddImage.tsx`
- [x] `app/not-found.tsx`
- [x] `app/driver/page.tsx`
- [x] `app/driver/driver/showdata/page.tsx`
- [x] `app/driver/driver/page.tsx`
- [x] `app/driver/driver/component/StartTrip.tsx`
- [x] `app/driver/driver/component/ActiveTrip.tsx`
- [x] `app/driver/components/MenuList.tsx`
- [x] `app/driver/driver/component/DriverOrderCard.tsx`
- [x] `app/dashboard/show-invoice/[invoiceid]/page.tsx`
- [x] `app/dashboard/show-invoice/[invoiceid]/loading.tsx`
- [x] `app/dashboard/show-invoice/components/ConfirmDriver.tsx`
- [x] `app/dashboard/show-invoice/components/Drivers.tsx`
- [x] `app/dashboard/show-invoice/components/SendOrderViaEmail.tsx`
- [x] `app/dashboard/management-users/shared/components/UserCard.tsx`
- [x] `app/dashboard/management-users/shared/components/UserUpsert.tsx`
- [x] `app/dashboard/management-tracking/[orderid]/page.tsx`
- [x] `app/dashboard/management-tracking/[orderid]/loading.tsx`
- [x] `app/dashboard/management-tracking/page.tsx`
- [x] `app/dashboard/management-suppliers/components/SupplierCard.tsx`
- [x] `app/dashboard/management-suppliers/components/SupplierUpsert.tsx`
- [x] `app/dashboard/management-suppliers/components/DeleteSupplierAlert.tsx`
- [x] `app/dashboard/management-tracking/components/RefreshButton.tsx`
- [x] `app/dashboard/management-tracking/components/GoogleMapsButton.tsx`
- [x] `app/dashboard/management-reports/reviews/component/ReviewsReportClient.tsx`
- [x] `app/dashboard/management-seo/page.tsx`
- [x] `app/dashboard/management-reports/product-performance/component/ProductPerformanceClient.tsx`
- [x] `app/dashboard/management-reports/page.tsx`
- [x] `app/dashboard/management-products/view/[id]/product-view-content.tsx`
- [x] `app/dashboard/management-products/view/[id]/page.tsx`
- [x] `app/dashboard/management-orders/status/in-way/page.tsx`
- [x] `app/dashboard/management-orders/status/in-way/loading.tsx`
- [x] `app/dashboard/management-orders/status/in-way/components/SyncOrderInWayButton.tsx`
- [x] `app/dashboard/management-orders/status/in-way/components/InWayOrdersView.tsx`
- [x] `app/dashboard/management-orders/status/canceled/page.tsx`
- [x] `app/dashboard/management-orders/status/canceled/components/OrderTable.tsx`
- [x] `app/dashboard/management-orders/status/canceled/components/CanceledOrdersView.tsx`
- [x] `app/dashboard/management-products/page.tsx`
- [x] `app/dashboard/management-products/new/page.tsx`
- [x] `app/dashboard/management-products/new/loading.tsx`
- [x] `app/dashboard/management-products/new/components/ProductUpsert.tsx`
- [x] `app/dashboard/management-products/new/components/ProductFormFallback.tsx`
- [x] `app/dashboard/management-orders/status/delivered/page.tsx`
- [x] `app/dashboard/management-orders/components/OrderStatusTabs.tsx`
- [x] `app/dashboard/management-orders/components/OrdersList.tsx`
- [x] `app/dashboard/management-orders/status/delivered/components/DeliveredOrdersView.tsx`
- [x] `app/dashboard/management-orders/components/OrderManagementView.tsx`
- [x] `app/dashboard/management-orders/components/OrderManagementHeader.tsx`
- [x] `app/dashboard/management-orders/components/OrderDashboardHeader.tsx`
- [x] `app/dashboard/management-orders/components/OrderCard.tsx`
- [x] `app/dashboard/management-products/gallery/[id]/page.tsx`
- [x] `app/dashboard/management-products/gallery/[id]/components/ProductGalleryManager.tsx`
- [x] `app/dashboard/management-orders/status/pending/page.tsx`
- [x] `app/dashboard/management-orders/assign-driver/[orderId]/components/DriverCard.tsx`
- [x] `app/dashboard/management-orders/assign-driver/[orderId]/components/OrderSummaryPanel.tsx`
- [x] `app/dashboard/management-orders/assign-driver/[orderId]/components/SmartSuggestions.tsx`
- [x] `app/dashboard/management-orders/assign-driver/[orderId]/components/DriverSelectionGrid.tsx`
- [x] `app/dashboard/management-orders/assign-driver/[orderId]/components/AssignDriverClient.tsx`
- [x] `app/dashboard/management-orders/status/pending/components/UnassignDriver.tsx`
- [x] `app/dashboard/management-products/edit/[id]/page.tsx`
- [x] `app/dashboard/management-orders/status/pending/components/PendingOrdersView.tsx`
- [x] `app/dashboard/management-orders/status/pending/components/OrderTable.tsx`
- [x] `app/dashboard/management-orders/status/pending/components/CancelOrderDialog.tsx`
- [x] `app/dashboard/management-orders/status/pending/components/AssignToDriver.tsx`
- [x] `app/dashboard/management-orders/status/pending/components/TabsWrapper.tsx`
- [x] `app/dashboard/management-orders/components/OrderCardView.tsx`