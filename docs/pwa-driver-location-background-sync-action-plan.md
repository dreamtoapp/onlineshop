# PWA Driver Location Background Sync – Action Plan

## Goal
Ensure that when a driver starts a trip, their **latest location** is reliably sent to the backend every 5 minutes, even if the PWA is minimized, in the background, or the device is locked. Only the most recent location per active trip is needed (no location history). This must work using Background Sync and Service Workers, with fallback for unsupported browsers.

---

## 1. **IndexedDB Location Storage (Latest Only)**
- Implement a small IndexedDB helper (e.g., `location-latest.js` in `/utils/`):
  - Store only the most recent unsent location per active trip (overwrite any previous unsent location for that trip).
  - Provide methods: `setLatestLocation`, `getLatestLocation`, `removeLatestLocation`.

## 2. **Client Location Update Logic**
- On each location update (every 5 minutes):
  - Try to send the location to the backend immediately.
  - If sending fails (offline, minimized, or fetch error):
    - Save/overwrite the latest location for the trip in IndexedDB.
    - Register a Background Sync event with the Service Worker:
      ```js
      navigator.serviceWorker.ready.then(reg => reg.sync.register('sync-location'));
      ```
- If Background Sync is not supported:
  - Show a manual retry button in the UI.
  - Optionally, attempt to resend the latest unsent location when the app is next active.

## 3. **Service Worker: Sync Event Handler**
- In `push-sw.js` (or a new SW file):
  - Listen for the `sync` event:
    ```js
    self.addEventListener('sync', event => {
      if (event.tag === 'sync-location') {
        event.waitUntil(sendLatestLocationToBackend());
      }
    });
    ```
  - `sendLatestLocationToBackend()`:
    - Read the latest unsent location for each active trip from IndexedDB.
    - POST it to the backend API (update the `activeTrip` table).
    - On success, remove the sent location from IndexedDB.
    - On failure, keep it for the next sync attempt.
    - Implement retry logic (e.g., exponential backoff or capped retries).

## 4. **Backend Endpoint**
- Ensure `/api/driver/location-update` can accept and update the latest location for the active trip (already present).

## 5. **Testing & Fallbacks**
- Test on Android/Chrome (Background Sync supported).
- Test fallback/manual retry on iOS/Safari (Background Sync not supported).
- Use DevTools to simulate offline/online and background sync events.

## 6. **Optional Enhancements**
- Add a UI indicator for unsent latest location and manual retry.
- Add analytics/logging for failed/successful syncs.

---

## **Summary Table**
| Step | Component         | Status/Action Needed                |
|------|-------------------|-------------------------------------|
| 1    | IndexedDB Helper  | Store only latest location/trip     |
| 2    | Client Logic      | Update to use latest-only logic     |
| 3    | Service Worker    | Sync only latest location/trip      |
| 4    | Backend           | Confirm endpoint works              |
| 5    | Fallbacks         | Manual retry for unsupported cases  |

---

## **References**
- [MDN: Background Sync Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)
- [Service Worker Basics](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
- [Example: Zeepalm Blog](https://www.zeepalm.com/blog/background-sync-in-pwas-service-worker-guide) 