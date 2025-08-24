import { test, expect } from '@playwright/test';
import { ProductPage } from './page-objects/ProductPage';

test.describe('Product Page POM tests', () => {
    let productPage: ProductPage;

    test.beforeEach(async({ page }) => {
        productPage = new ProductPage(page);

        await productPage.goto('/');
    })

    test.describe('Product catalogue functionality', () => {
        test('should display correct product count on load', async ({ page }) => {
            const productCount = await productPage.getProductCount();
            expect(productCount).toBe(16); //get this from config later
        });
    });
});