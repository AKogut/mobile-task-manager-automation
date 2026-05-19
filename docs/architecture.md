# Architecture

High-level view of the **Mobile Task Manager Automation** portfolio repository.

## Repository layout

```text
mobile-task-manager-automation/
├── app/                 # React Native application (TypeScript)
├── appium-tests/        # Cross-platform E2E (Appium + WebdriverIO)
├── ios-tests/           # Native iOS UI tests (Swift + XCUITest)
├── android-tests/       # Native Android UI tests (Kotlin + Espresso)
└── docs/                # Architecture and contributor guides
```

## System diagram

```mermaid
flowchart TB
  subgraph Client["Mobile clients"]
    iOS["iOS app"]
    Android["Android app"]
  end

  subgraph AppLayer["app/ — React Native"]
    UI["Screens & components"]
    Nav["React Navigation"]
    State["Zustand store"]
    Storage["AsyncStorage"]
    Forms["React Hook Form + Zod"]
  end

  subgraph Automation["Test automation"]
    Appium["appium-tests/\nAppium + WebdriverIO"]
    XCUITest["ios-tests/\nXCUITest"]
    Espresso["android-tests/\nEspresso"]
  end

  subgraph CI["GitHub Actions"]
    Lint["Lint & typecheck"]
    Unit["Jest unit tests"]
    E2E["E2E on emulators"]
    Native["Native UI test jobs"]
  end

  iOS --> AppLayer
  Android --> AppLayer
  UI --> Nav
  Nav --> State
  State --> Storage
  UI --> Forms

  Appium --> iOS
  Appium --> Android
  XCUITest --> iOS
  Espresso --> Android

  Lint --> AppLayer
  Lint --> Appium
  Unit --> AppLayer
  E2E --> Appium
  Native --> XCUITest
  Native --> Espresso
```

## Test pyramid

```mermaid
flowchart BT
  E2E["Cross-platform E2E\n(Appium)"]
  Native["Native UI\n(XCUITest / Espresso)"]
  Unit["Unit & component\n(Jest)"]

  Unit --> Native
  Native --> E2E
```

| Layer              | Location                       | Purpose                                      |
| ------------------ | ------------------------------ | -------------------------------------------- |
| Unit               | `app/__tests__`                | Business logic, hooks, utilities             |
| Native UI          | `ios-tests/`, `android-tests/` | Platform-specific flows, fast feedback on CI |
| Cross-platform E2E | `appium-tests/`                | Full user journeys on both platforms         |

## Selector strategy

Shared **accessibility identifiers** (`testID` in React Native) are the contract between:

1. Application UI
2. Appium page objects
3. XCUITest and Espresso queries

This keeps tests stable when visual styling changes.

## Application modules (planned)

```mermaid
flowchart LR
  Auth["Authentication"]
  Tasks["Task management"]
  Profile["Profile & settings"]

  Auth --> Tasks
  Tasks --> Profile
```

### Authentication

- Login / logout
- Form validation
- Remember session (AsyncStorage)

### Tasks

- CRUD, completion toggle
- Search, filter (status, priority), sort (due date)

### Profile & settings

- User profile, theme switcher
- Clear local data, about screen

## CI pipeline (planned)

```mermaid
flowchart LR
  PR["Pull request"] --> Quality["lint · typecheck · format"]
  Quality --> AppBuild["Build app"]
  AppBuild --> Tests["Jest + Appium + native UI"]
  Tests --> Report["Artifacts & summaries"]
```

Jobs will run on GitHub-hosted macOS (iOS Simulator) and Linux (Android Emulator) runners.
