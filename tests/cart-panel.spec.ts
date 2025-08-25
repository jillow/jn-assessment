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

    test('should handle quantity adjustment via cart panel correctly', async({ page }) =>  {
        const cart = TEST_CARTS.DOUBLE_QUANTITY;
        
        await productPage.addProductToCartByIndex(0);
        await cartPanel.increaseItemQuantity(0);
        
        await cartPanel.verifyQuantityText(cart.quantity)
        await cartPanel.verifySubtotal(cart.expectedSubtotal);
        const cartCount = await cartPanel.getCartItemCount();
        expect(cartCount).toBe(cart.quantity);
    });

    test('should handle quantity adjustment via add to cart button correctly', async({ page }) => {
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
})