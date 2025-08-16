## DB-backed Settings Migration Plan (env → admin-editable)

### Goal
Make client-specific configuration editable from the admin panel and stored in DB. Keep `.env` only for deployment-wide, infrastructure, and build-time constants. Follow `onlinerule.md` strictly: scope-limited, zero-risk, no unrelated changes.

---

## 📌 Execution Task Board (Checklist)

Follow in strict order. Move to the next task ONLY when the current task’s Testing Gate is fully checked.

### Task 1 — Database Schema (Company) [FIRST]
- [x] Add ALL new fields to `Company` in `prisma/schema.prisma` (single migration)
  - Prisma change snippet (additions only):
    ```prisma
    model Company {
      // ...existing fields

      // WhatsApp settings
      whatsappPermanentToken     String @default("")
      whatsappPhoneNumberId      String @default("")
      whatsappApiVersion         String @default("v23.0")
      whatsappBusinessAccountId  String @default("")
      whatsappWebhookVerifyToken String @default("")
      whatsappAppSecret          String @default("")

      // Email/SMTP settings
      emailUser                  String @default("")
      emailPass                  String @default("")
      smtpHost                   String @default("")
      smtpPort                   String @default("")
      smtpUser                   String @default("")
      smtpPass                   String @default("")
      smtpFrom                   String @default("")

      // Analytics (GTM)
      gtmContainerId             String @default("")

      // Cloudinary
      cloudinaryCloudName        String @default("")
      cloudinaryApiKey           String @default("")
      cloudinaryApiSecret        String @default("")
      cloudinaryUploadPreset     String @default("")
      cloudinaryClientFolder     String @default("")

      // Pusher
      pusherAppId                String @default("")
      pusherKey                  String @default("")
      pusherSecret               String @default("")
      pusherCluster              String @default("")

      // Web Push (VAPID)
      vapidPublicKey             String @default("")
      vapidPrivateKey            String @default("")
      vapidSubject               String @default("")
      vapidEmail                 String @default("")

      // Authentication
      authCallbackUrl            String @default("")
    }
    ```
- [x] Run `prisma generate` and `prisma db push` on STAGING
- [ ] Backfill from `.env` into `Company` (staging): create a one-off script or manual seed
  - [skipped] Decision: populate via Admin UI instead of backfill script
- [ ] Implement feature flags env variables per service group (e.g., `USE_DB_CLOUDINARY_*`, `USE_DB_WHATSAPP_*`, `USE_DB_PUSHER_*`, ...)
- [ ] Prepare production backup + rollback plan

Testing Gate (must pass before Task 2):
- [x] Schema visible in DB (staging)
- [skipped] Seeded values match `.env` (we will input values via Admin UI)
- [x] No errors in logs after deploy to staging

### Task 2 — Admin UI (Full CRUD for Company Settings)
- [x] Extend existing Company settings UI under admin (do not create a new app section)
  - Suggested location: `app/dashboard/management/settings` (reuse existing pattern)
  - Implemented under: `app/dashboard/management/settings/advanced/*`
- [x] Add settings sections with validation (covering ALL variables)
  - [x] Cloudinary: `cloudinaryCloudName`, `cloudinaryApiKey`, `cloudinaryApiSecret`, `cloudinaryUploadPreset`, `cloudinaryClientFolder`
  - [x] WhatsApp: `whatsappPermanentToken`, `whatsappPhoneNumberId`, `whatsappApiVersion`, `whatsappBusinessAccountId`, `whatsappWebhookVerifyToken`, `whatsappAppSecret`, `whatsappNumber`
  - [x] Email/SMTP: `emailUser`, `emailPass`, `smtpHost`, `smtpPort`, `smtpUser`, `smtpPass`, `smtpFrom`
  - [x] Analytics: `gtmContainerId`
  - [x] Pusher: `pusherAppId`, `pusherKey`, `pusherSecret`, `pusherCluster`
  - [x] Web Push: `vapidPublicKey`, `vapidPrivateKey`, `vapidSubject`, `vapidEmail`
  - [x] Auth: `authCallbackUrl` (+ auto-detect button)
- [x] Wire UI to server actions for create/update with proper auth and CSRF protections
- [x] Use `revalidateTag('company')` on successful mutation
- [x] Ensure no secret values are leaked to client components
  - Implementation status: Cloudinary section wired to `saveCompnay` with partial updates; more sections pending.

Testing Gate (must pass before Task 3):
- [x] Admin can read/update all settings successfully
- [x] Cache invalidates and UI reflects new values
- [x] Secrets never rendered client-side
- [x] No unrelated UI affected

### Task 3 — Group 1: Cloudinary Migration (Feature-flagged)
- [x] `app/api/images/cloudinary/config.ts` reads from DB with `.env` fallback (flag: `USE_DB_CLOUDINARY`)
- [x] `app/api/images/route.ts` resolves preset/folder from DB when flagged, with env fallback
- [x] `app/api/images/cloudinary/uploadImageToCloudinary.ts` initializes via centralized config
- [x] Dead/legacy paths under `lib/cloudinary/*` not used by route

Testing Gate (must pass before Task 4):
- [x] Image upload works (tested via `/api/images`)
- [x] Upload preset optional; route falls back and uploader retries without preset
- [x] Feature flag off → uses `.env`; on → uses DB
- [x] No perf degradation; no new errors

### Task 4 — Group 2: WhatsApp Migration (Feature-flagged)
- [ ] Migrate each variable one-by-one per “VARIABLE-BY-VARIABLE MIGRATION PLAN”
- [ ] Update: `lib/whatsapp/config.ts`, `lib/whatsapp-template-api.ts`, `app/api/get-template-details/route.ts`, OTP action

Testing Gate:
- [ ] Template API + OTP work in staging
- [ ] Feature flags switch works (DB vs `.env`)
- [ ] No new errors

### Task 5 — Group 3: Email/SMTP Migration (Feature-flagged)
- [ ] Update email helpers and actions to DB values with `.env` fallback
- [ ] Files: `helpers/errorEmailService.ts`, `lib/email/sendOtpEmail.ts`, order/invoice/news mailers, `client-submission` SMTP

Testing Gate:
- [ ] Error/OTP/Order emails deliver in staging
- [ ] Feature flags switch works (DB vs `.env`)
- [ ] No new errors

### Task 6 — Group 4: Analytics (GTM)
- [ ] `app/layout.tsx` reads `company.gtmContainerId` server-side and hydrates client

Testing Gate:
- [ ] GTM loads per client domain
- [ ] No client leaks of secrets

### Task 7 — Group 5: Pusher (Feature-flagged)
- [ ] Server and client configs read from DB with fallback

Testing Gate:
- [ ] Real-time events functional in staging
- [ ] No connection/auth errors

### Task 8 — Group 6: Web Push (Feature-flagged)
- [ ] `lib/vapid-config.ts` + public key route + client setup read from DB

Testing Gate:
- [ ] Registration + send + receive OK in staging

### Task 9 — Group 7: Authentication
- [ ] Use `company.authCallbackUrl` in `auth.ts`
- [ ] Remove Google OAuth (keep credentials only) per plan

Testing Gate:
- [ ] Session management OK per client domain
- [ ] No regression in sign-in flow

## 🚨 **CRITICAL SAFETY ENHANCEMENTS (MANDATORY)**

### **LIVE APP PROTECTION RULES:**
- **1500+ active users** - Zero tolerance for downtime
- **NO bulk changes** - One variable group at a time
- **ALWAYS fallback** - Keep .env working during transition
- **Staging first** - Never test on production
- **Rollback ready** - Can revert in <5 minutes
- **24/7 monitoring** - Watch for any errors

### **EMERGENCY SAFETY PREP (Week 0):**
1. **Full Production Backup**
   - Database backup with timestamp
   - Code backup (current working version)
   - Environment variables backup
   - Company table data export

2. **Staging Environment Setup**
   - Exact production copy for testing
   - Test all migrations before touching production
   - Verify staging matches production exactly

3. **Rollback Procedures**
   - Document exact rollback steps
   - Test rollback on staging
   - Keep rollback scripts ready

4. **Feature Flags Implementation**
   - Add toggle to use DB vs .env per service
   - Can switch back instantly if issues arise
   - Monitor performance impact

---

## 📋 **VARIABLE-BY-VARIABLE MIGRATION PLAN**

### Known integration gaps to include (added for focus)
- Cloudinary: also update `utils/fashionData/mineralWaterCategories.ts`, `utils/fashionData/mineralWaterSuppliers.ts`, `utils/fashionData/mineralWaterOffers.ts`, `utils/fashionData/mineralWaterProducts.ts` (these helpers read Cloudinary envs). Validate `app/manifest.ts` Cloudinary icon URL generation (likely no change).
- WhatsApp: also update `lib/whatapp-cloud-api.ts`, `app/api/test-whatsapp/route.ts`, and any legacy `temp_otp_fixed.ts` if actively used.
- Analytics: replace GA4 usage with GTM. Remove GA4 from `app/layout.tsx` and inject GTM using `company.gtmContainerId` with env fallback and feature flag.
- Web Push: client must convert the base64 VAPID key to Uint8Array in `ServiceWorkerRegistration.tsx` and `PushNotificationSetup.tsx` when switching to server-fetched key.
- Pusher: server file `lib/pusherServer.ts` uses NEXT_PUBLIC_* env names. Do not rename; only change value source via Company + feature flags.

### **GROUP 1: WHATSAPP SETTINGS (Priority: HIGH - Start Here)**

#### **WHATSAPP_PERMANENT_TOKEN**
**Files to update:**
- `lib/whatsapp/config.ts` (line: ~15)
- `lib/whatsapp-template-api.ts` (line: ~25)
- `app/api/get-template-details/route.ts` (line: ~30)
- `app/(e-comm)/(adminPage)/auth/verify/action/otp-via-whatsapp.ts` (line: ~20)

**Safety measures:**
- Add feature flag: `USE_DB_WHATSAPP_TOKEN`
- Keep .env fallback active
- Test WhatsApp messaging after each file update
- Monitor WhatsApp API response times

#### **WHATSAPP_PHONE_NUMBER_ID**
**Files to update:**
- `lib/whatsapp/config.ts` (line: ~18)
- `lib/whatsapp-template-api.ts` (line: ~28)
- `app/api/get-template-details/route.ts` (line: ~32)
- `app/(e-comm)/(adminPage)/auth/verify/action/otp-via-whatsapp.ts` (line: ~22)

**Safety measures:**
- Add feature flag: `USE_DB_WHATSAPP_PHONE_ID`
- Test phone number validation
- Verify template delivery works

#### **WHATSAPP_API_VERSION**
**Files to update:**
- `lib/whatsapp/config.ts` (line: ~20)
- `lib/whatsapp-template-api.ts` (line: ~30)
- `app/api/get-template-details/route.ts` (line: ~34)

**Safety measures:**
- Default to "v23.0" in DB
- Add version validation
- Test API compatibility

#### **WHATSAPP_BUSINESS_ACCOUNT_ID**
**Files to update:**
- `app/api/get-template-details/route.ts` (line: ~36)

**Safety measures:**
- Add feature flag: `USE_DB_WHATSAPP_BUSINESS_ID`
- Test template API functionality

#### **WHATSAPP_WEBHOOK_VERIFY_TOKEN**
**Files to update:**
- `app/api/webhook/whatsapp/route.ts` (line: ~25)

**Safety measures:**
- Add feature flag: `USE_DB_WHATSAPP_WEBHOOK`
- Test webhook verification
- Monitor webhook delivery

#### **WHATSAPP_APP_SECRET**
**Files to update:**
- `lib/whatsapp/config.ts` (line: ~22)

**Safety measures:**
- Add feature flag: `USE_DB_WHATSAPP_SECRET`
- Test app authentication

#### **WHATSAPP_BUSINESS_PHONE**
**Files to update:**
- `lib/whatsapp-template-api.ts` (line: ~35)

**Safety measures:**
- Already exists in Company table
- Verify no breaking changes

Additional WhatsApp touchpoints to update:
- `lib/whatapp-cloud-api.ts` (reads `WHATSAPP_*` envs)
- `app/api/test-whatsapp/route.ts` (if active)
- `temp_otp_fixed.ts` (legacy; remove or migrate if used)

---

### **GROUP 2: EMAIL/SMTP SETTINGS (Priority: HIGH - After WhatsApp)**

#### **EMAIL_USER**
**Files to update:**
- `helpers/errorEmailService.ts` (line: ~15)
- `lib/email/sendOtpEmail.ts` (line: ~20)
- `app/(e-comm)/(adminPage)/user/statement/action/sendOrderEmail.ts` (line: ~25)
- `utils/sendEmail.ts` (line: ~18)
- `app/dashboard/show-invoice/actions/sendInvoiceEmail.ts` (line: ~22)
- `app/dashboard/management/client-news/helper/sendMails.ts` (line: ~28)

**Safety measures:**
- Add feature flag: `USE_DB_EMAIL_USER`
- Test email delivery after each file update
- Monitor email sending success rates
- Keep .env fallback active

#### **EMAIL_PASS**
**Files to update:**
- `helpers/errorEmailService.ts` (line: ~18)
- `lib/email/sendOtpEmail.ts` (line: ~22)
- `app/(e-comm)/(adminPage)/user/statement/action/sendOrderEmail.ts` (line: ~27)
- `utils/sendEmail.ts` (line: ~20)
- `app/dashboard/show-invoice/actions/sendInvoiceEmail.ts` (line: ~24)
- `app/dashboard/management/client-news/helper/sendMails.ts` (line: ~30)

**Safety measures:**
- Add feature flag: `USE_DB_EMAIL_PASS`
- Test email authentication
- Monitor for authentication errors

#### **EMAIL_SENDER_NAME**
**Files to update:**
- `lib/email/sendOtpEmail.ts` (line: ~25)

**Safety measures:**
- Use existing `company.fullName`
- Test email sender display

#### **APP_NAME**
**Files to update:**
- `lib/email/sendOtpEmail.ts` (line: ~28)

**Safety measures:**
- Use existing `company.fullName`
- Test email branding

#### **APP_URL**
**Files to update:**
- `lib/email/sendOtpEmail.ts` (line: ~30)

**Safety measures:**
- Use existing `company.website`
- Test email links

#### **SMTP_HOST**
**Files to update:**
- `app/dashboard/management/client-submission/actions/createReply.ts` (line: ~35)

**Safety measures:**
- Add feature flag: `USE_DB_SMTP_HOST`
- Test SMTP connection
- Monitor connection errors

#### **SMTP_PORT**
**Files to update:**
- `app/dashboard/management/client-submission/actions/createReply.ts` (line: ~37)

**Safety measures:**
- Add feature flag: `USE_DB_SMTP_PORT`
- Validate port number range
- Test SMTP connection

#### **SMTP_USER**
**Files to update:**
- `app/dashboard/management/client-submission/actions/createReply.ts` (line: ~39)

**Safety measures:**
- Add feature flag: `USE_DB_SMTP_USER`
- Test SMTP authentication

#### **SMTP_PASS**
**Files to update:**
- `app/dashboard/management/client-submission/actions/createReply.ts` (line: ~41)

**Safety measures:**
- Add feature flag: `USE_DB_SMTP_PASS`
- Test SMTP authentication

#### **SMTP_FROM**
**Files to update:**
- `app/dashboard/management/client-submission/actions/createReply.ts` (line: ~43)

**Safety measures:**
- Add feature flag: `USE_DB_SMTP_FROM`
- Test email sender validation

---

### **GROUP 1: CLOUDINARY SETTINGS (Priority: CRITICAL - Start Here)**

#### **CLOUDINARY_CLOUD_NAME**
**Files to update:**
- `lib/cloudinary/config.ts` (line: ~15)
- `app/api/images/route.ts` (line: ~25)
- `lib/sendTOCloudinary.ts` (line: ~20)
- `lib/cloudinary/uploadImageToCloudinary.ts` (line: ~18)
 - `utils/fashionData/mineralWaterCategories.ts` (reads `CLOUDINARY_API_KEY/SECRET`)
 - `utils/fashionData/mineralWaterSuppliers.ts` (reads `CLOUDINARY_API_KEY/SECRET`)
 - `utils/fashionData/mineralWaterOffers.ts` (reads `CLOUDINARY_API_KEY/SECRET`)
 - `utils/fashionData/mineralWaterProducts.ts` (reads `CLOUDINARY_API_KEY/SECRET`)
 - `app/manifest.ts` (review Cloudinary icon URL generation; adjust only if envs used)

**Safety measures:**
- Add feature flag: `USE_DB_CLOUDINARY_CLOUD`
- Test image upload after each file update
- Monitor upload success rates
- Test image optimization

References:
- [Cloudinary Node SDK configuration](https://cloudinary.com/documentation/node_integration#configuration)
- [Image Upload API reference](https://cloudinary.com/documentation/image_upload_api_reference)

#### **CLOUDINARY_API_KEY**
**Files to update:**
- `lib/cloudinary/config.ts` (line: ~18)
- `app/api/images/route.ts` (line: ~28)
- `lib/sendTOCloudinary.ts` (line: ~22)

**Safety measures:**
- Add feature flag: `USE_DB_CLOUDINARY_KEY`
- Test API authentication
- Monitor for auth errors

#### **CLOUDINARY_API_SECRET**
**Files to update:**
- `lib/cloudinary/config.ts` (line: ~20)
- `app/api/images/route.ts` (line: ~30)
- `lib/sendTOCloudinary.ts` (line: ~24)

**Safety measures:**
- Add feature flag: `USE_DB_CLOUDINARY_SECRET`
- Test API authentication
- Monitor for auth errors

#### **CLOUDINARY_UPLOAD_PRESET**
**Files to update:**
- `app/api/images/route.ts` (line: ~32)

**Safety measures:**
- Add feature flag: `USE_DB_CLOUDINARY_PRESET`
- Test upload preset validation
- Monitor upload errors

#### **CLOUDINARY_CLIENT_FOLDER**
**Files to update:**
- `app/api/images/route.ts` (line: ~34)

**Safety measures:**
- Add feature flag: `USE_DB_CLOUDINARY_FOLDER`
- Test folder organization
- Verify image organization

---

### **GROUP 4: ANALYTICS SETTINGS (Priority: MEDIUM - After Cloudinary)**

#### **GTM_CONTAINER_ID**
**Files to update:**
- `app/layout.tsx` (line: ~45)

**Safety measures:**
- Add feature flag: `USE_DB_GTM_ID`
- Test GTM loading per client domain
- Monitor analytics data
- Verify no JavaScript errors

#### Replace GA4 with GTM (Recommended)
Current: GA4 (`GoogleAnalytics`) is used in `app/layout.tsx`.

Plan:
- Remove GA4 `<GoogleAnalytics gaId=... />` from `app/layout.tsx`.
- Add server-side GTM injection using `company.gtmContainerId` with env fallback.
- Gate with `USE_DB_GTM_ID` feature flag.

Safety:
- Validate no hydration warnings and no duplicate script injection.

Implementation snippet (App Router):
```tsx
// app/layout.tsx (server component)
import Script from 'next/script';
import { getCompany } from '@/app/(e-comm)/helpers/layoutData'; // or helpers/settings.ts when added

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const company = await getCompany();
  const useDb = process.env.USE_DB_GTM_ID === 'true';
  const gtmId = useDb ? company?.gtmContainerId : process.env.GTM_CONTAINER_ID;

  return (
    <html>
      <head>
        {gtmId ? (
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        ) : null}
      </head>
      <body>
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}
        {children}
      </body>
    </html>
  );
}
```

---

### **GROUP 5: PUSHER SETTINGS (Priority: HIGH - After Analytics)**

#### **PUSHER_APP_ID**
**Files to update:**
- `lib/pusherServer.ts` (line: ~15)

**Safety measures:**
- Add feature flag: `USE_DB_PUSHER_APP_ID`
- Test real-time notifications
- Monitor connection status

#### **PUSHER_KEY**
**Files to update:**
- `lib/pusherServer.ts` (line: ~18)
- `lib/pusherClient.ts` (line: ~20)

**Safety measures:**
- Add feature flag: `USE_DB_PUSHER_KEY`
- Test real-time notifications
- Monitor connection status

#### **PUSHER_SECRET**
**Files to update:**
- `lib/pusherServer.ts` (line: ~20)

**Safety measures:**
- Add feature flag: `USE_DB_PUSHER_SECRET`
- Test server authentication
- Monitor auth errors

#### **PUSHER_CLUSTER**
**Files to update:**
- `lib/pusherServer.ts` (line: ~22)
- `lib/pusherClient.ts` (line: ~22)

**Safety measures:**
- Add feature flag: `USE_DB_PUSHER_CLUSTER`
- Test cluster connection
- Monitor connection errors

---

### **GROUP 6: WEB PUSH SETTINGS (Priority: MEDIUM - After Pusher)**

#### **VAPID_PUBLIC_KEY**
**Files to update:**
- `app/api/vapid-public-key/route.ts` (line: ~15)
- `app/components/PushNotificationSetup.tsx` (line: ~25)
- `app/components/ServiceWorkerRegistration.tsx` (line: ~20)

**Safety measures:**
- Add feature flag: `USE_DB_VAPID_PUBLIC`
- Test push notification registration
- Monitor subscription success rates

#### **VAPID_PRIVATE_KEY**
**Files to update:**
- `lib/vapid-config.ts` (line: ~15)

**Safety measures:**
- Add feature flag: `USE_DB_VAPID_PRIVATE`
- Test push notification sending
- Monitor delivery success rates

#### **VAPID_SUBJECT**
**Files to update:**
- `lib/vapid-config.ts` (line: ~18)

**Safety measures:**
- Add feature flag: `USE_DB_VAPID_SUBJECT`
- Test push notification display
- Verify subject line formatting

#### **VAPID_EMAIL**
**Files to update:**
- `lib/vapid-config.ts` (line: ~20)

**Safety measures:**
- Add feature flag: `USE_DB_VAPID_EMAIL`
- Test push notification metadata
- Verify email validation

---

### **GROUP 7: AUTHENTICATION SETTINGS (Priority: HIGH - Last)**

#### **NEXTAUTH_URL**
**Files to update:**
- `auth.ts` (line: ~25)
- `lib/auth-dynamic-config.ts` (line: ~30)

**Safety measures:**
- Add feature flag: `USE_DB_AUTH_CALLBACK`
- Test authentication flow per client domain
- Monitor session creation/validation
- Test OAuth callbacks

---

## 🔧 **SAFETY-ENHANCED IMPLEMENTATION TASKS**

### **TASK 0: EMERGENCY SAFETY PREP (Priority: CRITICAL - Week 0)**
**Files to create:**
- `helpers/settings.ts` - Company settings getter with caching
- `actions/settings.ts` - Admin CRUD operations with revalidation
- `types/settings.ts` - TypeScript interfaces for settings
- `helpers/featureFlags.ts` - Feature flag management
- `scripts/backup-production.sh` - Production backup script
- `scripts/rollback-migration.sh` - Rollback script

**Implementation steps:**
1. Create `helpers/settings.ts` with `getCompany()` function
2. Implement caching with `revalidateTag('company')`
3. Add fallback to `.env` when DB values missing
4. Create `actions/settings.ts` for admin operations
5. Add proper error handling and logging
6. Test helper functions with mock data
7. Create feature flag system
8. Create backup and rollback scripts
9. Test backup/rollback on staging

**Code structure:**
```typescript
// helpers/settings.ts
export async function getCompany(): Promise<Company | null>
export async function getCompanySetting(key: string): Promise<string | null>
export async function getCompanyWithFallback(): Promise<Company & { fallbackToEnv: boolean }>

// helpers/featureFlags.ts
export function isFeatureEnabled(flag: string): boolean
export function getFeatureValue(flag: string, defaultValue: string): string
```

### **TASK 1: CLOUDINARY SERVICE MIGRATION (Priority: CRITICAL - Week 1)**
**Safety approach:**
- Update only Cloudinary files
- Add feature flags for each Cloudinary setting
- Test image functionality after each file
- Keep .env fallback active
- Monitor upload success rates

**Files to update (one by one):**
1. `lib/cloudinary/config.ts` - Add feature flags, test config loading
2. `app/api/images/route.ts` - Add feature flags, test image uploads
3. `lib/sendTOCloudinary.ts` - Add feature flags, test cloudinary uploads
4. `lib/cloudinary/uploadImageToCloudinary.ts` - Add feature flags, test image uploads

**Testing checklist:**
- [ ] Cloudinary config loads correctly
- [ ] Image uploads work
- [ ] Image optimization works
- [ ] No upload failures
- [ ] Feature flags work correctly

### **TASK 2: EMAIL/SMTP SERVICE MIGRATION (Priority: HIGH - Week 2)**
**Safety approach:**
- Update only email files
- Add feature flags for each email setting
- Test email functionality after each file
- Keep .env fallback active
- Monitor email delivery success rates

**Files to update (one by one):**
1. `helpers/errorEmailService.ts` - Add feature flags, test error emails
2. `lib/email/sendOtpEmail.ts` - Add feature flags, test OTP emails
3. `app/(e-comm)/(adminPage)/user/statement/action/sendOrderEmail.ts` - Add feature flags, test order emails
4. Continue with remaining email files...

**Testing checklist:**
- [ ] Error emails send correctly
- [ ] OTP emails deliver
- [ ] Order emails work
- [ ] No email failures
- [ ] Feature flags work correctly

### **TASK 3: CLOUDINARY SERVICE MIGRATION (Priority: HIGH - Week 3)**
**Safety approach:**
- Update only Cloudinary files
- Add feature flags for each Cloudinary setting
- Test image upload after each file
- Keep .env fallback active
- Monitor upload success rates

**Files to update (one by one):**
1. `lib/cloudinary/config.ts` - Add feature flags, test config loading
2. `app/api/images/route.ts` - Add feature flags, test image uploads
3. `lib/sendTOCloudinary.ts` - Add feature flags, test cloudinary uploads
4. Continue with remaining Cloudinary files...

**Testing checklist:**
- [ ] Cloudinary config loads correctly
- [ ] Image uploads work
- [ ] Image optimization works
- [ ] No upload failures
- [ ] Feature flags work correctly

### **TASK 4: REMAINING SERVICES MIGRATION (Priority: MEDIUM - Week 4-5)**
**Safety approach:**
- One service group per week
- Add feature flags for each setting
- Test functionality after each service
- Keep .env fallback active
- Monitor for any issues

**Service groups:**
- Week 4: Analytics (GTM), Pusher
- Week 5: Web Push (VAPID), Authentication

---

## 🚀 **SAFETY-ENHANCED IMPLEMENTATION PHASES**

### **PHASE 0: EMERGENCY SAFETY PREP (Week 0)**
1. **Create Staging Environment**
   - Exact production copy
   - Test all migrations before touching production

2. **Full Production Backup**
   - Database backup with timestamp
   - Code backup (current working version)
   - Environment variables backup

3. **Safety Infrastructure**
   - Feature flag system
   - Backup and rollback scripts
   - Monitoring and alerting

4. **Rollback Testing**
   - Test rollback procedures on staging
   - Verify rollback works correctly

### **PHASE 1: CLOUDINARY ONLY (Week 1)**
1. **Update Prisma Schema**
   - Add only Cloudinary fields to Company model
   - Run `prisma generate` and `prisma db push` on staging
   - Verify schema changes in staging database

2. **Cloudinary Service Updates**
   - Update Cloudinary files one by one
   - Add feature flags for each setting
   - Test image functionality after each file
   - Keep .env fallback active

3. **Cloudinary Testing**
   - Test image uploads
   - Test image optimization
   - Test cloudinary configuration
   - Monitor for any issues

### **PHASE 2: WHATSAPP ONLY (Week 2)**
1. **WhatsApp Service Updates**
   - Update WhatsApp files one by one
   - Add feature flags for each setting
   - Test WhatsApp functionality after each file
   - Keep .env fallback active

2. **WhatsApp Testing**
   - Test WhatsApp messaging
   - Test template API
   - Test OTP verification
   - Monitor for any issues

### **PHASE 3: EMAIL ONLY (Week 3)**
1. **Email Service Updates**
   - Update email files one by one
   - Add feature flags for each setting
   - Test email functionality after each file
   - Keep .env fallback active

2. **Email Testing**
   - Test error emails
   - Test OTP emails
   - Test order emails
   - Monitor email delivery rates

### **PHASE 4: REMAINING SERVICES (Week 4-5)**
1. **Analytics & Pusher (Week 4)**
   - Update analytics and Pusher files
   - Add feature flags for each setting
   - Test functionality after each service

2. **Web Push & Authentication (Week 5)**
   - Update web push and authentication files
   - Add feature flags for each setting
   - Test functionality after each service

### **PHASE 5: PRODUCTION DEPLOYMENT (Week 6+)**
1. **Production Migration**
   - Deploy to production with feature flags
   - Enable DB settings gradually
   - Monitor for 24 hours per service

2. **.env Removal**
   - Remove .env variables gradually
   - One variable group per week
   - Monitor for any issues

3. **Full Monitoring**
   - 24/7 monitoring of all services
   - Performance monitoring
   - Error rate monitoring

---

## ✅ **ENHANCED VERIFICATION & TESTING CHECKLIST**

### **Pre-Implementation Validation**
- [ ] Staging environment matches production exactly
- [ ] Database schema updated and tested on staging
- [ ] Settings helper functions created and tested
- [ ] Fallback mechanism verified on staging
- [ ] Caching system working correctly on staging
- [ ] Feature flag system working correctly
- [ ] Backup and rollback scripts tested on staging

### **During Implementation Validation**
- [ ] Only one variable group updated at a time
- [ ] Feature flags working correctly
- [ ] .env fallback working correctly
- [ ] No performance degradation
- [ ] No errors in logs
- [ ] All functionality working correctly

### **Post-Implementation Validation**
- [ ] All services read from Company table instead of .env
- [ ] Fallback to .env works when DB values missing
- [ ] Multi-tenant isolation working correctly
- [ ] Admin panel can edit all new settings
- [ ] Settings changes trigger proper cache invalidation
- [ ] Feature flags working correctly

### **Critical Path Testing**
- [ ] WhatsApp messaging works per client
- [ ] Email delivery works per client
- [ ] Image uploads work per client
- [ ] Real-time notifications work per client
- [ ] Push notifications work per client
- [ ] Authentication works per client domain
- [ ] Analytics loading per client

### **Performance & Security**
- [ ] No performance degradation with new settings
- [ ] Settings properly cached and invalidated
- [ ] No sensitive data exposed to client
- [ ] Proper error handling for missing settings
- [ ] Logging and monitoring in place
- [ ] Feature flags not impacting performance

### **Rollback Plan**
- [ ] Keep .env variables during transition
- [ ] Feature flags allow instant rollback
- [ ] Gradual removal of .env variables
- [ ] Ability to revert to .env if issues arise
- [ ] Database backup before migration
- [ ] Staging environment testing completed
- [ ] Rollback scripts tested and ready

---

## 🚨 **EMERGENCY ROLLBACK PROCEDURES**

### **Instant Rollback (Feature Flags)**
1. **Disable feature flag for problematic service**
2. **Service immediately uses .env values**
3. **No downtime or restart required**

### **Database Rollback**
1. **Run rollback script**
2. **Restore Company table from backup**
3. **Restart application if needed**

### **Full Application Rollback**
1. **Revert code changes**
2. **Restore .env variables**
3. **Restart application**

### **Contact Information**
- **Emergency Contact**: [Add emergency contact]
- **Rollback Authority**: [Add rollback authority]
- **Monitoring Team**: [Add monitoring team]

---

**This enhanced plan follows onlinerule.md strictly with maximum safety for your live app. Every change is isolated, tested, and reversible.**






Notes
- NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_BASE_URL should be replaced with runtime base URL detection (server headers or `lib/auth-dynamic-config.ts`). Not DB-backed.
- Per memory, only `WHATSAPP_PHONE_NUMBER_ID` is strictly required in env for this project [[memory:4377589]]. In this plan, all WhatsApp settings become DB-backed with env fallbacks, so the env can remain minimal.

### Move to DB (admin-editable)
Add new fields to existing `Company` table:

**New fields to add:**
- whatsappPermanentToken
- whatsappPhoneNumberId  
- whatsappApiVersion (default: v23.0)
- whatsappBusinessAccountId
- whatsappWebhookVerifyToken
- whatsappAppSecret
- emailUser, emailPass
- smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom
- gtmContainerId
- cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret, cloudinaryUploadPreset, cloudinaryClientFolder
- pusherAppId, pusherKey, pusherSecret, pusherCluster
- vapidPublicKey, vapidPrivateKey, vapidSubject, vapidEmail
- authCallbackUrl

**Already exists:**
- company.fullName, website, whatsappNumber, taxPercentage, shippingFee, minShipping, workingHours
- company.logo, profilePicture, bio, socials

**Caching:**
- Reuse existing tag-based caching (`revalidateTag('company')`)

**Folder structure:**
- `helpers/settings.ts` → simple helpers: `getCompany()`, `getCompanySetting(key)` with caching
- `actions/settings.ts` → admin writes/updates, revalidation

---

## 🔧 DETAILED IMPLEMENTATION TASKS

### **CRITICAL INFRASTRUCTURE (Must be completed first)**

#### **TASK 0: Settings Helper Infrastructure (Priority: CRITICAL)**
**Files to create:**
- `helpers/settings.ts` - Company settings getter with caching
- `actions/settings.ts` - Admin CRUD operations with revalidation
- `types/settings.ts` - TypeScript interfaces for settings

**Implementation steps:**
1. Create `helpers/settings.ts` with `getCompany()` function
2. Implement caching with `revalidateTag('company')`
3. Add fallback to `.env` when DB values missing
4. Create `actions/settings.ts` for admin operations
5. Add proper error handling and logging
6. Test helper functions with mock data

**Code structure:**
```typescript
// helpers/settings.ts
export async function getCompany(): Promise<Company | null>
export async function getCompanySetting(key: string): Promise<string | null>
export async function getCompanyWithFallback(): Promise<Company & { fallbackToEnv: boolean }>
```

### **TASK 1: WhatsApp Service Migration (Priority: HIGH)**
**Files to update:**
- `lib/whatsapp/config.ts`
  - **Current**: `process.env.WHATSAPP_PERMANENT_TOKEN`, `process.env.WHATSAPP_PHONE_NUMBER_ID`, `process.env.WHATSAPP_API_VERSION`, `process.env.WHATSAPP_BUSINESS_ACCOUNT_ID`, `process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `process.env.WHATSAPP_APP_SECRET`
  - **New**: `company.whatsappPermanentToken`, `company.whatsappPhoneNumberId`, `company.whatsappApiVersion`, `company.whatsappBusinessAccountId`, `company.whatsappWebhookVerifyToken`, `company.whatsappAppSecret`
  - **Fallback**: Keep `process.env` as fallback during transition

- `lib/whatsapp-template-api.ts`
  - **Current**: `process.env.WHATSAPP_BUSINESS_PHONE`, `process.env.WHATSAPP_PERMANENT_TOKEN`, `process.env.WHATSAPP_PHONE_NUMBER_ID`, `process.env.WHATSAPP_API_VERSION`
  - **New**: `company.whatsappNumber`, `company.whatsappPermanentToken`, `company.whatsappPhoneNumberId`, `company.whatsappApiVersion`

- `app/api/get-template-details/route.ts`
  - **Current**: `process.env.WHATSAPP_PERMANENT_TOKEN`, `process.env.WHATSAPP_BUSINESS_ACCOUNT_ID`, `process.env.WHATSAPP_API_VERSION`
  - **New**: `company.whatsappPermanentToken`, `company.whatsappBusinessAccountId`, `company.whatsappApiVersion`

- `app/(e-comm)/(adminPage)/auth/verify/action/otp-via-whatsapp.ts`
  - **Current**: `process.env.WHATSAPP_PERMANENT_TOKEN`, `process.env.WHATSAPP_PHONE_NUMBER_ID`, `process.env.WHATSAPP_API_VERSION`
  - **New**: `company.whatsappPermanentToken`, `company.whatsappPhoneNumberId`, `company.whatsappApiVersion`

**Implementation steps:**
1. Import `getCompany()` helper
2. Replace `process.env` with `company.fieldName`
3. Add error handling for missing company settings
4. Test WhatsApp functionality with new settings
5. Verify fallback to .env works

### **TASK 2: Email/SMTP Service Migration (Priority: HIGH)**
**Files to update:**
- `helpers/errorEmailService.ts`
  - **Current**: `process.env.EMAIL_USER`, `process.env.EMAIL_PASS`
  - **New**: `company.emailUser`, `company.emailPass`
  - **Fallback**: Keep `process.env` as fallback

- `lib/email/sendOtpEmail.ts`
  - **Current**: `process.env.EMAIL_USER`, `process.env.EMAIL_PASS`, `process.env.EMAIL_SENDER_NAME`, `process.env.APP_NAME`, `process.env.APP_URL`
  - **New**: `company.emailUser`, `company.emailPass`, `company.fullName`, `company.fullName`, `company.website`

- `app/(e-comm)/(adminPage)/user/statement/action/sendOrderEmail.ts`
  - **Current**: `process.env.EMAIL_USER`, `process.env.EMAIL_PASS`, `process.env.APP_NAME`
  - **New**: `company.emailUser`, `company.emailPass`, `company.fullName`

- `utils/sendEmail.ts`
  - **Current**: `process.env.EMAIL_USER`, `process.env.EMAIL_PASS`
  - **New**: `company.emailUser`, `company.emailPass`

- `app/dashboard/show-invoice/actions/sendInvoiceEmail.ts`
  - **Current**: `process.env.EMAIL_USER`, `process.env.EMAIL_PASS`
  - **New**: `company.emailUser`, `company.emailPass`

- `app/dashboard/management/client-news/helper/sendMails.ts`
  - **Current**: `process.env.EMAIL_USER`, `process.env.EMAIL_PASS`
  - **New**: `company.emailUser`, `company.emailPass`

- `app/dashboard/management/client-submission/actions/createReply.ts`
  - **Current**: `process.env.SMTP_HOST`, `process.env.SMTP_PORT`, `process.env.SMTP_USER`, `process.env.SMTP_PASS`, `process.env.SMTP_FROM`
  - **New**: `company.smtpHost`, `company.smtpPort`, `company.smtpUser`, `company.smtpPass`, `company.smtpFrom`

**Implementation steps:**
1. Import `getCompany()` helper in each file
2. Replace `process.env` with `company.fieldName`
3. Add error handling for missing company settings
4. Test email functionality with new settings
5. Verify fallback to .env works

### **TASK 3: Cloudinary Service Migration (Priority: HIGH)**
**Files to update:**
- `app/api/images/route.ts`
  - **Current**: `process.env.CLOUDINARY_CLOUD_NAME`, `process.env.CLOUDINARY_API_KEY`, `process.env.CLOUDINARY_API_SECRET`, `process.env.CLOUDINARY_UPLOAD_PRESET`, `process.env.CLOUDINARY_CLIENT_FOLDER`
  - **New**: `company.cloudinaryCloudName`, `company.cloudinaryApiKey`, `company.cloudinaryApiSecret`, `company.cloudinaryUploadPreset`, `company.cloudinaryClientFolder`

- `lib/sendTOCloudinary.ts`
  - **Current**: `process.env.CLOUDINARY_CLOUD_NAME`, `process.env.CLOUDINARY_API_KEY`, `process.env.CLOUDINARY_API_SECRET`
  - **New**: `company.cloudinaryCloudName`, `company.cloudinaryApiKey`, `company.cloudinaryApiSecret`

- `lib/cloudinary/config.ts`
  - **Current**: `process.env.CLOUDINARY_CLOUD_NAME`, `process.env.CLOUDINARY_API_KEY`, `process.env.CLOUDINARY_API_SECRET`
  - **New**: `company.cloudinaryCloudName`, `company.cloudinaryApiKey`, `company.cloudinaryApiSecret`

- `lib/cloudinary/uploadImageToCloudinary.ts`
  - **Current**: `process.env.CLOUDINARY_CLOUD_NAME`
  - **New**: `company.cloudinaryCloudName`

**Implementation steps:**
1. Import `getCompany()` helper in each file
2. Replace `process.env` with `company.fieldName`
3. Add error handling for missing company settings
4. Test image upload functionality with new settings
5. Verify fallback to .env works

### **TASK 4: Analytics Integration (Priority: MEDIUM)**
**Files to update:**
- `app/layout.tsx`
  - **Current**: `process.env.GTM_CONTAINER_ID`
  - **New**: `company.gtmContainerId` (server fetch, hydrate client)

**Implementation steps:**
1. Import `getCompany()` helper
2. Replace `process.env.GTM_CONTAINER_ID` with `company.gtmContainerId`
3. Add error handling for missing company settings
4. Test GTM loading per client domain
5. Verify fallback to .env works

### **TASK 5: Pusher Service Migration (Priority: HIGH)**
**Files to update:**
- `lib/pusherServer.ts`
  - **Current**: `process.env.PUSHER_APP_ID`, `process.env.PUSHER_KEY`, `process.env.PUSHER_SECRET`, `process.env.PUSHER_CLUSTER`
  - **New**: `company.pusherAppId`, `company.pusherKey`, `company.pusherSecret`, `company.pusherCluster`

- `lib/pusherClient.ts`
  - **Current**: `process.env.NEXT_PUBLIC_PUSHER_KEY`, `process.env.NEXT_PUBLIC_PUSHER_CLUSTER`
  - **New**: `company.pusherKey`, `company.pusherCluster` (server fetch, hydrate client)

**Implementation steps:**
1. Import `getCompany()` helper in each file
2. Replace `process.env` with `company.fieldName`
3. Add error handling for missing company settings
4. Test real-time notifications per client
5. Verify fallback to .env works

### **TASK 6: Web Push Service Migration (Priority: MEDIUM)**
**Files to update:**
- `lib/vapid-config.ts`
  - **Current**: `process.env.VAPID_PUBLIC_KEY`, `process.env.VAPID_PRIVATE_KEY`, `process.env.VAPID_SUBJECT`, `process.env.VAPID_EMAIL`
  - **New**: `company.vapidPublicKey`, `company.vapidPrivateKey`, `company.vapidSubject`, `company.vapidEmail`

- `app/api/vapid-public-key/route.ts`
  - **Current**: `process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY`
  - **New**: `company.vapidPublicKey` (server fetch, hydrate client)

- `app/components/PushNotificationSetup.tsx`
  - **Current**: `process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY`
  - **New**: `company.vapidPublicKey` (server fetch, hydrate client)

- `app/components/ServiceWorkerRegistration.tsx`
  - **Current**: `process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY`
  - **New**: `company.vapidPublicKey` (server fetch, hydrate client)

**Implementation steps:**
1. Import `getCompany()` helper in each file
2. Replace `process.env` with `company.fieldName`
3. Add error handling for missing company settings
4. On client, convert base64 key to Uint8Array for `applicationServerKey` (required by Push API)
5. Test push notifications per client domain
6. Verify fallback to .env works

### Base URL (compute, not DB)
- `app/(e-comm)/(cart-flow)/checkout/page.tsx`
- `app/(e-comm)/(cart-flow)/checkout/actions/orderActions.ts`
- `app/(e-comm)/(cart-flow)/cart/page.tsx`
  - From: NEXT_PUBLIC_APP_URL
  - To: runtime base URL helper (e.g., `helpers/getBaseUrl.ts` using headers/auth dynamic config)

### Stay as env (no change)
- NextAuth configuration: `auth.config.ts` (for session management, not OAuth)

### **TASK 7: Authentication System Refactor (Priority: HIGH)**
**Files to update:**
- `auth.config.ts`
  - **Current**: Google OAuth provider with `process.env.GOOGLE_CLIENT_ID`, `process.env.GOOGLE_CLIENT_SECRET`
  - **New**: Remove Google OAuth provider completely, keep only credentials
  - **Implementation**: Delete Google provider, remove unused imports

- `auth.ts`
  - **Current**: `process.env.NEXTAUTH_URL` via `getNextAuthURL()`
  - **New**: `company.authCallbackUrl` (dynamic per-client domain)
  - **Implementation**: Update to use Company settings

- `lib/auth-dynamic-config.ts`
  - **Current**: Complex OAuth and Vercel logic
  - **New**: Simplified `getNextAuthURL()` function only
  - **Remove**: `getOAuthConfig()`, `getOAuthCallbackURL()`, Vercel environment detection

**Implementation steps:**
1. Remove Google OAuth from `auth.config.ts`
2. Clean up `lib/auth-dynamic-config.ts` (remove unused functions)
3. Update `auth.ts` to use Company.authCallbackUrl
4. Test authentication per client domain
5. Verify session management works correctly

---

## Minimal schema additions (pending approval)
Add these new fields to existing `Company` model:

```prisma
model Company {
  // ... existing fields ...
  
  // WhatsApp settings
  whatsappPermanentToken    String @default("")
  whatsappPhoneNumberId     String @default("")
  whatsappApiVersion        String @default("v23.0")
  whatsappBusinessAccountId String @default("")
  whatsappWebhookVerifyToken String @default("")
  whatsappAppSecret         String @default("")
  
  // Email/SMTP settings
  emailUser                 String @default("")
  emailPass                 String @default("")
  smtpHost                  String @default("")
  smtpPort                  String @default("")
  smtpUser                  String @default("")
  smtpPass                  String @default("")
  smtpFrom                  String @default("")
  
  // Analytics & Cloudinary
  gtmContainerId            String @default("")
  cloudinaryCloudName       String @default("")
  cloudinaryApiKey          String @default("")
  cloudinaryApiSecret       String @default("")
  cloudinaryUploadPreset    String @default("")
  cloudinaryClientFolder    String @default("")
  
  // Pusher settings
  pusherAppId               String @default("")
  pusherKey                 String @default("")
  pusherSecret              String @default("")
  pusherCluster             String @default("")
  
  // Web Push settings
  vapidPublicKey            String @default("")
  vapidPrivateKey           String @default("")
  vapidSubject              String @default("")
  vapidEmail                String @default("")
  
  // Authentication settings
  authCallbackUrl            String @default("")
}
```

Simple approach: all fields in one table, no encryption, no separate models.

---

## 🚀 IMPLEMENTATION PHASES

### **PHASE 1: Database Schema & Infrastructure (Week 1)**
1. **Update Prisma Schema**
   - Add new fields to Company model
   - Run `prisma generate` and `prisma db push`
   - Verify schema changes in database

2. **Create Settings Infrastructure**
   - `helpers/settings.ts` - Company settings getter with caching
   - `actions/settings.ts` - Admin CRUD operations with revalidation
   - `types/settings.ts` - TypeScript interfaces for settings

3. **Database Migration Script**
   - Create migration script to backfill Company table from current .env
   - Test migration on staging environment
   - Verify data integrity

### **PHASE 2: Core Service Updates (Week 2)**
4. **Authentication System Refactor**
   - Remove Google OAuth from `auth.config.ts`
   - Clean up `lib/auth-dynamic-config.ts` (remove Vercel/OAuth logic)
   - Update `auth.ts` to use Company.authCallbackUrl

5. **WhatsApp Service Updates**
   - Update `lib/whatsapp/config.ts` to use Company settings
   - Update `lib/whatsapp-template-api.ts` to use Company settings
   - Update `app/api/get-template-details/route.ts` to use Company settings
   - Update OTP verification action to use Company settings

6. **Email/SMTP Service Updates**
   - Update `helpers/errorEmailService.ts` to use Company settings
   - Update `lib/email/sendOtpEmail.ts` to use Company settings
   - Update all email sending actions to use Company settings

### **PHASE 3: External Service Integration (Week 3)**
7. **Cloudinary Service Updates**
   - Update `lib/cloudinary/config.ts` to use Company settings
   - Update `lib/sendTOCloudinary.ts` to use Company settings
   - Update `app/api/images/route.ts` to use Company settings
   - Update image optimization functions

8. **Pusher Service Updates**
   - Update `lib/pusherServer.ts` to use Company settings
   - Update `lib/pusherClient.ts` to use Company settings
   - Test real-time notifications per client

9. **Web Push Service Updates**
   - Update `lib/vapid-config.ts` to use Company settings
   - Update `app/api/vapid-public-key/route.ts` to use Company settings
   - Update push notification components

### **PHASE 4: Analytics & UI Integration (Week 4)**
10. **Analytics Integration**
    - Update `app/layout.tsx` to use Company.gtmContainerId
    - Test GTM loading per client domain

11. **Admin Panel Updates**
    - Extend existing Company settings page with new fields
    - Add validation for required fields
    - Add settings import/export functionality
    - Add settings backup/restore functionality

### **PHASE 5: Testing & Deployment (Week 5)**
12. **Comprehensive Testing**
    - Test all services with per-client configuration
    - Verify fallback to .env when DB values missing
    - Test multi-tenant isolation
    - Performance testing with caching

13. **Production Deployment**
    - Deploy to staging with new settings
    - Run migration script on production
    - Monitor for 24 hours
    - Remove old .env variables gradually

14. **Documentation & Training**
    - Update admin documentation
    - Create client onboarding guide
    - Document troubleshooting procedures

---

## ✅ VERIFICATION & TESTING CHECKLIST

### **Pre-Implementation Validation**
- [ ] Database schema updated and tested
- [ ] Settings helper functions created and tested
- [ ] Fallback mechanism verified
- [ ] Caching system working correctly

### **Post-Implementation Validation**
- [ ] All services read from Company table instead of .env
- [ ] Fallback to .env works when DB values missing
- [ ] Multi-tenant isolation working correctly
- [ ] Admin panel can edit all new settings
- [ ] Settings changes trigger proper cache invalidation

### **Critical Path Testing**
- [ ] WhatsApp messaging works per client
- [ ] Email delivery works per client
- [ ] Image uploads work per client
- [ ] Real-time notifications work per client
- [ ] Push notifications work per client
- [ ] Authentication works per client domain
- [ ] Analytics loading per client

### **Performance & Security**
- [ ] No performance degradation with new settings
- [ ] Settings properly cached and invalidated
- [ ] No sensitive data exposed to client
- [ ] Proper error handling for missing settings
- [ ] Logging and monitoring in place

### **Rollback Plan**
- [ ] Keep .env variables during transition
- [ ] Gradual removal of .env variables
- [ ] Ability to revert to .env if issues arise
- [ ] Database backup before migration
- [ ] Staging environment testing completed


