# 🏆 Best Seller Route Action Plan

## 1. Route Structure
- Create a new route: `/best-sellers` (or `/bestsellers`)
- Add a navigation link/icon (e.g., fire icon) in the main nav/bottom nav
- Use file: `app/(e-comm)/bestsellers/page.tsx` (Next.js app router)

## 2. Backend Logic
- Add a backend API or server action to fetch best-selling products:
  - Criteria: highest sales count, most orders, or most views (choose metric)
  - Example: `getBestSellers({ limit, page })` in `app/(e-comm)/homepage/actions/`
  - Use Prisma to sort products by `salesCount` or similar field
  - Support pagination for large result sets

## 3. Frontend UI
- Create a dedicated page: `BestSellerPage`
- Display products in a grid/list (reuse existing product card components)
- Add a prominent "Best Seller" badge/icon (e.g., fire) on each product card
- Show product rank (1st, 2nd, 3rd, ...), if desired
- Add filters/sorting (optional: by category, price, etc.)

## 4. Badge/Icon Usage
- Use a fire icon (`FaFire` or similar) for best seller in nav and on product cards
- Use theme color for badge (e.g., orange or gold)
- Ensure accessibility: add `aria-label` and alt text

## 5. Sorting Logic
- Default: sort by `salesCount` descending
- Fallback: use `views` or `orders` if `salesCount` is missing
- Allow admin to configure metric in the future (optional)

## 6. Testing & QA
- Test with real and empty data
- Test pagination, loading, and error states
- Test badge/icon visibility on all devices
- Test SEO: add meta tags for the best seller page

## 7. Best Practices
- Use SWR or server actions for data fetching
- Reuse product card/grid components for consistency
- Keep route and logic isolated for easy maintenance
- Add analytics to track visits to the best seller page

---

**References:**
- [E-commerce best seller UX patterns](https://baymard.com/blog/best-seller-lists)
- [Next.js dynamic routes](https://nextjs.org/docs/app/building-your-application/routing)
- [React-icons FaFire](https://react-icons.github.io/react-icons/icons?name=fa) 