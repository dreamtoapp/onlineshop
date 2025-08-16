## helpers/ directory overview

### helpers/clientErrorLogger.ts
- **Exports**: `logClientError(error, context?)`, `CLIENT_ERROR_LOGGER.{form,component,action,network}`
- **Purpose**: Client-safe error logging via POST `/api/log-error`
- **Runtime**: Client-safe (uses `fetch`)
- **Depends on**: `/api/log-error`
- **Used by**: (no direct imports found; intended for client components)
- **Notes**: Returns API `errorId` or fallback
 
- **SAFE TO DELETE**: YES

### helpers/system-error-email.ts
- **Exports**: `sendErrorNotificationEmail(errorData)`
- **Purpose**: Sends HTML email notification with severity styling
- **Runtime**: Server (nodemailer)
- **Depends on**: `nodemailer`, `EMAIL_USER`, `EMAIL_PASS`
- **Used by**: `helpers/errorLogger.ts`
- **Notes**: Sends to `dreamto@gmail.com`
 
- **SAFE TO DELETE**: NO

### helpers/errorLogger.ts
- **Exports**: `logErrorToDatabase(error, context?)`, `ERROR_LOGGER.{database,api,payment,auth}`
- **Purpose**: Central pipeline: severity → email → DB store
- **Runtime**: Server (Prisma, NextAuth)
- **Depends on**: `@/lib/prisma`, `@/auth`, `sendErrorNotificationEmail`
- **Used by**:
  - `app/api/log-error/route.ts`
  - `app/api/webhook/whatsapp/route.ts` (`ERROR_LOGGER.api`)
- **DB models**: `errorLog`
- **Notes**: Email first, DB is best-effort
- **SAFE TO DELETE**: NO

<!-- Removed from helpers/: newsletter helpers now live at `app/(e-comm)/homepage/actions/newsletterHelpers.ts` -->

### helpers/notificationHelper.ts
- **Exports**: `sendOrderNotification(data)`, `testNotificationSystem(userId)`
- **Purpose**: Orchestrates in-app + push notifications with logging
- **Runtime**: Server
- **Depends on**: `createOrderNotification`, `ORDER_NOTIFICATION_TEMPLATES`, `PushNotificationService`, `@/utils/logger`
- **Used by**: (no direct usage located; project often calls `PushNotificationService` directly)
- **Notes**: Returns `{ success, inAppSuccess, pushSuccess, details }`
 
- **SAFE TO DELETE**: YES

<!-- Removed from helpers/: notification icon helper is colocated with the notifications page at `app/(e-comm)/(adminPage)/user/notifications/components/notificationIconHelper.ts` -->

<!-- Not in helpers/: order number generator is managed in its feature folder -->

### helpers/systemNotifications.ts
- **Exports**: `SYSTEM_NOTIFICATIONS`, `createSystemNotification(params)`
- **Purpose**: Predefined onboarding notifications + DB create
- **Runtime**: Server (Prisma)
- **Depends on**: `@/lib/prisma`
- **Used by**: `app/(e-comm)/(adminPage)/auth/register/actions/actions.ts`
- **DB models**: `userNotification`
 
- **SAFE TO DELETE**: NO

<!-- Not in helpers/: WhatsApp webhook helpers are managed with the API route -->

<!-- Not in helpers/: WhatsApp utilities are colocated under `lib/whatsapp/` and actions -->

## Cross-flows
- **Error flow**: Client components → `clientErrorLogger` → `/api/log-error` → `logErrorToDatabase` → email + `errorLog`
- **Notifications**: Onboarding via `systemNotifications`; UI renders with `notificationIconHelper`; unified send available via `notificationHelper`
- **Orders**: `orderNumberGenerator` used in checkout to guarantee sequential numbers
- **WhatsApp**: Webhook saves inbound + status; OTP uses number normalization and guidance URL

## Usage audit (direct vs indirect)

- `helpers/system-error-email.ts`
  - **Direct imports**: `helpers/errorLogger.ts`
  - **Indirect usage**: Any place calling `logErrorToDatabase` or `ERROR_LOGGER.*` sends emails through this helper

- `helpers/errorLogger.ts`
  - **Direct imports**: `app/api/log-error/route.ts`, `app/api/webhook/whatsapp/route.ts`
  - **Indirect usage**: Client-side error POSTs to `/api/log-error` reach `logErrorToDatabase`

- `helpers/systemNotifications.ts`
  - **Direct imports**: `app/(e-comm)/(adminPage)/auth/register/actions/actions.ts`
  - **Indirect usage**: none detected

## Safe-to-remove candidates (no direct or indirect references)

- None at this time (all files under `helpers/` are in active use)


## Final deletion flags (based on deep scan)

- helpers/clientErrorLogger.ts → SAFE TO DELETE: YES
- helpers/system-error-email.ts → SAFE TO DELETE: NO
- helpers/errorLogger.ts → SAFE TO DELETE: NO
- helpers/notificationHelper.ts → SAFE TO DELETE: YES
- helpers/systemNotifications.ts → SAFE TO DELETE: NO


