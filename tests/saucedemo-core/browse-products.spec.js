import { test, expect } from '@playwright/test';

test.describe('Core End-User Operations', () => {
  test('Browse, sort, and inspect a product before selecting it', async ({ page }) => {
    // 1. Start from a fresh browser state, sign in as standard_user with password secret_sauce, and open the Products page.
    await page.goto('https://www.saucedemo.com');
    await page.locator('input[data-test="username"]').fill('standard_user');
    await page.locator('input[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.locator('[data-test^="add-to-cart"]')).toHaveCount(6);
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Backpack' })).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Bike Light' })).toHaveCount(2);
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');

    // 2. Change Sort products to Price (low to high).
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('lohi');
    await expect(page.locator('[data-test="item-2-title-link"]')).toHaveText('Sauce Labs Onesie');
    await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light');

    // 3. Open the Sauce Labs Backpack product details.
    await page.locator('[data-test="item-4-img-link"]').click();
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=4$/);
    await expect(page.getByRole('img', { name: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.getByText('$29.99', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();

    // 4. Use Back to products and select the Name (Z to A) sort option.
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await page.locator('select[data-test="product-sort-container"]').selectOption('za');
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('za');
    await expect(page.locator('[data-test="item-3-title-link"]')).toHaveText('Test.allTheThings() T-Shirt (Red)');
    await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light');
  });
});
