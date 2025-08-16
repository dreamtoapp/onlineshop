# 🛡️ Verified Dead Code Report

## ✅ Unused (Safe to Remove) — Phase 1 candidates
- `archive/` — Archived code not referenced by runtime.
- Code-like text artifacts:
  - `archive/app/(e-comm)/(cart-flow)/checkout/actions/getCart.ts.txt`
  - `app/(e-comm)/actions/getUserAlerts.ts.txt`
  - `app/(e-comm)/(adminPage)/about/actions/SeoData.ts.txt`
  - `app/(e-comm)/(adminPage)/about/actions/getTestimonials.ts.txt`
  - `app/api/images/cloudinary/validator.ts.txt`
  - `lib/auth-dynamic-config.ts.txt`
- Extraneous DOM candidates (empty React fragments):
  - `app/(e-comm)/(adminPage)/user/wishlist/components/ClientWishlistPage.tsx` (contains empty fragment `<> </>`)

## ❗ In Use – Keep (from prior verification)
- `lib/auth-dynamic-config.ts` — `getNextAuthURL` is imported and used in `auth.ts`

## Scan Notes
- Initial Phase 1 scan focused on orphan-like files, archived code, and obvious extraneous DOM.
- Tooling constraints (global installs missing) prevented running `knip`, `ts-prune`, and `tsc` in CI mode. Manual glob/grep used instead.
- Next.js reserved files (`page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`) are treated as in-use by convention.
