import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from "./BasePage";

export class CartPanel extends BasePage {
    readonly cartPanel: Locator;
    readonly openCartButton: Locator;
    readonly closeCartButton: Locator;
    readonly subtotalPanel: Locator;

    constructor(page: Page) {
        super(page);

        this.cartPanel = this.page.locator('div:has(button:has-text("X")):has(*:has-text("Cart"))').last();
        this.subtotalPanel = this.cartPanel.locator('div:has(*:text-is("SUBTOTAL"))');
        
    }

    async openCart(): Promise<void> {
        if(await this.isCartOpen()) {
            return;
        }
    }
    async isCartOpen(): Promise<boolean> {
        return await this.cartPanel.getByText('SUBTOTAL').isVisible();
    }

    async verifyProductInCart(productName: string) {
        if (!await this.isCartOpen()) {
            await this.openCart();
        }

        await expect(this.cartPanel.getByText(productName).first()).toBeVisible();
    }

    async verifyQuantityText(expectedQuantity: number) {
        if (!await this.isCartOpen()) {
            await this.openCart();
        }

        await expect(this.cartPanel.getByText(`Quantity: ${expectedQuantity}`)).toBeVisible();
    }

    async verifySubtotal(expectedSubtotal: number) {
        if (!await this.isCartOpen()) {
            await this.openCart();
        }
        
        const subTotalStr = expectedSubtotal.toString();
        const [dollars, cents] = subTotalStr.split('.');
        const subTotalLocator = this.subtotalPanel.locator(`text=/\\$\\s*${dollars}\\s*\\.\\s*${cents}/`);
        await expect(subTotalLocator.first()).toBeVisible();
    }

    async getCartItemCount(): Promise<number> {
            if(await this.cartPanel.isVisible()) {
                const panelText = await this.cartPanel.textContent();
                const itemCount = panelText?.match(/X(\d+)Cart/);

                if(itemCount) {
                    const count = parseInt(itemCount[1]);
                    if (!isNaN(count) && count > 0) return count;
                }
            }
            
            console.warn('Failed to get cart count');
            return 0;
    }
}