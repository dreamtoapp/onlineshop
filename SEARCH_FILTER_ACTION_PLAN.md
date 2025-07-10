# 🔍 Search Filter Implementation & Clear Action Plan

## Goal
- Make the search form (name, description, price, category) actually filter the product results.
- Add a way to clear/reset the filter.

---

## 1. Backend
- Update the products API (e.g., `/api/products-grid` or similar) to accept query params for:
  - `name` (string, partial match)
  - `description` (string, partial match)
  - `price` (number, exact or range)
  - `category` (id or slug)
- In the API handler, use these params to filter the DB query (e.g., with Prisma `where` conditions).
- Ensure the API returns filtered results based on the provided params.
- Support empty params (return all products if no filter).

---

## 2. Frontend
- On form submit (Apply):
  - Fetch products from the products API, passing the filter values as query params.
  - Display the filtered results in the UI (e.g., product grid/list).
- Add a "Clear" button:
  - Resets all fields to empty/default.
  - Refetches all products (no filters).
- Disable the "Apply" button if all fields are empty (optional, for UX).
- Show loading and error states for the results.

---

## 3. UX
- Show a loading spinner while fetching filtered results.
- Show a message if no products match the filter.
- Keep the filter form visible above the results.
- Make the "Clear" button visible only if any filter is active.

---

## 4. Testing
- Test filtering by each field individually and in combination.
- Test clearing the filter.
- Test with no results, and with many results.

---

## References
- Products API: `/api/products-grid` (or your actual endpoint)
- SearchBar component (frontend) 