# Action Plan: Refactor Wishlist Flow and WishlistIconClient (Deep Audit)

## Goal
- Refactor the wishlist system so that:
  - Users can **add** products to their wishlist from any product-related UI (product card, quick view, product quantity, add-to-cart modal).
  - Users can **remove** products from their wishlist directly from the wishlist page (custom remove button).
  - The wishlist icon in the header always shows the up-to-date count, fetched directly from the database (not context).
  - All context usage is removed for a single source of truth.

---

## Flow Overview

1. **Add to Wishlist (All Product Entry Points)**
   - All add-to-wishlist actions use the `WishlistButton` component.
   - Entry points include:
     - Product Card (grid/list)
     - Quick View modal
     - Product Quantity controls
     - Add to Cart modal
   - The button calls `addToWishlist` server action and updates UI optimistically.
   - The header count updates after each add.

2. **Remove from Wishlist (Wishlist Page)**
   - Each product card in the wishlist page has a custom "إزالة" (Remove) button (not using `WishlistButton`).
   - This button must be wired to call `removeFromWishlist` server action.
   - The product is removed from the UI and the header count updates.

---

## Steps

1. **Server Actions**
   - Server actions for:
     - `addToWishlist(productId)` — adds a product for the current user.
     - `removeFromWishlist(productId)` — removes a product for the current user.
     - `isProductInWishlist(productId)` — checks if a product is in the wishlist.
     - `getWishlistCount(userId)` — returns the count of wishlist items for a user.
   - All actions are now in the `/actions` folder as per folder structure rules.

2. **Refactor All WishlistButton Usages**
   - Context usage is being removed from `WishlistButton`.
   - All entry points (product card, quick view, product quantity, add-to-cart modal) will use direct server action calls and local state for optimistic UI.
   - After add/remove, trigger a re-fetch of the header count.
   - All usages are being updated to the new logic.

3. **Wishlist Page: Remove from Wishlist**
   - The "إزالة" (Remove) button in `WishlistProductCard` will:
     - Call `removeFromWishlist(product.id)` on click.
     - Optimistically remove the product from the UI.
     - Trigger a re-fetch of the header count.
     - Handle loading and error states.
   - This is the next immediate step.

4. **WishlistIconClient (Header Icon)**
   - Will fetch the wishlist count directly from the server (not context).
   - Will use SWR/React Query for live updates.
   - Will show a loading state while fetching.
   - All internal navigation now uses the new dynamic route with the correct `userId`.

5. **Remove Wishlist Context**
   - Once all components are refactored, remove `WishlistProvider` and `WishlistContext` from the codebase and layout.
   - Update documentation and README files as needed.

6. **Test All Flows**
   - Add to wishlist from every entry point (product card, modal, quick view, etc.).
   - Remove from wishlist on the wishlist page.
   - Ensure header count updates everywhere.
   - Test as logged-in user and guest.
   - Check for race conditions, hydration mismatches, and UI consistency.

---

## Progress & Status

- [x] Dynamic route migration complete (`/user/wishlist/[userId]`).
- [x] UI components extracted to `components/` subfolder.
- [x] Backend logic moved to `/actions`.
- [x] Internal navigation updated.
- [x] Old static wishlist page deleted.
- [ ] All `WishlistButton` usages refactored to remove context (in progress).
- [ ] Remove-from-wishlist button in wishlist page wired to backend (next).
- [ ] Global context/provider removal (after above).
- [ ] Thorough testing and documentation update.

---

## Components to Update (Tracking)

The following components will be updated as part of the wishlist refactor:

- `WishlistButton` (all usages)
  - Product Card (grid/list)
  - Quick View modal
  - Product Quantity controls
  - Add to Cart modal
- `WishlistProductCard` (remove-from-wishlist button logic)
- `WishlistIconClient` (header icon/count)
- `WishlistProvider` and `WishlistContext` (to be removed)
- Any layout or provider files referencing the wishlist context
- Documentation/README files as needed

---

## Risks & Considerations
- **Consistency:** Ensure the count and UI always reflect the true DB state (handle race conditions).
- **Performance:** Minimize DB calls and use caching/optimistic updates where possible.
- **Auth:** Only allow actions for the correct user.
- **Hydration:** Avoid hydration mismatches between server and client.
- **Zero Error:** Test every entry point and state transition for reliability.

---

## Next Steps
- Finish refactoring all `WishlistButton` usages and wire up remove-from-wishlist button.
- Remove global context/provider.
- Test all flows and update documentation.
- Proceed step by step, testing after each change. 