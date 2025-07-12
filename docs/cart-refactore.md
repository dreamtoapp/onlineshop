# 🛒 Cart Synchronization & Refactor Plan

## Background

- **Current Issue:** Cart icon on homepage is slow (2–3s delay) because it fetches cart data from the server on every load.
- **localStorage** is fast but only works per browser/device. It does NOT sync across devices or browsers for logged-in users.
- **Industry Standard:** Big companies (Amazon, Walmart, etc.) use a hybrid approach: localStorage for instant feedback, server for cross-device sync.

---

## Best Practice: Hybrid Cart Model

### 1. Anonymous Users (Not Logged In)
- Cart is stored in `localStorage`.
- Fast, works across tabs (via `storage` event).
- On login, **merge local cart with server cart**.

### 2. Logged-In Users
- Cart is stored on the server (DB).
- On page load:
  - **Show cart count from localStorage instantly** (optimistic UI).
  - In the background, fetch server cart and update UI if different.
- On add/remove:
  - Update both localStorage and server (optimistic, then sync).
- On login from another device:
  - Cart is loaded from server (localStorage ignored unless merging).

### 3. Cross-Tab Sync
- Use `localStorage` + `storage` event for instant updates across tabs.

### 4. Cross-Device Sync
- Only possible for logged-in users (server is source of truth).

---

## Proposed Solution for Our Codebase

### A. Cart Data Flow

1. **On Page Load:**
   - Read cart count from `localStorage` and show it immediately.
   - If user is logged in, fetch cart from server in the background and update UI if needed.

2. **On Add/Remove Item:**
   - Update `localStorage` and UI instantly.
   - If logged in, also send update to server (async).

3. **On Login:**
   - Merge localStorage cart with server cart (resolve duplicates, sum quantities, etc.).
   - After merge, clear localStorage cart and use server cart as source of truth.

4. **On Logout:**
   - Optionally, move server cart to localStorage for guest session.

### B. Implementation Steps

1. **Refactor Cart Context/Provider:**
   - Use a React context to provide cart state and actions.
   - On mount, initialize from `localStorage` for instant UI.
   - If logged in, fetch server cart and update context.

2. **Sync Logic:**
   - On cart change, update both localStorage and (if logged in) server.
   - Listen for `storage` events to sync across tabs.

3. **Merge Logic:**
   - On login, merge local and server carts (sum quantities, resolve duplicates).

4. **Server API:**
   - Provide endpoints for cart CRUD (add, remove, update, fetch).
   - On login, provide a merge endpoint or logic.

---

## Comparison Table

| Approach         | Fast UI | Cross-Tab | Cross-Device | Works Offline | Complexity |
|------------------|:-------:|:---------:|:------------:|:-------------:|:----------:|
| localStorage     |   ✅    |    ✅     |      ❌      |      ✅       |     Low    |
| Server-only      |   ❌    |    ✅     |      ✅      |      ❌       |    Medium  |
| Hybrid (Best)    |   ✅    |    ✅     |      ✅      |      ✅*      |    High    |

\* Works offline for local changes, syncs when online.

---

## References

- [Sync shopping carts across devices and platforms? (Medium)](https://medium.com/@jjmayank98/sync-shopping-carts-across-devices-and-platforms-53c62e4a9344)
- [React's useSyncExternalStore in Practice — Cross-Tab Shopping Cart (DEV.to)](https://dev.to/blamsa0mine/reacts-usesyncexternalstore-in-practice-building-a-cross-tab-shopping-cart-574f)

---

## Discussion Points

- Do we want to prioritize instant UI (localStorage) or always-accurate server data?
- How should cart merging work on login? (sum quantities, prefer server, etc.)
- Should we support offline cart usage for guests?
- Any privacy/security concerns with localStorage?

---

## Next Steps

1. Review and discuss this proposal.
2. Decide on merge logic and UX for login/logout.
3. Plan phased implementation (context refactor, sync logic, server API).

---

*Please review and add your comments or suggestions before we finalize and start coding!* 