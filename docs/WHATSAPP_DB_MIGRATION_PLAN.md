## WhatsApp (Cloud API) Migration Plan — env → DB-backed settings

### Resume here (after restart)

- Next step: Run staging tests (see Testing Gate below)

### Checklist (current status)

- [ ] Testing: webhook verification passes (staging)
- [ ] Testing: templates send OK (staging)
- [ ] Testing: OTP flow works (staging)
- [ ] Testing: no secret leakage to client
- [ ] Webhook TODOs (last): implement message handling and status processing

### Goal
Mirror the Cloudinary approach: read WhatsApp settings from `Company` when feature flags are ON, fallback to `.env` otherwise. Zero risk, staging-first, instant rollback.

### Fields (Company)
- whatsappPermanentToken
- whatsappPhoneNumberId
- whatsappApiVersion (default: v23.0)
- whatsappBusinessAccountId
- whatsappWebhookVerifyToken
- whatsappAppSecret
- whatsappNumber (business phone for templates)

All exist in `prisma/schema.prisma` already.

Status:
- [x] `whatsappApiVersion` default set to `v23.0` in Prisma
- [x] `whatsappEnvironment` added in Prisma with default `production`

### Per-client vs deployment-wide
- Per client (store in Company; unique per tenant):
  - whatsappPermanentToken
  - whatsappPhoneNumberId
  - whatsappBusinessAccountId
  - whatsappWebhookVerifyToken
  - whatsappAppSecret
  - whatsappNumber

- Deployment-wide (static defaults; can remain env-level):
  - whatsappApiVersion (e.g., `v23.0`) — optional to store in DB; default is fine
  - WHATSAPP_ENVIRONMENT (`production`/`staging`) — keep as env

### Feature Flags
- USE_DB_WHATSAPP_TOKEN
- USE_DB_WHATSAPP_PHONE_ID
- USE_DB_WHATSAPP_VERSION
- USE_DB_WHATSAPP_BUSINESS_ID
- USE_DB_WHATSAPP_WEBHOOK
- USE_DB_WHATSAPP_SECRET

Single umbrella flag may be used: `USE_DB_WHATSAPP=true`.

### Files to Update (one-by-one, with tests after each)
1) `lib/whatsapp/config.ts`
   - Add DB reads gated by flags with env fallback
   - Keep `validateWhatsAppConfig` compatible (return isValid when DB or env provides values)

2) `app/api/webhook/whatsapp/route.ts`
   - Use `getWhatsAppConfig()` only; no direct env access
   - Verify webhook verify token via config

3) `lib/whatsapp/whatsapp-template-api.ts` (if used)
   - Read token/phone/version from config (or Company) instead of env

4) `lib/whatsapp/whatapp-cloud-api.ts` (client/HTTP helpers)
   - Ensure it consumes config/token from `lib/whatsapp/config.ts`

5) OTP and template helper routes/actions
   - `app/(e-comm)/(adminPage)/auth/verify/action/otp-via-whatsapp.ts`
   - `app/api/get-template-details/route.ts`
   - Any callers of WhatsApp Cloud API

### Admin UI
- `app/dashboard/management/settings/advanced/components/forms/WhatsAppSettingsForm.tsx`
  - [x] Prefill from `company` (token, phoneNumberId, businessAccountId, webhookVerifyToken, appSecret, number)
  - [x] Sensitive fields masked with show/hide toggle; token uses multiline textarea
  - [x] Inline critical `InfoTooltip` explaining sensitivity (to add)

### Testing Gate
- [ ] Flag OFF: messaging works using env
- [ ] Flag ON: messaging works using DB values
- [ ] Webhook verification passes
- [ ] Templates send OK
- [ ] No secret leakage to client

### Rollback
- Disable `USE_DB_WHATSAPP*` → instantly uses `.env` again

### Notes
- `constant/app-defaults.ts` contains defaults; keep only for local dev, not prod
- Future: add usage metrics and per-client rate limits via WhatsApp API headers/logs (optional)




### Final Task (Last): Webhook TODOs Implementation

- [ ] Incoming messages handling
  - [ ] Save incoming messages to DB (sender, text, timestamp, messageId)
  - [ ] Optional: auto-reply workflow (template or text) with rate limiting
  - [ ] Optional: basic command processing (e.g., HELP, STOP)
- [ ] Status updates handling
  - [ ] Persist delivery/read/failure statuses by `messageId`
  - [ ] Add retries/backoff for transient failures
  - [ ] Update analytics counters/metrics
- [ ] Observability
  - [ ] Structured logs for both messages and statuses
  - [ ] Error monitoring hooks
- [ ] Safety
  - [ ] Guardrails to prevent sending replies in production without explicit enable flag
  - [ ] Ensure no PII is logged