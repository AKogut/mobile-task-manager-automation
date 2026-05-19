# Appium E2E Tests

Cross-platform end-to-end tests powered by **Appium 2** and **WebdriverIO 9** with **TypeScript**.

## Structure

```text
appium-tests/
├── page-objects/     # Screen objects and reusable selectors
├── specs/            # Mocha test suites
└── wdio.conf.ts      # WebdriverIO runner configuration
```

## Prerequisites

- Node.js 22+
- Appium 2 (`npx appium driver install uiautomator2 xcuitest`)
- Built app artifacts for iOS and/or Android (see `app/` README)
- Running simulator or emulator

## Commands

```bash
npm install
npm run typecheck
npm run test
npm run test:ios
npm run test:android
```

## Conventions

- Prefer `testID` accessibility identifiers shared with native test suites
- Keep selectors in page objects, not in spec files
- One spec file per user-facing flow (auth, tasks, settings)
