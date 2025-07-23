# Driver Trip Activation Flow — Complete Plan

## 0. Pre-Implementation: Code Review & Refactor
- Review the current driver area code for tracking logic.
- Remove or refactor any existing tracking logic that does not align with this plan and the business rules in driver-trip-management-logic.md.
- Prepare the codebase for the new, unified flow described below.

## 1. Home Page Load (Driver View)
- On page load, check for each assigned order:
  - **If order status is `ASSIGNED`:**
    - Show rocket icon (start trip button).
  - **If order status is `IN_TRANSIT`:**
    - Check if an `ActiveTrip` record exists for this order/driver:
      - **If exists:**
        - Show active trip UI (tracking, stop/cancel options).
      - **If not:**
        - Show trip detail card with a **confirmation button** to start tracking.
  - **If order status is `DELIVERED` or `CANCELED`:**
    - Do not show trip actions (show as completed/canceled).

## 2. Start Trip Flow
- When driver clicks the rocket icon on an `ASSIGNED` order:
  - Set order status to `IN_TRANSIT` (if not already).
  - Show trip detail card with a **confirmation button** (not yet tracking).

## 3. Final Confirmation (Start Tracking)
- When driver clicks the confirmation button:
  - Check if an `ActiveTrip` record already exists for this order/driver.
    - If exists: show error, do not create duplicate.
    - If not: create `ActiveTrip` record (tracking starts).

## 4. Active Trip State
- If order status is `IN_TRANSIT` **and** there is an `ActiveTrip` record:
  - Show active trip UI (tracking, stop/cancel options).
  - Driver can:
    - Stop (complete) the trip (sets status to `DELIVERED`, removes `ActiveTrip` record).
    - Cancel the trip (sets status to `CANCELED`, removes `ActiveTrip` record).

## 5. Business Rules
- Only one active trip per driver at a time.
- Tracking only starts after final confirmation (not just status change).
- No duplicate `ActiveTrip` records for the same order/driver.
- UI always reflects the real backend state (status + ActiveTrip record).

---
**This plan covers all checks, states, and transitions for the driver trip activation flow.** 