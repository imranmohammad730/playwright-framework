import { test, expect } from '../../src/fixtures/test-fixtures';

/**
 * Smoke suite. Runs in under 30 seconds.
 * Goal: catch the obvious "is the site even up" failures.
 */

test.describe('Smoke @smoke', () => {
  test('homepage loads and is responsive @critical', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });

  test('login page renders required fields @critical', async ({ loginPage, page }) => {
    await loginPage.goto();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="sign-in-button"]')).toBeEnabled();
  });

  test('API health endpoint returns 200 @critical', async ({ apiClient: _apiClient, request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
  });
});
