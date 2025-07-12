# 🛒 Place Order Button: Action Plan

## 1. Frontend: Collect All Required Data
- Create a single checkout form (or use context/state) to collect:
  - Full name (from user or editable field)
  - Phone (from user or editable field)
  - Selected address ID (from AddressBook)
  - Selected shift ID (from ShiftSelector)
  - Selected payment method (from PaymentMethodSelector)
  - Terms acceptance (from TermsDialog)
- Pass all these values to `PlaceOrderButton` (or manage in a parent component).

---

## 2. Frontend: Place Order Button
- Enable the button only if all required fields are filled and valid.
- On click: Call the `createDraftOrder` server action (already implemented in `orderActions.ts`).
- Show loading state while submitting.
- **On success: Redirect to `/happyorder?orderid=ORDER_ID` (not a generic confirmation page).**
- On error: Show validation errors or server error to the user.

---

## 3. Backend: Order Creation
- The backend logic in `orderActions.ts` is already robust:
  - Validates all fields with Zod.
  - Checks cart, user, address, shift, and payment method.
  - Creates the order and order items in Prisma.
  - Clears the cart and notifies admin.
- **No changes needed in Prisma schema.**

---

## 4. UX: InfoTooltip Improvements
- On mobile: Use a modal or bottom sheet instead of a hover tooltip.
- On desktop: Keep the tooltip on hover/click.
- Detect device or use a prop to switch between tooltip/modal.
- Message should be dynamic: If the button is disabled, show exactly what's missing (e.g., "يرجى اختيار عنوان التوصيل").

---

## 5. Remove "قريباً" Message
- Remove the "🚧 جاري تطوير نظام الطلبات - سيكون متاحاً قريباً" message.
- Only show actionable errors or confirmations.

---

## 6. Testing
- Test on both desktop and mobile.
- Test all error cases (missing info, backend error, etc.).
- Test successful order flow, including redirect to `/happyorder?orderid=ORDER_ID` and rating/clear cart features.

---

## Example: PlaceOrderButton Usage

```tsx
<PlaceOrderButton
  cart={cart}
  user={user}
  addressId={selectedAddressId}
  shiftId={selectedShiftId}
  paymentMethod={selectedPaymentMethod}
  termsAccepted={termsAccepted}
/>
```

---

## Next Steps
1. Refactor checkout page to collect all required fields in state/context.
2. Update PlaceOrderButton to use these values and call the server action.
3. On success, redirect to `/happyorder?orderid=ORDER_ID`.
4. Improve InfoTooltip for mobile/desktop.
5. Remove the old "قريباً" message.
6. Test the full flow. 