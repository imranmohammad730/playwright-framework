import { test as setup } from '@playwright/test';
import { loadEnvironment } from './src/config/environments';
import { LoginPage } from './src/pages/LoginPage';

const authFile = 'auth/storage-state.json';

/**
 * Logs in once, stores auth state to disk, then every authenticated test
 * picks up the session without re-running the login flow.
 *
 * Cuts CI time substantially on suites where most tests are authenticated.
 */
setup('authenticate', async ({ page }) => {
  const env = loadEnvironment();
  const login = new LoginPage(page);

  await login.goto();
  await login.signIn({
    email: env.testUser.email,
    password: env.testUser.password,
  });

  await page.context().storageState({ path: authFile });
});
