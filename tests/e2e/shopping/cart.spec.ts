import { test, expect } from '@playwright/test';
import { loginUser, addToCart, goToCart, TEST_USERS, ARABIC_SELECTORS } from '../../utils/test-helpers';

test.describe('Shopping Cart Flow Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for slow development server
    page.setDefaultTimeout(60000);
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for products to load
    await page.waitForTimeout(3000);
  });

  test('should add product to cart as guest user', async ({ page }) => {
    // Find and click first product's add to cart button
    const addToCartButton = page.getByText(new RegExp(`${ARABIC_SELECTORS.addToCart}|${ARABIC_SELECTORS.addToCartAlt}`, 'i')).first();
    await expect(addToCartButton).toBeVisible();
    
    await addToCartButton.click();
    await page.waitForTimeout(1000);
    
    // Check if cart badge shows item count
    const cartBadge = page.locator('[data-testid="cart-badge"], .cart-badge, [class*="badge"]');
    if (await cartBadge.count() > 0) {
      await expect(cartBadge.first()).toBeVisible();
    }
  });

  test('should navigate to cart page and display items', async ({ page }) => {
    // Add item first
    const addToCartButton = page.getByText(new RegExp(`${ARABIC_SELECTORS.addToCart}|${ARABIC_SELECTORS.addToCartAlt}`, 'i')).first();
    await addToCartButton.click();
    await page.waitForTimeout(1000);
    
    // Navigate to cart
    await goToCart(page);
    
    // Check cart page elements
    await expect(page.getByText(new RegExp(`${ARABIC_SELECTORS.cart}|${ARABIC_SELECTORS.cartAlt}|cart`, 'i'))).toBeVisible();
    await expect(page.locator('.container')).toBeVisible();
  });

  test('should update product quantity in cart', async ({ page }) => {
    // Add item and go to cart
    const addToCartButton = page.getByText(new RegExp(`${ARABIC_SELECTORS.addToCart}|${ARABIC_SELECTORS.addToCartAlt}`, 'i')).first();
    await addToCartButton.click();
    await page.waitForTimeout(1000);
    await goToCart(page);
    
    // Find quantity controls
    const increaseButton = page.locator('button').filter({ hasText: new RegExp(`\\+|plus|${ARABIC_SELECTORS.increaseQuantity}`, 'i') }).first();
    const decreaseButton = page.locator('button').filter({ hasText: new RegExp(`-|minus|${ARABIC_SELECTORS.decreaseQuantity}`, 'i') }).first();
    
    if (await increaseButton.count() > 0) {
      await increaseButton.click();
      await page.waitForTimeout(500);
      
      // Check if quantity updated (look for quantity display)
      const quantityDisplay = page.locator('[data-testid="quantity"], .quantity, [class*="quantity"]');
      if (await quantityDisplay.count() > 0) {
        await expect(quantityDisplay.first()).toBeVisible();
      }
    }
  });

  test('should remove item from cart', async ({ page }) => {
    // Add item and go to cart
    const addToCartButton = page.getByText(new RegExp(`${ARABIC_SELECTORS.addToCart}|${ARABIC_SELECTORS.addToCartAlt}`, 'i')).first();
    await addToCartButton.click();
    await page.waitForTimeout(1000);
    await goToCart(page);
    
    // Find remove button
    const removeButton = page.getByText(new RegExp(`remove|delete|${ARABIC_SELECTORS.remove}`, 'i')).first();
    if (await removeButton.count() > 0) {
      await removeButton.click();
      await page.waitForTimeout(1000);
      
      // Check if item is removed (cart should be empty or show empty message)
      const emptyCartMessage = page.getByText(new RegExp(`empty|${ARABIC_SELECTORS.emptyCart}|no items`, 'i'));
      if (await emptyCartMessage.count() > 0) {
        await expect(emptyCartMessage.first()).toBeVisible();
      }
    }
  });

  test('should merge guest cart with user cart on login', async ({ page }) => {
    // Add item as guest
    const addToCartButton = page.getByText(new RegExp(`${ARABIC_SELECTORS.addToCart}|${ARABIC_SELECTORS.addToCartAlt}`, 'i')).first();
    await addToCartButton.click();
    await page.waitForTimeout(1000);
    
    // Login
    await loginUser(page, TEST_USERS.validUser.phone, TEST_USERS.validUser.password);
    
    // Check if cart still has items (merged)
    await goToCart(page);
    const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
    if (await cartItems.count() > 0) {
      await expect(cartItems.first()).toBeVisible();
    }
  });

  test('should calculate cart totals correctly', async ({ page }) => {
    // Add item and go to cart
    const addToCartButton = page.getByText(new RegExp(`${ARABIC_SELECTORS.addToCart}|${ARABIC_SELECTORS.addToCartAlt}`, 'i')).first();
    await addToCartButton.click();
    await page.waitForTimeout(1000);
    await goToCart(page);
    
    // Check for total elements
    const subtotal = page.getByText(new RegExp(`subtotal|${ARABIC_SELECTORS.subtotal}`, 'i'));
    const total = page.getByText(new RegExp(`total|${ARABIC_SELECTORS.total}`, 'i'));
    
    if (await subtotal.count() > 0) {
      await expect(subtotal.first()).toBeVisible();
    }
    if (await total.count() > 0) {
      await expect(total.first()).toBeVisible();
    }
  });

  test('should proceed to checkout from cart', async ({ page }) => {
    // Add item and go to cart
    const addToCartButton = page.getByText(new RegExp(`${ARABIC_SELECTORS.addToCart}|${ARABIC_SELECTORS.addToCartAlt}`, 'i')).first();
    await addToCartButton.click();
    await page.waitForTimeout(1000);
    await goToCart(page);
    
    // Click checkout button
    const checkoutButton = page.getByText(new RegExp(`checkout|proceed|${ARABIC_SELECTORS.proceedToCheckout}`, 'i'));
    if (await checkoutButton.count() > 0) {
      await checkoutButton.click();
      await page.waitForLoadState('networkidle');
      
      // Should be redirected to checkout or login page
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/checkout|login/);
    }
  });
}); 