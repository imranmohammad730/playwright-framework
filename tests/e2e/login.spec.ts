import { test, expect } from '../../src/fixtures/test-fixtures';
import { loadEnvironment } from '../../src/config/environments';

test.describe('Login flow @regression', () => {
  test('user signs in with valid credentials @critical', async ({ loginPage, page }) => {
    const env = loadEnvironment();
    await loginPage.goto();
    await loginPage.signIn({
      email: env.testUser.email,
      password: env.testUser.password,
    });
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('rejects invalid password with a clear message', async ({ loginPage }) => {
    const env = loadEnvironment();
    const message = await loginPage.signInExpectingError({
      email: env.testUser.email,
      password: 'definitely-wrong-password',
    });
    expect(message.toLowerCase()).toContain('invalid');
  });

  test('rejects unknown email with a clear message', async ({ loginPage }) => {
    const message = await loginPage.signInExpectingError({
      email: 'does-not-exist@example.com',
      password: 'whatever-1234',
    });
    expect(message.length).toBeGreaterThan(0);
  });

  test('forgot password link navigates to recovery page', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.clickForgotPassword();
  });

  test('authenticated session can hit a protected route via fixture', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/settings');
    await expect(authenticatedPage.locator('h1')).toContainText(/settings/i);
  });
});
