# Product Filtering Refactor Plan

## Goal
Unify product filtering to use category, offer, and custom filters (not supplier) across homepage, category, offer, and filtered product views.

---

## Steps

### 1. Update `fetchProductsPage`
- Change the function to accept a `filters` object (categorySlug, offerId, search, price, etc.).
- Remove supplier filtering.
- Add category, offer, and other filter logic as needed.

**Example:**
```ts
export interface ProductFilters {
  categorySlug?: string;
  offerId?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  // ...other filters
}

export async function fetchProductsPage(
  filters: ProductFilters = {},
  page: number = 1,
  pageSize: number = 8
) {
  const whereClause: Prisma.ProductWhereInput = {
    published: true,
    imageUrl: { not: null },
  };

  if (filters.categorySlug) {
    whereClause.categoryAssignments = {
      some: { category: { slug: filters.categorySlug } }
    };
  }
  if (filters.offerId) {
    whereClause.offers = { some: { id: filters.offerId } };
  }
  // Add other filters (search, price, etc.)

  // ...rest of the logic
}
```

---

### 2. Update All Usages
- Pass a `filters` object everywhere `fetchProductsPage` is used.
- Update homepage, infinite scroll, category, offer, and API route.
- Example for category page: `{ categorySlug: slug }`
- Example for offers page: `{ offerId: ... }`

---

### 3. Update Types
- Define and use a shared `ProductFilters` type in a common location (e.g., `types/`).
- Update all function signatures and usages to use this type.

---

### 4. Test
- Homepage (with and without filters)
- Category page
- Offers page (if exists)
- Any custom filter/search UI
- Infinite scroll and pagination

---

### 5. Cleanup
- Remove supplier-based filtering and related code from product queries.
- Clean up any unused supplier-related code in product fetching.

---

## Files to Update
- `app/(e-comm)/homepage/actions/fetchProductsPage.ts`
- `app/(e-comm)/homepage/component/HomepageProductSection.tsx`
- `app/(e-comm)/homepage/helpers/useProductInfiniteScroll.ts`
- `app/(e-comm)/(home-page-sections)/product/cards/ProductsSection.tsx`
- `app/(e-comm)/(home-page-sections)/product/cards/ProductListWithScroll.tsx`
- `app/api/products-grid/route.ts`
- Any other file using `fetchProductsPage` or product filtering

---

## Notes
- Be careful to update all usages and test thoroughly!
- Ensure all product listings (homepage, category, offer, filtered, infinite scroll) use the new unified filter logic.
- Remove any supplier-based logic from product fetching.

--- 