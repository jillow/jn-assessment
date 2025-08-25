import { test, expect } from '@playwright/test';
import { EXPECTED_PRODUCTS, TEST_CARTS } from './test-data/products';
import { ProductPage } from './page-objects/ProductPage';
import { CartPanel } from './page-objects/CartPanel';

test.describe('Cart panel functionality', () => {
    let productPage: ProductPage;
    let cartPanel: CartPanel;

    test.beforeEach(async({ page }) => {
        productPage = new ProductPage(page);
        cartPanel = new CartPanel(page);
        await productPage.goto('/');
    })

    test('should add single item to cart successfully', async({ page }) => {
        const cart = TEST_CARTS.SINGLE_ITEM;

        await productPage.addProductToCartByIndex(0);

        await cartPanel.verifyProductInCart(cart.product.name);
        await cartPanel.verifyQuantityText(1);
        await cartPanel.verifySubtotal(cart.expectedSubtotal);
        const cartCount = await cartPanel.getCartItemCount();
        expect(cartCount).toBe(1);
    });

    test('should handle increase quantity adjustment via cart panel correctly', async({ page }) =>  {
        const cart = TEST_CARTS.DOUBLE_QUANTITY;
        
        await productPage.addProductToCartByIndex(0);
        await cartPanel.increaseItemQuantity(0);
        
        await cartPanel.verifyQuantityText(cart.quantity);
        await cartPanel.verifySubtotal(cart.expectedSubtotal);
        const cartCount = await cartPanel.getCartItemCount();
        expect(cartCount).toBe(cart.quantity);
    });

    test('should handle decrease quantity adjustment correctly', async ({ page }) => {
        const cart = TEST_CARTS.DOUBLE_QUANTITY;

        await productPage.addProductToCartByIndex(0);
        await cartPanel.increaseItemQuantity(0);

        await cartPanel.verifyQuantityText(cart.quantity);
        const cartCount = await cartPanel.getCartItemCount();
        expect(cartCount).toBe(cart.quantity);

        await cartPanel.decreaseItemQuantity(0);

        await cartPanel.verifyQuantityText(cart.quantity - 1);
        await cartPanel.verifySubtotal(cart.expectedSubtotal / 2);
        const updatedCartCount = await cartPanel.getCartItemCount();
        expect(updatedCartCount).toBe(cart.quantity - 1);
    });

    test('should handle increase quantity adjustment via add to cart button correctly', async({ page }) => {
        const cart = TEST_CARTS.DOUBLE_QUANTITY;

        await productPage.addProductToCartByIndex(0);
        await productPage.addProductToCartByIndex(0);

        await cartPanel.verifyQuantityText(cart.quantity)
        await cartPanel.verifySubtotal(cart.expectedSubtotal);
        const cartCount = await cartPanel.getCartItemCount();
        expect(cartCount).toBe(cart.quantity);
    });

    test('should handle adding multiple different items to cart correctly', async({ page }) => {
        await productPage.addProductToCartByIndex(0);
        await productPage.addProductToCartByIndex(1);

        await cartPanel.verifyProductInCart(EXPECTED_PRODUCTS[0].name);
        await cartPanel.verifyProductInCart(EXPECTED_PRODUCTS[1].name);
        const productCount = await cartPanel.getUniqueItemCount();
        expect(productCount).toBe(2);
    });

    test('should calculate subtotal with multiple different items correctly', async({ page }) => {
        const cart = TEST_CARTS.DOUBLE_ITEM_DOUBLE_QUANTITY;

        await productPage.addProductToCartByIndex(0);
        await productPage.addProductToCartByIndex(1);
        await cartPanel.increaseItemQuantity(0);
        await cartPanel.increaseItemQuantity(1);

        await cartPanel.verifySubtotal(cart.expectedSubtotal);
    });

    test('should maintain cart state when close and reopened', async({ page }) => {
        const cart = TEST_CARTS.SINGLE_ITEM;

        await productPage.addProductToCartByIndex(0);
        
        await cartPanel.closeCart();
        await cartPanel.openCart();

        await cartPanel.verifyProductInCart(cart.product.name);
        await cartPanel.verifyQuantityText(cart.quantity);
        await cartPanel.verifySubtotal(cart.expectedSubtotal);
    });

    test('should show empty cart alert when checkout clicked with no items', async({ page }) => {
        let alertMessage = '';
        page.on('dialog', async dialog => {
            alertMessage = dialog.message();
            await dialog.accept();
        });

        await cartPanel.proceedToCheckout();

        if(alertMessage) {
            expect(alertMessage).toContain('Add some product in the cart!');
        }
    });

    test('should show subtotal alert when checkout clicked with items in cart', async({ page }) => {
        const cart = TEST_CARTS.DOUBLE_ITEM_DOUBLE_QUANTITY;

        let alertMessage = '';
        page.on('dialog', async dialog => {
            alertMessage = dialog.message();
            await dialog.accept();
        });

        await productPage.addProductToCartByIndex(0);
        await productPage.addProductToCartByIndex(0);
        await productPage.addProductToCartByIndex(1);
        await productPage.addProductToCartByIndex(1);
        await cartPanel.proceedToCheckout();

        if(alertMessage) {
            const expectedSubtotalText = `${cart.expectedSubtotal.toFixed(2)}`;
            expect(alertMessage).toContain(expectedSubtotalText);
        }
    });
})