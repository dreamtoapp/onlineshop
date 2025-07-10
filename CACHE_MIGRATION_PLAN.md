# 🚦 Safe Cache Migration Plan (Step-by-Step, Zero-Risk)

## ✅ Summary
- All server-side and client-side cache migration steps are complete, tested, and production-ready.
- All cache keys, revalidation, and tags follow Next.js/React best practices.
- Server and client caches are confirmed working (logs, tests, and browser checks).
- No breakage, zero downtime, and all code is clean.
- **All CRUD actions for products, offers, suppliers, categories, and company detail now call `revalidateTag` for instant cache invalidation.**
- **Tags used:**
  - `products` for product caches
  - `offers` for offer caches
  - `suppliers` for supplier caches
  - `categories` for category caches
  - `company` for company detail caches
- **Your app is now fully production-ready for cache and invalidation.**
- **Next step:** Monitor, optimize, and extend as needed for new features.

## Phase 1: Server-Side Cache (Foundation First)

### 1. `lib/cache.ts` (The Utility)
| Step | Status |
|------|--------|
| Review implementation: Ensure `cacheData` requires a keyFn function, not an array | [x] |
| Test with a sample consumer | [x] |
| Do NOT change the API again after this step | [x] |
| If you change this file, update all consumers before running the app | [x] |

---

### 2. All Consumers of `cacheData` or `unstable_cache`
| File | Confirm Usage | Update to keyFn | Check Options | Test | Done |
|------|--------------|-----------------|--------------|------|------|
| lib/getSession.ts | [x] | [x] | [x] | [x] | [x] |
| app/dashboard/show-invoice/actions/driver-list.ts | [x] | [x] | [x] | [x] | [x] |
| app/dashboard/management-products/new/actions/getProductData.ts | [x] | [x] | [x] | [x] | [x] |
| app/dashboard/management-dashboard/action/fetchOrders.ts | [x] | [x] | [x] | [x] | [x] |
| app/dashboard/management-dashboard/action/fetchAnalytics.ts | [x] | [x] | [x] | [x] | [x] |
| app/(e-comm)/homepage/actions/getPromotions.ts | [x] | [x] | [x] | [x] | [x] |
| app/(e-comm)/actions/companyDetail.ts | [x] | [x] | [x] | [x] | [x] |
| app/(e-comm)/homepage/actions/fetchProductsPage.ts | [x] | [x] | [x] | [x] | [x] |
| app/api/products-grid/route.ts | [x] | [x] | [x] | [x] | [x] |
| app/(e-comm)/page.tsx | [x] | [x] | [x] | [x] | [x] |
| app/(e-comm)/homepage/helpers/useProductInfiniteScroll.ts | [x] | [x] | [x] | [x] | [x] |

#### For Each File:
- Find all usages of `cacheData` or `unstable_cache`.
- If using `cacheData`, ensure the second argument is a function:  
  - Wrong: `cacheData(fn, ['key'], opts)`
  - Right: `cacheData(fn, () => ['key'], opts)`
- If using `unstable_cache` directly, ensure the cache key is always a function or array as required by Next.js docs.
- Check for correct `revalidate` and `tags` options.
- Test each function in isolation (unit test or log output).
- After all are updated, run the app and check for errors.
- If any error like `keyFn is not a function` appears, fix immediately.

---

## Phase 2: Client-Side Cache (SWR Only in Client Components)

| File | Confirm 'use client' | Use SWR | Fetcher/key | Error/loading UI | Test | Done |
|------|---------------------|---------|-------------|------------------|------|------|
| app/(e-comm)/homepage/component/ProductInfiniteGrid.tsx | [x] | [x] | [x] | [x] | [x] | [x] |

---

**All planned migration steps are complete. Next: implement on-demand cache invalidation as described below.**

---

## General Safety Rules
- Never change the cache utility and run the app before updating all consumers.
- Test each migration step before moving to the next.
- If you see any error, stop and fix before proceeding.
- Keep a backup or use git to revert if needed.

---

## Example Migration (Server-Side Consumer)
**Before:**
```ts
export const getPromotions = cacheData(fetchPromos, ['getPromos'], { revalidate: 3600 });
```
**After:**
```ts
export const getPromotions = cacheData(fetchPromos, () => ['getPromos'], { revalidate: 3600 });
```

---

**Summary:**
- Start with `lib/cache.ts`.
- Update all consumers before running the app.
- Test every step.
- Use SWR only in client components.
- Zero downtime, zero breakage. 

---

## 🚨 IMPORTANT: On-Demand Cache Invalidation (Follow-up)

After migration, implement on-demand cache invalidation for product changes:

- Use `revalidateTag('products')` after any product add, update, or delete action.
- Tag all product-related cache entries with `tags: ['products']` in cacheData options.
- This ensures users see fresh data immediately after changes, not just after time-based revalidation.

**Plan to add this after all migration steps are complete!** 