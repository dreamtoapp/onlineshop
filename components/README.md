## components/ directory overview

### components/AddImage.tsx
- **Exports**: `AddImage` (default)
- **Purpose**: Client component to upload an image to `/api/images` with progress and preview; supports Cloudinary via server API
- **Runtime**: Client
- **Depends on**: `next/image`, `/api/images`
- **Used by**: Dashboard forms/components for image uploads (various)
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/app-dialog.tsx
- **Exports**: `AppDialog` (default)
- **Purpose**: Simplified dialog wrapper with header/footer slots
- **Runtime**: Client
- **Depends on**: `@/components/ui/dialog`, `@/components/ui/badge`
- **Used by**: General UI dialogs
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/BackToTopButton.tsx
- **Exports**: `BackToTopButton` (default)
- **Purpose**: Floating scroll-to-top button
- **Runtime**: Client
- **Depends on**: DOM APIs
- **Used by**: Any page wanting quick scroll UX
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/DynamicForm.tsx
- **Exports**: `DynamicForm` (default)
- **Purpose**: Render form inputs dynamically from a fields config
- **Runtime**: Client
- **Depends on**: `@/components/ui/{input,textarea,select,label}`
- **Used by**: Forms that need dynamic fields
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/FilterAlert.tsx
- **Exports**: `FilterAlert` (default)
- **Purpose**: Sticky filter summary bar with clear action
- **Runtime**: Client
- **Depends on**: `next/navigation`, `@/components/ui/button`
- **Used by**: Product listing/search pages
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/form-error.tsx
- **Exports**: `FormError` (default)
- **Purpose**: Inline form error banner
- **Runtime**: Client/Server
- **Depends on**: none
- **Used by**: Forms
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/GoogleMapsLink.tsx
- **Exports**: `GoogleMapsLink` (default)
- **Purpose**: Open coordinates in Google Maps in new tab
- **Runtime**: Client
- **Depends on**: `@/components/ui/button`
- **Used by**: Address/location views
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/icons/Icon.tsx
- **Exports**: `Icon`, `IconSize`, `IconVariant`
- **Purpose**: Central icon component with cva variants, lucide mapping
- **Runtime**: Client/Server
- **Depends on**: `lucide-react`, `class-variance-authority`, `@/lib/utils`
- **Used by**: Many UI components
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/InfoTooltip.tsx
- **Exports**: `InfoTooltip` (default)
- **Purpose**: WAI-ARIA tip with optional custom trigger
- **Runtime**: Client
- **Depends on**: `@/components/ui/tooltip`, `@/components/ui/button`
- **Used by**: Various UI tooltips
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/link/index.tsx
- **Exports**: `Link` (default)
- **Purpose**: Prefetch-on-hover wrapper over Next.js Link per project rule
- **Runtime**: Client
- **Depends on**: `next/link`
- **Used by**: App-wide links
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/NotificationBellClient.tsx
- **Exports**: `NotificationBellClient` (default)
- **Purpose**: Client bell with unread count and periodic refresh
- **Runtime**: Client
- **Depends on**: `@/hooks/useNotificationCounter`
- **Used by**: Header/navigation
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/seo/*
- AdvancedAnalyticsReport, PerformanceClient, WebVitalsChart, WebVitalsCollector
- **Purpose**: SEO/Performance dashboard client components
- **Runtime**: Client
- **Depends on**: project UI, analytics actions
- **Used by**: Dashboard SEO pages
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/ui/*
- Shadcn-based primitives (accordion, alert, alert-dialog, avatar, button, card, dialog, drawer, dropdown, input, label, popover, progress, radio-group, scroll-area, select, separator, sheet, skeleton, tabs, textarea, tooltip, user-avatar, etc.)
- **Purpose**: Reusable UI primitives for the app
- **Runtime**: Client/Server depending on file
- **Depends on**: `@/lib/utils`, `radix-ui`, `lucide-react`
- **Used by**: App-wide
- **DB models**: none
- **SAFE TO DELETE**: NO

### components/WhatsappShareButton.tsx
- **Exports**: `WhatsappShareButton` (default)
- **Purpose**: Share message to WhatsApp via wa.me
- **Runtime**: Client
- **Depends on**: `@/components/ui/button`
- **Used by**: Marketing/share UIs
- **DB models**: none
- **SAFE TO DELETE**: NO

## Cross-flows
- Icons and utils power many UI primitives.
- Notification bell integrates with hooks and API count.

## Usage audit (direct vs indirect)
- Direct imports are widespread; primitives and icons are core dependencies across the UI.

## Final deletion flags (based on deep scan)
- All listed components → SAFE TO DELETE: NO


