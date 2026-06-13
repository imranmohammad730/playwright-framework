import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface Credentials {
  email: string;
  password: string;
}

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/login');
  }

  /**
   * Performs a login. Returns the page so callers can chain navigation.
   * Page objects should expose user-level actions, not raw selectors.
   */
  async signIn({ email, password }: Credentials): Promise<void> {
    await this.byTestId('email-input').fill(email);
    await this.byTestId('password-input').fill(password);
    await this.byTestId('sign-in-button').click();
    await this.page.waitForURL(/\/dashboard/);
  }

  async signInExpectingError({ email, password }: Credentials): Promise<string> {
    await this.byTestId('email-input').fill(email);
    await this.byTestId('password-input').fill(password);
    await this.byTestId('sign-in-button').click();

    const error = this.byTestId('login-error');
    await expect(error).toBeVisible();
    return (await error.textContent()) ?? '';
  }

  async clickForgotPassword(): Promise<void> {
    await this.byTestId('forgot-password-link').click();
    await this.expectUrlContains('/forgot-password');
  }
}
