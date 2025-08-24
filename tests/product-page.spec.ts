import { test, expect } from '@playwright/test';
import { ProductPage } from './page-objects/ProductPage';
import { CATALOGUE_CONFIG, EXPECTED_PRODUCTS, getProductsForSize } from './test-data/products';

test.describe('Product Page POM tests', () => {
    let productPage: ProductPage;

    test.beforeEach(async({ page }) => {
        productPage = new ProductPage(page);

        await productPage.goto('/');
    })

    test.describe('Product catalogue functionality', () => {
        test('should display correct product count on load', async ({ page }) => {
            const productCount = await productPage.getProductCount();
            expect(productCount).toBe(CATALOGUE_CONFIG.EXPECTED_PRODUCT_COUNT);
        });

        test('should filter products by size correctly', async ({ page }) => {
            for(const size of CATALOGUE_CONFIG.SIZES) {
                const expectedProducts = getProductsForSize(size);
                const expectedProduct = expectedProducts[0];

                await productPage.goto('/');
                await productPage.filterBySize(size);
                await expect(page.getByText(expectedProduct.name)).toBeVisible();
                //check products found matches number items displayed
            }
        });

        test('should handle multiple filter selections', async ({ page }) => {
            const sizeXs = CATALOGUE_CONFIG.SIZES[0];
            const sizeXxl = CATALOGUE_CONFIG.SIZES[6];
            const expectedXsProduct = getProductsForSize(sizeXs)[0];
            const expectedXxlProduct = getProductsForSize(sizeXxl)[0];

            await productPage.goto('/');
            await productPage.filterBySize(sizeXs);
            await productPage.filterBySize(sizeXxl);
            await expect(page.getByText(expectedXsProduct.name)).toBeVisible();
            await expect(page.getByText(expectedXxlProduct.name)).toBeVisible();
            //check products found matches number items displayed
        })

        test('should display product info correctly', async ({ page }) => {
            const visibleProducts = await productPage.getProductNames();

            expect(visibleProducts.length).toBeGreaterThan(0);
            const firstProduct = EXPECTED_PRODUCTS[0];
            await expect(page.getByText(firstProduct.name)).toBeVisible();
            await productPage.verifyPriceVisible(firstProduct.price); //validate against expected price also
        })
    });
});