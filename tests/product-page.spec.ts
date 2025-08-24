import { test, expect } from '@playwright/test';
import { ProductPage } from './page-objects/ProductPage';
import { CATALOGUE_CONFIG, SIZE_FILTERS_TESTS } from './test-data/products';

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

        test('should filter products by size correctly', async ({ page }) => {
            const testCase = SIZE_FILTERS_TESTS[0]; // run all eventually
            await productPage.filterBySize(testCase.size);

            const filteredCount = await productPage.getProductCount();
            expect(filteredCount).toBeLessThan(CATALOGUE_CONFIG.EXPECTED_PRODUCT_COUNT);
            expect(filteredCount).toBeGreaterThan(0);
            await expect(page.getByText(testCase.expectedProducts[0])).toBeVisible();
        });
    });
});