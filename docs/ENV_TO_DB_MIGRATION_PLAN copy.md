## DB-backed Settings Migration Plan (env → admin-editable)

### Goal
Make client-specific configuration editable from the admin panel and stored in DB. Keep `.env` only for deployment-wide, infrastructure, and build-time constants. Follow `onlinerule.md` strictly: scope-limited, zero-risk, no unrelated changes.

---

## 📋 ENV → DB MAPPING TABLE

| .env Variable | DB Table | DB Field | Notes |
|---------------|----------|----------|-------|
| **WHATSAPP_PERMANENT_TOKEN** | Company | whatsappPermanentToken | New field |
| **WHATSAPP_PHONE_NUMBER_ID** | Company | whatsappPhoneNumberId | New field |
| **WHATSAPP_API_VERSION** | Company | whatsappApiVersion | New field, default: v23.0 |
| **WHATSAPP_BUSINESS_ACCOUNT_ID** | Company | whatsappBusinessAccountId | New field |
| **WHATSAPP_WEBHOOK_VERIFY_TOKEN** | Company | whatsappWebhookVerifyToken | New field |
| **WHATSAPP_APP_SECRET** | Company | whatsappAppSecret | New field |
| **WHATSAPP_BUSINESS_PHONE** | Company | whatsappNumber | Already exists |
| **EMAIL_USER** | Company | emailUser | New field |
| **EMAIL_PASS** | Company | emailPass | New field |
| **EMAIL_SENDER_NAME** | Company | fullName | Already exists |
| **APP_NAME** | Company | fullName | Already exists |
| **APP_URL** | Company | website | Already exists |
| **GTM_CONTAINER_ID** | Company | gtmContainerId | New field |
| **CLOUDINARY_CLOUD_NAME** | Company | cloudinaryCloudName | New field |
| **CLOUDINARY_API_KEY** | Company | cloudinaryApiKey | New field |
| **CLOUDINARY_API_SECRET** | Company | cloudinaryApiSecret | New field |
| **CLOUDINARY_UPLOAD_PRESET** | Company | cloudinaryUploadPreset | New field |
| **CLOUDINARY_CLIENT_FOLDER** | Company | cloudinaryClientFolder | New field |
| **SMTP_HOST** | Company | smtpHost | New field |
| **SMTP_PORT** | Company | smtpPort | New field |
| **SMTP_USER** | Company | smtpUser | New field |
| **SMTP_PASS** | Company | smtpPass | New field |
| **SMTP_FROM** | Company | smtpFrom | New field |
| **PUSHER_APP_ID** | Company | pusherAppId | New field |
| **PUSHER_KEY** | Company | pusherKey | New field |
| **PUSHER_SECRET** | Company | pusherSecret | New field |
| **PUSHER_CLUSTER** | Company | pusherCluster | New field |
| **VAPID_PUBLIC_KEY** | Company | vapidPublicKey | New field |
| **VAPID_PRIVATE_KEY** | Company | vapidPrivateKey | New field |
| **VAPID_SUBJECT** | Company | vapidSubject | New field |
| **VAPID_EMAIL** | Company | vapidEmail | New field |
| **NEXTAUTH_URL** | Company | authCallbackUrl | New field |

**Note:** All settings stored in existing `Company` table. Simple approach - no encryption, no separate tables.

### Source of truth
- Global/shared constants → `.env`
- Per-client settings → `Company` table (already exists, add new fields)
- Simple approach: no encryption, no separate tables

### Keep in .env (global constants)
- DATABASE_URL
- NODE_ENV, VERCEL_ENV, VERCEL_URL, ANALYZE






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

## File-by-file replacement map (env → DB)
Only the files below will change to read from DB. No unrelated edits.

### WhatsApp
- `lib/whatsapp/config.ts`
  - From: WHATSAPP_PERMANENT_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_API_VERSION, WHATSAPP_BUSINESS_ACCOUNT_ID, WHATSAPP_WEBHOOK_VERIFY_TOKEN, WHATSAPP_APP_SECRET, WHATSAPP_ENVIRONMENT
  - To: `CompanySecret.whatsappPermanentToken`, `CompanySecret.whatsappPhoneNumberId`, `CompanySecret.whatsappApiVersion`, `CompanySecret.whatsappWebhookVerifyToken`, `CompanySecret.whatsappAppSecret`, plus environment string optional in public settings
  - Also: Replace WHATSAPP_BUSINESS_PHONE usages with `Company.whatsappNumber`

- `lib/whatapp-cloud-api.ts`
  - From: WHATSAPP_PERMANENT_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_API_VERSION
  - To: CompanySecret.whatsappPermanentToken, CompanySecret.whatsappPhoneNumberId, CompanySecret.whatsappApiVersion

- `lib/whatsapp-template-api.ts`
  - From: WHATSAPP_BUSINESS_PHONE, WHATSAPP_PERMANENT_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_API_VERSION
  - To: Company.whatsappNumber, CompanySecret.whatsappPermanentToken, CompanySecret.whatsappPhoneNumberId, CompanySecret.whatsappApiVersion

- `app/api/get-template-details/route.ts`
  - From: WHATSAPP_PERMANENT_TOKEN, WHATSAPP_BUSINESS_ACCOUNT_ID, WHATSAPP_API_VERSION
  - To: CompanySecret.whatsappPermanentToken, [remove BUSINESS_ACCOUNT_ID per project rule [[memory:4377589]]], CompanySecret.whatsappApiVersion

- `app/(e-comm)/(adminPage)/auth/verify/action/otp-via-whatsapp.ts`
  - From: WHATSAPP_PERMANENT_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_API_VERSION
  - To: CompanySecret.whatsappPermanentToken, CompanySecret.whatsappPhoneNumberId, CompanySecret.whatsappApiVersion

### Email/SMTP and APP branding
- `helpers/errorEmailService.ts`
  - From: EMAIL_USER, EMAIL_PASS
  - To: CompanySecret.smtpUser/emailUser, CompanySecret.smtpPass/emailPass

- `lib/email/sendOtpEmail.ts`
  - From: EMAIL_USER, EMAIL_PASS, EMAIL_SENDER_NAME, APP_NAME, APP_URL
  - To: CompanySecret.emailUser/emailPass, Company.fullName as sender name, Company.website for links

- `app/(e-comm)/(adminPage)/user/statement/action/sendOrderEmail.ts`
  - From: EMAIL_USER, EMAIL_PASS, APP_NAME
  - To: CompanySecret.emailUser/emailPass, Company.fullName

- `utils/sendEmail.ts`
  - From: EMAIL_USER, EMAIL_PASS
  - To: CompanySecret.emailUser, CompanySecret.emailPass

- `app/dashboard/show-invoice/actions/sendInvoiceEmail.ts`
  - From: EMAIL_USER, EMAIL_PASS
  - To: CompanySecret.emailUser, CompanySecret.emailPass

- `app/dashboard/management/client-news/helper/sendMails.ts`
  - From: EMAIL_USER, EMAIL_PASS
  - To: CompanySecret.emailUser, CompanySecret.emailPass

- `app/dashboard/management/client-submission/actions/createReply.ts`
  - From: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
  - To: CompanySecret.smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom

### Cloudinary (per-client configuration)
- `app/api/images/route.ts`
  - From: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLIENT_FOLDER
  - To: Company.cloudinaryCloudName, Company.cloudinaryApiKey, Company.cloudinaryApiSecret, Company.cloudinaryUploadPreset, Company.cloudinaryClientFolder

- `lib/sendTOCloudinary.ts`
  - From: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
  - To: Company.cloudinaryCloudName, Company.cloudinaryApiKey, Company.cloudinaryApiSecret

- `lib/cloudinary/config.ts`
  - From: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
  - To: Company.cloudinaryCloudName, Company.cloudinaryApiKey, Company.cloudinaryApiSecret

- `lib/cloudinary/uploadImageToCloudinary.ts`
  - From: CLOUDINARY_CLOUD_NAME
  - To: Company.cloudinaryCloudName

### Analytics
- `app/layout.tsx`
  - From: GTM_CONTAINER_ID
  - To: Company.gtmContainerId (server fetch, hydrate client)

### Pusher (per-client configuration)
- `lib/pusherServer.ts`
  - From: PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER
  - To: Company.pusherAppId, Company.pusherKey, Company.pusherSecret, Company.pusherCluster

- `lib/pusherClient.ts`
  - From: NEXT_PUBLIC_PUSHER_KEY, NEXT_PUBLIC_PUSHER_CLUSTER
  - To: Company.pusherKey, Company.pusherCluster (server fetch, hydrate client)

### Web Push (per-client configuration)
- `lib/vapid-config.ts`
  - From: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT, VAPID_EMAIL
  - To: Company.vapidPublicKey, Company.vapidPrivateKey, Company.vapidSubject, Company.vapidEmail

- `app/api/vapid-public-key/route.ts`
  - From: NEXT_PUBLIC_VAPID_PUBLIC_KEY
  - To: Company.vapidPublicKey (server fetch, hydrate client)

- `app/components/PushNotificationSetup.tsx`
  - From: NEXT_PUBLIC_VAPID_PUBLIC_KEY
  - To: Company.vapidPublicKey (server fetch, hydrate client)

- `app/components/ServiceWorkerRegistration.tsx`
  - From: NEXT_PUBLIC_VAPID_PUBLIC_KEY
  - To: Company.vapidPublicKey (server fetch, hydrate client)

### Base URL (compute, not DB)
- `app/(e-comm)/(cart-flow)/checkout/page.tsx`
- `app/(e-comm)/(cart-flow)/checkout/actions/orderActions.ts`
- `app/(e-comm)/(cart-flow)/cart/page.tsx`
  - From: NEXT_PUBLIC_APP_URL
  - To: runtime base URL helper (e.g., `helpers/getBaseUrl.ts` using headers/auth dynamic config)

### Stay as env (no change)
- NextAuth configuration: `auth.config.ts` (for session management, not OAuth)

### Authentication (per-client configuration)
- `auth.config.ts`
  - From: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
  - To: Company.googleClientId, Company.googleClientSecret (if keeping Google OAuth)
  - Task: Remove Google OAuth provider completely

- `auth.ts`
  - From: NEXTAUTH_URL
  - To: Company.authCallbackUrl (dynamic per-client domain)

- `lib/auth-dynamic-config.ts`
  - Task: Remove unused OAuth and Vercel logic
  - Keep only: simplified getNextAuthURL() function
  - Remove: getOAuthConfig(), getOAuthCallbackURL(), Vercel environment detection

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

## Implementation steps (no code yet)
1) Add new fields to existing `Company` model in Prisma schema
2) Create `helpers/settings.ts` with simple cached getters: `getCompany()`, `getCompanySetting(key)`
3) Update the files listed in the replacement map to use settings helpers instead of `process.env`
4) Admin UI: extend existing settings pages to edit new fields
5) **TASK: Remove Google OAuth provider from auth.config.ts** (credentials only)
6) **TASK: Clean up lib/auth-dynamic-config.ts** - Remove unused OAuth and Vercel logic, keep only simplified getNextAuthURL()
7) Migrations plan: backfill DB from current `.env`, verify via staging, then remove env where applicable

---

## Verification checklist
- Only touched files listed above
- Existing behavior preserved; fall back to `.env` if DB value is missing
- All settings stored in single `Company` table
- Tag-based cache invalidation wired: `revalidateTag('company')`


