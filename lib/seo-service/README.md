## lib/seo-service directory overview

### lib/seo-service/getMetadata.ts
- **Exports**: `getPageMetadata`
- **Purpose**: Factory that returns a Next.js `generateMetadata` function which builds Metadata from DB SEO entries with localized alternates
- **Runtime**: Server
- **Depends on**: `@/lib/prisma`
- **Used by**: SEO-enabled pages that import it and assign `export const generateMetadata = getPageMetadata(...)`
- **DB models**: `globalSEO`
- **SAFE TO DELETE**: NO

## Cross-flows
- Generates OpenGraph and hreflang alternates by fetching localized SEO entries.

## Usage audit (direct vs indirect)
- Direct imports: none currently in repo snapshot; file is intended to be imported per-page.
- Indirect usage: none.

## Final deletion flags (based on deep scan)
- `lib/seo-service/getMetadata.ts` → SAFE TO DELETE: NO (kept as reusable utility for SEO-enabled routes)



















