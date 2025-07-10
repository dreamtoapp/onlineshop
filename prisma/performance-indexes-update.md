# Prisma Schema Performance Indexes Update (MongoDB)

## What Was Changed
- **Removed invalid index:**
  - `@@index([categoryAssignments])` was removed from the `Product` model.
- **Added comment:**
  - Explained that MongoDB/Prisma cannot index relation fields (like `categoryAssignments`).
  - Suggested denormalizing `categorySlug` onto `Product` for best-practice filtering if needed.
- **Kept/added these indexes:**
  - `@@index([published, createdAt])` (for homepage/category infinite scroll)
  - `@@index([published, outOfStock, createdAt])`
  - `@@index([supplierId, published, outOfStock])`
  - `@@index([imageUrl])`
  - `@@index([rating])`
  - `@@index([price])`

## Why This Was Done
- **Prisma/MongoDB only allows indexes on scalar fields.**
- Attempting to index a relation field (like `categoryAssignments`) causes a schema error and will not work.
- Indexes on frequently filtered/sorted scalar fields (like `published`, `createdAt`, `price`) make queries much faster, especially for infinite scroll and product lists.

## How This Helps Performance
- **Faster homepage and category queries:**
  - Indexes on `published` and `createdAt` allow MongoDB to quickly find and sort products for infinite scroll.
- **No more schema errors:**
  - Removing the invalid index allows you to run migrations and generate the Prisma client without issues.
- **Clear path for further optimization:**
  - If category filtering is a bottleneck, denormalizing the category slug onto the `Product` model and indexing it will make category queries extremely fast.

## Next Steps (Best Practice)
- If you need to filter products by category very often and want the best performance:
  1. Add a `categorySlug` field (type `String`) to the `Product` model.
  2. Populate it when assigning categories.
  3. Add `@@index([categorySlug])` to the model.
- This will allow MongoDB to use the index for category queries, making them as fast as possible.

---

**Summary:**
- Your schema is now valid and optimized for MongoDB/Prisma infinite scroll and filtering.
- For even better performance on category filtering, consider denormalizing and indexing `categorySlug`. 