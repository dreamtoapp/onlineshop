# 🗂️ Category Dropdown Action Plan

## Goal
Make the category field in the search form a dropdown list populated from existing backend categories, not a free text input.

---

## 1. Backend
- Ensure `/api/categories` returns all categories with at least: `id`, `name`, `slug`.
- No changes needed if endpoint already works (see `app/api/categories/route.ts`).
- If you want to filter by language, use the `getCategories` action in `app/(e-comm)/homepage/actions/getCategories.ts`.

---

## 2. Frontend
- Refactor the search form:
  - Replace the category text input with a dropdown (`<select>` or custom component).
  - On mount, fetch categories from `/api/categories` (client-side fetch or SWR).
  - Populate the dropdown with the fetched categories (show name, use id/slug as value).
  - Show a loading state while fetching.
  - Show a fallback message if fetch fails.

---

## 3. Fallback (Optional)
- If the API fails, use static categories from `utils/fashionData/categories.ts` as a fallback.
- Consider showing a warning if using fallback data.

---

## 4. UX
- Always show the dropdown, even if empty (with a disabled state or message).
- Make the field required or allow clearing (as needed).

---

## 5. Testing
- Test with real categories in DB.
- Test with no categories (empty state).
- Test with API failure (fallback).

---

## References
- API: `app/api/categories/route.ts`
- Fetcher: `app/(e-comm)/homepage/actions/getCategories.ts`
- Static fallback: `utils/fashionData/categories.ts` 