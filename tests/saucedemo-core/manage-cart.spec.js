import { test, expect } from '@playwright/test';

test.describe('Core End-User Operations', () => {
  test('Add, review, and remove products from the cart', async ({ page }) => {
    // 1. Start from a fresh browser state, sign in, and open the Products page.
    await page.goto('https://www.saucedemo.com');
    await page.locator('input[data-test="username"]').fill('standard_user');
    await page.locator('input[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
    await expect(page.locator('[data-test^="remove-"]')).toHaveCount(0);

    // 2. Add Sauce Labs Backpack and Sauce Labs Bike Light to the cart.
    await page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('button[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.getByRole('button', { name: 'Cart, 2 items' })).toBeVisible();
    await expect(page.locator('button[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('button[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();

    // 3. Open the cart.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Backpack' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Bike Light' })).toBeVisible();
    await expect(page.locator('[data-test="item-quantity"]')).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();

    // 4. Remove the Bike Light from the cart.
    await page.locator('button[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(page.getByRole('button', { name: 'Cart, 1 item' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Bike Light' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Backpack' })).toBeVisible();

    // 5. Remove the Backpack and open the cart.
    await page.locator('button[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Backpack' })).toHaveCount(0);
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(page.getByRole('form', { name: 'Checkout information' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  });
});
