## constant/ directory overview

### constant/app-defaults.ts
- **Exports**: `DEFAULT_COMPANY_SETTINGS`, `DefaultCompanySettings`
- **Purpose**: Development/staging fallback defaults for third-party services (Cloudinary, WhatsApp, Email, Pusher, VAPID, etc.)
- **Runtime**: Server/Build-time
- **Depends on**: none (hardcoded placeholders)
- **Used by**: `app/dashboard/management/settings/advanced/actions/updateCompany.ts`
- **DB models**: `company` (indirectly via updateCompany action)
- **SAFE TO DELETE**: NO (useful for local setup; ensure no real secrets committed)

### constant/DUMMY_PRODUCT_RATINGS.ts
- **Exports**: `DUMMY_PRODUCT_RATINGS`
- **Purpose**: Demo data for product ratings UI/analytics
- **Runtime**: Client/Server
- **Depends on**: none
- **Used by**: `app/dashboard/management-products/analytics/[id]/components/ProductRatingsSection.tsx`
- **DB models**: none
- **SAFE TO DELETE**: NO

### constant/enums.ts
- **Exports**: `Directions`, `Languages`, `homeSections`, `Routes`, `Pages`, `InputTypes`, `Navigate`, `Responses`, `SortOrder`, `SortBy`, `AuthMessages`, `Methods`, `Environments`, `UserRole`, `questionQueryMode`, `questionStatus`, `RatingType`
- **Purpose**: Central enums for app-wide usage
- **Runtime**: Client/Server
- **Depends on**: none
- **Used by**: various UI/actions across the app (menus, ratings, API routes)
- **DB models**: none
- **SAFE TO DELETE**: NO

### constant/order-status.ts
- **Exports**: `ORDER_STATUS`, `OrderStatus`, `ORDER_STATUS_STYLES`, `ORDER_STATUS_DISPLAY_AR`
- **Purpose**: Order status constants, types, and display config
- **Runtime**: Client/Server
- **Depends on**: none
- **Used by**: multiple order management actions/pages and driver flows
- **DB models**: none
- **SAFE TO DELETE**: NO

### constant/whatsapp.ts
- **Exports**: `getOtpTextMessage`
- **Purpose**: WhatsApp text template for OTP delivery
- **Runtime**: Server/Client
- **Depends on**: none
- **Used by**: WhatsApp OTP/text flows (optional helper alongside lib/whatsapp)
- **DB models**: none
- **SAFE TO DELETE**: NO

## Cross-flows
- Order flows use `order-status` constants for UI and server logic.
- OTP flows may use `whatsapp` text template when sending plain messages.

## Usage audit (direct vs indirect)
- Direct imports listed per item above.
- Indirect usage: none significant.

## Final deletion flags (based on deep scan)
- All constants here → SAFE TO DELETE: NO



















