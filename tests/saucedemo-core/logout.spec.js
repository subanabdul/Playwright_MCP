import { test, expect } from '@playwright/test';

test.describe('Core End-User Operations', () => {
  test('Log out and verify the session is closed', async ({ page }) => {
    // 1. Start from a fresh browser state, sign in as standard_user, and confirm the Products page is visible.
    await page.goto('https://www.saucedemo.com');
    await page.locator('input[data-test="username"]').fill('standard_user');
    await page.locator('input[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.locator('button:has-text("Open Menu")')).toBeVisible();

    // 2. Open the menu and click Logout.
    await page.locator('button:has-text("Open Menu")').click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('form', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // 3. Attempt to navigate directly to https://www.saucedemo.com/inventory.html without signing in again.
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('form', { name: 'Login' })).toBeVisible();
    await expect(page.getByText('Products', { exact: true })).toHaveCount(0);
  });
});
