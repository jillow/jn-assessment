import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
    readonly productCountText: Locator;
    readonly productNames: Locator;
    readonly addToCartButtons: Locator;

    constructor(page: Page) {
        super(page);

        this.productCountText = page.locator('text=/\\d+ Product\\(s\\) found/');
        this.productNames = page.locator('h1, h2, h3, h4, h5, h6'); //find something better
        this.addToCartButtons = page.locator('button:has-text("Add to cart")');
    }

    /**
     * Navigate to the product page and wait for a product to load
     * @param url ProductPage url
     */
    async goto(url: string): Promise<void> {
        await super.goto(url);
        await this.waitForProductsToLoad();
    }

    /**
     * Wait for products to load on the page using element waiting
     */
    async waitForProductsToLoad(): Promise<void> {
        await this.waitForElement(this.addToCartButtons.first());
    }

    /**
     * Get the current product count from the page
     * @returns the number of products matching the applied filter, currently visible on the page
     */
    async getProductCount(): Promise<number> {
        const countText = await this.productCountText.textContent();
        const match = countText?.match(/(\d+) Product\(s\) found/); //find strings like: '16 Product(s) found'
        return match ? parseInt(match[1]) : 0;
    }

    /**
     * Filter products shown on the page to the selected size
     * @param size the size filter to apply
     */
    async filterBySize(size: string): Promise<void> {
        await this.page.getByText(size, { exact: true}).click();
    }

    /**
     * Get all visible product names
     * @returns all product name currently visible on the page
     */
    async getProductNames(): Promise<string[]> {
        await this.productNames.first().waitFor({ state: 'visible'});
        const names = await this.productNames.allTextContents();
        return names.filter(name => name.trim().length > 0);
    }

    /**
     * Verify that a specific price is visible on the page
     * @param price the price to check is visible on the page
     */
    async verifyPriceVisible(price: number) {
        const priceStr = price.toString();
        const [dollars, cents] = priceStr.split('.');
        const priceLocator = this.page.locator(`text=/\\$\\s*${dollars}\\s*\\.\\s*${cents}/`); // find prices in format: $12.34

        await expect(priceLocator.first()).toBeVisible();
    }

    /**
     * Add a specific product to the cart by index number
     * @param index the index of the product to add to the cart
     */
    async addProductToCartByIndex(index: number) {
        const button = this.addToCartButtons.nth(index);
        await expect(button).toBeVisible();
        await button.click();
    }
}