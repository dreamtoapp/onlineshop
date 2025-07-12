# Action Plan: Convert Wishlist Page to Dynamic Route

## Goal
Make the wishlist page dynamic so it can display wishlists for different users via a route like `/user/wishlist/[userId]`.

---

## Steps

1. **Create Dynamic Route Folder**
   - Rename or move `page.tsx` to `[userId]/page.tsx` inside the wishlist folder.

2. **Update Data Fetching**
   - In the new `[userId]/page.tsx`, use the `params` argument to get the `userId` from the URL.
   - **Best Practice:** Type your page props using a shared interface (like `PageProps` from `@/types/commonTypes`). Accept `params` as a Promise and `await` it at the top of your function.
   - Update the logic to fetch the wishlist for the given `userId` (e.g., `getUserWishlist(userId)`).

3. **Handle Auth and Permissions**
   - Ensure only the owner or authorized users can view/edit the wishlist.
   - Redirect or show an error if unauthorized.

4. **Update Links**
   - Update any links in the app that point to `/user/wishlist` to use the dynamic route with the correct `userId`.

5. **Test**
   - Test with different user IDs to ensure correct wishlists are shown and permissions are enforced.

---

## Example: Dynamic Route Page (Best Practice)

```tsx
import { PageProps } from '@/types/commonTypes';

export default async function WishlistPage({ params }: PageProps<{ userId: string }>) {
  const { userId } = await params;
  // Fetch wishlist for userId
  // ...rest of your code
}
```

---

## Checklist

- [ ] Move/rename wishlist page to `[userId]` dynamic route
- [ ] Update data fetching to use `userId` (using best practice for params)
- [ ] Add auth/permission checks
- [ ] Update all internal links
- [ ] Test thoroughly

---

## Files/Places That Reference the Wishlist Route
Update these to use the new dynamic route with the correct `userId`:

- `app/(e-comm)/homepage/component/Fotter/Fotter.tsx` (line 85): wishlist link in footer
- `app/(e-comm)/homepage/component/Header/UserMenuTrigger.tsx` (line 75): wishlist link in user menu
- `app/(e-comm)/(adminPage)/user/ratings/page.tsx` (line 201): wishlist link in ratings page
- `app/(e-comm)/(adminPage)/user/wishlist/page.tsx` (line 410): redirect to wishlist on login

**Header Wishlist Icon:**
- In `app/(e-comm)/homepage/component/Header/HeaderUnified.tsx`, the wishlist icon is rendered via `WishlistIconClient`, but it does not currently link to the wishlist page.
- If you want the icon to navigate to the wishlist, wrap it in a `Link` and set the `href` to the new dynamic route (e.g., `/user/wishlist/[userId]`).

Search for `/user/wishlist` in the codebase to catch any additional hardcoded links or redirects. 