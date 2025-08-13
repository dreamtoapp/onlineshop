## Cloudinary Migration & Integration Action Plan

### Goal
Move Cloudinary configuration from `.env` to DB-backed settings (Company model) with an admin UI, safe rollout, and instant rollback via feature flags.

### Scope (Only Cloudinary)
- Settings (DB fields):
  - `cloudinaryCloudName`, `cloudinaryApiKey`, `cloudinaryApiSecret`, `cloudinaryUploadPreset`, `cloudinaryClientFolder`
- UI: Advanced settings → Cloudinary card (already implemented)
- Backend reads: `app/api/images/cloudinary/config.ts`, `app/api/images/route.ts`, `app/api/images/cloudinary/uploadImageToCloudinary.ts`

### Current State
- Admin UI implemented at `app/dashboard/management/settings/advanced/components/forms/CloudinarySettingsForm.tsx`
- Server action: `advanced/actions/updateCompany.ts` saves partial updates and revalidates `company` tag
- Defaults: `constant/app-defaults.ts` (temporary for first seed only)

### Usage Map (Deep report)
- `app/api/images/cloudinary/config.ts`
  - Initializes SDK
  - Uses: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - Plan: read from `Company` (flagged), fallback to env
- `app/api/images/cloudinary/uploadImageToCloudinary.ts`
  - Upload helper
  - Uses: `CLOUDINARY_*`; retries without preset on failure
  - Plan: use `Company` values and DB preset/folder when present
- `app/api/images/route.ts`
  - API route for uploads and optional DB update
  - Uses: `CLOUDINARY_UPLOAD_PRESET`, `CLOUDINARY_CLIENT_FOLDER`
  - Plan: use `Company.cloudinaryUploadPreset` and `Company.cloudinaryClientFolder`

### Rollout Strategy
1) Phase A – UI & Data
   - [x] Admin UI for Cloudinary (save, reset, hints, SweetAlert2 feedback)
   - [x] Persist values in `Company`
   - [x] Compute progress across all advanced fields (visual cue)

2) Phase B – Service Wiring (feature-flagged)
   - [x] Add feature flags `USE_DB_CLOUDINARY_*` (or a single `USE_DB_CLOUDINARY`) to gate DB usage in runtime
   - [x] Update reads in:
     - [x] `app/api/images/cloudinary/config.ts`
     - [x] `app/api/images/route.ts`
     - [x] `app/api/images/cloudinary/uploadImageToCloudinary.ts`
   - Behavior: try DB → fallback to legacy env → log warn if missing

#### Action Item: Centralize Cloudinary Initialization (DRY)
- [x] Create a single initialization entrypoint in `app/api/images/cloudinary/config.ts` (`initCloudinary`) that reads credentials from `Company` when `USE_DB_CLOUDINARY === 'true'`, with `.env` fallback
- [x] Replace any direct `cloudinary.v2.config(...)` calls with `await initCloudinary()`
- [x] Ensure API routes that perform uploads rely on modules that call `initCloudinary` (no duplicate config)
- [x] For the upload helper (`app/api/images/cloudinary/uploadImageToCloudinary.ts`), continue using server-side init and support DB/env via `initCloudinary`

3) Phase C – Validation & Cleanup
   - Staging tests (see checklist below)
   - Enable `USE_DB_CLOUDINARY` in production after validation
   - Monitor for 24h; if stable, remove legacy `.env` keys gradually

### Implementation Notes
- Folder rules respected:
  - UI components under `app/dashboard/management/settings/advanced/components/forms`
  - Server actions under `app/dashboard/management/settings/advanced/actions`
  - Pure helpers/schemas under `app/dashboard/management/settings/helper`
- Secrets never rendered client-side; only submitted when user types
- Partial updates only; empty fields never overwrite existing secrets

### Example (config read with fallback)
```ts
// app/api/images/cloudinary/config.ts (concept)
import cloudinary from 'cloudinary';
import db from '@/lib/prisma';

export async function initCloudinary() {
  const company = await db.company.findFirst();
  const useDb = process.env.USE_DB_CLOUDINARY === 'true';
  const cloudName = useDb ? company?.cloudinaryCloudName : process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey    = useDb ? company?.cloudinaryApiKey : process.env.CLOUDINARY_API_KEY;
  const apiSecret = useDb ? company?.cloudinaryApiSecret : process.env.CLOUDINARY_API_SECRET;

  if (!cloudName) return { error: 'MISSING_CLOUD_CONFIG' };

  cloudinary.v2.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  return {};
}
```

### Testing Checklist (Staging)
- [ ] UI saves values; SweetAlert2 success on save
- [ ] Feature flag OFF: legacy env path still uploads correctly
- [ ] Feature flag ON: reading from DB works (image uploads, presets & folders applied)
- [ ] `app/api/images/route.ts` uses `uploadPreset/clientFolder`
- [ ] Upload retries handled; errors logged without exposing secrets

### Rollback
- Disable `USE_DB_CLOUDINARY` → instantly returns to `.env`
- Keep `.env` keys during transition window

### Security & Performance
- Never expose API key/secret to client
- Use stable folder naming: `${uploadPreset}/${clientFolder}/products/...`
- Prefer webp/jpg with quality auto; leverage Cloudinary CDN

### Monitoring
- Track upload success rate, latency, and error logs
- Add lightweight console warning if DB or env keys missing

### Timeline (Suggested)
- Day 1–2: Validate UI and staging uploads with flag ON
- Day 3: Enable in production for admins only, monitor
- Day 4+: Remove legacy env references after stability window

---

This document is limited to Cloudinary. See `ENV_TO_DB_MIGRATION_PLAN.md` for the complete multi-service plan.


