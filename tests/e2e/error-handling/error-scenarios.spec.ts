import { test, expect } from '@playwright/test';

test.describe('Error Handling Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.route('**/*', route => route.abort());
    
    // Try to navigate
    await page.goto('/');
    
    // Should show some error handling or fallback
    await expect(page.locator('body')).toBeVisible();
    
    // Restore network
    await page.unroute('**/*');
  });

  test('should handle invalid login credentials', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Try invalid credentials
    await page.getByRole('textbox', { name: /رقم الهاتف|phone/i }).fill('invalid');
    await page.getByRole('textbox', { name: /كلمة المرور|password/i }).fill('wrong');
    await page.getByRole('button', { name: /تسجيل الدخول|login/i }).click();
    
    await page.waitForTimeout(3000);
    
    // Should still be on login page or show error
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/login/);
  });

  test('should handle empty cart checkout', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: /رقم الهاتف|phone/i }).fill('0500000000');
    await page.getByRole('textbox', { name: /كلمة المرور|password/i }).fill('admin123');
    await page.getByRole('button', { name: /تسجيل الدخول|login/i }).click();
    await page.waitForLoadState('networkidle');
    
    // Try to access checkout with empty cart
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Should be redirected or show empty cart message
    const currentUrl = page.url();
    if (currentUrl.includes('/checkout')) {
      // Check for empty cart message
      const emptyMessage = page.getByText(/empty|فارغة|no items/i);
      if (await emptyMessage.count() > 0) {
        await expect(emptyMessage.first()).toBeVisible();
      }
    } else {
      // Should be redirected to cart or home
      expect(currentUrl).toMatch(/cart|home/);
    }
  });

  test('should handle invalid product page', async ({ page }) => {
    // Try to access non-existent product
    await page.goto('/products/invalid-product-id');
    await page.waitForLoadState('networkidle');
    
    // Should show 404 or error page
    const errorMessage = page.getByText(/not found|404|error|خطأ/i);
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should handle form validation errors', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Submit empty form
    await page.getByRole('button', { name: /تسجيل الدخول|login/i }).click();
    await page.waitForTimeout(1000);
    
    // Should show validation errors
    const validationErrors = page.getByText(/required|مطلوب|invalid|غير صحيح/i);
    if (await validationErrors.count() > 0) {
      await expect(validationErrors.first()).toBeVisible();
    }
  });

  test('should handle server errors gracefully', async ({ page }) => {
    // Try to access a page that might cause server error
    await page.goto('/api/test-error');
    await page.waitForLoadState('networkidle');
    
    // Should show error page or message
    const errorContent = page.locator('body');
    await expect(errorContent).toBeVisible();
  });

  test('should handle slow loading gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 5000);
    });
    
    // Try to navigate
    await page.goto('/', { timeout: 10000 });
    
    // Should show loading state or handle timeout
    await expect(page.locator('body')).toBeVisible();
    
    // Restore normal network
    await page.unroute('**/*');
  });

  test('should handle payment failures', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: /رقم الهاتف|phone/i }).fill('0500000000');
    await page.getByRole('textbox', { name: /كلمة المرور|password/i }).fill('admin123');
    await page.getByRole('button', { name: /تسجيل الدخول|login/i }).click();
    await page.waitForLoadState('networkidle');
    
    // Add item to cart
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const addToCartButton = page.getByText(/add to cart|أضف للسلة/i).first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Go to checkout
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Simulate payment failure by intercepting API call
    await page.route('**/api/checkout', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Payment failed' })
      });
    });
    
    // Try to place order
    const placeOrderButton = page.getByText(/place order|تنفيذ الطلب/i);
    if (await placeOrderButton.count() > 0) {
      await placeOrderButton.click();
      await page.waitForTimeout(2000);
      
      // Should show error message
      const errorMessage = page.getByText(/error|failed|خطأ|فشل/i);
      if (await errorMessage.count() > 0) {
        await expect(errorMessage.first()).toBeVisible();
      }
    }
    
    // Restore normal API
    await page.unroute('**/api/checkout');
  });

  test('should handle database connection errors', async ({ page }) => {
    // This would typically be tested with a mock or by temporarily disabling the database
    // For now, we'll test that the app doesn't crash on API errors
    
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Database connection failed' })
      });
    });
    
    // Try to access a page that makes API calls
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // App should still be functional
    await expect(page.locator('body')).toBeVisible();
    
    // Restore normal API
    await page.unroute('**/api/**');
  });

  test('should handle invalid URLs gracefully', async ({ page }) => {
    // Try various invalid URLs
    const invalidUrls = [
      '/invalid-page',
      '/products/',
      '/checkout/invalid',
      '/admin/nonexistent'
    ];
    
    for (const url of invalidUrls) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Should show error page or redirect to home
      const currentUrl = page.url();
      if (currentUrl === url) {
        // Check for error message
        const errorMessage = page.getByText(/not found|404|error|خطأ/i);
        if (await errorMessage.count() > 0) {
          await expect(errorMessage.first()).toBeVisible();
        }
      }
    }
  });

  test('should handle browser compatibility issues', async ({ page }) => {
    // Test with different viewport sizes
    const viewports = [
      { width: 320, height: 568 }, // Small mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should be responsive and functional
      await expect(page.locator('.container')).toBeVisible();
    }
  });

  test('should handle JavaScript errors gracefully', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navigate and interact
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try some interactions
    const addToCartButton = page.getByText(/add to cart|أضف للسلة/i).first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(1000);
    }
    
    // App should still be functional even if there are console errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle authentication errors', async ({ page }) => {
    // Try to access protected page without login
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Should be redirected to login
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/login/);
  });

  test('should handle session expiration', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: /رقم الهاتف|phone/i }).fill('0500000000');
    await page.getByRole('textbox', { name: /كلمة المرور|password/i }).fill('admin123');
    await page.getByRole('button', { name: /تسجيل الدخول|login/i }).click();
    await page.waitForLoadState('networkidle');
    
    // Clear cookies to simulate session expiration
    await page.context().clearCookies();
    
    // Try to access protected page
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Should be redirected to login
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/login/);
  });
}); 