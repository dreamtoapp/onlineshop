## WhatsApp Webhook: Message Handling and Status Processing — Task Plan (Codebase‑Aligned)

### Goal
- Safely handle inbound WhatsApp messages and delivery statuses on the server, DB‑backed, behind feature flags, with structured logging and instant rollback.

### Current state (from codebase)
- Route exists: `app/api/webhook/whatsapp/route.ts` with GET verification and POST signature check via `getWhatsAppConfig()`.
- WhatsApp config: `lib/whatsapp/config.ts` (DB‑backed via `Company` model).
- DB: Prisma with MongoDB provider; WhatsApp models added and pushed.
- Helpers implemented: `helpers/whatsapp-webhook.ts` with `saveIncomingMessage` and `recordMessageStatus`.
- Route integrated behind flag: with `USE_DB_WHATSAPP_WEBHOOK_PROCESSING==='true'` it persists messages/statuses; otherwise logs only.
- Logging: `utils/logger.ts` (structured), error pipeline in `helpers/errorLogger.ts`.

### Decisions
- Flags (env):
  - `USE_DB_WHATSAPP_WEBHOOK_PROCESSING` default `false` → when `true` persist to DB; otherwise log‑only.
  - `AUTO_REPLY_ENABLED` default `false` → optional, rate‑limited auto‑reply later.
- Logging: use `utils/logger.ts` for info/debug/warn/error; escalate failures through `helpers/errorLogger.ts`.

### Progress checklist
- [x] Refactor plan to task‑based, codebase‑aligned document
- [x] Phase 1 — Add WhatsApp models to `prisma/schema.prisma`
- [x] Phase 1 — Run `prisma generate`
- [x] Phase 1 — Run `prisma db push` (staging)
- [x] Phase 2 — Implement `helpers/whatsapp-webhook.ts`
- [x] Phase 3 — Integrate helpers in `app/api/webhook/whatsapp/route.ts` behind flags
- [ ] Phase 4 — Add structured logging via `utils/logger.ts` and error escalation
- [ ] Phase 5 — Enforce security/privacy logging rules
- [ ] Phase 6 — Optional auto‑reply (flagged, default OFF)
- [ ] Phase 7 — Staging tests and verification

### TODO (remaining work)

- [ ] Phase 4 — Observability
  - [ ] Add structured info logs in `app/api/webhook/whatsapp/route.ts` for message/status events using `utils/logger.ts` with fields: `category='whatsapp.webhook'`, `kind`, `waMessageId`, `fromWa?`, `status?`.
  - [ ] Add error escalation via `ERROR_LOGGER.api(error, '/api/webhook/whatsapp')` on unexpected failures.
  - [ ] Ensure logs never include full `raw` payloads or secrets.

- [ ] Phase 5 — Security & privacy
  - [ ] Store full webhook `raw` only in DB; do not log PII.
  - [ ] Minimize PII in logs; mask/omit phone numbers where not required.
  - [ ] Verify env gating works: `USE_DB_WHATSAPP_WEBHOOK_PROCESSING`, `AUTO_REPLY_ENABLED`.

- [ ] Phase 6 — Optional auto‑reply (flagged)
  - [ ] Gate behind `AUTO_REPLY_ENABLED==='true'`.
  - [ ] Implement safe reply using `lib/whatsapp/config.ts` helpers (`buildApiEndpoint`, `getApiHeaders`).
  - [ ] Add simple rate limit per `fromWa` to avoid loops.
  - [ ] Keep OFF by default; verify no side effects when OFF.

- [ ] Phase 7 — Staging tests
  - [ ] GET verification and POST HMAC signature check with staging secrets.
  - [ ] Flag OFF: log‑only, zero DB writes.
  - [ ] Flag ON: persist messages, persist statuses, update denorm on `WhatsappMessage`.
  - [ ] Idempotency: duplicate statuses ignored via unique index `(waMessageId, occurredAt)`.
  - [ ] Resilience: per‑item try/catch; route returns 200 even on item errors.
  - [ ] Confirm no secrets/PII in logs.

- [ ] Rollout & rollback
  - [ ] Enable on staging → verify logs/DB → enable production during low traffic.
  - [ ] Monitor error rates and DB growth.
  - [ ] Immediate rollback by turning flags OFF.

### Tasks

#### Phase 1 — Prisma schema (MongoDB)
- [x] Add models to `prisma/schema.prisma` (no other models touched). You will run Prisma commands manually.

```prisma
model WhatsappMessage {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  companyId    String?  @db.ObjectId
  waMessageId  String   @unique
  fromWa       String
  toWa         String
  direction    String   // 'inbound' | 'outbound'
  type         String   // 'text' | 'image' | 'interactive' | 'unknown'
  text         String?
  raw          Json
  receivedAt   DateTime @default(now())

  // denorm
  lastStatus   String?
  lastStatusAt DateTime?
}

model WhatsappMessageStatus {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  companyId    String?  @db.ObjectId
  waMessageId  String
  status       String   // 'sent' | 'delivered' | 'read' | 'failed' | 'unknown'
  reason       String?
  raw          Json
  occurredAt   DateTime @default(now())

  @@index([waMessageId, occurredAt])
  @@unique([waMessageId, occurredAt]) // idempotency for statuses
}
```

- [ ] After you review: run `prisma generate` then (manually) `prisma db push` on staging only.

#### Phase 2 — Helpers (new)
- Created `helpers/whatsapp-webhook.ts` with:
  - `saveIncomingMessage(value, message)` → normalize and upsert `WhatsappMessage` by `waMessageId`.
  - `recordMessageStatus(status)` → normalize and upsert `WhatsappMessageStatus` by `(waMessageId, occurredAt)`, then update denorm on `WhatsappMessage`.
  - Uses `db` from `@/lib/prisma`, `info` from `utils/logger.ts`, and strict types (`Prisma.InputJsonValue`).

#### Phase 3 — Route integration (minimal, gated)
- In `app/api/webhook/whatsapp/route.ts` POST:
  - Keep existing HMAC verification and JSON parse.
  - If `process.env.USE_DB_WHATSAPP_WEBHOOK_PROCESSING !== 'true'` → log structured events and return 200.
  - Else → for each `value.messages` call `saveIncomingMessage(value, message)`; for each `value.statuses` call `recordMessageStatus(status)`.
  - Wrap each item in try/catch; continue on error; always return 200 for the batch.
  - Keep GET behavior unchanged.

Example gating shape:
```ts
if (process.env.USE_DB_WHATSAPP_WEBHOOK_PROCESSING !== 'true') {
  info('whatsapp.webhook', { kind: 'message|status', mode: 'log-only' });
  return new NextResponse('OK', { status: 200 });
}
```

#### Phase 4 — Observability
- Use `utils/logger.ts` with fields: `category='whatsapp.webhook'`, `kind='message'|'status'`, `waMessageId`, `fromWa?`, `status?`, `error?`.
- On unexpected failures, call `ERROR_LOGGER.api(error, '/api/webhook/whatsapp')`.

#### Phase 5 — Security & privacy
- Never log tokens/app secrets or full raw payloads; store `raw` in DB only.
- Minimize PII in logs; include only keys above.

#### Phase 6 — Optional auto‑reply (flagged)
- If `AUTO_REPLY_ENABLED==='true'`: send a safe template/text reply with rate limiting using `lib/whatsapp/config.ts` (`buildApiEndpoint`, `getApiHeaders`). Keep OFF by default.

#### Phase 7 — Testing (staging)
- Signature verification succeeds with DB verify token/app secret.
- With flag OFF → logs only, no DB writes.
- With flag ON →
  - inbound `message` creates/updates `WhatsappMessage` (raw saved).
  - `status` items create `WhatsappMessageStatus` and update denorm on `WhatsappMessage`.
- No secrets in logs; route always returns 200.

#### Rollout & rollback
- Rollout: enable flag on staging → verify DB writes/logs → enable in production during low traffic.
- Rollback: set flag OFF to disable persistence instantly; route remains functional (log‑only).

#### Acceptance criteria
- Flags OFF: behavior matches current route (no persistence, logs only).
- Flags ON: idempotent persistence of messages and statuses; denorm updated; no crashes on malformed items.
- Strict typing (no `any`); changes limited to the files listed above.