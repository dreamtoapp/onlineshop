import { cacheData } from './cache';

// Simple async function to test caching
async function add(...args: number[]) {
  return args.reduce((a, b) => a + b, 0);
}

// Wrap with cacheData using the new signature
export const cachedAdd = cacheData(
  (...args: any[]) => add(...args),
  ['add'],
  { revalidate: 60 }
);

// Usage example (can be run in a script or test)
async function test() {
  const result1 = await cachedAdd(2, 3);
  const result2 = await cachedAdd(2, 3);
  console.log('Result:', result1, result2); // Should both be 5, and the second call should be cached
}

test(); 