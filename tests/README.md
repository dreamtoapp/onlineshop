# 🧪 E2E Testing Guide

This folder contains End-to-End (E2E) tests for our online shop application using **Playwright**.

## 🚀 **How to Run Tests**

### **First Time Setup**
1. Install dependencies: `pnpm install`
2. Install browsers: `pnpm exec playwright install`

### **Run Tests**
```bash
# Run all tests (headless)
pnpm run test:e2e

# Run tests with browser visible
pnpm run test:e2e:headed

# Run tests with UI (interactive)
pnpm run test:e2e:ui

# Debug specific test
pnpm run test:e2e:debug
```

## 📁 **Folder Structure**

```
tests/
├── e2e/
│   ├── auth/           # Authentication tests (login, register)
│   ├── shopping/       # Shopping flow tests (homepage, cart)
│   ├── user-account/   # User account management tests
│   └── admin/          # Admin dashboard tests (future)
├── utils/
│   └── test-helpers.ts # Helper functions for tests
└── README.md          # This file
```

## 🔐 **Test Types**

### **✅ Currently Available:**
- **Authentication Tests**: Login, register, password reset
- **Homepage Tests**: Navigation, products display, search

### **🚧 Coming Soon:**
- **Shopping Cart Tests**: Add to cart, checkout process  
- **User Account Tests**: Profile, wishlist, order history
- **Admin Tests**: Product management, order management

## 📝 **Writing Your Own Tests**

### **Basic Test Structure:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/my-page');
  });

  test('should do something', async ({ page }) => {
    // Your test code here
    await expect(page.getByText('Something')).toBeVisible();
  });
});
```

### **Using Helper Functions:**
```typescript
import { loginUser, addToCart, TEST_USERS } from '../utils/test-helpers';

test('logged in user can add to cart', async ({ page }) => {
  // Login using helper
  await loginUser(page, TEST_USERS.validUser.email, TEST_USERS.validUser.password);
  
  // Add product using helper
  await addToCart(page, 'Premium Water');
  
  // Check result
  await expect(page.getByText(/added to cart|تم الإضافة/i)).toBeVisible();
});
```

## ⚠️ **Important Notes**

### **🛡️ Safety:**
- Tests run on `localhost:3000` only (never production!)
- Uses test database (not real customer data)
- All test data is fake and safe

### **📊 Best Practices:**
- Always use `await` for page actions
- Use `page.waitForLoadState('networkidle')` after navigation
- Use Arabic and English text selectors for better coverage
- Add meaningful test descriptions
- Group related tests in `describe` blocks

### **🐛 Debugging:**
- Use `pnpm run test:e2e:headed` to see browser
- Use `pnpm run test:e2e:ui` for interactive debugging
- Screenshots are taken automatically on failure
- Check `test-results/` folder for artifacts

## 📈 **Test Results**

After running tests, you'll find:
- **HTML Report**: Detailed test results with screenshots
- **Screenshots**: Captured on test failures  
- **Videos**: Recorded for failed tests (if enabled)
- **Traces**: Detailed execution traces for debugging

## 🎯 **Test Coverage Goals**

- ✅ **Authentication**: Login, register, logout
- ✅ **Homepage**: Navigation, product display
- 🚧 **Shopping**: Add to cart, checkout, payment
- 🚧 **User Account**: Profile, wishlist, orders
- 🚧 **Admin**: Product management, orders

## 🆘 **Need Help?**

1. **Test fails?** Check the HTML report for screenshots and error details
2. **Can't find element?** Use browser dev tools to inspect selectors
3. **Test is flaky?** Add proper waits (`waitForLoadState`, `waitForSelector`)
4. **Need new test?** Copy existing test and modify for your use case

## 🚀 **Next Steps**

1. Run the existing tests to see how they work
2. Modify test data in `utils/test-helpers.ts` to match your app
3. Add new tests for features you want to test
4. Integrate tests into your development workflow 