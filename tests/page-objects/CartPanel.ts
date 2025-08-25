import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from "./BasePage";

export class CartPanel extends BasePage {
    readonly cartPanel: Locator;
    readonly openCartButton: Locator;
    readonly closeCartButton: Locator;
    readonly subtotalPanel: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page);

        this.cartPanel = this.page.locator('div:has(button:has-text("X")):has(*:has-text("Cart"))').last();
        this.subtotalPanel = this.cartPanel.locator('div:has(*:text-is("SUBTOTAL"))');
        this.openCartButton = this.page.locator('button:has([title="Products in cart quantity"])');
        this.closeCartButton = this.page.getByRole('button', { name: 'X'});
        this.checkoutButton = this.cartPanel.getByRole('button', { name: 'CHECKOUT'});
    }

    /**
     * Opens the shopping cart panel
     * @returns nothing
     */
    async openCart(): Promise<void> {
        if(await this.isCartOpen()) {
            return;
        }

        await this.openCartButton.click();
    }

    /**
     * Closes the shopping cart panel
     */
    async closeCart(): Promise<void> {
        await this.closeCartButton.click();
    }

    /**
     * Check if the cart panel is currently open
     * @returns true if the cart panel is open, otherwise false
     */
    async isCartOpen(): Promise<boolean> {
        return await this.cartPanel.getByText('SUBTOTAL').isVisible();
    }

    /**
     * Click the checkout button
     */
    async proceedToCheckout() {
        if (!await this.isCartOpen()) {
            await this.openCart();
        }

        await this.checkoutButton.click();
    }

    /**
     * Verify that a specific product is in the cart
     * @param productName the product name to verify is in the cart
     */
    async verifyProductInCart(productName: string) {
        if (!await this.isCartOpen()) {
            await this.openCart();
        }

        await expect(this.cartPanel.getByText(productName).first()).toBeVisible();
    }

    /**
     * Verify the cart has the expected quantity text
     * @param expectedQuantity the quantity to verify of product to verify in the cart
     */
    async verifyQuantityText(expectedQuantity: number) {
        if (!await this.isCartOpen()) {
            await this.openCart();
        }

        await expect(this.cartPanel.getByText(`Quantity: ${expectedQuantity}`)).toBeVisible();
    }

    /**
     * Verifies the cart matches an expected amount
     * @param expectedSubtotal the cart subtotal to verify against
     */
    async verifySubtotal(expectedSubtotal: number) {
        if (!await this.isCartOpen()) {
            await this.openCart();
        }
        
        const subTotalStr = expectedSubtotal.toString();
        const [dollars, cents] = subTotalStr.split('.');
        const subTotalLocator = this.subtotalPanel.locator(`text=/\\$\\s*${dollars}\\s*\\.\\s*${cents}/`); // find prices in format: $12.34
        await expect(subTotalLocator.first()).toBeVisible();
    }

    /**
     * Get the number of items currently in the cart
     * @returns the number of items currently in the cart
     */
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

    /**
     * Increases the quantity of a specified item currently in the cart
     * @param productIndex the index of the item to increase the quantity of
     */
    async increaseItemQuantity(productIndex: number) {
        if(!await this.isCartOpen()) {
            await this.openCart();
        }

        const increaseQuantityButton = this.cartPanel.getByRole('button', { name: '+'}).nth(productIndex);
        await expect(increaseQuantityButton).toBeVisible();
        await increaseQuantityButton.click();
    }

    /**
     * Decreases the quantity of a specified item currently in the cart
     * @param productIndex the index of the item to decrease the quantity of
     */
    async decreaseItemQuantity(productIndex: number) {
        if(!await this.isCartOpen()) {
            await this.openCart();
        }

        const decreaseQuantityButton = this.cartPanel.getByRole('button', { name: '-'}).nth(productIndex);
        await expect(decreaseQuantityButton).toBeVisible();
        await decreaseQuantityButton.click();
    }

    /**
     * Get the number of unique items (line items) currently in the cart
     * @returns the number of unique items in the cart
     */
    async getUniqueItemCount(): Promise<number> {
        if(!await this.isCartOpen()) {
            await this.openCart();
        }

        const removeButtons = this.cartPanel.getByRole('button', { name: 'remove product from cart' });
        return await removeButtons.count();
    }
}