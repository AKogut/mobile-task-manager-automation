# Appium E2E Tests

Cross-platform end-to-end automation for the Mobile Task Manager app, written
in TypeScript with **Appium 2**, **WebdriverIO 9**, and **Mocha**. The same
specs run unchanged on **iOS (XCUITest)** and **Android (UiAutomator2)**, and
each platform produces its own isolated Allure report.

## Coverage

| Suite             | Spec files                                       | Test cases        |
| ----------------- | ------------------------------------------------ | ----------------- |
| Authentication    | `auth.smoke`, `auth.negative`, `auth.regression` | TC-AUTH-001…013   |
| Task creation     | `task-creation.spec.ts`                          | TC-TASK-001…009   |
| Complete / reopen | `task-complete.spec.ts`                          | TC-TASK-013…016   |
| Delete            | `task-delete.spec.ts`                            | TC-TASK-017…019   |
| Edit              | `task-edit.spec.ts`                              | TC-TASK-020…025   |
| Search            | `task-search.spec.ts`                            | TC-SEARCH-001…006 |
| Filters           | `task-filter.spec.ts`                            | TC-FILTER-001…007 |

Full, human-readable test-case definitions live in
[`docs/test-cases/`](../docs/test-cases/).

## Prerequisites

- Node.js 22.11 or newer.
- Appium 2 server reachable on `http://localhost:4723`.
- **iOS** — Xcode with the configured simulator.
- **Android** — Android Studio, SDK, and the configured emulator.
- Built app binaries at the paths configured in `src/config/` (overridable via
  the environment variables below).

## Install

```sh
cd appium-tests
yarn install
```

## Running tests

```sh
yarn test:ios
yarn test:android
```

Both commands run the entire spec suite. The app is installed once per session
and its state is reset between tests by the suite itself (see
[Test data & cleanup](#test-data--cleanup)).

### Environment variables

Defaults target a local simulator/emulator; override any of these to point at
another device or a prebuilt binary.

| Variable                      | Platform | Default                                   |
| ----------------------------- | -------- | ----------------------------------------- |
| `APPIUM_IOS_DEVICE_NAME`      | iOS      | `iPhone 17 Pro Max`                       |
| `APPIUM_IOS_PLATFORM_VERSION` | iOS      | `26.5`                                    |
| `APPIUM_IOS_UDID`             | iOS      | _(unset — simulator by name)_             |
| `APPIUM_IOS_APP_PATH`         | iOS      | local `Debug-iphonesimulator` build       |
| `WDA_DERIVED_DATA`            | iOS      | _(unset — enables prebuilt WDA when set)_ |
| `APPIUM_ANDROID_DEVICE_NAME`  | Android  | `emulator-5554`                           |
| `APPIUM_ANDROID_APP_PATH`     | Android  | local `app-debug.apk`                     |

## Reports

Results and screenshots are written **per platform** so the two runs never mix:

```text
allure-results/ios       allure-results/android
allure-report/ios        allure-report/android
screenshots/ios          screenshots/android
```

Each results folder carries an `environment.properties` file (platform, device,
automation engine) that surfaces in the report's Environment widget.

Generate and open a report for the platform you just ran:

```sh
yarn report:ios          # generate allure-report/ios
yarn report:open:ios     # open it

yarn report:android      # generate allure-report/android
yarn report:open:android # open it
```

A screenshot is captured automatically on every test failure and stored under
`screenshots/<platform>/`.

### Published reports (GitHub Pages)

The `Appium E2E Tests` workflow generates a separate report per platform and
deploys them to GitHub Pages behind a landing page:

```text
<pages-url>/          # landing page with iOS / Android cards
<pages-url>/ios/      # iOS report
<pages-url>/android/  # Android report
```

Each platform job uploads its own `allure-results/<platform>` artifact; the
publish job generates `site/ios` and `site/android` independently, so the two
reports never merge.

## Project structure

```text
src/
  config/
    wdio.shared.conf.ts    # createSharedConfig(platform) factory: reporters,
                           # timeouts, hooks, per-platform Allure output
    wdio.ios.conf.ts       # iOS capabilities (XCUITest)
    wdio.android.conf.ts   # Android capabilities (UiAutomator2)
  pages/                   # Page Objects (one screen each), re-exported via index.ts
    BasePage.ts            # shared element/scroll/typing primitives
    LoginPage.ts  HomePage.ts  SettingsPage.ts
    TaskFormPage.ts  TaskDetailsPage.ts
  helpers/
    AuthHelper.ts          # login/logout/restart orchestration
    TaskHelper.ts          # session start, task setup, home cleanup
  data/
    credentials.ts         # demo account
    taskFixtures.ts        # task + search/filter fixtures and queries
  utils/
    platform.ts            # isIos() / isAndroid()
    ScreenshotHelper.ts    # per-platform failure screenshots
  types/
    globals.d.ts           # browser / driver / $ ambient declarations
  tests/
    auth/                  # authentication suites
    tasks/                 # task CRUD, complete, search, filter suites
```

## Architecture & patterns

**Page Object Model.** Every screen is a class extending `BasePage`. Pages expose
intent-revealing actions and queries (`login`, `getVisibleTaskTitles`,
`tapStatusFilter`); specs never touch selectors directly. Element identity is
always a `testID`, resolved per platform by `BasePage` (`resourceId` on Android,
accessibility id on iOS).

**Helpers orchestrate multi-screen flows.** `AuthHelper` and `TaskHelper`
compose page actions into reusable journeys (session start, app restart, create
N tasks, complete a task by title, return to a clean home) so specs stay
declarative.

**Centralized platform handling.** `utils/platform.ts` is the single source of
truth for `isIos()` / `isAndroid()`; `BasePage` re-exposes them as protected
helpers for pages.

**Cross-platform scrolling.** Lists are virtualized, so off-screen elements are
not always in the accessibility tree. `BasePage` reveals targets with the native
strategy per platform — `UiScrollable` on Android, coordinate swipes on iOS.

**Virtualization-safe list assertions.** Visible task count is read from the
always-rendered `task-list-title` label (`"N of M tasks"`) instead of counting
rendered rows. Identity checks read row titles by their per-index `testID`, with
iOS reading by existence so an open keyboard never hides results.

**Fixtures over literals.** Reusable task data, search queries, and filter sets
live in `data/`, keeping specs focused on behavior.

## Test data & cleanup

Tasks persist via the app's local storage, so the suite resets state itself:

- `TaskHelper.returnToCleanHome()` — return to Home and delete all tasks
  (used by single-dataset task suites).
- `TaskHelper.prepareCleanHome()` — additionally reset active filters first, so
  cleanup is never hidden behind an active filter (used by search/filter suites).

## Conventions

- **No inline code comments.** The code is self-documenting; rationale lives here
  and in `docs/`.
- Test titles are prefixed with their case id (`TC-AUTH-001 — …`) to map 1:1 to
  [`docs/test-cases/`](../docs/test-cases/).
- Selectors are `testID`s only — no XPath, no text matching for identity.

## Notable decisions

- **TC-AUTH-013 (loading indicator) is skipped.** The indicator shows for
  ~400 ms — shorter than the reliable element-polling round-trip on either
  XCUITest or UiAutomator2 — so it cannot be caught consistently at the E2E
  level. It is better covered by a component-level test.
- **Retries: test-level only, no session/spec retries.** A failed test is
  retried once in the same session (`mochaOpts.retries: 1`) to absorb residual
  device flakiness. Connection and spec-file retries stay disabled because on
  iOS they spawn a second WDA `xcodebuild` that competes for port 8100 and fails
  with `ECONNREFUSED`; timeouts are kept generous instead (`connectionRetryTimeout`
  5 min, Mocha hook/test timeout 3 min to cover multi-task setup).
- **Prebuilt WDA.** Setting `WDA_DERIVED_DATA` makes Appium reuse a prebuilt
  WebDriverAgent and skip the 3–10 min cold build on the first iOS session.

## Other commands

```sh
yarn typecheck
yarn lint
```
