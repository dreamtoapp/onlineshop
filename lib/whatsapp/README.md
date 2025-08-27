## lib/whatsapp directory overview

### lib/whatsapp/config.ts
- **Exports**: `getWhatsAppConfig`, `buildApiEndpoint`, `getApiHeaders`
- **Purpose**: Load WhatsApp Cloud API config from DB and build headers/endpoints
- **Runtime**: Server
- **Depends on**: `@/lib/prisma`
- **Used by**: `lib/whatsapp/send.ts`, `lib/whatsapp/send-otp-template.ts`, `app/api/webhook/whatsapp/route.ts`, `app/api/get-template-details/route.ts`
- **DB models**: `company`
- **SAFE TO DELETE**: NO

### lib/whatsapp/send.ts
- **Exports**: `sendWhatsAppText`
- **Purpose**: Send a plain WhatsApp text message via Graph API
- **Runtime**: Server
- **Depends on**: `config.ts`
- **Used by**: `app/api/webhook/whatsapp/route.ts`
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/whatsapp/send-otp-template.ts
- **Exports**: `sendOTPTemplate`
- **Purpose**: Send OTP using an approved WhatsApp template (confirm)
- **Runtime**: Server
- **Depends on**: `config.ts`, `whatsapp.ts`
- **Used by**: `app/(e-comm)/(adminPage)/auth/verify/action/otp-via-whatsapp.ts`, `app/api/test-whatsapp/route.ts`
- **DB models**: none
- **SAFE TO DELETE**: NO

### lib/whatsapp/whatsapp-webhook.ts
- **Exports**: `saveIncomingMessage`, `recordMessageStatus`
- **Purpose**: Persist inbound messages and status updates with idempotent upserts
- **Runtime**: Server
- **Depends on**: `@/lib/prisma`
- **Used by**: `app/api/webhook/whatsapp/route.ts`
- **DB models**: `whatsappMessage`, `whatsappMessageStatus`
- **SAFE TO DELETE**: NO

### lib/whatsapp/whatsapp.ts
- **Exports**: `convertToInternationalFormat`, `generateWhatsAppGuidanceURL`
- **Purpose**: Normalize phone numbers to E.164 and generate a wa.me guidance URL
- **Runtime**: Server
- **Depends on**: env (WHATSAPP_BUSINESS_PHONE)
- **Used by**: `lib/whatsapp/send-otp-template.ts`, `app/(e-comm)/(adminPage)/auth/verify/action/otp-via-whatsapp.ts`
- **DB models**: none
- **SAFE TO DELETE**: NO

## Cross-flows
- Webhook: `config` + `whatsapp-webhook` used by API route to ingest messages and statuses.
- OTP: `send-otp-template` + `whatsapp` helpers for number formatting and guidance URL; fallback to `send.ts` for plain text.

## Usage audit (direct vs indirect)
- Direct import usages listed in each item above.
- Indirect: Webhook triggers persistence; OTP flows may call either template or text sender.

## Final deletion flags (based on deep scan)
- All files → SAFE TO DELETE: NO



















