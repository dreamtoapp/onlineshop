import { defineConfig, devices } from '@playwright/test';

/**
 * Development config - only runs Chrome for faster testing
 * Use this during development: pnpm run test:e2e:dev
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // No retries in development
  retries: 0,
  
  // Use more workers for faster execution
  workers: 2,
  
  // Reporter to use
  reporter: 'html',
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Slower actions for development (easier to follow)
    actionTimeout: 10000,
  },

  // Configure projects for development - only Chrome
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: true, // Don't restart if already running
  },
}); 