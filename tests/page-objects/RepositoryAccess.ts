import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export class RepositoryAccess extends BasePage {
    readonly gitHubButton: Locator;

    constructor(page: Page) {
        super(page);

        this.gitHubButton = this.page.locator('a[href*="github.com"]').first();
    }

    /**
     * Gets the website GitHub repo url from the github button
     * @returns the url of the repo the website is hosted in
     */
    async getRepoUrl(): Promise<string> {
        const url = await this.gitHubButton.getAttribute('href');
        
        if(!url) {
            throw new Error('Github repo url could not be extracted');
        }

        return url;
    }

    /**
     * Checks that the supplied URL is returning a 200 response
     * @param url the url to check is valid (response 200)
     */
    async verifyUrlValid(url: string): Promise<void> {
        const response = await this.page.request.get(url);
        expect(response.status()).toBe(200);
    }

    /**
     * Clones the repository at a specificed url
     * @param url the repsotiory url to clone
     * @returns the directory the repository was cloned to
     */
    async cloneRepository(url: string): Promise<string> {
        const tempDir = await this.createTempDirectory();
        const cloneDir = path.join(tempDir, 'cloned-repo');

        try {
            await execAsync(`git clone "${url}" "${cloneDir}"`);

            if(!fs.existsSync(cloneDir)) {
                throw new Error('Clone directory was not created');
            }

            return cloneDir;
        } catch(error) {
            await this.cleanupDirectory(tempDir);
            throw new Error(`Failed to clone repository: ${error}`);
        }
    }

    /**
     * Creates a temporary directory in the file system
     * @returns temporary directory path
     */
    private async createTempDirectory(): Promise<string> {
        const tempDir = path.join(os.tmpdir(), `playwright-repo-test-${Date.now()}`);
        fs.mkdirSync(tempDir, { recursive: true });
        return tempDir;
    }

    /**
     * Deletes a directory and all of its contents
     * @param dirPath the filepath of the directory to clean up
     */
    async cleanupDirectory(dirPath: string): Promise<void> {
        if(fs.existsSync(dirPath)) {
            try {
                fs.rmSync(dirPath, { recursive: true, force: true });
            } catch(error) {
                console.warn(`Failed to cleanup direcotry ${dirPath}:`, error);
            }
        }
    }

    /**
     * Verifies that the README.md file exists at the specified filepath
     * @param dirPath the directory filepath to check
     */
    async verifyReadmeExists(dirPath: string): Promise<void> {
        const readmePath = path.join(dirPath, 'README.md');

        const readmeExists = fs.existsSync(readmePath);

        if(!readmeExists) {
            throw new Error('README.md file not found in repository');
        }

        const stats = fs.statSync(readmePath);
        expect(stats.isFile()).toBe(true);
        expect(stats.size).toBeGreaterThan(0);
    }
}