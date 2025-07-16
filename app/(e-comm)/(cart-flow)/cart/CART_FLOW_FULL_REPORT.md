# 🛒 Cart Flow: Full Codebase Audit & Coverage Report

## 1. Architecture Overview

- **Hybrid SSR/CSR:** Cart uses both server (for data integrity) and client (for instant UI) logic.
- **State Management:** Zustand store (`cartStore.ts`) for local state, server actions (`cartServerActions.ts`) for DB.
- **Optimistic UI:** All cart actions update UI instantly, then sync with server. Rollback on error.
- **User Types:** Supports both guest (cookie-based) and authenticated (DB-based) carts, with auto-merge on login.

---

## 2. Main Cart Actions & Where They Are Handled

| Action         | Local (Zustand)                | Server (DB/Prisma)                | UI Components / Triggers                |
|----------------|-------------------------------|------------------------------------|-----------------------------------------|
| Add item       | `addItem` in `cartStore.ts`   | `addItem` in `cartServerActions.ts`| `AddToCartButton`, `AddToCartModal`     |
| Increase qty   | `updateQuantity` in store     | `updateItemQuantity`/`updateItemQuantityByProduct` in server actions | `CartItemQuantityControls`, `CartDropdown` |
| Decrease qty   | `updateQuantity` in store     | `updateItemQuantity`/`updateItemQuantityByProduct` in server actions | `CartItemQuantityControls`, `CartDropdown` |
| Remove item    | `removeItem` in store         | `removeItem` in server actions     | `CartItemQuantityControls`, `CartDropdown` |
| Clear cart     | `clearCart` in store          | `clearCart` in server actions      | `CartDropdown`, Cart page dialog        |

---

## 3. File-by-File Coverage

### a. `cartStore.ts` (Zustand Store)
- **addItem(product, quantity):** Adds or increases quantity in local state.
- **updateQuantity(productId, delta):** Increases/decreases quantity, removes if qty=0.
- **removeItem(productId):** Removes item from local state.
- **clearCart():** Empties local cart.
- **setCart(cart):** Allows syncing state from server.
- **No API calls here** (per best practice).

### b. `cartServerActions.ts` (Server Actions)
- **addItem(productId, quantity):** Handles both guest and user carts, merges guest cart on login, updates DB.
- **updateItemQuantity(itemId, quantity):** Updates quantity, removes if qty <= 0.
- **removeItem(itemId):** Removes item, deletes cart if empty.
- **updateItemQuantityByProduct(productId, delta):** Updates by productId, used for optimistic UI.
- **clearCart():** Empties cart in DB.
- **mergeGuestCartOnLogin:** Merges guest cart into user cart on login.

### c. UI Components

- **`CartItemQuantityControls.tsx`:**
  - Handles +/–/input for quantity.
  - Optimistic update via Zustand, then server sync.
  - Rollback on error.
  - Remove button with confirmation and rollback.

- **`CartDropdown.tsx`:**
  - Shows cart preview.
  - Allows quick +/–/remove for each item.
  - Uses Zustand for instant update, then server sync.

- **`CartPageView.tsx`:**
  - Main cart page.
  - Fetches server cart for authenticated users.
  - Renders all items, summary, and checkout.
  - Handles empty cart, loading, and removal.

---

## 4. Edge Cases & Error Handling

- **Guest vs. Authenticated:** Guest cart is stored in cookies; on login, it merges with user cart in DB.
- **Optimistic UI:** All actions update UI first, then sync with server. If server fails, UI rolls back and user is notified.
- **Quantity Limits:** Quantity is validated (min 1, max 99) both client and server side.
- **Remove on Zero:** If quantity is set to 0, item is removed.
- **Clear Cart:** Confirmation dialog before clearing; works for both guest and user.
- **Empty Cart:** UI handles and displays empty state gracefully.
- **Error Toasts:** All errors (add, update, remove) show user-friendly toasts and roll back UI.

---

## 4.a. Action Plan: Merge Guest Cart on Login

### Purpose
Ensure that when a guest user logs in, their local (cookie-based) cart is merged with their authenticated (DB) cart, preserving all items and quantities.

### Steps
1. **Detect Guest Cart on Login:**
   - On user login, check for the presence of a `localCartId` cookie.
2. **Fetch Guest Cart:**
   - If the cookie exists, fetch the guest cart and its items from the database.
3. **Fetch/Create User Cart:**
   - Fetch the authenticated user's cart from the database. If it doesn't exist, create a new one.
4. **Merge Items:**
   - For each item in the guest cart:
     - If the product exists in the user cart, sum the quantities.
     - If not, add the product to the user cart with its quantity.
5. **Cleanup:**
   - Delete the guest cart from the database.
   - Clear the `localCartId` cookie.
6. **Sync State:**
   - Update the frontend state to reflect the merged cart.

### Code Reference
- **Function:** `mergeGuestCartOnLogin(guestCartId, userId)` in `cartServerActions.ts`
- **Trigger:** Called during the login flow if a guest cart is detected.

### Test Recommendations
- Add items to cart as a guest, then log in and verify all items are present in the user cart.
- Test merging with overlapping products (quantities should sum).
- Test merging with unique products (all should appear).
- Ensure guest cart is deleted and cookie is cleared after merge.
- Simulate errors (e.g., DB failure) and verify rollback or error handling.

### Best Practices
- Always perform merge in a transaction to ensure data integrity.
- Provide user feedback (toast or notification) after merge.
- Add E2E tests for this flow.

---

### 4.a.i. Merge Guest Cart on Login – Implementation Checklist

Use this checklist to ensure all technical and UX steps are covered when implementing or reviewing the guest cart merge on login feature:

#### Technical Steps
- [ ] Detect `localCartId` cookie on user login/registration.
- [ ] If cookie exists, fetch guest cart and its items from the database.
- [ ] Fetch or create the authenticated user's cart in the database.
- [ ] For each item in the guest cart:
    - [ ] If the product exists in the user cart, sum the quantities.
    - [ ] If not, add the product to the user cart with its quantity.
- [ ] Perform the merge in a single database transaction to ensure data integrity.
- [ ] Delete the guest cart from the database after successful merge.
- [ ] Clear the `localCartId` cookie from the user's browser.
- [ ] Update the frontend cart state to reflect the merged cart (if user is on the site during login).

#### UX Steps
- [ ] Show a confirmation message or toast to the user after a successful merge (e.g., "Your cart has been merged with your account.").
- [ ] Handle and display errors if the merge fails (e.g., DB error, network issue).
- [ ] Ensure the user can proceed to checkout seamlessly after merge.

#### Testing & Validation
- [ ] Test all study cases and edge scenarios (see section 4.b).
- [ ] Add E2E tests for guest-to-user cart merge, including error and rollback cases.
- [ ] Confirm that the `localCartId` cookie is always cleared after a successful merge.
- [ ] Confirm that no duplicate or orphaned carts remain in the database after merge.

---

## 4.b. Cart Merge Study Cases & Scenarios

This section covers all possible user flows and edge cases for cart merging, ensuring robust handling for every scenario.

### **Case 1: New Guest Adds to Cart, Registers Before Checkout**
- **Flow:**
  1. User visits site as a guest (no `localCartId` cookie).
  2. Adds items to cart (Zustand + new guest cart in DB, `localCartId` cookie set).
  3. Proceeds to checkout, is prompted to register/login.
  4. On registration/login:
     - System detects `localCartId` cookie.
     - Guest cart is merged into new user’s cart (created if not exists).
     - Guest cart is deleted, cookie cleared.
     - User continues checkout with merged cart.
- **Expected:** All items added as guest are present after registration.

### **Case 2: Existing User (Not Logged In) Adds to Cart, Then Logs In**
- **Flow:**
  1. User is registered but not logged in (no session, no user cart loaded).
  2. Adds items as guest (Zustand + guest cart in DB, `localCartId` cookie set).
  3. Logs in.
     - System detects `localCartId` cookie.
     - If user has a previous cart in DB:
       - Merge guest cart into user cart (quantities summed for duplicates).
     - If no previous user cart:
       - Guest cart becomes user cart.
     - Guest cart is deleted, cookie cleared.
- **Expected:**
  - If user had a previous cart, both carts are merged (no data loss).
  - If not, guest cart becomes user cart.

### **Case 3: User Already Logged In, Adds to Cart**
- **Flow:**
  1. User is logged in.
  2. Adds items to cart (directly updates user cart in DB, no guest cart or `localCartId` involved).
- **Expected:** Cart is always up-to-date in DB, no merge needed.

### **Case 4: Guest Adds to Cart on Multiple Devices, Then Registers**
- **Flow:**
  1. User adds items as guest on Device A (gets `localCartId` A).
  2. Adds items as guest on Device B (gets `localCartId` B).
  3. Registers/logs in on Device A:
     - Only Device A’s guest cart is merged into user cart.
  4. Registers/logs in on Device B:
     - Only Device B’s guest cart is merged into user cart.
- **Expected:** Each device’s guest cart is merged independently on login from that device.

### **Case 5: Guest Clears Cart Before Registering**
- **Flow:**
  1. Guest adds items, then clears cart (Zustand + guest cart in DB cleared).
  2. Registers/logs in.
     - No guest cart to merge; user cart is empty or as previously stored.
- **Expected:** No merge occurs, user cart is empty or as previously stored.

### **Case 6: Error During Merge**
- **Flow:**
  1. Guest logs in, merge process starts.
  2. Error occurs (e.g., DB failure).
- **Expected:**
  - Transaction is rolled back, no partial merge.
  - User is notified of the error.
  - Guest cart and cookie remain until successful merge.

### **Case 7: User Logs In, No Guest Cart Present**
- **Flow:**
  1. User logs in, but no `localCartId` cookie exists.
- **Expected:**
  - User cart is loaded from DB as usual.
  - No merge needed.

---

**Summary Table:**

| Scenario                                      | Guest Cart | User Cart | Merge Action                | Outcome                        |
|-----------------------------------------------|------------|-----------|-----------------------------|--------------------------------|
| New guest adds, registers                     | Yes        | No        | Guest cart becomes user cart| All items present              |
| Guest adds, user logs in (has old cart)       | Yes        | Yes       | Merge, sum quantities       | Both carts combined            |
| Logged-in user adds                          | No         | Yes       | N/A                        | User cart updated              |
| Guest on multiple devices, registers          | Yes (per device) | Yes   | Merge per device           | Each device’s cart merged      |
| Guest clears cart, then registers             | No         | No/Yes    | N/A                        | User cart empty or as before   |
| Error during merge                            | Yes        | Yes/No    | Rollback, notify user       | No data loss, retry possible   |
| User logs in, no guest cart                   | No         | Yes/No    | N/A                        | User cart loaded as normal     |

---

**Best Practice:**
- Always handle merge in a transaction.
- Always clear `localCartId` after successful merge.
- Always notify user of merge result or errors.
- Add E2E tests for all above scenarios.

---

## 5. Test Coverage Recommendations

- Add item (guest & user)
- Increase/decrease quantity (with min/max)
- Remove item (single, last item)
- Clear cart (confirmation, empty state)
- Merge guest cart on login
- Rollback on server error (simulate failure)
- UI disables controls during pending server sync

---

## 6. Diagram

```mermaid
flowchart TD
  SSR[CartPageView (SSR)] -->|fetches| Server[cartServerActions (Server)]
  SSR -->|renders| Client[CartItemQuantityControls, AddToCartModal, CartButtonWithBadge, CartDropdown]
  Client -->|state| Zustand[cartStore (Zustand)]
  Client -->|actions| Server
  Zustand -->|sync| Server
  Server -->|DB| Prisma[(Prisma/DB)]
```

---

## 7. Summary Table: All Cart Cases

| Case                        | Guest | Authenticated | UI Feedback | Server Sync | Rollback on Error |
|-----------------------------|-------|---------------|-------------|-------------|-------------------|
| Add new product             | ✅    | ✅            | ✅          | ✅          | ✅                |
| Increase quantity           | ✅    | ✅            | ✅          | ✅          | ✅                |
| Decrease quantity           | ✅    | ✅            | ✅          | ✅          | ✅                |
| Remove product              | ✅    | ✅            | ✅          | ✅          | ✅                |
| Remove last product         | ✅    | ✅            | ✅          | ✅          | ✅                |
| Clear cart                  | ✅    | ✅            | ✅          | ✅          | ✅                |
| Merge guest cart on login   | ✅    | ✅            | N/A         | ✅          | N/A               |
| Error during any action     | ✅    | ✅            | ✅ (toast)  | N/A         | ✅                |

---

## 8. Recommendations

- All best practices are followed: optimistic UI, rollback, no duplicate API calls, clear separation of concerns.
- For further robustness, add E2E tests for all above cases.
- Ensure all cart-related UI elements have `aria-label` for accessibility.

---

Let me know if you want to add more details or diagrams! 