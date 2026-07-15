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
    Appium["appium-tests/<br/>Appium + WebdriverIO"]
    XCUITest["ios-tests/<br/>XCUITest"]
    Espresso["android-tests/<br/>Espresso"]
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
  E2E["Cross-platform E2E<br/>(Appium)"]
  Native["Native UI<br/>(XCUITest / Espresso)"]
  Unit["Unit & component<br/>(Jest)"]

  Unit --> Native
  Native --> E2E
```

| Layer              | Location                       | Purpose                                      |
| ------------------ | ------------------------------ | -------------------------------------------- |
| Unit               | `app/src/**/__tests__`         | Business logic, hooks, utilities             |
| Native UI          | `ios-tests/`, `android-tests/` | Platform-specific flows, fast feedback on CI |
| Cross-platform E2E | `appium-tests/`                | Full user journeys on both platforms         |

## Selector strategy

Shared **accessibility identifiers** (`testID` in React Native) are the contract between:

1. Application UI
2. Appium page objects
3. XCUITest and Espresso queries

This keeps tests stable when visual styling changes.

## Application modules

```mermaid
flowchart LR
  Auth["Authentication"]
  Tasks["Task management"]
  Settings["Settings"]

  Auth --> Tasks
  Tasks --> Settings
```

### Authentication

- Login / logout
- Form validation
- Remember session (AsyncStorage)

### Tasks

- CRUD, completion toggle
- Search, filter (status, priority), sort (due date)

### Settings

- Account info (name, email)
- Logout

## CI pipeline

```mermaid
flowchart LR
  PR["Pull request"] --> Quality["lint · typecheck · format"]
  Quality --> AppBuild["Build app"]
  AppBuild --> Tests["Jest + Appium + native UI"]
  Tests --> Report["Artifacts & summaries"]
```

Jobs run on GitHub-hosted macOS (iOS Simulator) and Linux (Android Emulator) runners. See the [workflows](../.github/workflows/) — per-suite reusable workflows plus a nightly orchestrator that publishes a combined report.
