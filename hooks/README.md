## hooks/ directory overview

### hooks/use-check-islogin.ts
- **Exports**: `useCheckIsLogin`
- **Purpose**: Derives authenticated user/session state combining NextAuth and backend check.
- **Runtime**: Client
- **Depends on**: `next-auth` session, `@/lib/check-is-login`
- **Used by**: `app/(e-comm)/(cart-flow)/cart/components/CartPageView.tsx`, `app/(e-comm)/(cart-flow)/cart/cart-controller/{CartQuantityControls.tsx,AddToCart.tsx}`, `app/(e-comm)/(cart-flow)/cart/components/OrderSummary.tsx`
- **DB models**: none
- **SAFE TO DELETE**: NO

### hooks/use-geo.tsx
- **Exports**: `useGeolocation` (default and named)
- **Purpose**: Robust geolocation with retries, accuracy threshold, and Google Maps link.
- **Runtime**: Client
- **Depends on**: Browser geolocation API
- **Used by**: `app/(e-comm)/(cart-flow)/checkout/components/{AddressSelector.tsx,AddressCard.tsx,LocationMapModal.tsx}`, `app/dashboard/management/settings/component/CompanyProfileForm.tsx`
- **DB models**: none
- **SAFE TO DELETE**: NO

### hooks/use-media-query.ts
- **Exports**: `useMediaQuery`
- **Purpose**: React hook for CSS media queries, SSR-safe
- **Runtime**: Client
- **Depends on**: `window.matchMedia`
- **Used by**: `app/(e-comm)/homepage/component/Header/HeaderUnified.tsx`, `app/(e-comm)/(cart-flow)/cart/cart-controller/CartButtonWithBadge.tsx`
- **DB models**: none
- **SAFE TO DELETE**: NO

### hooks/use-mobile.tsx
- **Exports**: `useIsMobile`
- **Purpose**: Boolean flag for viewport under mobile breakpoint
- **Runtime**: Client
- **Depends on**: `window.matchMedia`
- **Used by**: `components/ui/sidebar.tsx`
- **DB models**: none
- **SAFE TO DELETE**: NO

### hooks/useNotificationCounter.ts
- **Exports**: `useNotificationCounter`
- **Purpose**: Client-side unread notifications counter with refresh method
- **Runtime**: Client
- **Depends on**: `next-auth`, `/api/user/notifications/count`
- **Used by**: `components/NotificationBellClient.tsx`
- **DB models**: none
- **SAFE TO DELETE**: NO

### hooks/usePusherConnectionStatus.ts
- **Exports**: `usePusherConnectionStatus`
- **Purpose**: Tracks Pusher connection state for the signed-in user
- **Runtime**: Client
- **Depends on**: `@/lib/pusherClient`, NextAuth
- **Used by**: `app/(e-comm)/(adminPage)/user/notifications/components/RealtimeNotificationListener.tsx`, `app/(e-comm)/homepage/component/Header/UserMenuTrigger.tsx`
- **DB models**: none
- **SAFE TO DELETE**: NO

## Cross-flows
- Realtime: `usePusherConnectionStatus` and `useNotificationCounter` enable live notification UX.
- Checkout location: `useGeolocation` powers address/location selection.

## Usage audit (direct vs indirect)

- `hooks/use-check-islogin.ts`
  - **Direct imports**: listed above
  - **Indirect usage**: none

- `hooks/use-geo.tsx`
  - **Direct imports**: listed above
  - **Indirect usage**: none

- `hooks/use-media-query.ts`
  - **Direct imports**: listed above
  - **Indirect usage**: none

- `hooks/use-mobile.tsx`
  - **Direct imports**: listed above
  - **Indirect usage**: none

- `hooks/useNotificationCounter.ts`
  - **Direct imports**: listed above
  - **Indirect usage**: none

- `hooks/usePusherConnectionStatus.ts`
  - **Direct imports**: listed above
  - **Indirect usage**: none

## Final deletion flags (based on deep scan)
- `hooks/use-check-islogin.ts` → SAFE TO DELETE: NO
- `hooks/use-geo.tsx` → SAFE TO DELETE: NO
- `hooks/use-media-query.ts` → SAFE TO DELETE: NO
- `hooks/use-mobile.tsx` → SAFE TO DELETE: NO
- `hooks/useNotificationCounter.ts` → SAFE TO DELETE: NO
- `hooks/usePusherConnectionStatus.ts` → SAFE TO DELETE: NO


