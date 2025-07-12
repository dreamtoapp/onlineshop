# fetchProductsPage Usage Explained

## What is `fetchProductsPage`?
A shared server-side function for fetching lists of products, supporting filters like category, offer, pagination, etc. It centralizes product fetching logic for reuse across the app.

**Note:** Supplier filtering is no longer used or supported.

---

## Where is it Used?

### 1. Homepage Product Section
- **File:** `app/(e-comm)/homepage/component/HomepageProductSection.tsx`
- **Why:** Fetches products to display on the homepage, possibly filtered by category or other criteria.

### 2. Homepage Infinite Scroll Helper
- **File:** `app/(e-comm)/homepage/helpers/useProductInfiniteScroll.ts`
- **Why:** Supports infinite scrolling on the homepage product list, loading more products as the user scrolls.

### 3. API Route
- **File:** `app/api/products-grid/route.ts`
- **Why:** Provides a backend API endpoint that returns products for a grid, used by client-side components or other services.

### 4. Product Cards Section
- **File:** `app/(e-comm)/(home-page-sections)/product/cards/ProductsSection.tsx`
- **Why:** Fetches products for a specific section, such as a category or featured products.

### 5. Product List with Infinite Scroll
- **File:** `app/(e-comm)/(home-page-sections)/product/cards/ProductListWithScroll.tsx`
- **Why:** Implements infinite scroll in product lists, fetching more products as needed.

---

## Why is it Used?
- **Centralizes product fetching logic** (DRY principle).
- **Supports different UI patterns** (static lists, infinite scroll, API endpoints).
- **Easy to update filtering or pagination logic in one place.**

---

## Supplier Filtering
- **No longer used.**
- All product fetching is now based on category, offer, or other business logic.

---

## Summary
`fetchProductsPage` is a reusable utility for fetching product lists throughout the app. It is no longer tied to supplier filtering, making it simpler and more focused on current business needs. 