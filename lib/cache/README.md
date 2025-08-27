## lib/cache directory overview

### lib/cache/wishlist.ts
- **Exports**: `getCachedWishlist`, `setCachedWishlist`
- **Purpose**: In-memory session cache for product wishlist state to avoid redundant server checks
- **Runtime**: Client
- **Depends on**: `Map`
- **Used by**: `app/(e-comm)/(home-page-sections)/product/cards/WishlistButton.tsx`
- **DB models**: none
- **SAFE TO DELETE**: NO

## Cross-flows
- Used alongside server actions in wishlist button to provide immediate UI feedback and reduce flicker.

## Usage audit (direct vs indirect)
- Direct imports: listed above
- Indirect usage: none

## Final deletion flags (based on deep scan)
- `lib/cache/wishlist.ts` → SAFE TO DELETE: NO



















