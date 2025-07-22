# Assigned Orders Route Migration Plan

## Rationale
- The current implementation uses tabs to switch between 'Pending' and 'Assigned to Drivers' orders within the same page/component.
- This approach mixes logic and UI, making it harder to maintain, test, and link directly to each status.
- The new plan is to remove the tabs and create a dedicated route/page for each status, improving clarity, navigation, and code separation.

## Important Note: Pending Orders Page Remains Unchanged
- The current pending orders page and its route (`/dashboard/management-orders/status/pending`) will **not** be affected by this migration.
- Only the tab logic will be removed.
- All pending orders functionality, analytics, and UI will remain as-is and accessible at the same route.
- No changes will be made to unrelated code or features.

## Final Plan & Steps

### 1. Remove Tab Logic
- Delete `TabsWrapper.tsx` and all tab-related code/props from `PendingOrdersView.tsx` and `pending/page.tsx`.
- Remove the `tab` URL parameter and all conditional rendering based on it.

### 2. Create Assigned Orders Route
- Add a new folder: `app/dashboard/management-orders/status/assigned/`.
- Create `page.tsx` for assigned orders, copying the structure from the pending page but filtering for `OrderStatus.ASSIGNED` only.
- **Do not move shared components.**
- **Follow the folder rule:**
  - UI components go in `components/`
  - Server actions/business logic go in `actions/`
  - Utility functions/hooks go in `helpers/`
- If a component is needed in both routes, copy it to the correct folder or create a shared version in the appropriate directory.

### 3. Update Orders Menu
- In the dashboard navigation/menu (under الطلبات), add a direct link to `/dashboard/management-orders/status/assigned`.
- Remove any tab logic from the UI.

### 4. Test Thoroughly
- Each route should show only the correct orders (pending or assigned).
- Navigation between routes should work with no errors.
- No regressions or broken links.
- All analytics/badges should reflect the correct counts for each status.

### 5. Security & Robustness
- Ensure no sensitive data is exposed in either view.
- Handle loading and error states gracefully.
- Validate user permissions if required.

### 6. Review Checklist
- [ ] Tabs and tab logic fully removed
- [ ] Dedicated assigned orders route exists and works
- [ ] Orders menu updated with new link
- [ ] No errors or regressions
- [ ] All analytics and counts correct
- [ ] Code is clean, maintainable, and secure
- [ ] Folder rule strictly followed for all components and logic

---

**This plan ensures a clean, maintainable, and user-friendly separation of order statuses, with zero errors and robust navigation.**

> Please review and discuss before implementation. Further adjustments can be made as needed. 