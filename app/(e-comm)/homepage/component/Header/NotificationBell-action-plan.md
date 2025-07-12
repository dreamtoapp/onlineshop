# Action Plan: Refactor NotificationBell to Server Component

## Goal
- Make NotificationBell a server component.
- On click, navigate to `/notifications`.
- Show unread notification count.
- Show warning if user is not opt-in or address is missing lat/lng.

## Steps

1. **Convert to Server Component**
   - Remove all React hooks and client-only logic.
   - Accept `userId` as a required prop.

2. **Fetch Data on Server**
   - Fetch unread notification count for the user.
   - Fetch user profile to check `opt` status.
   - Fetch user's default address and check for `lat` and `lng`.

3. **Render**
   - Render a `<Link href="/notifications">` wrapping the bell icon.
   - Show unread count badge if count > 0.
   - If not opt-in or address missing lat/lng, show a warning badge or tooltip.

4. **Props**
   - `userId: string` (required)

5. **No Client Interactivity**
   - No modals, popovers, or client hooks.

6. **Testing**
   - Test with user who has unread notifications, is not opt-in, and/or missing address lat/lng.

## Example Usage

```tsx
<NotificationBell userId={user.id} />
```

## API/DB Endpoints Needed

- `GET /api/user/{userId}/notifications/unread-count`
- `GET /api/user/{userId}/profile`
- `GET /api/user/{userId}/address/default`

## Notes

- `/notifications` is the route for notification details.
- All logic is server-side for performance and SSR. 