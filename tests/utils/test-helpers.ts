import { Page } from '@playwright/test';

// 🛠️ TEST HELPER FUNCTIONS

/**
 * Test user data for consistent testing
 */
export const TEST_USERS = {
  validUser: {
    phone: '0512345678',
    password: 'password123',
    name: 'Test User'
  },
  adminUser: {
    phone: '0587654321',
    password: 'admin123',
    name: 'Admin User'
  }
};

/**
 * Common test data
 */
export const TEST_DATA = {
  products: {
    waterBottle: 'Premium Water Bottle',
    sparkling: 'Sparkling Water'
  },
  searchTerms: {
    water: 'water',
    premium: 'premium'
  }
};

/**
 * Login helper function
 * @param page - Playwright page object
 * @param phone - User phone number
 * @param password - User password
 */
export async function loginUser(page: Page, phone: string, password: string) {
  // Go to login page
  await page.goto('/auth/login');
  
  // Fill login form
  await page.getByPlaceholder('رقم الهاتف (05XXXXXXXX)').fill(phone);
  await page.getByPlaceholder('كلمة المرور').fill(password);
  
  // Click login button
  await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
  
  // Wait for navigation
  await page.waitForLoadState('networkidle');
}

/**
 * Logout helper function
 * @param page - Playwright page object
 */
export async function logoutUser(page: Page) {
  // Look for logout button or user menu
  const logoutButton = page.getByText(/logout|تسجيل الخروج/i);
  const userMenu = page.getByText(/profile|الملف الشخصي|account|الحساب/i);
  
  // Try clicking user menu first (if dropdown)
  if (await userMenu.isVisible()) {
    await userMenu.click();
    await page.waitForTimeout(500); // Wait for dropdown
  }
  
  // Click logout
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Add product to cart helper
 * @param page - Playwright page object
 * @param productName - Name of the product to add
 */
export async function addToCart(page: Page, productName?: string) {
  // If specific product, search for it first
  if (productName) {
    const searchInput = page.getByPlaceholder(/search|بحث/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill(productName);
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }
  }
  
  // Find and click "Add to Cart" button
  const addToCartButton = page.getByText(/add to cart|أضف للسلة/i).first();
  if (await addToCartButton.isVisible()) {
    await addToCartButton.click();
    
    // Wait for cart update (animation or notification)
    await page.waitForTimeout(1000);
  }
}

/**
 * Navigate to cart page
 * @param page - Playwright page object
 */
export async function goToCart(page: Page) {
  const cartButton = page.getByText(/cart|السلة/i).or(
    page.getByRole('button', { name: /cart|السلة/i })
  );
  
  if (await cartButton.first().isVisible()) {
    await cartButton.first().click();
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Wait for element with custom timeout
 * @param page - Playwright page object
 * @param selector - Element selector
 * @param timeout - Custom timeout in milliseconds
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Take screenshot with custom name
 * @param page - Playwright page object
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ 
    path: `tests/screenshots/${name}-${Date.now()}.png`,
    fullPage: true 
  });
}

/**
 * Check if page has error messages
 * @param page - Playwright page object
 */
export async function hasErrorMessage(page: Page) {
  const errorSelectors = [
    page.getByText(/error|خطأ/i),
    page.getByText(/invalid|غير صحيح/i),
    page.getByText(/required|مطلوب/i),
    page.getByText(/failed|فشل/i)
  ];
  
  for (const selector of errorSelectors) {
    if (await selector.first().isVisible()) {
      return true;
    }
  }
  return false;
}

/**
 * Check if page has success message
 * @param page - Playwright page object
 */
export async function hasSuccessMessage(page: Page) {
  const successSelectors = [
    page.getByText(/success|نجح/i),
    page.getByText(/completed|مكتمل/i),
    page.getByText(/confirmed|مؤكد/i),
    page.getByText(/added|تم الإضافة/i)
  ];
  
  for (const selector of successSelectors) {
    if (await selector.first().isVisible()) {
      return true;
    }
  }
  return false;
}

/**
 * Clear and fill input field
 * @param page - Playwright page object
 * @param selector - Input selector
 * @param value - Value to fill
 */
export async function fillInput(page: Page, selector: string, value: string) {
  await page.fill(selector, ''); // Clear first
  await page.fill(selector, value);
} 