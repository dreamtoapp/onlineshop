# 🛡️ CURSOR SAFE DEAD CODE & UNUSED COMPONENT REPORTER

## 🎯 Objective
Find and **verify** all unused files, components, functions, and extra DOM in the project.  
Produce a **100% verified Markdown report** for manual review.  
❌ No deletion — only safe, reviewable output.

---

## 📋 Process Checklist

> **Before starting**, confirm with the user:
> - **Project root path**
> - **Frameworks/libraries used** (e.g., Next.js, React, Prisma)
> - **Path aliases**
> - **Ignore list** (`node_modules`, `dist`, `build`, `.next`, etc.)

---

### Phase 1 – Identify Potential Unused Code
- [ ] Scan `/` and relevant directories.
- [ ] List files never directly imported anywhere.
- [ ] List unused React components.
- [ ] List unused exported functions/hooks/utils.
- [ ] Flag unreachable code (after `return`/`throw`).
- [ ] Flag redundant imports.
- [ ] Flag extraneous DOM (empty elements, redundant wrappers).

---

### Phase 2 – Deep Usage Verification for Each Candidate
For **each** candidate from Phase 1:

1. [ ] Search **direct imports**.
2. [ ] Search **indirect imports** (barrel files, re-exports).
3. [ ] Search **dynamic imports** (`import('...')`, `require('...')`).
4. [ ] Search **path aliases**.
5. [ ] Search in configs, JSON, `.env`, docs, tests, mocks.
6. [ ] If **any usage found**, mark as **KEEP ❗**.
7. [ ] If **no usage found anywhere**, mark as **UNUSED ✅**.

---

### Phase 3 – Markdown Report Output
- [ ] Create a file called **`dead_code_report.md`** at the project root.
- [ ] Structure:

  ```markdown
  # 🛡️ Verified Dead Code Report

  ## ✅ Unused (Safe to Remove)
  - `path/to/file.tsx` – Unused component (no references found)
  - `path/to/util.ts` – Unused helper function
  - `path/to/style.css` – Unused asset

  ## ❗ In Use – Keep
  - `path/to/file.ts` – Used indirectly via `index.ts`
  - `path/to/config.js` – Referenced in `package.json` scripts
