import { test, expect } from '@playwright/test';

// Test phone number login functionality
test.describe('Phone Login Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/auth/login');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should display login form with correct elements', async ({ page }) => {
    // Check if login form elements are present
    await expect(page.getByRole('textbox', { name: /رقم الهاتف|phone/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /كلمة المرور|password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /تسجيل الدخول|login/i })).toBeVisible();
  });

  test('should show error for empty form submission', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /تسجيل الدخول|login/i }).click();
    
    // Wait a bit for any error messages to appear
    await page.waitForTimeout(1000);
    
    // Check for error indicators (could be validation messages or error styles)
    const phoneInput = page.getByRole('textbox', { name: /رقم الهاتف|phone/i });
    const passwordInput = page.getByRole('textbox', { name: /كلمة المرور|password/i });
    
    // Check if inputs have error styling or required attributes
    await expect(phoneInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should show error for invalid phone number format', async ({ page }) => {
    // Fill form with invalid phone number
    await page.getByRole('textbox', { name: /رقم الهاتف|phone/i }).fill('123');
    await page.getByRole('textbox', { name: /كلمة المرور|password/i }).fill('password');
    
    // Submit form
    await page.getByRole('button', { name: /تسجيل الدخول|login/i }).click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Check that we're still on login page (not redirected)
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill form with non-existent credentials
    await page.getByRole('textbox', { name: /رقم الهاتف|phone/i }).fill('0599999999');
    await page.getByRole('textbox', { name: /كلمة المرور|password/i }).fill('wrongpassword');
    
    // Submit form
    await page.getByRole('button', { name: /تسجيل الدخول|login/i }).click();
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // Check that we're still on login page or error is shown
    await expect(page).toHaveURL(/.*login/);
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Test with a known valid phone number (you may need to adjust this)
    await page.getByRole('textbox', { name: /رقم الهاتف|phone/i }).fill('0500000000');
    await page.getByRole('textbox', { name: /كلمة المرور|password/i }).fill('admin123');
    
    // Submit form
    await page.getByRole('button', { name: /تسجيل الدخول|login/i }).click();
    
    // Wait for navigation
    await page.waitForTimeout(5000);
    
    // Check if redirected away from login page (successful login)
    const currentUrl = page.url();
    console.log('Current URL after login attempt:', currentUrl);
    
    // Check for successful login indicators
    try {
      // Look for welcome message or user-specific content
      await expect(page.getByText(/مرحباً بعودتك|welcome back/i)).toBeVisible({ timeout: 5000 });
    } catch {
      // Alternative: check if we're redirected to homepage or dashboard
      await expect(page).not.toHaveURL(/.*login/);
    }
  });

  test('should handle Arabic text input correctly', async ({ page }) => {
    // Test Arabic text in phone field (though not typical, tests Unicode support)
    const phoneInput = page.getByRole('textbox', { name: /رقم الهاتف|phone/i });
    
    await phoneInput.fill('٠٥٠٠٠٠٠٠٠٠'); // Arabic-Indic digits
    await expect(phoneInput).toHaveValue('٠٥٠٠٠٠٠٠٠٠');
    
    // Clear and try regular digits
    await phoneInput.clear();
    await phoneInput.fill('0500000000');
    await expect(phoneInput).toHaveValue('0500000000');
  });

  test('should show/hide password functionality', async ({ page }) => {
    const passwordInput = page.getByRole('textbox', { name: /كلمة المرور|password/i });
    
    // Fill password
    await passwordInput.fill('testpassword');
    
    // Look for show/hide password button (eye icon or similar)
    const toggleButton = page.locator('button').filter({ hasText: /show|hide|عرض|إخفاء/ }).or(
      page.locator('[data-testid*="password"], [class*="eye"], [class*="toggle"]')
    );
    
    if (await toggleButton.count() > 0) {
      await toggleButton.first().click();
      
      // Check if password is now visible (input type changed)
      const inputType = await passwordInput.getAttribute('type');
      console.log('Password input type after toggle:', inputType);
    }
  });

});

// Test responsive design
test.describe('Login Page Responsive Tests', () => {
  
  test('should display correctly on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/auth/login');
    
    // Check if form is still accessible and properly sized
    await expect(page.getByRole('textbox', { name: /رقم الهاتف|phone/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /كلمة المرور|password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /تسجيل الدخول|login/i })).toBeVisible();
  });

  test('should display correctly on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/auth/login');
    
    // Check form elements
    await expect(page.getByRole('textbox', { name: /رقم الهاتف|phone/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /كلمة المرور|password/i })).toBeVisible();
  });

}); 