# Authentication Settings Action Plan (env → database)

## Tasks (Do in order)
- [x] Add env flag `USE_DB_AUTH_CALLBACK=true|false`
- [x] Refactor `lib/auth-dynamic-config.ts` to add DB-backed `getNextAuthURLAsync()` and keep `getNextAuthURL()` for fallback
  - [x] If flag is true → return `company.authCallbackUrl` (server)
  - [x] Else → fall back to `process.env.NEXTAUTH_URL`
  - [x] Fallback of last resort → runtime base URL detection (if present)
- [x] Update `auth.ts` to use `await getNextAuthURLAsync()` in production
- [x] Remove Google OAuth from `auth.config.ts` (keep Credentials)
- [x] Ensure admin form saves `authCallbackUrl` and calls `revalidateTag('company')`
- [ ] Staging tests (flag on/off, redirects/callbacks)
- [ ] Rollout to Production gradually and monitor

## Goal
- Make authentication settings admin-editable and stored in the database.
- Keep `.env` as a safe fallback during migration and as a default when DB values are missing.

## Scope
- Covers the NextAuth base/callback URL handling.
- Does not include adding new OAuth providers; Google OAuth should be removed and only Credentials kept.

## Fields and Flags
- From DB: `Company.authCallbackUrl`
- From env (fallback): `NEXTAUTH_URL`
- Feature flag: `USE_DB_AUTH_CALLBACK` with values `"true" | "false"`

## Affected Files
- `auth.ts`
- `auth.config.ts`
- `lib/auth-dynamic-config.ts`
- `app/dashboard/management/settings/advanced/components/forms/AuthSettingsForm.tsx`

## Implementation Steps
1) Add the feature flag
- Add env variable: `USE_DB_AUTH_CALLBACK=true|false`.

2) Simplify `lib/auth-dynamic-config.ts`
- Keep a single function: `getNextAuthURL()`.
- Function logic:
  - If `USE_DB_AUTH_CALLBACK === 'true'`: fetch the company on the server and return `company.authCallbackUrl` if present.
  - Otherwise use `process.env.NEXTAUTH_URL` as a fallback.
  - If neither exists, use runtime base-URL detection (if implemented) and document the behavior.

3) Update `auth.ts`
- Ensure NextAuth relies on `getNextAuthURL()` as the single source of truth.
- Do not read `process.env.NEXTAUTH_URL` directly in this file.

4) Clean up `auth.config.ts`
- Remove Google OAuth and its env variables entirely.
- Keep the Credentials provider only.

5) Admin UI
- The “Authentication Settings” form reads/updates `authCallbackUrl` via a server action.
- Do not render sensitive values on the client.
- After saving, call `revalidateTag('company')` to refresh cached data.

## Testing Gate (Staging)
- Sign-in/out works with both `USE_DB_AUTH_CALLBACK=true` and `false`.
- Redirect/callback routes resolve correctly per client domain.
- No NextAuth errors or hydration warnings in logs.

## Rollback
- Set `USE_DB_AUTH_CALLBACK=false` to immediately revert to `.env.NEXTAUTH_URL`.
- Keep `.env` values during the transition window.

## Acceptance Criteria
- Admin can edit `authCallbackUrl` from the dashboard successfully.
- NextAuth reads from DB when the flag is on, and from `.env` when it is off.
- No sensitive data is leaked to the client.
- No session disruptions or login failures.

## Quick Checklist
- [x] Add `USE_DB_AUTH_CALLBACK` flag
- [x] Simplify `lib/auth-dynamic-config.ts` to `getNextAuthURL()` only (with async DB-backed variant)
- [x] Update `auth.ts` to depend on `getNextAuthURLAsync()` in production
- [x] Remove Google OAuth from `auth.config.ts`
- [x] Wire the admin form and revalidate via `revalidateTag('company')`
- [ ] End-to-end test on Staging and roll out gradually to Production

## Risks and Mitigations
- **Incorrect callback URL**: add validation before saving or provide a “Test” button later.
- **Environment differences**: document separate values per Staging/Prod.

## Release Notes
- Start in Staging, then enable the flag in Production gradually while monitoring logs for 24 hours.
