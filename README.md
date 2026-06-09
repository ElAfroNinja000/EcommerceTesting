# SauceDemo Playwright Test Suite

This project contains end-to-end tests for SauceDemo using Playwright and TypeScript.

## Prerequisites

- Node.js 18+
- npm

## Install

```bash
npm install
npx playwright install
```

## Run tests

```bash
npm test
```

## Useful scripts

- `npm run test:headed` - Run tests with visible browsers.
- `npm run test:ui` - Open Playwright UI mode.
- `npm run test:debug` - Run with Playwright Inspector.
- `npm run test:smoke` - Run only `@smoke` scenarios.
- `npm run test:auth` - Run only `@auth` scenarios.
- `npm run test:checkout` - Run only `@checkout` scenarios.
- `npm run test:regression` - Run only `@regression` scenarios.
- `npm run report` - Open the last HTML report.

## Test tagging and selective execution

The suite uses lightweight tags in test titles:

- `@smoke` for quick confidence checks
- `@auth` for login and credential behavior
- `@checkout` for purchase flow validation
- `@regression` for broader critical path coverage

You can also run tags directly with Playwright:

```bash
npx playwright test --grep @smoke
```

## Test file

- `tests/saucedemo.spec.ts`
