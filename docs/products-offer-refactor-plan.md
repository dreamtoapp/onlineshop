# Offer Page Refactor Plan

## Goal
Refactor the offer page to match the new category page approach:
- No pagination or infinite scroll
- Fetch all products for the offer on the server (just like category page fetches by category)
- Render all product cards in a simple grid
- Ensure clean, error-free, and maintainable code
- **Offer and category pages should be structurally and functionally identical, only differing in the filter (offer vs category)**

---

## Steps

### 1. Review Current Logic
- The offer page (`app/(e-comm)/(home-page-sections)/offers/[slug]/page.tsx`) fetches the offer and its products using Prisma.
- The category page (`app/(e-comm)/(home-page-sections)/categories/[slug]/page.tsx`) fetches the category and its products using a similar approach.
- Both pages map over their products and render `ProductCardAdapter` for each.
- No infinite scroll or paging is present.

### 2. Ensure Identical Structure
- Both pages should:
  - Fetch all related products server-side (by offer or category).
  - Use the same grid layout and card component.
  - Show the product count above the grid.
  - Handle the empty state with a friendly message.
- Only the filter (offer vs category) should differ.

### 3. Best Practices
- Use concise, clear code with minimal comments.
- Ensure all product data is fetched in a single query for performance.
- Use the same card component (`ProductCardAdapter`) for consistency.
- Move any reusable UI or logic to `components/` or `helpers/` if needed.

### 4. Affected Files
- `app/(e-comm)/(home-page-sections)/offers/[slug]/page.tsx`
- (No changes needed to actions or helpers unless you want to further optimize fetching.)

### 5. Testing
- Test with offers that have products and offers that have none.
- Check that the product count matches the number of cards.
- Ensure no errors in the console or UI.
- Compare with the category page to ensure identical user experience.

---

## Summary
This plan will make the offer page logic **identical** to the category page, with zero errors and a clean, maintainable structure. Only the filter (offer vs category) will differ. 