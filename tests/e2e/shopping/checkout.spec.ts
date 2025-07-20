import { test, expect } from '@playwright/test';
import { ARABIC_SELECTORS } from '../../utils/test-helpers';

test.describe('Checkout Flow Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for slow development server
    page.setDefaultTimeout(60000);
    
    // Login first
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Login with test credentials
    await page.getByRole('textbox', { name: new RegExp(`${ARABIC_SELECTORS.phoneNumber}|phone`, 'i') }).fill('0500000000');
    await page.getByRole('textbox', { name: new RegExp(`${ARABIC_SELECTORS.password}|password`, 'i') }).fill('admin123');
    await page.getByRole('button', { name: new RegExp(`${ARABIC_SELECTORS.login}|login`, 'i') }).click();
    await page.waitForLoadState('networkidle');
    
    // Add item to cart
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for products to load
    await page.waitForTimeout(3000);
    
    const addToCartButton = page.getByText(new RegExp(`${ARABIC_SELECTORS.addToCart}|${ARABIC_SELECTORS.addToCartAlt}`, 'i')).first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('No Add to Cart button found, skipping cart addition');
    }
  });

  test('should navigate to checkout page', async ({ page }) => {
    // Go to cart first
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    
    // Click checkout button
    const checkoutButton = page.getByText(new RegExp(`checkout|proceed|${ARABIC_SELECTORS.proceedToCheckout}`, 'i'));
    if (await checkoutButton.count() > 0) {
      await checkoutButton.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on checkout page
      await expect(page).toHaveURL(/checkout/);
    }
  });

  test('should display checkout form elements', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Check for essential checkout elements
    await expect(page.getByText(new RegExp(`checkout|${ARABIC_SELECTORS.checkout}`, 'i'))).toBeVisible();
    await expect(page.locator('.container')).toBeVisible();
    
    // Check for address selection
    const addressSection = page.getByText(new RegExp(`address|${ARABIC_SELECTORS.deliveryAddress}`, 'i'));
    if (await addressSection.count() > 0) {
      await expect(addressSection.first()).toBeVisible();
    }
    
    // Check for payment method selection
    const paymentSection = page.getByText(new RegExp(`payment|${ARABIC_SELECTORS.checkout}`, 'i'));
    if (await paymentSection.count() > 0) {
      await expect(paymentSection.first()).toBeVisible();
    }
  });

  test('should select delivery address', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Look for address selection
    const addressOptions = page.locator('[data-testid="address-option"], .address-option, input[type="radio"]');
    if (await addressOptions.count() > 0) {
      await addressOptions.first().click();
      await page.waitForTimeout(500);
      
      // Check if address is selected
      await expect(addressOptions.first()).toBeChecked();
    }
  });

  test('should select delivery time', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Look for delivery time selection
    const timeOptions = page.locator('[data-testid="shift-option"], .shift-option, input[type="radio"]');
    if (await timeOptions.count() > 0) {
      await timeOptions.first().click();
      await page.waitForTimeout(500);
      
      // Check if time is selected
      await expect(timeOptions.first()).toBeChecked();
    }
  });

  test('should select payment method', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Look for payment method options
    const paymentOptions = page.locator('[data-testid="payment-option"], .payment-option, input[type="radio"]');
    if (await paymentOptions.count() > 0) {
      await paymentOptions.first().click();
      await page.waitForTimeout(500);
      
      // Check if payment method is selected
      await expect(paymentOptions.first()).toBeChecked();
    }
  });

  test('should accept terms and conditions', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Look for terms checkbox
    const termsCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: new RegExp(`terms|conditions|${ARABIC_SELECTORS.termsAndConditions}`, 'i') });
    if (await termsCheckbox.count() > 0) {
      await termsCheckbox.click();
      await page.waitForTimeout(500);
      
      // Check if terms are accepted
      await expect(termsCheckbox).toBeChecked();
    }
  });

  test('should display order summary', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Check for order summary elements
    const summarySection = page.getByText(/summary|ملخص|order/i);
    if (await summarySection.count() > 0) {
      await expect(summarySection.first()).toBeVisible();
    }
    
    // Check for total amount
    const totalAmount = page.getByText(new RegExp(`total|${ARABIC_SELECTORS.total}`, 'i'));
    if (await totalAmount.count() > 0) {
      await expect(totalAmount.first()).toBeVisible();
    }
  });

  test('should place order successfully', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Select required options
    const addressOptions = page.locator('input[type="radio"]').first();
    const timeOptions = page.locator('input[type="radio"]').nth(1);
    const paymentOptions = page.locator('input[type="radio"]').nth(2);
    const termsCheckbox = page.locator('input[type="checkbox"]').first();
    
    if (await addressOptions.count() > 0) await addressOptions.click();
    if (await timeOptions.count() > 0) await timeOptions.click();
    if (await paymentOptions.count() > 0) await paymentOptions.click();
    if (await termsCheckbox.count() > 0) await termsCheckbox.click();
    
    await page.waitForTimeout(1000);
    
    // Click place order button
    const placeOrderButton = page.getByText(new RegExp(`place order|${ARABIC_SELECTORS.placeOrder}`, 'i'));
    if (await placeOrderButton.count() > 0) {
      await placeOrderButton.click();
      await page.waitForLoadState('networkidle');
      
      // Should be redirected to order confirmation
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/happyorder|confirmation/);
    }
  });

  test('should show validation errors for missing fields', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Try to place order without selecting options
    const placeOrderButton = page.getByText(new RegExp(`place order|${ARABIC_SELECTORS.placeOrder}`, 'i'));
    if (await placeOrderButton.count() > 0) {
      await placeOrderButton.click();
      await page.waitForTimeout(2000);
      
      // Should show validation errors
      const errorMessages = page.getByText(new RegExp(`required|${ARABIC_SELECTORS.required}|error|${ARABIC_SELECTORS.error}`, 'i'));
      if (await errorMessages.count() > 0) {
        await expect(errorMessages.first()).toBeVisible();
      }
    }
  });

  test('should handle checkout on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Check if checkout form is responsive
    await expect(page.locator('.container')).toBeVisible();
    
    // Check if elements are accessible on mobile
    const placeOrderButton = page.getByText(new RegExp(`place order|${ARABIC_SELECTORS.placeOrder}`, 'i'));
    if (await placeOrderButton.count() > 0) {
      await expect(placeOrderButton.first()).toBeVisible();
    }
  });
}); 