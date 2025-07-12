# Dynamic Import Migration Plan: sweetalert2 & pusher-js

## Goal
Dynamically import `sweetalert2` and `pusher-js` only where needed to reduce bundle size and improve performance, following Next.js best practices.

---

## sweetalert2 (and sweetalert2-react-content)
**Change:** Replace all top-level imports with dynamic imports inside event handlers or functions.

### Affected Files/Components
- [ ] `lib/swal-config.ts`
- [ ] `lib/alert-utils.ts` (uses ReactSwal from above)
- [ ] `app/dashboard/show-invoice/components/ConfirmDriver.tsx`
- [ ] `app/dashboard/management-suppliers/components/DeleteSupplierAlert.tsx`
- [ ] `app/dashboard/management-products/new/components/ProductUpsert.tsx`
- [ ] `app/dashboard/management-categories/components/DeleteCategoryAlert.tsx`
- [ ] `app/(e-comm)/(adminPage)/auth/verify/component/OtpForm.tsx`
- [ ] `app/(e-comm)/(adminPage)/auth/register/components/register-form.tsx`

**How:**
- Remove `import Swal from 'sweetalert2'` at the top.
- Use `const Swal = (await import('sweetalert2')).default;` inside the function where needed.
- If using `withReactContent`, import it dynamically as well.

---

## pusher-js (client-side only)
**Change:** Replace all top-level imports with dynamic imports inside `useEffect` or event handlers.

### Affected Files/Components
- [ ] `lib/pusherClient.ts`
- [ ] `app/dashboard/management/PusherNotify.tsx`
- [ ] Any other client-side file using `import Pusher from 'pusher-js'`

**How:**
- Remove `import Pusher from 'pusher-js'` at the top.
- Use `const Pusher = (await import('pusher-js')).default;` inside `useEffect` or the function where needed.

---

## pusher (server-side)
**No change needed** for server-side usage (e.g., `lib/pusherServer.ts`, `utils/pusherActions.ts`).

---

## Migration Steps
1. [ ] Refactor each file as above, one at a time.
2. [ ] Test each feature (alerts, notifications, etc.) after refactor.
3. [ ] Run bundle analyzer to confirm reduction in vendor chunk.
4. [ ] Mark each item complete in this checklist.

---

## Notes
- This migration is safe and recommended by Next.js docs.
- No breaking changes expected if you await the import before use.
- For TypeScript, add type annotations if needed.

---

**References:**
- [Next.js Lazy Loading Guide](https://nextjs.org/docs/app/guides/lazy-loading)
- [Dynamic Imports for Libraries](https://nextjs.org/learn/seo/dynamic-imports) 