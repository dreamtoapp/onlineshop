# 🚨 Emergency Memory Leak & High Memory Usage Action Plan (Next.js/Node.js)

## 1. Immediate Actions
- [ ] **Restart server** to restore service if memory threshold is hit.
- [ ] **Enable monitoring** (Datadog, Grafana, Vercel/host logs) for memory, CPU, and restarts.
- [ ] **Check logs** for errors, OOM, or slow queries.
- [ ] **Notify team** and escalate if repeated crashes.

## 2. Deep Codebase Audit (Findings)
- [x] **Pagination everywhere:** All product/order/category queries use pagination (`findMany` with `skip`/`take`), preventing large dataset loads.
- [x] **Infinite scroll:** Product lists use SWR Infinite or custom hooks for lazy loading.
- [x] **No unbounded queries:** No evidence of `findMany` without `take`/`limit`.
- [x] **Debounce/throttle:** Used for search, scroll, and input handlers to avoid excessive requests.
- [x] **Component cleanup:** Most hooks/components clean up timers, listeners, and observers in `useEffect` cleanup.
- [ ] **Remove all debug logs:** Ensure no `console.log` in production (see `.cursor/rules/cleanup.yaml`).
- [ ] **Audit for unused/legacy code:** Remove dead code, unused files, and legacy scripts (see `Important_CLEANUP_ACTION_PLAN.md`).

## 3. Best Practices (Official + Codebase)
- [ ] **Profile memory:** Use `node --inspect` and Chrome DevTools for heap snapshots. Run `next build --experimental-debug-memory-usage` for build memory analysis.
- [ ] **Optimize dependencies:** Remove unused/large dependencies. Use bundle analyzer.
- [ ] **Enable Webpack memory optimizations:**
  - In `next.config.js`:
    ```js
    experimental: { webpackMemoryOptimizations: true }
    ```
- [ ] **Limit static analysis in CI:**
  - In `next.config.js`:
    ```js
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    ```
- [ ] **Disable source maps in production:**
  - In `next.config.js`:
    ```js
    productionBrowserSourceMaps: false,
    experimental: { serverSourceMaps: false },
    ```
- [ ] **Close resources:** Always close DB/file connections in server actions.
- [ ] **Use memoization:** Memoize expensive React components and hooks.
- [ ] **Virtualize large lists:** Use `react-window` or similar for very large lists.
- [ ] **Cache frequently accessed data:** Use Redis or unstable_cache for hot data.
- [ ] **Monitor for memory leaks:** Regularly check for increasing memory usage and GC activity.

## 4. Debugging & Recovery
- [ ] **Record heap profile:**
  - `node --heap-prof node_modules/next/dist/bin/next build`
  - Analyze `.heapprofile` in Chrome DevTools.
- [ ] **Analyze heap snapshot:**
  - Run with `NODE_OPTIONS=--inspect` and connect DevTools.
- [ ] **Check for unclosed listeners/timers:** Ensure all `useEffect` cleanups are present.
- [ ] **Check for global variables:** Avoid long-lived objects outside request scope.
- [ ] **Update Next.js/Node.js:** Use latest stable versions for memory fixes.

## 5. Long-Term Prevention
- [ ] **Automate monitoring/alerts** for memory, CPU, and restarts.
- [ ] **Document all fixes and findings.**
- [ ] **Regularly audit codebase** for best practices and dead code.
- [ ] **Test with load/stress tools** before each release.

---

## References
- [Next.js Memory Usage Guide](https://nextjs.org/docs/app/building-your-application/optimizing/memory-usage)
- [Node.js Memory Debugging](https://nodejs.org/en/learn/diagnostics/memory)
- [Memory Leak Prevention in Next.js (Medium)](https://medium.com/@nextjs101/memory-leak-prevention-in-next-js-47b414907a43)

---

**If memory issues persist after following this plan, escalate to senior engineering and consider professional support.** 

---

## 📋 Deep Codebase Audit Report (Memory Leaks & Production Stability)

### 1. Pagination & Infinite Scroll
- ✅ All product, order, and category queries use pagination (`findMany` with `skip`/`take` or `limit`).
- ✅ Infinite scroll is implemented using SWR Infinite or custom hooks for product lists.
- ✅ No evidence of unbounded queries (no `findMany` without `take`/`limit`).
- ✅ Debounce/throttle is used for search, scroll, and input handlers.

### 2. Component & Hook Cleanup
- ✅ Most React components and hooks clean up timers, listeners, and observers in `useEffect` cleanup functions.
- 🔍 Recommendation: Audit all custom hooks and components for missing cleanups, especially for event listeners and intervals.

### 3. Debug Logs & Dead Code
- ⚠️ Some `console.log` and debug logs may remain (see `.cursor/rules/cleanup.yaml`).
- ⚠️ Unused/legacy files and dead code identified in `Important_CLEANUP_ACTION_PLAN.md`.
- 🔍 Recommendation: Remove all debug logs and dead code before production deploys.

### 4. Global Variables & Resource Management
- ✅ No critical global variables or long-lived objects found outside request scope in main business logic.
- 🔍 Recommendation: Double-check server actions for unclosed DB/file handles.

### 5. Memoization, Virtualization, Caching
- ✅ Memoization is used for expensive React components and hooks (e.g., `useMemo`, `React.memo`).
- ✅ Virtualization is recommended for very large lists (consider `react-window` for future scaling).
- ✅ Caching is used for frequently accessed data (unstable_cache, SWR, wishlist cache).
- 🔍 Recommendation: Audit for additional caching opportunities (e.g., Redis for hot data).

### 6. Next.js/Node.js Config & Best Practices
- ⚠️ Ensure `experimental.webpackMemoryOptimizations: true` in `next.config.js` for lower memory usage.
- ⚠️ Disable source maps in production for lower build memory usage.
- ⚠️ Limit static analysis in CI to avoid OOM during builds.
- 🔍 Recommendation: Regularly update Next.js/Node.js to latest stable versions for memory fixes.

### 7. Monitoring & Prevention
- ⚠️ Monitoring and alerting for memory/CPU/restarts should be enabled in production.
- 🔍 Recommendation: Automate regular audits and document all findings/fixes.

---

**Summary:**
- The codebase follows most best practices for memory safety and production stability.
- Remaining risks: debug logs, dead code, and config optimizations.
- Follow the checklist above and the emergency plan for ongoing safety.

--- 