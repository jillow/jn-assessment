import { Page, Locator, expect } from '@playwright/test';

/**
 * Base page class providing common functionality for all page objects
 */
export abstract class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL or path
     * @param url url to navigate to
     */
    async goto(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Wait for an element to be visible on the page
     * @param locator the locator of the element to wait for
     */
    protected async waitForElement(locator: Locator): Promise<void> {
        await expect(locator).toBeVisible();
    }
}