import { test, expect } from '@playwright/test';

test.describe('Core End-User Operations', () => {
  test('Sign in with valid credentials and reject invalid credentials', async ({ page }) => {
    // 1. Start from a fresh browser state and navigate to https://www.saucedemo.com.
    await page.goto('https://www.saucedemo.com');
    await expect(page.getByRole('form', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // 2. Enter username standard_user and password secret_sauce, then click Login.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();

    // 3. Reset to a fresh browser state, enter an invalid username or password, and click Login.
    await page.locator('button:has-text("Open Menu")').click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await page.locator('[data-test="username"]').fill('invalid_user');
    await page.locator('[data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('alert')).toContainText('Username and password do not match any user');
  });
});
