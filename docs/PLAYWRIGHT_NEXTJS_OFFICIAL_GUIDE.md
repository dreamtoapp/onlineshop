# 🎯 Playwright + Next.js Official Integration Guide

## 📚 **Official Documentation References**

### **1. Official Playwright Next.js Guide**
- **Source**: https://playwright.dev/docs/nextjs
- **Key Points**: Next.js specific configurations and best practices

### **2. Official Next.js Testing Guide**
- **Source**: https://nextjs.org/docs/testing
- **Key Points**: Next.js testing strategies and recommendations

## 🚀 **Official Recommended Setup**

### **A. Playwright Configuration for Next.js**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
  },
});
```

### **B. Next.js Specific Optimizations**

```typescript
// playwright.config.ts
export default defineConfig({
  // ... other config
  
  use: {
    baseURL: 'http://localhost:3000',
    
    // Next.js specific timeouts
    navigationTimeout: 30000,
    actionTimeout: 10000,
    
    // Handle Next.js loading states
    waitForLoadState: 'networkidle',
  },
  
  // Optimize for Next.js development server
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    
    // Wait for Next.js to be ready
    stdout: 'Ready in',
    stderr: 'Error',
  },
  
  // Retry failed tests (common with Next.js dev server)
  retries: process.env.CI ? 2 : 1,
  
  // Single worker for stability with Next.js
  workers: process.env.CI ? 1 : 1,
});
```

## 🎯 **Official Testing Patterns**

### **A. Component Testing (Recommended)**

```typescript
// tests/components/Button.spec.tsx
import { test, expect } from '@playwright/test';

test('Button component', async ({ mount }) => {
  const component = await mount(`
    <button data-testid="my-button">
      Click me
    </button>
  `);
  
  await expect(component.getByTestId('my-button')).toBeVisible();
  await component.getByTestId('my-button').click();
});
```

### **B. Page Testing (Your Current Approach)**

```typescript
// tests/e2e/shopping/cart.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page
    await page.goto('/');
    
    // Wait for Next.js to be ready
    await page.waitForLoadState('domcontentloaded');
  });

  test('should add item to cart', async ({ page }) => {
    // Use data-testid for reliable selectors
    const addToCartButton = page.getByTestId('add-to-cart-button');
    await addToCartButton.click();
    
    // Wait for cart update
    await expect(page.getByTestId('cart-count')).toHaveText('1');
  });
});
```

### **C. API Testing**

```typescript
// tests/api/products.spec.ts
import { test, expect } from '@playwright/test';

test('API: Get products', async ({ request }) => {
  const response = await request.get('/api/products-grid?page=1&pageSize=8');
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  expect(data.products).toBeDefined();
});
```

## 🔧 **Official Performance Optimizations**

### **A. Parallel Testing**

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4, // More workers for faster execution
  
  // Use different ports for parallel tests
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:3001', // Different port
      },
    },
  ],
});
```

### **B. Test Isolation**

```typescript
// tests/e2e/shopping/cart.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing state
    await page.context().clearCookies();
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    // Clean up after each test
    await page.context().clearCookies();
  });
});
```

## 🎨 **Official Selector Best Practices**

### **A. Use Data Attributes (Recommended)**

```typescript
// In your React components
<button data-testid="add-to-cart-button">
  أضف إلى السلة
</button>

// In your tests
const addToCartButton = page.getByTestId('add-to-cart-button');
await addToCartButton.click();
```

### **B. Use Role-Based Selectors**

```typescript
// More reliable than text-based selectors
const addToCartButton = page.getByRole('button', { name: /أضف إلى السلة/i });
await addToCartButton.click();
```

### **C. Use Locator Patterns**

```typescript
// Combine multiple selectors for reliability
const addToCartButton = page
  .locator('button')
  .filter({ hasText: /أضف إلى السلة|Add to Cart/i })
  .first();
```

## 🚀 **Official Development Workflow**

### **A. Development Server Management**

```typescript
// playwright.config.ts
export default defineConfig({
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    
    // Wait for specific Next.js output
    stdout: 'Ready in',
  },
});
```

### **B. Production Testing**

```typescript
// playwright.config.ts
export default defineConfig({
  webServer: process.env.NODE_ENV === 'production' ? {
    command: 'npm run build && npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000, // 3 minutes for build
  } : undefined,
});
```

## 📊 **Official Performance Monitoring**

### **A. Test Performance Metrics**

```typescript
// tests/performance.spec.ts
import { test, expect } from '@playwright/test';

test('Page load performance', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  const loadTime = Date.now() - startTime;
  
  // Assert performance requirements
  expect(loadTime).toBeLessThan(5000); // 5 seconds max
});
```

### **B. Lighthouse Integration**

```typescript
// tests/lighthouse.spec.ts
import { test, expect } from '@playwright/test';

test('Lighthouse audit', async ({ page }) => {
  await page.goto('/');
  
  const lighthouse = await page.evaluate(() => {
    // Run Lighthouse audit
    return window.lighthouse;
  });
  
  expect(lighthouse.performance).toBeGreaterThan(0.8);
});
```

## 🎯 **Your Current Issues & Solutions**

### **Problem 1: Slow Development Server**
**Official Solution**: Use production build for testing
```bash
# Build and test with production server
npm run build
npm start
# Then run tests
npx playwright test
```

### **Problem 2: Arabic Selectors**
**Official Solution**: Use data-testid attributes
```typescript
// In components
<button data-testid="add-to-cart-arabic">
  أضف إلى السلة
</button>

// In tests
await page.getByTestId('add-to-cart-arabic').click();
```

### **Problem 3: Timeout Issues**
**Official Solution**: Optimize timeouts and waiting
```typescript
test.beforeEach(async ({ page }) => {
  // Use faster load state
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded'); // Faster than networkidle
});
```

## 🚀 **Recommended Implementation**

### **Step 1: Update playwright.config.ts**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Disable for stability
  retries: 1,
  workers: 1, // Single worker for stability
  
  use: {
    baseURL: 'http://localhost:3000',
    navigationTimeout: 60000, // 1 minute
    actionTimeout: 30000, // 30 seconds
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
    stdout: 'Ready in',
  },
});
```

### **Step 2: Add Data Test IDs**
```typescript
// In your components
<button data-testid="add-to-cart-button">
  أضف إلى السلة
</button>

<button data-testid="cart-icon">
  السلة
</button>
```

### **Step 3: Update Tests**
```typescript
// tests/e2e/shopping/cart.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should add item to cart', async ({ page }) => {
    const addToCartButton = page.getByTestId('add-to-cart-button');
    await addToCartButton.click();
    
    await expect(page.getByTestId('cart-count')).toHaveText('1');
  });
});
```

This follows the official Playwright + Next.js best practices! 🎯 