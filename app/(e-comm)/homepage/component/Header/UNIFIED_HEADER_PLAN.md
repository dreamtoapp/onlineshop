# 🏗️ Unified Responsive Header Refactor Plan

## Goals
- Use a single header component for all devices.
- Ensure feature parity and consistent UX.
- Follow best practices from leading e-commerce sites.

---

## 1. Analysis: Current State

### DesktopHeader.tsx
- Full-featured, fixed, visually rich, desktop-only.
- Features: Logo, search (drawer), wishlist, cart, notifications, user menu.

### MobileHeaderSkeleton.tsx
- Minimal, sticky, mobile-only, skeleton loader.
- No real logic, just loading state.

### Gaps
- Two separate headers = more maintenance, inconsistent UX.
- No shared logic or adaptive layout.
- No skeleton/loader for desktop.

---

## 2. Industry Best Practices
- Single responsive header (media queries, breakpoints, conditional rendering).
- Core actions always accessible, layout adapts.
- Progressive disclosure: hide less-used features on mobile.
- Skeletons/loaders for both desktop and mobile.
- Accessibility: aria-labels, keyboard nav.
- Lazy-load non-critical features.

---

## 3. Action Plan

### 1. Design a Responsive Layout
- Use CSS (Tailwind, CSS modules, etc.) with breakpoints (`sm`, `md`, `lg`).
- Show/hide or rearrange elements based on screen size.
- Example: Hamburger menu on mobile, full nav on desktop.

### 2. Merge Logic & Props
- Create a single `Header` component with all needed props (user, logo, counts, etc.).
- Use conditional rendering for device-specific features.

### 3. Extract Skeleton/Loader
- Create a `HeaderSkeleton` subcomponent for both layouts.

### 4. Componentize Actions
- Wishlist, cart, notifications, user menu as modular subcomponents.
- Shared actions bar, conditional rendering for mobile/desktop.

### 5. Accessibility & Performance
- All buttons/menus accessible (aria-labels, keyboard nav).
- Lazy-load non-critical features (e.g., notifications dropdown).

### 6. Testing
- Test on all breakpoints/devices.
- Test with/without user, notifications, etc.

---

## Example Structure

```plaintext
components/
  Header/
    Header.tsx         # Main responsive header
    HeaderSkeleton.tsx # Loader for both mobile/desktop
    Logo.tsx
    SearchBar.tsx
    UserMenuTrigger.tsx
    NotificationBell.tsx
    WishlistIcon.tsx
    CartIcon.tsx
    ...
```

---

## References
- Amazon, Shopify, Zalando, Material UI AppBar

---

## 4. What Should Appear in the Unified Header?

> **Note:** 'Company info/links' are already in the footer, 'Language switcher' is handled in user preferences, and the hamburger menu already exists elsewhere, so they are omitted from the header.

### Desktop Header Elements
- Logo (left, always visible, clickable to home)
- Search bar (inline, always visible)
- Wishlist icon (in actions bar)
- Cart icon with badge (always visible)
- Notifications icon with badge (in actions bar)
- User menu/profile avatar (in actions bar)

### Mobile Header Elements
- Logo (center, always visible, clickable to home)
- Search (icon button, opens drawer/overlay)
- Cart icon with badge (always visible)
- Wishlist icon (if space allows, else in menu)
- Notifications icon (if space allows, else in menu)
- User menu/profile avatar (icon or in menu)

#### Best Practice Notes
- Keep core actions (cart, search, user) always accessible.
- Show badges for notifications and cart.
- Logo should always be visible and clickable.
- Keep header height minimal for mobile usability.
- Prioritize accessibility: all icons have aria-labels, keyboard nav.

---

## 5. Header Variations: Logged-in vs Guest

The header should adapt based on user authentication state. Below are the recommended differences:

### Desktop Header
- **Logged-in User:**
  - Logo (left)
  - Search bar
  - Wishlist icon
  - Cart icon with badge
  - Notifications icon with badge
  - User menu/profile avatar (shows account options, logout, etc.)
- **Guest:**
  - Logo (left)
  - Search bar
  - Wishlist icon (may prompt login)
  - Cart icon with badge
  - Notifications icon *(optional, usually hidden or replaced with login prompt)*
  - Login/Register button (instead of user menu/avatar)

### Mobile Header
- **Logged-in User:**
  - Logo (center)
  - Search (icon button)
  - Cart icon with badge
  - Wishlist icon (if space allows)
  - Notifications icon (if space allows)
  - User menu/profile avatar (or in menu)
- **Guest:**
  - Logo (center)
  - Search (icon button)
  - Cart icon with badge
  - Wishlist icon (if space allows, may prompt login)
  - Notifications icon *(optional, usually hidden or replaced with login prompt)*
  - Login/Register button (in menu or as icon)

#### Notes
- For guests, actions like wishlist and notifications can prompt login or show limited info.
- **Best practice:** Most e-commerce sites hide the notifications icon for guests, or show a login prompt if clicked.
- Login/Register should be prominent for guests, replaced by user menu/avatar for logged-in users.
- Keep the rest of the header layout consistent for both states for clarity and simplicity.

---

## Discussion: What do you want to show/hide?
- Which features are must-have for your users on mobile?
- Any custom actions or branding elements?
- Should notifications be always visible or only in menu on mobile?
- Do you want a persistent search bar on desktop?

> **Please review and add your preferences below.** 