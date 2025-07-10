// Fix for ESM: Use dynamic import for 'web-vitals' to ensure correct loading in Next.js 15
// Fix for web-vitals v5: use onFCP instead of onFID (onFID was removed)
export async function reportWebVitals(onReport: (metric: any) => void) {
  const mod = await import('web-vitals');
  mod.onCLS(onReport);
  mod.onFCP(onReport); // Use onFCP instead of onFID
  mod.onLCP(onReport);
  mod.onINP(onReport);
  mod.onTTFB(onReport);
}
