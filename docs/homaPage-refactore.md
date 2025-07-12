# Homepage Refactor Action Plan (Checklist)

## Goals
- [x] Simplify product list rendering on homepage
- [x] Reduce component nesting and data drilling
- [x] Improve maintainability and performance
- [x] Apply consistent best practices across homepage sections

---

## Step-by-Step Checklist

### 1. Audit Current Product List Flow
- [x] List all components currently involved:

#### **Current Product List Flow (as of audit):**

| Component/File Path                                               | Responsibility                                                      |
|------------------------------------------------------------------|---------------------------------------------------------------------|
| `app/(e-comm)/page.tsx`                                          | HomePage: Orchestrates homepage layout, passes slug/filter props     |
| `components/product/cards/ProductsSection.tsx`                    | Server component: Fetches first page of products, passes to grid     |
| `components/product/cards/ProductListWithScroll.tsx`              | Client component: Handles infinite scroll, fetches more products     |
| `components/product/cards/ProductCardAdapter.tsx`                 | Renders individual product cards, adapts product data to UI          |
| `components/product/cards/ProductCardSkeleton.tsx`                | Renders loading skeletons for product cards                          |
| `app/(e-comm)/homepage/actions/fetchProductsPage.ts`              | Server action: Fetches paginated product data from DB                |
| `app/(e-comm)/homepage/component/category/CategoryList.tsx`       | Renders category list (not directly part of product list, but nearby)|
| `app/(e-comm)/homepage/component/offer/FeaturedPromotions.tsx`    | Renders offer list (not directly part of product list, but nearby)   |

- [x] All data flows from HomePage → ProductsSection (server) → ProductListWithScroll (client) → ProductCardAdapter (client)
- [x] Infinite scroll and pagination logic is handled in ProductListWithScroll
- [x] Product fetching is split between server (initial) and client (pagination)
- [x] Filter logic is not yet unified or passed as props

---

### 2. Design New Structure
- [x] Define new components/hooks with clear, descriptive names:
  - `HomepageProductSection` (server component): fetches initial products, receives filters
  - `ProductInfiniteGrid` (client component): renders product grid, manages UI state
  - `useProductInfiniteScroll` (client hook): handles infinite scroll, filter changes, pagination
  - `ProductFilterPanel` (client component, optional): manages filter state, passes to section
- [x] Plan prop/data flow:
  - Filters managed in `ProductFilterPanel` (if present), passed to `HomepageProductSection`
  - `HomepageProductSection` fetches initial products (server), passes to grid
  - `ProductInfiniteGrid` receives initial products, manages UI
  - `useProductInfiniteScroll` handles infinite scroll, filter changes, and pagination
- [x] Ensure all names are unique and descriptive for easy identification
- [x] Document filter integration: filters are passed as a single object prop (e.g., `{ category, search, priceRange }`)

#### **New Structure Table**

| Old Component/File                        | New Component/Hook/File                | Notes                                    |
|-------------------------------------------|----------------------------------------|------------------------------------------|
| ProductsSection.tsx                       | HomepageProductSection.tsx             | Server, fetches initial products         |
| ProductListWithScroll.tsx                 | ProductInfiniteGrid.tsx                | Client, renders grid, manages UI         |
| useInfiniteProducts (logic, not file)     | useProductInfiniteScroll.ts            | Client hook, enhanced for filters        |
| (Filter logic, not unified)               | ProductFilterPanel.tsx (optional)      | Client, manages and passes filters       |
| ProductCardAdapter.tsx, ProductCard...    | (Reused or renamed as needed)          | Pure presentational, keep or clean up    |

---

### 3. Implement Enhanced useProductInfiniteScroll Hook
- [x] Accepts filter parameters
- [x] Debounces fetches on filter change
- [x] Resets state on filter change
- [x] Handles loading, error, and hasMore states
- [x] (Optional) Adds caching for repeated queries

**Summary:**
- The new `useProductInfiniteScroll` hook is implemented in `app/(e-comm)/homepage/helpers/useProductInfiniteScroll.ts`.
- It supports filter parameters, debounced fetches, state reset on filter change, and robust error/loading/hasMore state management.
- Follows best practices for clean, maintainable, and scalable infinite scroll logic.

---

### 4. Build New HomepageProductSection and ProductInfiniteGrid
- [x] `HomepageProductSection` (server): fetches initial products, passes to grid
- [x] `ProductInfiniteGrid` (client): renders products, uses `useProductInfiniteScroll`
- [x] Integrate with `ProductFilterPanel` (if present)

---

### 5. Update HomePage
- [x] Replace old product list logic with new `HomepageProductSection` and `ProductInfiniteGrid`
- [x] Ensure filters are passed and handled correctly
- [x] Use Suspense for best-practice streaming loading UI
- [x] Remove old logic and imports from page

**Summary:**
- Homepage now uses `HomepageProductSection` for the product list, with filters passed as props.
- `<Suspense>` is used for the product section, following Next.js best practices for streaming and partial loading.
- Old product list logic is removed from the homepage.

---

### 6. Remove/Merge Old Files
- [ ] Remove `components/product/cards/ProductsSection.tsx` (renamed to .txt for safe cleanup)
- [ ] Remove `components/product/cards/ProductListWithScroll.tsx` (renamed to .txt for safe cleanup)
- [ ] Remove any unused product card adapters or skeletons
- [ ] Remove dead code or unused props related to old product list flow

### 7. Test & Polish
- [ ] Test homepage for regressions and performance
- [ ] Test filter changes, infinite scroll, and error/loading states
- [ ] Update documentation/comments as needed

---

## Notes on Filter Integration & Enhancements
- Filters (category, search, price, etc.) should be managed in a top-level `ProductFilterPanel` and passed as props to `HomepageProductSection`.
- `useProductInfiniteScroll` should refetch and reset state when filters change, with debounce for rapid changes.
- All data fetching should be typed and errors handled gracefully in the UI.

---

## Summary Table

| Step                     | Component Type | Responsibility                        |
|--------------------------|---------------|----------------------------------------|
| HomePage                 | Server        | Page shell, passes props/filters       |
| ProductFilterPanel       | Client        | Manages filter state                   |
| HomepageProductSection   | Server        | Fetches initial products, passes down  |
| ProductInfiniteGrid      | Client        | Renders grid, manages UI state         |
| useProductInfiniteScroll | Client Hook   | Handles infinite scroll/pagination     |

---

## Files/Components to Remove After Refactor
- `components/product/cards/ProductsSection.tsx`
- `components/product/cards/ProductListWithScroll.tsx`
- Any unused product card adapters or skeletons
- Any dead code or unused props related to old product list flow

---

## Progress Tracking
- [x] Step 1: Audit current flow
- [x] Step 2: Design new structure
- [x] Step 3: Implement enhanced hook
- [x] Step 4: Build new components
- [x] Step 5: Update homepage
- [ ] Step 6: Remove old files
- [ ] Step 7: Test & polish 