import { useEffect, useState } from 'react';

/**
 * usePerformanceModeAutoDetect
 * Auto-detects if performanceMode should be enabled for animated backgrounds.
 * - Enables performance mode if:
 *   - hardwareConcurrency <= 4 (low CPU)
 *   - deviceMemory <= 2 (low RAM, if supported)
 *   - prefers-reduced-motion is set
 * Returns true if performance mode should be enabled.
 */
export function usePerformanceModeAutoDetect(): boolean {
  const [performanceMode, setPerformanceMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const deviceMemory = (navigator as any).deviceMemory;
    const lowMemory = typeof deviceMemory === 'number' && deviceMemory <= 2;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (lowCPU || lowMemory || prefersReducedMotion) {
      setPerformanceMode(true);
    }
  }, []);

  return performanceMode;
} 