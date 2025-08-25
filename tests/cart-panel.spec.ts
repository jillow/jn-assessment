import { test, expect } from '@playwright/test';
import { TEST_CARTS } from './test-data/products';
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
    })
})