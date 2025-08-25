import { test } from '@playwright/test';
import { ProductPage } from './page-objects/ProductPage';
import { RepositoryAccess } from './page-objects/RepositoryAccess';

test.describe('Test that website repository is valid and publicly accessible', () => {
    let productPage: ProductPage;
    let repoAccess: RepositoryAccess;

    test.beforeEach(async ({ page }) => {
        productPage = new ProductPage(page);
        repoAccess = new RepositoryAccess(page);
        await productPage.goto('/');
    })

    test('verify github repo is publically accessible, can be cloned and has README.md at root', async ({ page }) => {
        const repoUrl = await repoAccess.getRepoUrl();
        await repoAccess.verifyUrlValid(repoUrl);

        let tempdir: string | null = null;

        try {
            const cloneDir = await repoAccess.cloneRepository(repoUrl);
            tempdir = cloneDir.replace('/cloned-repo', '');

            await repoAccess.verifyReadmeExists(cloneDir);
        } finally {
            if (tempdir) {
                await repoAccess.cleanupDirectory(tempdir);
            }
        }
    });
})