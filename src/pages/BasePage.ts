import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage holds behavior every page object inherits.
 * Keep this small. If a method only fits one page, put it there.
 */
export abstract class BasePage {
    constructor(protected readonly page: Page) {}

  async goto(path: string = '/'): Promise<void> {
        await this.page.goto(path);
        await this.waitForReady();
  }

  protected async waitForReady(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
  }

  async expectUrlContains(fragment: string): Promise<void> {
        await expect(this.page).toHaveURL(new RegExp(fragment));
  }

  async screenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }

  protected byTestId(id: string): Locator {
        return this.page.locator(`[data-testid="${id}"]`);
  }
}
