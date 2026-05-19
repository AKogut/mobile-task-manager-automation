# Mobile Task Manager Automation

[![Node](https://img.shields.io/badge/node-%3E%3D22.11.0-339933?logo=node.js&logoColor=white)](./.nvmrc)
[![React Native](https://img.shields.io/badge/React%20Native-0.85-61DAFB?logo=react&logoColor=black)](./app)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](./app/tsconfig.json)

Portfolio-grade **React Native** task manager for **iOS** and **Android**, paired with **cross-platform** and **native** mobile test automation and a **CI/CD** pipeline.

## Overview

This repository demonstrates end-to-end mobile engineering skills:

| Area                   | Stack                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------- |
| **App**                | React Native, TypeScript, React Navigation, Zustand, AsyncStorage, React Hook Form, Zod |
| **Cross-platform E2E** | TypeScript, Appium 2, WebdriverIO 9                                                     |
| **iOS automation**     | Swift, XCUITest                                                                         |
| **Android automation** | Kotlin, Espresso                                                                        |
| **CI/CD**              | GitHub Actions, Android Emulator, iOS Simulator                                         |

## Repository structure

```text
mobile-task-manager-automation/
├── app/                 # React Native application
├── appium-tests/        # Appium + WebdriverIO E2E suite
├── ios-tests/           # Swift + XCUITest
├── android-tests/       # Kotlin + Espresso
└── docs/                # Architecture and guides
```

See [docs/architecture.md](./docs/architecture.md) for diagrams and design decisions.

## Features (roadmap)

### Authentication

- Login and logout
- Validation errors
- Remember user session

### Tasks

- Create, view, edit, delete
- Mark completed
- Search, filter by status/priority, sort by due date

### Profile & settings

- User profile
- Theme switcher
- Clear local data
- About screen

## Getting started

### Prerequisites

- **Node.js** 22.11+ ([nvm](https://github.com/nvm-sh/nvm): `nvm use`)
- **Xcode** (iOS) with CocoaPods
- **Android Studio** with SDK and emulator
- **Watchman** (recommended on macOS)

### Install

```bash
# Root tooling (Husky, ESLint, Prettier)
npm install

# React Native app
cd app && npm install

# iOS native dependencies
cd ios && bundle install && bundle exec pod install && cd ../..

# Appium test package (when running E2E)
cd ../appium-tests && npm install
```

### Run the app

From the repository root:

```bash
npm run app:start    # Metro bundler
npm run app:ios      # iOS Simulator
npm run app:android  # Android Emulator
```

Or from `app/`:

```bash
npm run start
npm run ios
npm run android
```

## Development workflow

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run lint`         | ESLint for app and Appium packages |
| `npm run typecheck`    | TypeScript strict check            |
| `npm run format`       | Prettier write                     |
| `npm run format:check` | Prettier check (CI)                |
| `npm run app:test`     | Jest unit tests                    |

**Git hooks** (Husky + lint-staged) run ESLint and Prettier on staged files before each commit.

## Test automation

| Suite            | Path             | Docs                                |
| ---------------- | ---------------- | ----------------------------------- |
| Appium E2E       | `appium-tests/`  | [README](./appium-tests/README.md)  |
| iOS XCUITest     | `ios-tests/`     | [README](./ios-tests/README.md)     |
| Android Espresso | `android-tests/` | [README](./android-tests/README.md) |

```bash
npm run e2e   # WebdriverIO (requires built app + running device)
```

## Labels

Issues use labels such as `epic`, `feature`, `automation`, `ios`, `android`, `appium`, `xcuitest`, `espresso`, `ci`, `documentation`, `tech-debt`, and priority tags.

## License

This project is part of a personal portfolio. Add a license file if you open-source the repository publicly.
