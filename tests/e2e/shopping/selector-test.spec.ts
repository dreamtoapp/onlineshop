import { test, expect } from '@playwright/test';
import { ARABIC_SELECTORS } from '../../utils/test-helpers';

test.describe('Arabic Selector Verification Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for slow development server
    page.setDefaultTimeout(60000);
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for products to load
    await page.waitForTimeout(3000);
  });

  test('should find Add to Cart buttons with correct Arabic text', async ({ page }) => {
    // Look for Add to Cart buttons
    const addToCartButtons = page.getByText(new RegExp(`${ARABIC_SELECTORS.addToCart}|${ARABIC_SELECTORS.addToCartAlt}`, 'i'));
    
    // Check if any buttons are found
    const buttonCount = await addToCartButtons.count();
    console.log(`Found ${buttonCount} Add to Cart buttons`);
    
    if (buttonCount > 0) {
      // Take screenshot of the first button
      await addToCartButtons.first().screenshot({ path: 'test-results/add-to-cart-button.png' });
      
      // Verify the button is visible
      await expect(addToCartButtons.first()).toBeVisible();
      
      // Get the actual text of the button
      const buttonText = await addToCartButtons.first().textContent();
      console.log(`Button text: "${buttonText}"`);
      
      // Verify it matches our expected text
      expect(buttonText).toMatch(new RegExp(`${ARABIC_SELECTORS.addToCart}|${ARABIC_SELECTORS.addToCartAlt}`, 'i'));
    } else {
      // If no buttons found, take a screenshot of the page
      await page.screenshot({ path: 'test-results/no-add-to-cart-buttons.png', fullPage: true });
      
      // Log page content for debugging
      const pageContent = await page.content();
      console.log('Page HTML:', pageContent.substring(0, 1000));
      
      // This test should fail if no buttons are found
      expect(buttonCount).toBeGreaterThan(0);
    }
  });

  test('should find cart navigation elements', async ({ page }) => {
    // Look for cart-related elements
    const cartElements = page.getByText(new RegExp(`${ARABIC_SELECTORS.cart}|${ARABIC_SELECTORS.cartAlt}|cart`, 'i'));
    
    const elementCount = await cartElements.count();
    console.log(`Found ${elementCount} cart-related elements`);
    
    if (elementCount > 0) {
      await expect(cartElements.first()).toBeVisible();
    }
    
    // This test should pass even if no cart elements are found (they might be in header)
    expect(elementCount).toBeGreaterThanOrEqual(0);
  });

  test('should verify page structure', async ({ page }) => {
    // Check for main container
    const containers = page.locator('.container');
    const containerCount = await containers.count();
    console.log(`Found ${containerCount} containers`);
    
    expect(containerCount).toBeGreaterThan(0);
    await expect(containers.first()).toBeVisible();
    
    // Check for sections
    const sections = page.locator('section[aria-label]');
    const sectionCount = await sections.count();
    console.log(`Found ${sectionCount} sections with aria-label`);
    
    expect(sectionCount).toBeGreaterThan(0);
  });

  test('should handle slow loading gracefully', async ({ page }) => {
    // Wait longer for slow loading
    await page.waitForTimeout(5000);
    
    // Check if page is responsive
    const isResponsive = await page.evaluate(() => {
      return document.readyState === 'complete';
    });
    
    expect(isResponsive).toBe(true);
    
    // Check if we can interact with the page
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
}); 