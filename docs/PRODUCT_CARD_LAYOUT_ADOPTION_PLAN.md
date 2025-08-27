## ProductCard Layout Adoption — Management Products

### Scope
- Apply 60/40 card layout (square media + content) and 2-column mobile grid to `/dashboard/management-products` without changing functionality.

### Files
- `app/dashboard/management-products/components/ProductCard.tsx`
- `app/dashboard/management-products/page.tsx`
- Reference only: `app/(e-comm)/(home-page-sections)/product/cards/ProductCardMedia.tsx`

### Layout Changes
- Card: rounded-2xl, subtle shadow; keep existing theme tokens and classes.
- Media: wrap image area in `div.aspect-square w-full` (top section, ~60% visual weight).
- Content: `min-h-[160px] p-4 flex flex-col gap-3` (bottom section, ~40%).
- Actions: keep in footer; ensure tap targets ≥44px; preserve tooltips and links.
- Badges: retain published/stock badges; position over media without layout shift.

### Grid Updates
- In listing grid: `grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`.
- Ensure cards are fluid (avoid fixed `max-w` that breaks 2-col mobile).

### Behavior To Preserve
- All links (view/edit/analytics/gallery), delete flow, and `AddImage` behavior.
- RTL layout, existing color tokens, pagination, and empty states.

### Acceptance Criteria
- Mobile shows 2 cards per row; images are perfectly square; content area stable.
- No layout shifts; buttons ≥44px; badges readable; RTL correct.
- Filters, pagination, and server actions unchanged.

### Risks & Mitigations
- CLS from media: enforce `aspect-square` wrapper; avoid reflow.
- Text overflow: use `line-clamp-2` and truncation where applicable.
- Regression: do not change component props or data contracts.

### Out of Scope
- Dependency changes, global style refactors, analytics wiring.

### Rollback
- Changes isolated to the two files; revert by restoring prior classNames/structure.


