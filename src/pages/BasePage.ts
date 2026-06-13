import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage holds behavior every page object inherits.
 * Keep this small. If a method only fits one page, put it there.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Navigate to a path relative to the configured baseURL.
   */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
    await this.waitForReady();
  }

  /**
   * Wait until the page has settled. Override in subclasses if a page
   * has a more specific readiness signal than networkidle.
   */
  protected async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Assert the current URL contains the expected path fragment.
   */
  async expectUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }

  /**
   * Take a named screenshot. Used for visual regression and debugging.
   */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Convenience helper for finding by data-testid since we use it heavily.
   */
  protected byTestId(id: string): Locator {
    return this.page.locator(`[data-testid="${id}"]`);
  }
}
