# Appium E2E Tests

Cross-platform end-to-end automation written in TypeScript using Appium 2,
WebdriverIO 9, and Mocha.

## Prerequisites

- Node 22.11 or newer.
- Appium 2 server available locally.
- Android SDK and the `Pixel_8_API_35` emulator for Android runs.
- Xcode and an iPhone 16 simulator running iOS 18.4 for iOS runs.
- Build the app before running tests. See
  [Build and Run](../docs/build-and-run.md).

## Install

Install dependencies from this directory:

```sh
yarn install
```

## Start Appium Server

Start Appium separately before running tests:

```sh
npx appium
```

## Run Android Tests

```sh
yarn test:android
```

## Run iOS Tests

```sh
yarn test:ios
```
