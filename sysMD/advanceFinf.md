# 🕵️ CURSOR DEEP FILE USAGE INVESTIGATOR

## 🎯 Objective
Perform a **complete deep search** to find *every* place a target file is used in the codebase — **directly or indirectly**.

**Covers**:
- ✅ Direct imports
- ✅ Indirect imports (via re-exports, index/barrel files)
- ✅ Dynamic imports
- ✅ CommonJS requires
- ✅ Path aliases
- ✅ Config/metadata references
- ✅ Test/mocks/stories
- ✅ Comments & documentation mentions

---

## 📋 Master Checklist

> **Before starting**: Ask me for:
> - **Exact file path** (relative to project root)
> - **Known path aliases** (e.g., `@/utils/file`)

### Phase 1 – Setup
- [ ] Confirm file path with user
- [ ] Identify path aliases
- [ ] Prepare search patterns for:
  - [ ] Exact path
  - [ ] Filename only
  - [ ] Path alias
  - [ ] Dynamic import string
  - [ ] CommonJS require string

---

### Phase 2 – Code Search

#### **Direct Imports**
- [ ] Search for `import ... from '<path>'`
- [ ] Search for `import * as ... from '<path>'`
- [ ] Search for named imports from file

#### **Indirect Imports**
- [ ] Search for re-exports (`export * from`)
- [ ] Search index/barrel files that import it
- [ ] Trace dependency chains for indirect usage

#### **Dynamic/Runtime Usage**
- [ ] Search for `import('<path>')`
- [ ] Search for `require('<path>')`
- [ ] Search for template literal imports `` import(`${...}`) ``

---

### Phase 3 – Non-Code References
- [ ] Search config files (`tsconfig.json`, `next.config.js`, `webpack.config.js`, etc.)
- [ ] Search `package.json` scripts/fields
- [ ] Search `.env` or environment variable references
- [ ] Search YAML/JSON configs
- [ ] Search comments, JSDoc, documentation mentions

---

### Phase 4 – Testing & Stories
- [ ] Search in `*.test.*`, `*.spec.*`, `*.stories.*`
- [ ] Search mocks in `__mocks__` folders
- [ ] Search test utilities/setup files

---

### Phase 5 – Final Report
- [ ] Group findings by category:
  - **Direct Imports**
  - **Indirect Imports**
  - **Dynamic/Runtime Usage**
  - **Config/Metadata References**
  - **Other Mentions**
- [ ] For each finding, include:
  - File path
  - Line number
  - Code snippet/context
  - Usage type
- [ ] Ensure checklist is fully marked ✅ before returning results

---

## ✅ Success Criteria
- 100% of references found
- Results grouped & labeled
- No false negatives
- All checklist items completed before final output
