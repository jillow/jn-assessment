# React Shopping Cart Test Automation Suite

A Playwright test automation suite for testing the Typescript React Shopping cart application's functionality. Built with Typescript and following the Page Object Model pattern.

## Project Overview

The test suite provides automated testing coverage for a simple react shopping site that includes:
    - Product catalogue with filtering options
    - Shopping cart functionality
    - Checkout process

## Prerequisites 

Before installing and running this project, ensure you have the following installed and/or available on your system:
    - Node.js - version 14 or higher
    - npm -  by default should be bundled with Node.js installation
    - Git - required for the repository accessibility tests
    - Internet connectivity - the site under test is hosted remotely

## Installation

### Install Dependencies

```cmd
# Install all project dependencies
npm install
```

### Install Playwright and Browsers

```cmd
# Install Playwright browser binaries
npm run test:install
```

## Running Tests

### Basic Test Execution

```cmd
#Run all tests
npm test
```

### Interactive and Debug Modes

```cmd
#Run tests with interactive Playwright UI
npm run test:ui

#Run test in headed mode
npm run test:headed

#Run test in debug mode
npm run test:debug
```

### Specific Test Execution

```cmd
#Run only product page tests
npm run test:product-page

#Run only cart panel tests
npm run test:cart-panel

#Run only repository access tests
npm run test:repo-access
```

## Assumptions and Limitations

### System Requirements

- Operating system: Windows, macOS or Linux
- Memory: 4GB RAM recommended for parrallel test execution
- Disk space: 1GB of free space for browsers and test artifacts

### Test Environment Assumptions

- Website availability: Tests assume the target site (https://automated-test-evaluation.web.app/) us accesible and operational
- Browser compatibility: Tests are designed for all modern major browsers supported by Playwright

### Repository Accessbility Tests

- Git installation: Repository cloning tests assume an existing Git installation is present and configured for command line access on the host machine
- GitHub access: Tests assume github.com is accessible for repository validation and clone
- Temporary storage: Tests assume they can read and write to a suitable temporary directory on the host file system (these are automatically cleaned up after test execution)
- Network Permissions: Tests require and outbound HTTPS connection to Github

### Test Data Limitations

- Product count: Tests expect exactly 16 products in the full catalogue - this has been hard coded in product.ts - in a real world project this number would be obtained dynamically from either a production data source or from a stable testing data subset
- Price Format: Tests expect prices in USD format with a decimal seperator
- Product Names: Tests rely on specific product names defined in product.ts - in real world project these names would be stored and retrieved from an external test data source or perhaps a product API

### Known Limitations

- Dyanmic Content: Current tests rely on visible text and structural selectors. This means they may fail if the website content or layout changes significantly. In a real-world framework, most locators would use stable data-testid attributes (added by developers and documented for QA). This ensures tests remain reliable even if UI text or structure changes.

### Future Enhancements

Given more time, the test scope could be expanded to include:

- Free shipping badge: verify that the badge appears on eligble products only
- Product image rollover event: confirm that images are updated correctly on mouse hover/rollover
- Improved locator resilience: add fallback locator strategies to reduce brittleness
- Cart stress tests: simulate rapidly adding and removing items to ensure cart stability
- Accessibility checks: validate keyboard navigation and basic accessiblity compliance
- Catalogue coverage: systemically test all product combinations in the catalogue, not just a small subset
- Size/variant combinations: verify every size option can be selected and added to the cart without error






