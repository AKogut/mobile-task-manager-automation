# Appium E2E Tests

Cross-platform end-to-end automation written in **TypeScript** using **Appium** and **WebdriverIO**.

## Planned structure

```text
appium-tests/
├── page-objects/     # Screen objects and reusable selectors
├── specs/            # Login, task CRUD, settings
└── wdio.conf.ts      # WebdriverIO runner configuration
```

## Integration

- E2E tests target the iOS and Android apps built from `app/`
- Mirror `testID` values used by React Native screens
- Run via WebdriverIO against local simulators/emulators or CI device runners

## Status

Scaffolding is in place. Appium dependencies, configuration, and TypeScript test sources will be added in the **cross-platform E2E automation** milestone.
