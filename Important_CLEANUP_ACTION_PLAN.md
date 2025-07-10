# Full App Cleanup Action Plan (Unused Components, Scripts, Dead Code)

## 1. Inventory & Usage Analysis ✅ COMPLETED

### COMPONENTS FOLDER ANALYSIS

#### ✅ USED COMPONENTS
- `components/AddImage.tsx` - **USED** (10+ imports across dashboard)
- `components/BackButton.tsx` - **USED** (20+ imports across dashboard)
- `components/BackToTopButton.tsx` - **USED** (imported in main page)
- `components/form-error.tsx` - **USED** (5+ imports in forms)
- `components/InfoTooltip.tsx` - **USED** (10+ imports, but has duplicate)
- `components/warinig-msg.tsx` - **USED** (2 imports in admin pages)
- `components/SupportPingButton.tsx` - **USED** (referenced in docs)
- `components/GoogleMap.tsx` - **USED** (referenced in docs)
- `components/Notification.tsx` - **USED** (referenced in docs)
- `components/HomeSeoForm.tsx` - **USED** (3 imports in SEO pages)
- `components/app-dialog.tsx` - **USED** (3 imports in dashboard)
- `components/InputField.tsx` - **USED** (referenced in shadcn checklist)
- `components/TextareaField.tsx` - **USED** (referenced in shadcn checklist)
- `components/image-upload.tsx` - **USED** (referenced in shadcn checklist)

#### ❌ UNUSED COMPONENTS
- `components/ThemeToggle.txt` - **UNUSED** (legacy file, only referenced in docs)
- `components/empty-box.tsx` - **UNUSED** (only referenced in TXT-document)
- `components/CardImage.tsx` - **UNUSED** (no imports found)
- `components/mdx-components.tsx` - **UNUSED** (no imports found)

#### 🔄 DUPLICATE COMPONENTS
- `components/InfoTooltip.tsx` vs `components/ui/InfoTooltip.tsx` - **DUPLICATE** (both used, need to merge)

### HOOKS FOLDER ANALYSIS

#### ✅ USED HOOKS
- `hooks/use-check-islogin.ts` - **USED** (6+ imports in cart/checkout)
- `hooks/use-geo.tsx` - **USED** (4 imports in checkout/company profile)
- `hooks/use-analytics.ts` - **USED** (referenced in analytics setup)
- `hooks/use-media-query.ts` - **USED** (2 imports in cart components)
- `hooks/use-mobile.tsx` - **USED** (1 import in sidebar)

#### ❌ UNUSED HOOKS
- `hooks/useCart.txt` - **UNUSED** (no imports found)

### UTILS FOLDER ANALYSIS

#### ✅ USED UTILS
- `utils/debounce.ts` - **USED** (multiple imports in infinite scroll, product cards)
- `utils/slug.ts` - **USED** (multiple imports in fashion data files)
- `utils/syncOrderInWay.ts` - **USED** (imported in order management)
- `utils/extract-latAndLog-fromWhatsAppLink.ts` - **USED** (4 imports in location components)
- `utils/sendEmail.ts` - **USED** (imported in client submission)
- `utils/logger.ts` - **USED** (imported in login form)

#### ❌ UNUSED UTILS
- `utils/fashionSeedData copy.txt` - **UNUSED** (legacy file)
- `utils/seedWithAppLogic.ts` - **UNUSED** (empty file)
- `utils/pusherActions.ts` - **UNUSED** (no imports found)
- `utils/localStoreage.ts` - **UNUSED** (no imports found)
- `utils/wrap-server-action.ts` - **UNUSED** (no imports found)
- `utils/seo.ts` - **UNUSED** (only referenced in TXT-document)

### LIB FOLDER ANALYSIS

#### ✅ USED LIB FILES
- `lib/prisma.ts` - **USED** (core database connection)
- `lib/utils.ts` - **USED** (core utilities)
- `lib/cache.ts` - **USED** (core caching)
- `lib/check-is-login.ts` - **USED** (core auth check)
- `lib/notifications.ts` - **USED** (referenced in docs)
- `lib/alert-utils.ts` - **USED** (referenced in docs)
- `lib/revalidate.ts` - **USED** (referenced in docs)
- `lib/swal-config.ts` - **USED** (referenced in docs)
- `lib/web-vitals.ts` - **USED** (referenced in web-vitals plan)

#### ❌ UNUSED LIB FILES
- `lib/cloudinary copy/` - **UNUSED** (duplicate directory)
- `lib/pusher1.ts` - **UNUSED** (no imports found)
- `lib/pusherSetting.ts` - **UNUSED** (no imports found)
- `lib/sendTOCloudinary.ts` - **UNUSED** (no imports found)
- `lib/sendWhatsapp-otp.ts` - **UNUSED** (no imports found)
- `lib/otp-Generator.ts` - **UNUSED** (no imports found)
- `lib/getSession.ts` - **UNUSED** (no imports found)
- `lib/isValidObjectId.ts` - **UNUSED** (no imports found)
- `lib/cloudinary.ts` - **UNUSED** (only referenced in TXT-document)
- `lib/image-utils.ts` - **UNUSED** (only referenced in TXT-document)
- `lib/formatCurrency.ts` - **UNUSED** (no imports found)
- `lib/getGeo.ts` - **UNUSED** (no imports found)
- `lib/address-helpers.ts` - **UNUSED** (no imports found)
- `lib/cart-events.ts` - **UNUSED** (no imports found)
- `lib/dashboardSummary.ts` - **UNUSED** (no imports found)
- `lib/whatapp-cloud-api.ts` - **UNUSED** (no imports found)
- `lib/importFonts.ts` - **UNUSED** (no imports found)

### HELPERS FOLDER ANALYSIS

#### ✅ USED HELPERS
- `helpers/orderNumberGenerator.ts` - **USED** (imported in order actions)
- `helpers/newsletterHelpers.ts` - **USED** (imported in newsletter actions)
- `helpers/orderNumberGenerator.test.ts` - **USED** (test file for order generator)

### SCRIPTS FOLDER ANALYSIS

#### ❌ UNUSED SCRIPTS
- `scripts/checkOrderAddressIntegrity.ts` - **UNUSED** (no imports found)
- `scripts/migrate-addresses.ts` - **UNUSED** (no imports found)

### LEGACY FILES ANALYSIS

#### ❌ LEGACY FILES (TXT-document folder)
- All files in `TXT-document/` - **LEGACY** (documentation/backup files)
- All files in `old-cursor-mdc/` - **LEGACY** (old documentation files)

## 2. Performance Analysis & Optimization Recommendations 🚀

### PERFORMANCE ISSUES IDENTIFIED (Chrome DevTools Analysis)

#### 🔴 Critical Issues
- **Scripting Time**: 9,029ms out of 16,096ms total (56% of load time)
- **Long Main Thread Tasks**: Heavy JavaScript execution blocking interactivity
- **Large Bundle Size**: 7,245 modules compiled, indicating potential bloat
- **Source Map 404s**: Multiple missing source maps affecting debugging

#### 📊 Performance Metrics
| Category    | Time (ms) | % of Total | Status |
|-------------|-----------|------------|--------|
| Scripting   | 9,029     | 56%        | 🔴 Critical |
| System      | 2,574     | 16%        | 🟡 Moderate |
| Rendering   | 516       | 3%         | 🟢 Good |
| Painting    | 264       | 2%         | 🟢 Good |
| Loading     | 196       | 1%         | 🟢 Good |

### OPTIMIZATION RECOMMENDATIONS

#### A. JavaScript Bundle Optimization (HIGH PRIORITY)
1. **Code Splitting Implementation**
   - Use dynamic imports for non-critical components
   - Split vendor and app code
   - Implement route-based code splitting

2. **Tree Shaking & Dead Code Elimination**
   - Audit and remove unused dependencies
   - Ensure proper tree shaking configuration
   - Remove unused exports and variables

3. **Bundle Analysis**
   - Run `next build` + `next analyze` to identify large chunks
   - Use `webpack-bundle-analyzer` for detailed analysis
   - Target the largest contributors first

4. **Dependency Optimization**
   - Replace heavy libraries with lighter alternatives
   - Use specific imports instead of full library imports
   - Consider lazy loading for third-party libraries

#### B. Component & Hook Optimization (MEDIUM PRIORITY)
1. **Lazy Loading Components**
   - Implement `React.lazy()` for heavy components
   - Use `Suspense` boundaries for better UX
   - Lazy load dashboard components

2. **Hook Optimization**
   - Memoize expensive calculations with `useMemo`
   - Use `useCallback` for function dependencies
   - Implement custom hooks for shared logic

3. **State Management Optimization**
   - Reduce unnecessary re-renders
   - Optimize context providers
   - Use local state when possible

#### C. Build & Development Optimization (MEDIUM PRIORITY)
1. **Source Map Configuration**
   - Fix missing source maps (lucide-react.js.map 404s)
   - Configure proper source map generation
   - Optimize source map size for production

2. **Development Server Optimization**
   - Reduce compilation time (currently 27.4s)
   - Optimize webpack configuration
   - Use faster development builds

#### D. Database & API Optimization (LOW PRIORITY)
1. **Prisma Connection Issues**
   - Fix "connection forcibly closed" errors
   - Implement connection pooling
   - Add retry logic for transient errors

2. **API Response Optimization**
   - Implement caching for frequently accessed data
   - Optimize database queries
   - Add pagination where missing

### PERFORMANCE OPTIMIZATION CHECKLIST
- [ ] Run bundle analysis (`next build && next analyze`)
- [ ] Implement code splitting for heavy components
- [ ] Audit and remove unused dependencies
- [ ] Fix source map 404s
- [ ] Optimize Prisma connection handling
- [ ] Implement lazy loading for dashboard components
- [ ] Add performance monitoring
- [ ] Test performance improvements
- [ ] Document optimization changes

## 3. Backup Before Deletion (CRITICAL)
- Before deleting any file, copy it to `backup/[DATE]/[FOLDER]/`.
- Never delete global/config files without explicit confirmation.
- Example backup: `backup/2024-07-01/components/UnusedComponent.tsx`

## 4. Safe Removal/Move/Merge Plan

### IMMEDIATE REMOVAL CANDIDATES (After Backup)
- `components/ThemeToggle.txt` - Legacy file
- `components/empty-box.tsx` - Unused component
- `components/CardImage.tsx` - Unused component
- `components/mdx-components.tsx` - Unused component
- `hooks/useCart.txt` - Unused hook
- `utils/fashionSeedData copy.txt` - Legacy file
- `utils/seedWithAppLogic.ts` - Empty file
- `utils/pusherActions.ts` - Unused utility
- `utils/localStoreage.ts` - Unused utility
- `utils/wrap-server-action.ts` - Unused utility
- `utils/seo.ts` - Unused utility
- `lib/cloudinary copy/` - Duplicate directory
- `lib/pusher1.ts` - Unused lib file
- `lib/pusherSetting.ts` - Unused lib file
- `lib/sendTOCloudinary.ts` - Unused lib file
- `lib/sendWhatsapp-otp.ts` - Unused lib file
- `lib/otp-Generator.ts` - Unused lib file
- `lib/getSession.ts` - Unused lib file
- `lib/isValidObjectId.ts` - Unused lib file
- `lib/cloudinary.ts` - Unused lib file
- `lib/image-utils.ts` - Unused lib file
- `lib/formatCurrency.ts` - Unused lib file
- `lib/getGeo.ts` - Unused lib file
- `lib/address-helpers.ts` - Unused lib file
- `lib/cart-events.ts` - Unused lib file
- `lib/dashboardSummary.ts` - Unused lib file
- `lib/whatapp-cloud-api.ts` - Unused lib file
- `lib/importFonts.ts` - Unused lib file
- `scripts/checkOrderAddressIntegrity.ts` - Unused script
- `scripts/migrate-addresses.ts` - Unused script

### MERGE CANDIDATES
- `components/InfoTooltip.tsx` vs `components/ui/InfoTooltip.tsx` - Need to merge and keep one

### LEGACY FOLDER CLEANUP
- `TXT-document/` - Entire folder (after backup)
- `old-cursor-mdc/` - Entire folder (after backup)

## 5. Dependency & Impact Check
- For each file marked for removal, search for all imports/usages.
- If any usage is found, update the plan (do not delete).
- For shared utilities/hooks, check for indirect usage.

## 6. Migration Steps
1. **Backup** all files marked for deletion/move.
2. **Remove** unused files, update imports as needed.
3. **Move** single-use components to their route folders.
4. **Merge** duplicates, update all imports.
5. **Run linter and TypeScript checks** after each step.
6. **Test the app** after each change (locally and in CI if possible).
7. **Commit** after each safe step with a clear message.

## 7. Documentation
- Document every action in this file:
  - What was removed, moved, or merged.
  - Reason for the action.
  - Any follow-up required.
- Update the checklist below as you proceed.

## 8. Best Practices & Safety Rules
- Never delete without backup.
- Never update global/config files without confirmation.
- Always test after each change.
- Follow folder structure and cleanup rules (see `foldercleanup.md`, `old-cursor-mdc/cleanup.mdc`, `old-cursor-mdc/safety.mdc`).
- Remove all `console.log`, `TODO`, `FIXME`, and unused variables.

---

## Cleanup Checklist
- [x] Inventory all files in components, app, lib, helpers, hooks, utils, scripts
- [x] Mark each as used, single-use, duplicate, or unused
- [ ] Backup all files marked for deletion/move
- [ ] Remove unused files/scripts/components
- [ ] Move single-use components to route folders
- [ ] Merge or remove duplicates
- [ ] Remove legacy/`.txt`/`to-Delete` files if not referenced
- [ ] Remove dead code and unused exports/variables
- [ ] Run linter and TypeScript checks
- [ ] Test the app after each change
- [ ] Commit after each safe step
- [ ] Document every action in this file

---

**Next Steps:**
- Start with backing up all files marked for deletion
- Begin with the safest removals (unused components)
- Proceed step-by-step, always backing up before deleting or moving files.
- **Priority**: Address performance issues first (bundle optimization, code splitting)
- **Secondary**: Continue with cleanup of unused files and components 