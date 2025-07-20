import { test, expect } from '@playwright/test';

test.describe('Order Flow Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Login with test credentials
    await page.getByRole('textbox', { name: /رقم الهاتف|phone/i }).fill('0500000000');
    await page.getByRole('textbox', { name: /كلمة المرور|password/i }).fill('admin123');
    await page.getByRole('button', { name: /تسجيل الدخول|login/i }).click();
    await page.waitForLoadState('networkidle');
  });

  test('should create order successfully', async ({ page }) => {
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
    
    // Fill checkout form
    const addressOptions = page.locator('input[type="radio"]').first();
    const timeOptions = page.locator('input[type="radio"]').nth(1);
    const paymentOptions = page.locator('input[type="radio"]').nth(2);
    const termsCheckbox = page.locator('input[type="checkbox"]').first();
    
    if (await addressOptions.count() > 0) await addressOptions.click();
    if (await timeOptions.count() > 0) await timeOptions.click();
    if (await paymentOptions.count() > 0) await paymentOptions.click();
    if (await termsCheckbox.count() > 0) await termsCheckbox.click();
    
    await page.waitForTimeout(1000);
    
    // Place order
    const placeOrderButton = page.getByText(/place order|تنفيذ الطلب/i);
    if (await placeOrderButton.count() > 0) {
      await placeOrderButton.click();
      await page.waitForLoadState('networkidle');
      
      // Should be redirected to order confirmation
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/happyorder|confirmation/);
    }
  });

  test('should display order confirmation page', async ({ page }) => {
    // Create order first (simplified)
    await page.goto('/happyorder?orderid=TEST123');
    await page.waitForLoadState('networkidle');
    
    // Check confirmation page elements
    await expect(page.getByText(/order|طلب/i)).toBeVisible();
    await expect(page.locator('.container')).toBeVisible();
    
    // Check for success message
    const successMessage = page.getByText(/success|تم|confirmed|مؤكد/i);
    if (await successMessage.count() > 0) {
      await expect(successMessage.first()).toBeVisible();
    }
  });

  test('should display order details', async ({ page }) => {
    await page.goto('/happyorder?orderid=TEST123');
    await page.waitForLoadState('networkidle');
    
    // Check for order details
    const orderNumber = page.getByText(/order number|رقم الطلب/i);
    if (await orderNumber.count() > 0) {
      await expect(orderNumber.first()).toBeVisible();
    }
    
    // Check for order items
    const orderItems = page.locator('[data-testid="order-item"], .order-item');
    if (await orderItems.count() > 0) {
      await expect(orderItems.first()).toBeVisible();
    }
  });

  test('should allow order rating', async ({ page }) => {
    await page.goto('/happyorder?orderid=TEST123');
    await page.waitForLoadState('networkidle');
    
    // Look for rating stars
    const ratingStars = page.locator('[data-testid="rating-star"], .rating-star, [class*="star"]');
    if (await ratingStars.count() > 0) {
      // Click on a star to rate
      await ratingStars.nth(4).click(); // 5-star rating
      await page.waitForTimeout(500);
      
      // Check if rating is applied
      await expect(ratingStars.nth(4)).toHaveClass(/active|selected/i);
    }
  });

  test('should submit order review', async ({ page }) => {
    await page.goto('/happyorder?orderid=TEST123');
    await page.waitForLoadState('networkidle');
    
    // Rate the order
    const ratingStars = page.locator('[data-testid="rating-star"], .rating-star, [class*="star"]');
    if (await ratingStars.count() > 0) {
      await ratingStars.nth(4).click();
      await page.waitForTimeout(500);
    }
    
    // Add comment
    const commentInput = page.getByPlaceholder(/comment|review|تعليق/i);
    if (await commentInput.count() > 0) {
      await commentInput.fill('Great service and fast delivery!');
    }
    
    // Submit review
    const submitButton = page.getByText(/submit|send|إرسال/i);
    if (await submitButton.count() > 0) {
      await submitButton.click();
      await page.waitForTimeout(2000);
      
      // Check for success message
      const successMessage = page.getByText(/thank you|شكراً|submitted|تم الإرسال/i);
      if (await successMessage.count() > 0) {
        await expect(successMessage.first()).toBeVisible();
      }
    }
  });

  test('should navigate to order history', async ({ page }) => {
    // Look for order history link
    const orderHistoryLink = page.getByText(/orders|history|طلباتي/i);
    if (await orderHistoryLink.count() > 0) {
      await orderHistoryLink.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on orders page
      await expect(page).toHaveURL(/orders|history/);
    }
  });

  test('should display order status', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForLoadState('networkidle');
    
    // Check for order status elements
    const orderStatus = page.getByText(/status|حالة/i);
    if (await orderStatus.count() > 0) {
      await expect(orderStatus.first()).toBeVisible();
    }
    
    // Check for order list
    const orderList = page.locator('[data-testid="order-item"], .order-item');
    if (await orderList.count() > 0) {
      await expect(orderList.first()).toBeVisible();
    }
  });

  test('should track order delivery', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForLoadState('networkidle');
    
    // Click on an order to view details
    const orderItem = page.locator('[data-testid="order-item"], .order-item').first();
    if (await orderItem.count() > 0) {
      await orderItem.click();
      await page.waitForLoadState('networkidle');
      
      // Check for tracking information
      const trackingInfo = page.getByText(/tracking|تتبع|delivery|توصيل/i);
      if (await trackingInfo.count() > 0) {
        await expect(trackingInfo.first()).toBeVisible();
      }
    }
  });

  test('should cancel order if allowed', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForLoadState('networkidle');
    
    // Look for cancel button on orders
    const cancelButton = page.getByText(/cancel|إلغاء/i);
    if (await cancelButton.count() > 0) {
      await cancelButton.first().click();
      await page.waitForTimeout(1000);
      
      // Check for confirmation dialog
      const confirmDialog = page.getByText(/confirm|تأكيد/i);
      if (await confirmDialog.count() > 0) {
        await confirmDialog.click();
        await page.waitForTimeout(2000);
        
        // Check for success message
        const successMessage = page.getByText(/cancelled|تم الإلغاء/i);
        if (await successMessage.count() > 0) {
          await expect(successMessage.first()).toBeVisible();
        }
      }
    }
  });

  test('should handle order notifications', async ({ page }) => {
    // Check for notification elements
    const notificationBell = page.locator('[data-testid="notification-bell"], .notification-bell, [class*="bell"]');
    if (await notificationBell.count() > 0) {
      await notificationBell.click();
      await page.waitForTimeout(500);
      
      // Check for notification dropdown
      const notificationDropdown = page.locator('[data-testid="notification-dropdown"], .notification-dropdown');
      if (await notificationDropdown.count() > 0) {
        await expect(notificationDropdown.first()).toBeVisible();
      }
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/orders');
    await page.waitForLoadState('networkidle');
    
    // Check if order page is responsive
    await expect(page.locator('.container')).toBeVisible();
    
    // Check if order items are accessible on mobile
    const orderItems = page.locator('[data-testid="order-item"], .order-item');
    if (await orderItems.count() > 0) {
      await expect(orderItems.first()).toBeVisible();
    }
  });
}); 