# 🚦 Driver Trip Start & Real-Time Tracking — Implementation Plan

## Goal
When the driver clicks "ابدأ رحلتك" (Start your trip), the app should:
- Capture the driver's current GPS location using the existing useGeolocation hook
- Start the trip in the backend with accurate coordinates
- No extra complexity or additional features beyond the core trip start and location capture

---

## Step-by-Step Checklist

### 1. Frontend: Integrate useGeolocation Hook
- [ ] Import and use the `useGeolocation` hook in `ActiveTrip.tsx` (or relevant component)
- [ ] Display geolocation status/loading/error to the driver (e.g., "جارٍ تحديد الموقع...", error messages)
- [ ] Disable the "ابدأ رحلتك" button while location is loading or if there is an error

### 2. Frontend: Start Trip Action
- [ ] When the driver clicks "ابدأ رحلتك":
    - [ ] Check that geolocation is available and not loading
    - [ ] If location is valid, call the `startTrip` server action with orderId, driverId, latitude, longitude
    - [ ] Handle and display any errors from the backend (e.g., trip already active, invalid IDs)
    - [ ] On success, update the UI to reflect that the trip has started (e.g., show trip-in-progress state)

### 3. Backend: Ensure startTrip Action Handles Coordinates
- [ ] Confirm that the `startTrip` action in `app/driver/actions/startTrip.ts` accepts and stores latitude/longitude
- [ ] Ensure it creates the `ActiveTrip` record with these coordinates
- [ ] Ensure it enforces business rules (one active trip per driver, order assignment, etc.)
- [ ] Ensure it sends notifications as required
- [ ] Do not add any extra logic or complexity beyond what is required for starting the trip and saving the location

### 4. DRY & Error Handling
- [ ] Use the `useGeolocation` hook for all geolocation logic (do not duplicate navigator.geolocation code)
- [ ] Handle all possible geolocation errors (permission denied, timeout, unavailable)
- [ ] Provide clear feedback to the driver for all error and loading states

### 5. Testing & Review
- [ ] Test on desktop and mobile browsers
- [ ] Test with location permission denied
- [ ] Test with slow/unstable GPS
- [ ] Confirm that the trip cannot be started without a valid location
- [ ] Confirm that the backend receives and stores the correct coordinates
- [ ] Confirm that the UI updates correctly after trip start

---

## 6. Periodic Location Updates (Frontend)
- [ ] After trip start, start a timer to fetch and send the driver’s location every X minutes (default: 5).
- [ ] Use the `useGeolocation` hook or similar to get the latest coordinates on each interval.
- [ ] Call a backend action (e.g., `updateDriverLocation`) to update the ActiveTrip record.
- [ ] Stop the timer when the trip ends or the component unmounts.

## 7. (Optional) Tracking Interval Configuration (Backend)
- [ ] Implement a Settings model to store the tracking interval (if not already present).
- [ ] Add an API/server action to fetch the interval for the frontend.
- [ ] Use the backend-configured interval in the frontend timer logic.

---

## Notes
- Periodic/background location updates are out of scope for this phase and will be planned separately.
- Keep the implementation as simple as possible: only start the trip and save the initial location. 

---

# 🚗 Driver Silent Background Tracking: Action Plan

## Goal
Enable 100% silent, background driver location updates using web-push and Service Workers, with **no UI or notification**, even when the browser is minimized or tab is closed (browser running).

---

## 1. **Driver Subscribes to Push**
- On trip start, ensure the driver’s browser is subscribed to push notifications (Push API).
- Store the push subscription in your backend (DB) linked to the driver.

## 2. **Backend Sends Silent Push**
- At your chosen interval (e.g., every 1 minute), your backend sends a push message to each active driver’s browser using the `web-push` library.
- The push payload should be minimal, e.g.:
  ```json
  { "type": "location-update", "orderId": "..." }
  ```
- **No notification content is needed.**

## 3. **Service Worker Handles Push (Silent Mode)**
- In `public/push-sw.js`, add a `self.addEventListener('push', ...)` handler.
- If the push type is `location-update`:
  - Use the Geolocation API to get the driver’s current location.
  - Send the new location to your backend (e.g., `/api/driver/location-update`), including `orderId`, `latitude`, `longitude`.
  - **Do NOT call `showNotification`**—no UI is shown to the driver.

  Example:
  ```js
  self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    if (data.type === 'location-update') {
      event.waitUntil(
        new Promise((resolve, reject) => {
          if (!('geolocation' in self.navigator)) return reject('Geolocation not supported');
          self.navigator.geolocation.getCurrentPosition(
            (pos) => {
              fetch('/api/driver/location-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: data.data?.orderId,
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                }),
              }).then(resolve).catch(reject);
            },
            reject,
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
          );
        })
      );
    }
    // No showNotification call = silent push
  });
  ```

## 4. **Backend Updates DB**
- The backend endpoint (`/api/driver/location-update`) receives the new coordinates.
- Updates the `ActiveTrip` record:
  - Sets new `latitude`, `longitude`
  - Increments `updateCount`
  - Updates `updatedAt`

## 5. **Testing**
- Start a trip as a driver and subscribe to push.
- Minimize or background the browser.
- Trigger a push from the backend.
- Confirm the DB is updated (no notification shown, no UI for the driver).

---

## **Key Points**
- No notification or UI is shown to the driver (silent push).
- Works even when browser is minimized or tab is closed (browser running).
- 100% native, no third-party scripts, no cron job required (just a backend process to send push).
- Fully compliant with official Push API and Service Worker docs.

---

**Ready to implement and test!** 