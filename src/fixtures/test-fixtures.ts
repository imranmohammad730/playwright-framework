import { test as base, Page, expect } from '@playwright/test';
import { ApiClient } from '../utils/api-client';
import { LoginPage } from '../pages/LoginPage';
import { loadEnvironment } from '../config/environments';
import { testData, TestUser } from '../utils/test-data';

interface Fixtures {
  authenticatedPage: Page;
  apiClient: ApiClient;
  freshUser: TestUser;
  loginPage: LoginPage;
}

/**
 * Extended test object with custom fixtures.
 * Import this `test` and `expect` everywhere instead of the bare Playwright one.
 *
 * Available fixtures:
 *   - authenticatedPage: page that is already logged in as the test user
 *   - apiClient: typed API client authed with the same session
 *   - freshUser: a randomized user, useful for sign-up and isolation tests
 *   - loginPage: pre-instantiated LoginPage page object
 */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  freshUser: async ({}, use) => {
    const user = testData.user();
    await use(user);
  },

  apiClient: async ({}, use) => {
    const client = await ApiClient.create();
    await use(client);
    await client.dispose();
  },

  authenticatedPage: async ({ page }, use) => {
    const env = loadEnvironment();
    const login = new LoginPage(page);
    await login.goto();
    await login.signIn({ email: env.testUser.email, password: env.testUser.password });
    await use(page);
  },
});

export { expect };
