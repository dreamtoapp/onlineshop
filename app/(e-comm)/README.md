# E-Comm Layout.tsx Focused Checklist

This checklist is for `app/(e-comm)/layout.tsx`—the heart of your e-commerce app. Follow these best practices to ensure performance, maintainability, and a great user experience.

---

## 1. Data Fetching & Performance
- [ ] Use `Promise.all` for parallel async data fetching (user, notifications, wishlist, addresses).
- [ ] Add try/catch for all async calls; show fallback UI or error messages if something fails.
- [ ] Cache static/infrequently changing data (e.g., company info) using Next.js caching or SWR.
- [ ] Only fetch and pass the minimal data each component needs (avoid large objects).

## 2. Component Structure & Imports
- [ ] Use `next/dynamic` for heavy/device-specific components (e.g., DesktopHeader, MobileHeader) to enable code splitting.
- [ ] Keep the layout component itself under 100–150 lines; extract logic to helpers/hooks if it grows.
- [ ] Ensure all providers (Cart, Wishlist, Tooltip, etc.) are at the correct level and not duplicated.

## 3. UI Consistency & Accessibility
- [ ] Use only shared UI components from `components/ui/` for buttons, alerts, cards, etc.
- [ ] Use semantic Tailwind color tokens—never hardcoded hex values.
- [ ] Ensure all interactive elements are keyboard accessible and have proper aria labels.

## 4. Error Handling & User Feedback
- [ ] Show clear, user-friendly error messages for any failed data fetch.
- [ ] Use loading skeletons or spinners for async content.
- [ ] Use error boundaries for critical UI sections if possible.

## 5. Code Quality & Simplicity
- [ ] Keep functions short and focused (ideally <30 lines).
- [ ] Extract repeated or complex logic into helpers/hooks.
- [ ] Use TypeScript interfaces/types for all props and data.
- [ ] Avoid deep nesting in JSX—split into subcomponents if needed.

## 6. State & Context
- [ ] Use context providers only for truly global state (cart, wishlist, user).
- [ ] Avoid prop drilling; use context or hooks for shared state.

## 7. Mobile & Responsive
- [ ] Test layout on all screen sizes (desktop, tablet, mobile).
- [ ] Ensure touch targets are large enough and navigation is mobile-friendly.
- [ ] Use responsive classes and layouts everywhere.

## 8. Progressive Enhancement
- [ ] Ensure the layout and navigation work without JavaScript (where possible).
- [ ] Use CSS for animations and transitions for best performance.

---

**Tip:** Keep this checklist updated as your project evolves to maintain a high-quality, scalable e-commerce foundation. 