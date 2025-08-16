# 🔍 CURSOR DEEP FILE USAGE SEARCH

## 🎯 Goal
Find **all occurrences** of a given file being used anywhere in the codebase, whether **directly or indirectly**.

The search must cover:
- ✅ Direct imports (`import ... from '...'`)
- ✅ Named imports
- ✅ Namespace imports (`import * as`)
- ✅ Dynamic imports (`import('...')`)
- ✅ CommonJS requires (`require('...')`)
- ✅ Barrel file re-exports (e.g., `index.ts` or `index.js`)
- ✅ Path aliases (`@/utils/file`)
- ✅ String-based references (e.g., in configs, tests, mocks, scripts)
- ✅ References in comments, JSDoc, or documentation
- ✅ Build or runtime configs referencing the file
- ✅ Environment variables or JSON that point to the file
- ✅ Tests, mocks, and stories that import it

---

## 🛠 Instructions for Cursor AI
1. **Ask for the exact file path** (relative to project root) from me before starting.
2. Search the entire repository for:
   - Exact path matches
   - Filename-only matches
   - Path alias matches
3. Identify **direct imports** of the file.
4. Identify **indirect imports**:
   - Check re-export files (`export * from './...'`)
   - Check index/barrel files
   - Trace through dependency chains
5. Include **dynamic usage** (via `import()`, `require()`, etc.).
6. Check for **non-code references**:
   - Config files (`next.config.js`, `tsconfig.json`, `package.json`, etc.)
   - JSON/YAML config
   - Test setup files
7. **Return results grouped as follows**:
   - **Direct Imports**
   - **Indirect Imports**
   - **Dynamic/Runtime Usage**
   - **Config/Metadata References**
   - **Other Mentions**
8. For each result:
   - Show file path
   - Show line number
   - Show matching code snippet
   - Indicate whether it’s direct or indirect usage

---

## 📦 Deliverable
A **complete list of all occurrences** of the file usage, including:
- File path
- Type of usage (Direct, Indirect, Dynamic, Config, Other)
- Code snippet or surrounding context

The search must be **exhaustive** and **precise** — no false negatives.
