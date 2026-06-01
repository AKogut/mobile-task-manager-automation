# Appium E2E Tests

Cross-platform end-to-end automation written in TypeScript using Appium,
WebdriverIO 9, and Mocha.

## Prerequisites

- Node.js 22.11 or newer.
- Appium server running on `http://localhost:4723`.
- Xcode and the configured iOS simulator for iOS runs.
- Android Studio, Android SDK, and the configured Android emulator for Android runs.
- Built app binaries at the paths configured in `src/config/`.

## Install

```sh
cd appium-tests
yarn install
```

## Run Tests

```sh
yarn test:ios
yarn test:android
```

## Test Structure

```text
src/tests/auth/
  auth.smoke.spec.ts
  auth.negative.spec.ts
  auth.regression.spec.ts
```

Full test case definitions are in [`docs/test-cases/`](../docs/test-cases/).

## Other Commands

```sh
yarn typecheck
yarn lint
```
