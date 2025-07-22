# Driver Area Refactor: Actionable TODOs

> **🚨 STRICT LIVE APP RULES (MANDATORY) 🚨**
>
> - The app is live with 1500+ active users. Every update is high risk.
> - **NO unrelated code changes.** Only touch code directly related to the driver refactor.
> - **ZERO tolerance for errors or crashes.** All changes must be tested and verified before deployment.
> - **Do NOT refactor, optimize, or "improve" code outside the scope of this plan.**
> - **If unsure, STOP and ask for clarification before making any change.**
> - All code must be reviewed and tested in a staging environment before going live.
>
> **This rule is for both AI and human developers. Violating it can cause major business risk.**

---

## **Task Description: Driver Area Refactor**

### **Business Goal**
Refactor the driver area of the web app to support a real-world, stable, and scalable multi-order delivery workflow. The goal is to ensure that drivers can:
- See all assigned (not yet delivered/canceled) orders after login.
- Start a trip for one order at a time (enforcing only one active delivery per driver).
- Send real-time notifications (web-push and Pusher) to both admin and client when starting, delivering, or canceling an order.
- Track and update their location only for the active order.
- Provide a reason when canceling an order, with notifications sent to both admin and client.
- Repeat the process for all assigned orders until all are delivered or canceled.
- All changes must be safe for a live environment with 1500+ active users.

### **Main Workflow (Detailed Explanation)**

1. **Login**
   - Driver logs in using the main app’s authentication (NextAuth, not a custom driver login).
   - After login, the app checks the user’s role:
     - If the user is a driver, they are redirected to `/driver`.
     - Session data (`user.id`, `user.name`, `user.image`) is loaded and used for all driver-specific actions and personalization.
   - Security: Only authenticated drivers can access the driver dashboard and actions.

2. **See All Assigned Orders**
   - On the `/driver` dashboard, the driver sees a summary and navigation.
   - When viewing assigned orders (`/driver/showdata?status=ASSIGNED&driverId=...`):
     - The backend fetches all orders assigned to the driver that are not yet delivered or canceled.
     - Each order is shown as a card with:
       - Order number, customer name, address label, notes.
       - Action buttons: Start Trip, Call, WhatsApp, Map, Cancel, View Details.
     - The list is mobile-first, minimal, and easy to use, with large touch targets and clear feedback.

3. **Start Trip (One at a Time)**
   - Driver selects an order and clicks “Start Trip”:
     - Validation: Only one order can be “in transit” (active) at a time for each driver.
       - If another trip is already active, “Start Trip” is disabled for all other orders.
     - Action: Clicking “Start Trip”:
       - Updates the order status to `IN_TRANSIT` in the backend.
       - Begins location tracking for this order only (periodic geolocation updates sent to backend).
       - Sends real-time notifications (Pusher/web-push) to both admin and client: “Order is on the way.”
     - UI: The active trip is shown clearly at the top; other “Start Trip” buttons are disabled.

4. **Deliver Order**
   - Driver marks the active order as “Delivered”:
     - Action: Clicking “Deliver”:
       - Updates the order status to `DELIVERED` in the backend.
       - Stops location tracking for this order.
       - Sends notifications to admin and client: “Order delivered.”
     - UI: The order is removed from the active trip section and from the assigned list.
     - Next: The driver can now start a trip for another assigned order.

5. **Cancel Order**
   - Driver can cancel the active order at any time:
     - Action: Clicking “Cancel”:
       - Prompts the driver to provide a cancellation reason (input field required).
       - Updates the order status to `CANCELED` in the backend and saves the reason.
       - Stops location tracking for this order.
       - Sends notifications to admin and client: “Order canceled” (includes the reason).
     - UI: The order is removed from the active trip section and from the assigned list.
     - Next: The driver can now start a trip for another assigned order.

6. **Repeat**
   - The driver repeats the process for all remaining assigned orders:
     - For each new assigned order, the driver can start a trip, deliver, or cancel.
     - The UI always enforces only one active trip at a time.
     - The process continues until all assigned orders are either delivered or canceled.

**Additional Details:**
- Contact & Navigation: Each order card provides quick actions to call the customer, open WhatsApp, or view the address on a map.
- View Details: Each card can expand to show full order details for clarity or debugging.
- Notifications: All major actions (start, deliver, cancel) trigger real-time notifications to both admin and client.
- Location Tracking: Only the active order receives location updates; tracking stops when the order is delivered or canceled.
- Error Handling: All actions are validated in the backend to prevent invalid transitions (e.g., starting multiple trips).
- UI/UX: All flows are designed to be mobile-first, minimal, and robust for non-tech-savvy drivers.

### **Files Affected (Based on Codebase Study)**

#### **Backend (app/driver/actions/)**
- `app/driver/actions/getActiveTrip.ts` (fetch active trip)
- `app/driver/actions/getOrderByStatus.ts` (fetch orders by status)
- `app/driver/actions/getOrderCount.ts` (fetch order counts)
- `app/driver/actions/startTrip.ts` (start trip logic, location update)
- `app/driver/actions/trackDriver.ts` (location update logic)
- `app/driver/actions/cancelOrder.ts` (cancel order logic)

#### **Frontend (app/driver/)**
- `app/driver/page.tsx` (main driver dashboard, entry point)
- `app/driver/components/` (all driver UI components: DriverHeader, ActiveTrip, StartTrip, etc.)
- `app/driver/showdata/page.tsx` (order list by status)

#### **Shared/Other**
- `prisma/schema.prisma` (OrderInWay, possibly Order, cancellation reason)
- `app/(e-comm)/api/driver/location` (if exists, or new endpoint for location updates)
- Notification logic (Pusher/web-push integration, possibly in helpers or utils)

_Note: Folder structure is now modular, clean, and matches workspace rules. All driver logic is under app/driver/ with clear separation for components, actions, and order lists. Old app/driver/driver/ structure is removed._

---

## **Driver Area: Current Logic, Flow, and Actions (as implemented)**

### **1. Authentication & Entry**
- Drivers log in via the main app using NextAuth (no custom driver login logic).
- After login, if the user is a driver, they are redirected to `/driver`.
- Session data (`user.id`, `user.name`, `user.image`) is used for all driver-specific actions and personalization.

### **2. Layout & Navigation**
- All driver pages use a shared layout (`app/driver/layout.tsx`) with:
  - **Header:** Shows driver avatar (or initials), name, and logout (icon only), styled for mobile/Material Design.
  - **Footer:** Fixed mobile tab bar with buttons for "Assigned", "Delivered", "Canceled", "Home", and "Analytics". Each tab shows the count of orders for that status.
  - Main content is padded to avoid overlap with header/footer.

### **3. Main Dashboard (`/driver`)**
- Renders the main driver dashboard (from `app/driver/driver/page.tsx`).
- Shows summary, active trip (if any), and navigation to order lists.

### **4. Assigned Orders Page (`/driver/showdata?status=ASSIGNED&driverId=...`)**
- Server component fetches all assigned orders and the current active trip for the driver.
- Renders a list of `<AssignedOrderCard />` (Client Component) for each assigned order.
- Each card displays:
  - Order number, customer name, address label, notes.
  - Action buttons: Start Trip (if no active trip), Call, WhatsApp, Map, Cancel Order, View Details (expand/collapse).
  - All actions are mobile-friendly, with large touch targets and clear feedback.

### **5. Order Actions & Flows**
- **Start Trip:**
  - Only one order can be "in transit" (active) at a time per driver.
  - Clicking "Start Trip" updates the order status to `IN_TRANSIT` and begins location tracking for that order only.
  - Notifications (Pusher/web-push) are sent to admin and client when a trip starts.
- **Deliver Order:**
  - Driver can mark the active order as delivered, which updates status to `DELIVERED` and stops location tracking.
  - Notifications are sent to admin and client.
- **Cancel Order:**
  - Driver can cancel the active order at any time, must provide a cancellation reason.
  - Status is updated to `CANCELED`, reason is saved, and location tracking stops.
  - Notifications are sent to admin and client with the reason.
- **Contact & Navigation:**
  - Each order card provides quick actions to call the customer, open WhatsApp, or view the address on a map.
- **View Details:**
  - Each card can expand to show full order details (JSON view for debugging/clarity).

### **6. Backend Actions**
- All backend logic is in `app/driver/actions/`:
  - `getActiveTrip.ts`: Fetches the current active trip for the driver.
  - `getOrderByStatus.ts`: Fetches orders by status for the driver.
  - `getOrderCount.ts`: Fetches counts of orders by status.
  - `startTrip.ts`: Handles starting a trip and updating status/location.
  - `trackDriver.ts`: Handles periodic location updates for the active order.
  - `cancelOrder.ts`: Handles order cancellation, reason saving, and notifications.

### **7. UI/UX Principles**
- All UI is mobile-first, minimal, and distraction-free, following Material Design and workspace rules.
- Large touch targets, clear icons, and high-contrast colors are used throughout.
- All feedback (success, error, loading) is clear and immediate.
- No unrelated code is touched; all changes are scoped and safe for a live environment.

### **8. Notifications**
- All major actions (start, deliver, cancel) trigger real-time notifications to both admin and client (via Pusher/web-push).
- When admin assigns a new order to a driver, the driver receives a notification.

### **9. Error Handling & Safety**
- All interactive logic (hooks, state) is in Client Components only.
- Server components only fetch and pass data.
- All actions are validated to prevent multiple active trips or invalid transitions.
- All changes are tested in staging before going live.

---

This document breaks down the driver area refactor into clear, step-by-step tasks. Follow these to ensure a stable, modern, and real-world driver workflow. Each step is designed to be easy to resume after a break.

---

## 1. **Schema & Backend Preparation**
- [x] **Remove `@unique` from `driverId` in `OrderInWay`** (done: updated schema, ran prisma db push, DB index updated)
- [ ] **Review/clean up location update endpoints** (ensure they update the correct order/driver and status).
- [ ] **Add/verify cancellation reason field** in order model if not present.
- [ ] **Ensure all status transitions (start, deliver, cancel) are atomic and validated.**
- [ ] **Add/verify notification triggers (Pusher/web-push) for all driver actions.**
- [ ] **When admin assigns a new order to a driver, the driver should receive a notification (Pusher/web-push).**

_Note: Schema updated and DB synced. Next: backend logic review/updates._

---

## 2. **Driver Login & Order List**
- [x] **Login refactor: /driver is now the main dashboard entry point after login.**
- [x] **Old login logic removed; all driver features accessible from /driver.**
- [ ] **On login, fetch all assigned (not delivered/canceled) orders for the driver.**
- [ ] **Display all orders in a clear, actionable list.**
- [ ] **Disable 'Start Trip' for all orders except one (enforce only one IN_TRANSIT at a time in UI and backend).**

_Note: Dashboard refactor complete. Next: backend logic and notification/cancellation enhancements._

---

## 3. **Start Trip Flow**
- [ ] **Allow driver to select an order and click 'Start Trip'.**
- [ ] **Update order status to `IN_TRANSIT` in backend.**
- [ ] **Start location tracking for this order only (periodic geolocation updates).**
- [ ] **Send notifications (Pusher/web-push) to admin and client: 'Order is on the way'.**
- [ ] **UI: Show active trip clearly, disable starting others until finished/canceled.**

---

## 4. **Deliver Order Flow**
- [ ] **Allow driver to mark the active order as 'Delivered'.**
- [ ] **Update order status to `DELIVERED` in backend.**
- [ ] **Stop location tracking for this order.**
- [ ] **Send notifications (Pusher/web-push) to admin and client: 'Order delivered'.**
- [ ] **UI: Remove from active, allow starting next order.**

---

## 5. **Cancel Order Flow**
- [ ] **Allow driver to cancel the active order at any time.**
- [ ] **Require a cancellation reason (input field).**
- [ ] **Update order status to `CANCELED` and save reason.**
- [ ] **Stop location tracking for this order.**
- [ ] **Send notifications (Pusher/web-push) to admin and client: 'Order canceled' with reason.**
- [ ] **UI: Remove from active, allow starting next order.**

---

## 6. **Location Tracking**
- [ ] **Ensure location updates are tied to the active order only.**
- [ ] **Store last known location (history optional).**
- [ ] **Handle geolocation errors gracefully (UI feedback).**

---

## 7. **UI/UX Improvements**
- [ ] **Make the order list and active trip UI clear and mobile-friendly.**
- [ ] **Show status, customer info, and actions for each order.**
- [ ] **Add clear feedback for all actions (toasts, loading states, errors).**
- [ ] **Test all flows: login, start, deliver, cancel, repeat.**

---

## 8. **Testing & QA**
- [ ] **Test with multiple orders per driver.**
- [ ] **Test all notification flows (admin/client).**
- [ ] **Test location tracking and error handling.**
- [ ] **Test edge cases (network loss, geolocation denied, etc.).**

---

## 9. **Docs & Handover**
- [ ] **Update this file with progress and notes.**
- [ ] **Document any new endpoints, events, or flows for the team.**

---

**When you return, start with the next unchecked item. If you need code samples or help with any step, just ask!** 