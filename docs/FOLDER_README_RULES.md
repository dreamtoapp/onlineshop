## Folder README rules and template

### Purpose
Use this guide to standardize README.md files inside feature folders. It ensures every folder documents its files, usage, and deletion safety consistently across the repo.

### Standard subfolders
- `components/`: UI-only components. No business logic, no data fetching.
- `actions/`: Server actions and business logic. Server-only code; can use DB, auth, and revalidation.
- `helpers/`: Utilities, pure functions, shared hooks. Avoid DB calls unless clearly utility-level.

### Placement rules
- Colocate by feature: inside any feature folder, you may have your own `components/`, `actions/`, and `helpers/`.
- Shared code: if used widely across features, place in top-level `components/`, `actions/`, or `helpers/`.
- Each of these folders should include a `README.md` following the template below.

### Documentation requirements (what each README must include)
1) Directory overview: one subsection per file with these fields:
   - Exports
   - Purpose
   - Runtime (Client/Server)
   - Depends on (modules, env vars)
   - Used by (direct import paths)
   - DB models (if any)
   - SAFE TO DELETE: YES or NO

2) Cross-flows (optional): summarize how files work together across the feature.

3) Usage audit (direct vs indirect):
   - Direct imports: exact files importing this file
   - Indirect usage: flows that trigger it (e.g., API routes posting to actions)

4) Final deletion flags: recap SAFE TO DELETE: YES/NO for fast review.

### SAFE TO DELETE criteria
- Mark as YES only if ALL are true:
  - No direct imports found anywhere in the repo.
  - No indirect runtime usage (e.g., invoked via API route or dynamic import) after a careful scan.
  - No references in config, cron, or environment-dependent execution.
- Otherwise mark as NO.
- Treat deletions as risky. Prefer archiving/moving to `archive/` first.

### Naming and imports
- File naming: match the surrounding folder’s convention (don’t introduce a new style).
- Imports: prefer `@/` absolute paths; fall back to relative paths only when necessary.
- Server-only code must avoid importing client-only modules.

### Template (copy/paste)

```
## <folder> directory overview

### <folder>/<fileA>.ts
- **Exports**: <exportA>, <exportB>
- **Purpose**: <short purpose>
- **Runtime**: Client | Server
- **Depends on**: <packages, env vars>
- **Used by**: <relative import paths>
- **DB models**: <if any>
- **SAFE TO DELETE**: YES | NO

### <folder>/<fileB>.tsx
- **Exports**: <exports>
- **Purpose**: <short purpose>
- **Runtime**: Client | Server
- **Depends on**: <deps>
- **Used by**: <paths>
- **DB models**: <models>
- **SAFE TO DELETE**: YES | NO

## Cross-flows
- <brief description of how files interact>

## Usage audit (direct vs indirect)

- `<folder>/<fileA>.ts`
  - **Direct imports**: <paths>
  - **Indirect usage**: <description or none>

- `<folder>/<fileB>.tsx`
  - **Direct imports**: <paths>
  - **Indirect usage**: <description or none>

## Final deletion flags (based on deep scan)
- `<folder>/<fileA>.ts` → SAFE TO DELETE: YES | NO
- `<folder>/<fileB>.tsx` → SAFE TO DELETE: YES | NO
```

### Workflow to update a folder README
1) Run a deep search for direct imports and symbol usages.
2) Validate indirect usages (API routes, dynamic imports, environment triggers).
3) Update each file section and the final deletion flags.
4) If marking SAFE TO DELETE: YES, move to `archive/` first; don’t hard-delete without review.


