## components/icons directory overview

### components/icons/Icon.tsx
- **Exports**: `Icon`, `IconSize`, `IconVariant`
- **Purpose**: Central icon component wrapping `lucide-react` with `cva` variants for size, color, and animation. Includes a small legacy-name map.
- **Runtime**: Client/Server
- **Depends on**: `lucide-react`, `class-variance-authority`, `@/lib/utils`
- **Used by**: Many UI primitives and app components (e.g., `components/ui/*`, `NotificationBellClient`, `InfoTooltip`, `Sidebar`, etc.)
- **DB models**: none
- **SAFE TO DELETE**: NO

## Usage audit (direct vs indirect)
- Direct imports: widespread across UI components; see `components/ui/*` and shared components.
- Indirect usage: none.

## Final deletion flags (based on deep scan)
- `components/icons/Icon.tsx` → SAFE TO DELETE: NO



















