/**
 * E2E Test Example using Playwright
 * Tests complete user flow: register -> browse products -> add to cart -> checkout
 *
 * To run: npx playwright test
 *
 * Prerequisites:
 * - Backend API running at http://localhost:5000
 * - Frontend running at http://localhost:5173
 */

import { test, expect } from "@playwright/test";

const API_URL = "http://localhost:5000";
const APP_URL = "http://localhost:5173";

test.describe("AI Store E2E Tests", () => {
  test("complete purchase flow", async ({ page }) => {
    // Navigate to the app
    await page.goto(APP_URL);

    // Should see products list on home page
    await expect(
      page.locator("h2").filter({ hasText: "Products" })
    ).toBeVisible();

    // Click Register link
    await page.click("text=Register / Login");
    await expect(page).toHaveURL(`${APP_URL}/register`);

    // Fill registration form
    const timestamp = Date.now();
    await page.fill('input[type="text"]', `testuser_${timestamp}`);
    await page.fill('input[type="email"]', `test_${timestamp}@example.com`);

    // Submit registration
    await page.click('button:has-text("Register")');

    // Should redirect to home page and see user info in header
    await expect(page).toHaveURL(APP_URL + "/");
    await expect(page.locator("text=User ID:")).toBeVisible();

    // Click on first product's "Add to Cart" button
    await page.click('button:has-text("Add to Cart")').first();

    // Should see success message
    await expect(page.locator("text=Item added to cart")).toBeVisible();

    // Navigate to cart
    await page.click('a:has-text("Cart")');
    await expect(page).toHaveURL(`${APP_URL}/cart`);

    // Should see cart items
    await expect(
      page.locator("h2").filter({ hasText: "Shopping Cart" })
    ).toBeVisible();
    await expect(page.locator("text=Subtotal:")).toBeVisible();

    // Proceed to checkout
    await page.click('button:has-text("Proceed to Checkout")');

    // Should see checkout success message
    await expect(page.locator("text=Checkout Successful")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("text=Total Amount:")).toBeVisible();

    // Continue shopping
    await page.click('button:has-text("Continue Shopping")');
    await expect(page).toHaveURL(APP_URL + "/");
  });

  test("product detail page flow", async ({ page }) => {
    // Go to home page
    await page.goto(APP_URL);

    // Click on first product name to go to detail page
    await page.click("h3").first();

    // Should be on product detail page
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=available")).toBeVisible();

    // Click back to products
    await page.click('button:has-text("Back to Products")');
    await expect(page).toHaveURL(APP_URL + "/");
  });

  test("validation errors on registration", async ({ page }) => {
    await page.goto(`${APP_URL}/register`);

    // Try to submit empty form
    await page.click('button:has-text("Register")');

    // Should show validation error
    await expect(page.locator("text=Username is required")).toBeVisible();

    // Fill username but leave email empty
    await page.fill('input[type="text"]', "testuser");
    await page.click('button:has-text("Register")');

    // Should show email required error
    await expect(page.locator("text=Email is required")).toBeVisible();

    // Fill invalid email
    await page.fill('input[type="email"]', "invalid-email");
    await page.click('button:has-text("Register")');

    // Should show email format error
    await expect(page.locator("text=valid email address")).toBeVisible();
  });

  test("logout functionality", async ({ page }) => {
    // Assume user is registered (use localStorage to simulate)
    await page.goto(APP_URL);
    await page.evaluate(() => {
      localStorage.setItem("ai-store-user-id", "1");
    });
    await page.reload();

    // Should see logout button
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();

    // Click logout
    await page.click('button:has-text("Logout")');

    // Should see Register link instead
    await expect(page.locator('a:has-text("Register / Login")')).toBeVisible();
    await expect(page.locator('button:has-text("Logout")')).not.toBeVisible();
  });
});
