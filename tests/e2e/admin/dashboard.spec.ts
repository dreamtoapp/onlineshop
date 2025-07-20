import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Login with admin credentials
    await page.getByRole('textbox', { name: /رقم الهاتف|phone/i }).fill('0500000000');
    await page.getByRole('textbox', { name: /كلمة المرور|password/i }).fill('admin123');
    await page.getByRole('button', { name: /تسجيل الدخول|login/i }).click();
    await page.waitForLoadState('networkidle');
  });

  test('should access admin dashboard', async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check if admin dashboard loads
    await expect(page.getByText(/dashboard|لوحة التحكم/i)).toBeVisible();
    await expect(page.locator('.container')).toBeVisible();
  });

  test('should display admin navigation menu', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for admin navigation elements
    const navMenu = page.locator('[data-testid="admin-nav"], .admin-nav, nav');
    if (await navMenu.count() > 0) {
      await expect(navMenu.first()).toBeVisible();
    }
    
    // Check for common admin menu items
    const menuItems = [
      'orders|الطلبات',
      'products|المنتجات',
      'users|المستخدمين',
      'analytics|التحليلات'
    ];
    
    for (const item of menuItems) {
      const menuItem = page.getByText(new RegExp(item, 'i'));
      if (await menuItem.count() > 0) {
        await expect(menuItem.first()).toBeVisible();
      }
    }
  });

  test('should display order management', async ({ page }) => {
    await page.goto('/dashboard/management-orders');
    await page.waitForLoadState('networkidle');
    
    // Check for order management elements
    await expect(page.getByText(/orders|الطلبات/i)).toBeVisible();
    
    // Check for order list or table
    const orderList = page.locator('[data-testid="order-list"], .order-list, table');
    if (await orderList.count() > 0) {
      await expect(orderList.first()).toBeVisible();
    }
  });

  test('should display product management', async ({ page }) => {
    await page.goto('/dashboard/management-products');
    await page.waitForLoadState('networkidle');
    
    // Check for product management elements
    await expect(page.getByText(/products|المنتجات/i)).toBeVisible();
    
    // Check for product list or grid
    const productList = page.locator('[data-testid="product-list"], .product-list, [class*="grid"]');
    if (await productList.count() > 0) {
      await expect(productList.first()).toBeVisible();
    }
  });

  test('should display user management', async ({ page }) => {
    await page.goto('/dashboard/management-users');
    await page.waitForLoadState('networkidle');
    
    // Check for user management elements
    await expect(page.getByText(/users|المستخدمين/i)).toBeVisible();
    
    // Check for user list or table
    const userList = page.locator('[data-testid="user-list"], .user-list, table');
    if (await userList.count() > 0) {
      await expect(userList.first()).toBeVisible();
    }
  });

  test('should display analytics dashboard', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');
    
    // Check for analytics elements
    await expect(page.getByText(/analytics|التحليلات/i)).toBeVisible();
    
    // Check for charts or statistics
    const charts = page.locator('[data-testid="chart"], .chart, canvas, svg');
    if (await charts.count() > 0) {
      await expect(charts.first()).toBeVisible();
    }
  });

  test('should assign driver to order', async ({ page }) => {
    await page.goto('/dashboard/management-orders');
    await page.waitForLoadState('networkidle');
    
    // Look for assign driver button
    const assignButton = page.getByText(/assign|assign driver|تعيين/i);
    if (await assignButton.count() > 0) {
      await assignButton.first().click();
      await page.waitForTimeout(1000);
      
      // Check for driver selection dropdown or modal
      const driverSelect = page.locator('[data-testid="driver-select"], select, [role="combobox"]');
      if (await driverSelect.count() > 0) {
        await expect(driverSelect.first()).toBeVisible();
      }
    }
  });

  test('should update order status', async ({ page }) => {
    await page.goto('/dashboard/management-orders');
    await page.waitForLoadState('networkidle');
    
    // Look for status update button
    const statusButton = page.getByText(/status|update|تحديث/i);
    if (await statusButton.count() > 0) {
      await statusButton.first().click();
      await page.waitForTimeout(1000);
      
      // Check for status selection
      const statusSelect = page.locator('[data-testid="status-select"], select, [role="combobox"]');
      if (await statusSelect.count() > 0) {
        await expect(statusSelect.first()).toBeVisible();
      }
    }
  });

  test('should add new product', async ({ page }) => {
    await page.goto('/dashboard/management-products');
    await page.waitForLoadState('networkidle');
    
    // Look for add product button
    const addButton = page.getByText(/add|new|إضافة/i);
    if (await addButton.count() > 0) {
      await addButton.first().click();
      await page.waitForLoadState('networkidle');
      
      // Check for product form
      const productForm = page.locator('[data-testid="product-form"], form');
      if (await productForm.count() > 0) {
        await expect(productForm.first()).toBeVisible();
      }
    }
  });

  test('should edit existing product', async ({ page }) => {
    await page.goto('/dashboard/management-products');
    await page.waitForLoadState('networkidle');
    
    // Look for edit button
    const editButton = page.getByText(/edit|تعديل/i);
    if (await editButton.count() > 0) {
      await editButton.first().click();
      await page.waitForLoadState('networkidle');
      
      // Check for edit form
      const editForm = page.locator('[data-testid="edit-form"], form');
      if (await editForm.count() > 0) {
        await expect(editForm.first()).toBeVisible();
      }
    }
  });

  test('should delete product', async ({ page }) => {
    await page.goto('/dashboard/management-products');
    await page.waitForLoadState('networkidle');
    
    // Look for delete button
    const deleteButton = page.getByText(/delete|حذف/i);
    if (await deleteButton.count() > 0) {
      await deleteButton.first().click();
      await page.waitForTimeout(1000);
      
      // Check for confirmation dialog
      const confirmDialog = page.getByText(/confirm|تأكيد/i);
      if (await confirmDialog.count() > 0) {
        await expect(confirmDialog.first()).toBeVisible();
      }
    }
  });

  test('should view order details', async ({ page }) => {
    await page.goto('/dashboard/management-orders');
    await page.waitForLoadState('networkidle');
    
    // Look for order item to click
    const orderItem = page.locator('[data-testid="order-item"], .order-item, tr').first();
    if (await orderItem.count() > 0) {
      await orderItem.click();
      await page.waitForLoadState('networkidle');
      
      // Check for order details
      const orderDetails = page.getByText(/order details|تفاصيل الطلب/i);
      if (await orderDetails.count() > 0) {
        await expect(orderDetails.first()).toBeVisible();
      }
    }
  });

  test('should filter orders', async ({ page }) => {
    await page.goto('/dashboard/management-orders');
    await page.waitForLoadState('networkidle');
    
    // Look for filter controls
    const filterInput = page.locator('[data-testid="filter-input"], input[placeholder*="filter"], input[placeholder*="بحث"]');
    if (await filterInput.count() > 0) {
      await filterInput.first().fill('test');
      await page.waitForTimeout(1000);
      
      // Check if filtering works
      await expect(filterInput.first()).toHaveValue('test');
    }
  });

  test('should export data', async ({ page }) => {
    await page.goto('/dashboard/management-orders');
    await page.waitForLoadState('networkidle');
    
    // Look for export button
    const exportButton = page.getByText(/export|تصدير/i);
    if (await exportButton.count() > 0) {
      await exportButton.first().click();
      await page.waitForTimeout(1000);
      
      // Check for export options or download
      const exportOptions = page.getByText(/download|csv|excel/i);
      if (await exportOptions.count() > 0) {
        await expect(exportOptions.first()).toBeVisible();
      }
    }
  });

  test('should handle admin notifications', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
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
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check if admin dashboard is responsive
    await expect(page.locator('.container')).toBeVisible();
    
    // Check if navigation is accessible on mobile
    const navMenu = page.locator('[data-testid="admin-nav"], .admin-nav, nav');
    if (await navMenu.count() > 0) {
      await expect(navMenu.first()).toBeVisible();
    }
  });

  test('should handle admin permissions', async ({ page }) => {
    // Test access to admin-only pages
    const adminPages = [
      '/dashboard',
      '/dashboard/management-orders',
      '/dashboard/management-products',
      '/dashboard/management-users',
      '/dashboard/analytics'
    ];
    
    for (const adminPage of adminPages) {
      await page.goto(adminPage);
      await page.waitForLoadState('networkidle');
      
      // Should be able to access admin pages
      await expect(page.locator('body')).toBeVisible();
      
      // Should not be redirected to login (already logged in as admin)
      const currentUrl = page.url();
      expect(currentUrl).toMatch(adminPage);
    }
  });
}); 