## lib/ directory overview

### lib/address-helpers.ts
- **Exports**: `migrateExistingUsers`, `cleanupDuplicateAddresses`, `getDefaultAddress`, `hasAddresses`
- **Purpose**: Address utilities and maintenance helpers
- **Runtime**: Server
- **Depends on**: `@/lib/prisma`
- **Used by**: various admin/address flows (indirect utilities)
- **DB models**: `address`, `user`
- **SAFE TO DELETE**: NO

### lib/auth-dynamic-config.ts
- **Exports**: `getNextAuthURL`, `getOAuthCallbackURL`, `getOAuthConfig`
- **Purpose**: Dynamic NextAuth URLs per environment (Vercel-aware)
- **Runtime**: Server
- **Depends on**: env vars
- **Used by**: NextAuth configuration (implicit)
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/cache.ts
- **Exports**: `cacheData`
- **Purpose**: Wrapper around React/Next caches for server functions
- **Runtime**: Server
- **Depends on**: `react`, `next/cache`
- **Used by**: server actions and loaders
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/cache/wishlist.ts
- **Exports**: `getCachedWishlist`, `setCachedWishlist`
- **Purpose**: In-memory session cache for wishlist state (client runtime)
- **Runtime**: Client
- **Depends on**: none
- **Used by**: wishlist UI components
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/cart-events.ts
- **Exports**: `emitCartChanged`, `onCartChanged`
- **Purpose**: Broadcast cart updates within and across tabs
- **Runtime**: Client
- **Depends on**: `window`, `localStorage`
- **Used by**: cart controllers/UI
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/check-is-login.ts
- **Exports**: `checkIsLogin`
- **Purpose**: Server check for authenticated user
- **Runtime**: Server
- **Depends on**: `@/auth`, `@/lib/prisma`
- **Used by**: `hooks/use-check-islogin.ts`
- **DB models**: `user`
- **SAFE TO DELETE**: NO

### lib/dashboardSummary.ts
- **Exports**: `getDashboardSummary`
- **Purpose**: Aggregate dashboard metrics
- **Runtime**: Server
- **Depends on**: `@/lib/prisma`
- **Used by**: API/dashboard routes and pages
- **DB models**: `order`, `user`, `product`, `orderItem`
- **SAFE TO DELETE**: NO

### lib/email/sendOtpEmail.ts
- **Exports**: `sendOtpEmail`
- **Purpose**: Send OTP email via nodemailer
- **Runtime**: Server
- **Depends on**: `nodemailer`, env
- **Used by**: auth flows (email verification)
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/formatCurrency.ts
- **Exports**: `formatCurrency`
- **Purpose**: Format numbers as SAR currency
- **Runtime**: Client/Server
- **Depends on**: Intl API
- **Used by**: UI and reports
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/getAddressFromLatLng.ts
- **Exports**: `getAddressFromLatLng`
- **Purpose**: Reverse geocoding via Nominatim
- **Runtime**: Server
- **Depends on**: fetch
- **Used by**: address flows
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/getSession.ts
- **Exports**: default `cache(auth)`
- **Purpose**: Cached auth session helper
- **Runtime**: Server
- **Depends on**: `@/auth`, `react`
- **Used by**: server components/actions needing session
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/notifications.ts
- **Exports**: `getAllNotifications`, `markAllNotificationsRead`
- **Purpose**: DB utilities for notifications
- **Runtime**: Server
- **Depends on**: `@/lib/prisma`, `@prisma/client`
- **Used by**: notifications pages/actions
- **DB models**: `userNotification`
- **SAFE TO DELETE**: NO

### lib/otp-Generator.ts
- **Exports**: `generateOTP`
- **Purpose**: Generate 4-digit OTP with expiry
- **Runtime**: Server
- **Depends on**: none
- **Used by**: OTP flows
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/prisma.ts
- **Exports**: default Prisma client (`db`)
- **Purpose**: Prisma client with dev global reuse
- **Runtime**: Server
- **Depends on**: `@prisma/client`
- **Used by**: all DB code
- **DB models**: all
- **SAFE TO DELETE**: NO

### lib/push-notification-service.ts
- **Exports**: `PushNotificationService`
- **Purpose**: Web Push via VAPID; order notification templates
- **Runtime**: Server
- **Depends on**: `web-push`, `@/lib/prisma`, VAPID env
- **Used by**: order status change actions
- **DB models**: `pushSubscription`
- **SAFE TO DELETE**: NO

### lib/pusherClient.ts
- **Exports**: `getPusherClient`
- **Purpose**: Lazy Pusher client init for browser
- **Runtime**: Client
- **Depends on**: `pusher-js`, env
- **Used by**: realtime listeners
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/pusherServer.ts
- **Exports**: `pusherServer`
- **Purpose**: Server Pusher instance
- **Runtime**: Server
- **Depends on**: `pusher`, env
- **Used by**: server events
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/seo-service/getMetadata.ts
- **Exports**: `getPageMetadata`
- **Purpose**: Generate Next.js Metadata from DB SEO entries
- **Runtime**: Server
- **Depends on**: `@/lib/prisma`
- **Used by**: SEO-enabled pages
- **DB models**: `globalSEO`
- **SAFE TO DELETE**: NO

### lib/utils.ts
- **Exports**: `cn`, `iconVariants`, `slugify`, `generateUniqueSlug`
- **Purpose**: UI/class utilities and slug helpers
- **Runtime**: Client/Server
- **Depends on**: `clsx`, `tailwind-merge`, `class-variance-authority`
- **Used by**: UI components and content flows
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/vapid-config.ts
- **Exports**: `VAPID_CONFIG`, `validateVapidConfig`, `urlBase64ToUint8Array`, `getVapidPublicKey`
- **Purpose**: VAPID config and helpers for Web Push
- **Runtime**: Client/Server
- **Depends on**: env
- **Used by**: push notification service and client registration
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/whatsapp/config.ts
- **Exports**: `getWhatsAppConfig`, `buildApiEndpoint`, `getApiHeaders`
- **Purpose**: WhatsApp Cloud API config from DB
- **Runtime**: Server
- **Depends on**: `@/lib/prisma`
- **Used by**: WhatsApp senders and webhooks
- **DB models**: `company`
- **SAFE TO DELETE**: NO

### lib/whatsapp/send-otp-template.ts
- **Exports**: `sendOTPTemplate`
- **Purpose**: Send WhatsApp OTP via approved template
- **Runtime**: Server
- **Depends on**: `config.ts`, `whatsapp.ts`
- **Used by**: OTP flows
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/whatsapp/send.ts
- **Exports**: `sendWhatsAppText`
- **Purpose**: Send plain WhatsApp text message
- **Runtime**: Server
- **Depends on**: `config.ts`
- **Used by**: webhook replies, OTP text fallback
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/whatsapp/whatsapp-webhook.ts
- **Exports**: `saveIncomingMessage`, `recordMessageStatus`
- **Purpose**: Persist inbound messages and delivery statuses
- **Runtime**: Server
- **Depends on**: `@/lib/prisma`
- **Used by**: `app/api/webhook/whatsapp/route.ts`
- **DB models**: `whatsappMessage`, `whatsappMessageStatus`
- **SAFE TO DELETE**: NO

### lib/whatsapp/whatsapp.ts
- **Exports**: `convertToInternationalFormat`, `generateWhatsAppGuidanceURL`
- **Purpose**: Phone normalization and guidance link
- **Runtime**: Server
- **Depends on**: env (business phone)
- **Used by**: WhatsApp OTP flows
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/zod/address.ts
- **Exports**: `addressSchema`, `AddressInput`
- **Purpose**: Zod schema for addresses
- **Runtime**: Server/Build-time
- **Depends on**: `zod`
- **Used by**: address forms/actions
- **DB models**: none
- **SAFE TO DELETE**: NO

## Cross-flows
- Notifications: `vapid-config` + `push-notification-service` → push; DB subscriptions in `prisma`.
- WhatsApp: `whatsapp/config` + `send`/`send-otp-template` + `whatsapp-webhook`.
- Auth: `auth-dynamic-config` used implicitly by NextAuth setup.

## Usage audit (direct vs indirect)
- See above “Used by” entries; indirect flows include webhook → DB persistence, and OTP flows via WhatsApp utilities.

## Final deletion flags (based on deep scan)
- All items above are marked SAFE TO DELETE: NO


