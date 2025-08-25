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

    async getRepoUrl(): Promise<string> {
        const url = await this.gitHubButton.getAttribute('href');
        
        if(!url) {
            throw new Error('Github repo url could not be extracted');
        }

        return url;
    }

    async verifyUrlValid(url: string): Promise<void> {
        const response = await this.page.request.get(url);
        expect(response.status()).toBe(200);
    }

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

    private async createTempDirectory(): Promise<string> {
        const tempDir = path.join(os.tmpdir(), `playwright-repo-test-${Date.now()}`);
        fs.mkdirSync(tempDir, { recursive: true });
        return tempDir;
    }

    async cleanupDirectory(dirPath: string): Promise<void> {
        if(fs.existsSync(dirPath)) {
            try {
                fs.rmSync(dirPath, { recursive: true, force: true });
            } catch(error) {
                console.warn(`Failed to cleanup direcotry ${dirPath}:`, error);
            }
        }
    }

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