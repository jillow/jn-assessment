import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
    readonly productCountText: Locator;
    readonly productNames: Locator;

    constructor(page: Page) {
        super(page);

        this.productCountText = page.locator('text=/\\d+ Product\\(s\\) found/');
        this.productNames = page.locator('h1, h2, h3, h4, h5, h6'); //find something better
    }

    async goto(url: string): Promise<void> {
        await super.goto(url);
    }

    async getProductCount(): Promise<number> {
        const countText = await this.productCountText.textContent();
        const match = countText?.match(/(\d+) Product\(s\) found/);
        return match ? parseInt(match[1]) : 0;
    }

    async filterBySize(size: string): Promise<void> {
        await this.page.getByText(size, { exact: true}).click();
    }

    async getProductNames(): Promise<string[]> {
        await this.productNames.first().waitFor({ state: 'visible'});
        const names = await this.productNames.allTextContents();
        return names.filter(name => name.trim().length > 0);
    }

    async verifyPriceVisible(price: number) {
        const priceStr = price.toString();
        const [dollars, cents] = priceStr.split('.');
        const priceLocator = this.page.locator(`text=/\\$\\s*${dollars}\\s*\\.\\s*${cents}/`);

        await expect(priceLocator.first()).toBeVisible();
    }
}