# Homepage Infinite Scroll Enhancement Plan

## Goal
Optimize homepage product loading and infinite scroll for best SSR, SEO, and performance.

---

## Current Approach
- `<HomepageProductSection filters={filters} page={page} />` is called in the page.
- `HomepageProductSection` fetches initial products on the server.
- Infinite scroll logic (if any) is handled in a child component, which fetches more products as the user scrolls.
- **Drawbacks:**
  - Data fetching logic is split between parent and child.
  - More prop drilling if data is needed deeper.
  - Potential for double-fetching or less SSR/SEO control.

---

## Enhanced Approach (Recommended)
1. **Fetch initial products in the main page (`page.tsx`) using `fetchProductsPage`.**
2. **Pass initial products, total count, and filters as props to the infinite scroll component.**
3. **Infinite scroll component renders initial products and fetches more on scroll.**
4. **No double-fetching, no unnecessary prop drilling, better SSR/SEO.**

---

## What Will Be Removed/Changed
- Remove product fetching from `HomepageProductSection` (child).
- Remove prop drilling for filters/page if not needed.
- Only the infinite scroll component will handle client-side fetching for more products.
- The main page will be responsible for the initial SSR data fetch.

---

## Summary Table
| Step                | Current Approach                        | Enhanced Approach (Recommended)         |
|---------------------|-----------------------------------------|-----------------------------------------|
| Data Fetching       | In child (HomepageProductSection)       | In page (server), pass as prop          |
| Initial Render      | Fetched in child, may double-fetch      | SSR: products rendered immediately      |
| Infinite Scroll     | Child fetches more on scroll            | Child fetches more on scroll            |
| Prop Drilling       | May be needed for deep components       | Only pass initial data to scroll comp   |
| SEO/Performance     | Not optimal                             | Best: SSR + client hydration           |

---

## Benefits
- Faster initial load
- Better SEO (products in SSR HTML)
- No double-fetching
- Cleaner, more maintainable code

---

## Next Steps
- Refactor homepage to fetch initial products in the page.
- Pass initial data to the infinite scroll component.
- Remove product fetching from child components. 