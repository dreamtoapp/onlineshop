# Driver Home Page IN_TRANSIT Refactor — Action Plan

## Goal
Refactor app/driver/page.tsx to:
- Show all orders for the driver with status IN_TRANSIT.
- If more than one IN_TRANSIT order exists for the driver:
  - Show all cards, but **disable all normal actions** (deliver, start tracking, etc.).
  - Enable only a **'Revert to ASSIGNED'** button on each card to allow the driver to resolve the error.
  - Show a clear warning message at the top: "يوجد أكثر من طلب جاري التوصيل. يرجى إرجاع الطلبات الزائدة إلى قائمة التعيين."
  - Once only one IN_TRANSIT order remains, re-enable normal trip actions for that order.
- For each order:
  - Check if an ActiveTrip record exists for that order/driver.
  - **Case 1:** If order is IN_TRANSIT but not in ActiveTrip:
    - Show a confirmation UI/button for the driver to start tracking (final confirmation).
    - Disable all other trip actions (deliver, cancel, etc.).
    - On confirmation, create the ActiveTrip record and start tracking.
  - **Case 2:** If order is IN_TRANSIT and in ActiveTrip:
    - Show full trip actions (tracking, deliver/cancel, etc.), all actions enabled.

## Steps
1. Fetch all orders for the driver from the Order table where status is IN_TRANSIT.
2. If more than one IN_TRANSIT order exists:
   - Render all cards with actions disabled except 'Revert to ASSIGNED'.
   - Allow the driver to revert orders until only one remains.
   - Show a prominent warning message at the top of the page.
3. For the single remaining IN_TRANSIT order (if any):
   - Query the ActiveTrip table for a matching record.
   - Render the appropriate UI based on whether ActiveTrip exists:
     - **If not in ActiveTrip:** show confirmation to start tracking, disable other actions.
     - **If in ActiveTrip:** show full trip actions (tracking, deliver/cancel, etc.).
4. If no IN_TRANSIT orders exist, show the empty state card/message.
5. Ensure all disabled actions are visually grayed out and the 'Revert to ASSIGNED' button is prominent.
6. Test all states: no IN_TRANSIT orders, multiple IN_TRANSIT orders, IN_TRANSIT with/without ActiveTrip, and tracking start.

---
**Review and confirm this plan before implementation.** 