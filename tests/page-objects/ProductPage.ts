import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
    readonly productCountText: Locator;

    constructor(page: Page) {
        super(page);

        this.productCountText = page.locator('text=/\\d+ Product\\(s\\) found/');
    }

    async goto(url: string): Promise<void> {
        await super.goto(url);
    }

    async getProductCount(): Promise<number> {
        const countText = await this.productCountText.textContent();
        const match = countText?.match(/(\d+) Product\(s\) found/);
        return match ? parseInt(match[1]) : 0;
    }
}