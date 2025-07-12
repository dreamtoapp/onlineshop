# ✅ Checkout Button Enablement: Action Plan

## 1. Account Activation
- Only allow checkout if the user's account is activated.
- Check: `user.isOtp === true`
- If not activated, show a clear message and disable the button.

## 2. Address Book Location
- Only allow checkout if the selected address has both `latitude` and `longitude`.
- Check: `selectedAddress.latitude && selectedAddress.longitude`
- If not, show a warning and disable the button.

## 3. Terms Acceptance
- Only allow checkout if the terms checkbox is checked.
- Check: `termsAccepted === true`
- If not, show a tooltip or message and disable the button.

---

## Implementation Steps

1. **In CheckoutClient:**
   - Track `selectedAddress` (not just ID).
   - Track `termsAccepted` (already done).
   - Read `user.isOtp` for activation status.

2. **In PlaceOrderButton:**
   - Compute `isValid` as:
     ```js
     const isValid =
       user.isOtp === true &&
       selectedAddress &&
       selectedAddress.latitude &&
       selectedAddress.longitude &&
       termsAccepted;
     ```
   - Only enable the button if `isValid` is true.
   - Show specific info/warning for each unmet condition.

3. **UI Feedback:**
   - If account not activated: show "يرجى تفعيل الحساب أولاً"
   - If address missing location: show "يرجى تحديد موقع العنوان"
   - If terms not accepted: show "يجب الموافقة على الشروط والأحكام"
   - Show these as tooltips, alerts, or under the button.

4. **Testing:**
   - Test all combinations (inactive account, missing location, unchecked terms, etc.)
   - Ensure button is only enabled when all 3 conditions are met.

---

## Example: isValid Logic

```js
const isValid =
  user.isOtp === true &&
  selectedAddress &&
  selectedAddress.latitude &&
  selectedAddress.longitude &&
  termsAccepted;
```

---

## Next Steps

1. Refactor state in CheckoutClient to track selectedAddress object.
2. Update PlaceOrderButton to receive user, selectedAddress, and termsAccepted.
3. Implement the new isValid logic and UI feedback.
4. Test all edge cases. 