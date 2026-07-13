# iOS Native UI Tests (XCUITest)

Native iOS UI automation for the Mobile Task Manager app, written in **Swift**
with **XCUITest** and driven by `xcodebuild`. The suite drives the real
`MobileTaskManager` app on the iOS Simulator and asserts behavior through the
app's accessibility tree.

Elements are addressed by the app's `testID` values: React Native maps every
`testID` in [`app/src/constants/testIds.ts`](../app/src/constants/testIds.ts) to
an iOS `accessibilityIdentifier`, so `app.buttons["task-add-button"]` resolves
the element declared as `testID="task-add-button"`. No native bridging code is
required.

## Coverage

Every test traces to a shared behavioral case in
[`docs/test-cases/`](../docs/test-cases/). Because `XCTest` has no free-form test
titles, the case id is encoded in the **method name** (`test_TC_AUTH_012_…`).

The suite mirrors the Appium E2E suite case-for-case (auth, task CRUD, complete/
reopen, search, and filters).

| Test case                                        | XCUITest method                                                  | Verifies                                             |
| ------------------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------- |
| [TC-AUTH-001](../docs/test-cases/TC-AUTH.md)     | `test_TC_AUTH_001_validLoginNavigatesToHome`                     | Valid login navigates to the Home screen             |
| [TC-AUTH-002](../docs/test-cases/TC-AUTH.md)     | `test_TC_AUTH_002_invalidPasswordShowsError`                     | Wrong password shows the auth error, stays on Login  |
| [TC-AUTH-003](../docs/test-cases/TC-AUTH.md)     | `test_TC_AUTH_003_unregisteredEmailShowsError`                   | Unregistered email shows the auth error              |
| [TC-AUTH-004](../docs/test-cases/TC-AUTH.md)     | `test_TC_AUTH_004_emptyEmailIsBlocked`                           | Empty email is blocked with a validation error       |
| [TC-AUTH-005](../docs/test-cases/TC-AUTH.md)     | `test_TC_AUTH_005_emptyPasswordIsBlocked`                        | Empty password is blocked with a validation error    |
| [TC-AUTH-006](../docs/test-cases/TC-AUTH.md)     | `test_TC_AUTH_006_invalidEmailFormatIsBlocked`                   | Invalid email format is blocked                      |
| [TC-AUTH-007](../docs/test-cases/TC-AUTH.md)     | `test_TC_AUTH_007_errorBannerClearsOnEdit`                       | Error banner clears once an input is edited          |
| [TC-AUTH-008](../docs/test-cases/TC-AUTH.md)     | `test_TC_AUTH_008_demoCredentialsCardIsVisibleOnLoginScreen`     | Demo credentials card and its `testID`s are exposed  |
| [TC-AUTH-009](../docs/test-cases/TC-AUTH.md)     | `test_TC_AUTH_009_logoutReturnsToLogin`                          | Logout from Settings returns to the Login screen     |
| [TC-AUTH-010](../docs/test-cases/TC-AUTH.md)     | `test_TC_AUTH_010_settingsShowsAccountInfo`                      | Settings shows the demo account name and email       |
| [TC-AUTH-011](../docs/test-cases/TC-AUTH.md)     | `test_TC_AUTH_011_sessionPersistsAfterRestart`                   | A logged-in session persists across an app restart   |
| [TC-AUTH-012](../docs/test-cases/TC-AUTH.md)     | `test_TC_AUTH_012_unauthenticatedUserLandsOnLoginScreen`         | Clean launch lands on Login, Home is not shown       |
| [TC-TASK-001](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_001_createTaskWithAllFields`                       | Create a task with all fields, details screen shown  |
| [TC-TASK-002](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_002_createTaskWithMinimumRequiredFields`           | Create a task with the minimum required fields       |
| [TC-TASK-003](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_003_newTaskAppearsInList`                          | A newly created task appears in the Home list        |
| [TC-TASK-004](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_004_creationBlockedWhenTitleIsEmpty`               | Creation is blocked when the title is empty          |
| [TC-TASK-005](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_005_creationBlockedWhenTitleExceeds80Characters`   | Creation is blocked for an over-long title           |
| [TC-TASK-006](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_006_creationBlockedWhenNoDueDate`                  | Creation is blocked when no due date is selected     |
| [TC-TASK-007](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_007_quickSelectTodaySetsDueDate`                   | Quick select "Today" sets the due date               |
| [TC-TASK-008](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_008_quickSelectTomorrowSetsDueDate`                | Quick select "Tomorrow" sets the due date            |
| [TC-TASK-009](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_009_quickSelectNextWeekSetsDueDate`                | Quick select "Next week" sets the due date           |
| [TC-TASK-013](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_013_completeTaskFromDetails`                       | Completing a task from details updates status/button |
| [TC-TASK-014](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_014_reopenTaskFromDetails`                         | Reopening a task from details updates status/button  |
| [TC-TASK-015](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_015_completeTaskViaListCheckbox`                   | Completing a task via the list checkbox              |
| [TC-TASK-016](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_016_reopenTaskViaListCheckbox`                     | Reopening a task via the list checkbox               |
| [TC-TASK-017](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_017_deleteShowsConfirmationDialog`                 | Delete shows the native confirmation dialog          |
| [TC-TASK-018](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_018_confirmingDeleteRemovesTask`                   | Confirming delete removes the task from the list     |
| [TC-TASK-019](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_019_cancellingDeletePreservesTask`                 | Cancelling delete keeps the task                     |
| [TC-TASK-020](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_020_editFormIsPrePopulated`                        | The edit form opens pre-populated with task values   |
| [TC-TASK-021](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_021_editTitleAndSave`                              | Editing the title and saving updates task details    |
| [TC-TASK-022](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_022_editPriorityAndSave`                           | Editing the priority and saving updates details      |
| [TC-TASK-023](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_023_editDescriptionAndSave`                        | Editing the description and saving updates details   |
| [TC-TASK-024](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_024_editedTaskReflectsInList`                      | An edited task reflects its new title in the list    |
| [TC-TASK-025](../docs/test-cases/TC-TASK.md)     | `test_TC_TASK_025_editBlockedWhenTitleCleared`                   | Editing is blocked when the title is cleared         |
| [TC-SEARCH-001](../docs/test-cases/TC-SEARCH.md) | `test_TC_SEARCH_001_exactTitleMatch`                             | Search by exact title returns the matching task      |
| [TC-SEARCH-002](../docs/test-cases/TC-SEARCH.md) | `test_TC_SEARCH_002_partialTitleMatch`                           | Search by partial title returns matching tasks       |
| [TC-SEARCH-003](../docs/test-cases/TC-SEARCH.md) | `test_TC_SEARCH_003_caseInsensitive`                             | Search is case-insensitive                           |
| [TC-SEARCH-004](../docs/test-cases/TC-SEARCH.md) | `test_TC_SEARCH_004_noMatchesShowsNoResultsCard`                 | No matches shows the no-results card                 |
| [TC-SEARCH-005](../docs/test-cases/TC-SEARCH.md) | `test_TC_SEARCH_005_clearingSearchRestoresList`                  | Clearing the search restores the full list           |
| [TC-SEARCH-006](../docs/test-cases/TC-SEARCH.md) | `test_TC_SEARCH_006_searchWithActiveStatusFilter`                | Search combines with an active status filter         |
| [TC-FILTER-001](../docs/test-cases/TC-FILTER.md) | `test_TC_FILTER_001_statusOpenShowsOnlyOpenTasks`                | Status filter "Open" shows only open tasks           |
| [TC-FILTER-002](../docs/test-cases/TC-FILTER.md) | `test_TC_FILTER_002_statusDoneShowsOnlyCompletedTasks`           | Status filter "Done" shows only completed tasks      |
| [TC-FILTER-003](../docs/test-cases/TC-FILTER.md) | `test_TC_FILTER_003_statusAllShowsAllTasks`                      | Status filter "All" shows all tasks                  |
| [TC-FILTER-004](../docs/test-cases/TC-FILTER.md) | `test_TC_FILTER_004_statusDoneWithNoCompletedShowsNoResultsCard` | "Done" with no completed tasks shows no-results      |
| [TC-FILTER-005](../docs/test-cases/TC-FILTER.md) | `test_TC_FILTER_005_priorityHighShowsOnlyHighTasks`              | Priority filter "High" shows only high tasks         |
| [TC-FILTER-006](../docs/test-cases/TC-FILTER.md) | `test_TC_FILTER_006_priorityMediumShowsOnlyMediumTasks`          | Priority filter "Medium" shows only medium tasks     |
| [TC-FILTER-007](../docs/test-cases/TC-FILTER.md) | `test_TC_FILTER_007_priorityLowShowsOnlyLowTasks`                | Priority filter "Low" shows only low tasks           |

### Intentionally not automated on iOS

- **TC-AUTH-013** (loading indicator shown during login) — the login request
  resolves in ~400 ms, so the `login-submit-loading` indicator is too transient
  to catch reliably. The Appium suite skips this case for the same reason; the
  XCUITest suite mirrors that skip rather than ship a flaky test.

## Prerequisites

- macOS with **Xcode 26.x** (matches the project's `xcodebuild` toolchain).
- The **iPhone 17 Pro Max** simulator.
- App dependencies installed and CocoaPods present:
  ```sh
  npm run setup          # from the repo root: installs JS deps + pods
  ```
- **Metro** running for any test that launches the app (the Debug build loads
  its JS bundle from Metro):
  ```sh
  npm run app:start      # from the repo root
  ```

## Setup — add the test target

Add the XCUITest target to `app/ios/MobileTaskManager.xcodeproj` once:

```sh
npm run ios:test:setup
```

This runs a reproducible script (using the `xcodeproj` gem that CocoaPods
already vendors) instead of hand-editing `project.pbxproj`. It is **idempotent**
— a no-op if the `MobileTaskManagerUITests` target already exists — and wires the
target into the existing `MobileTaskManager` scheme's Test action.

## Running the tests

Start Metro once (the Debug build loads its JS bundle from it), then run the
suite. All commands are run from the repo root:

```sh
npm run app:start        # in one terminal — leave it running

npm run ios:test         # build + run the suite
npm run ios:test:build   # build only (compile the test bundle)
npm run ios:test:run     # run the already-built bundle
```

`npm run ios:test` is a thin wrapper over `xcodebuild` (see
[`scripts/run-tests.sh`](./scripts/run-tests.sh)) targeting the iPhone 17 Pro Max
simulator. Override the device with `IOS_TEST_DESTINATION`:

```sh
IOS_TEST_DESTINATION='platform=iOS Simulator,name=iPhone 17 Pro' npm run ios:test
```

The build / run split (`ios:test:build` then `ios:test:run`) is the same
build-once-run-many flow a CI job uses. Inside **Xcode**, the suite also runs
from the Test navigator (`⌘U`).

Equivalent raw commands, if you prefer to drive `xcodebuild` directly:

```sh
xcodebuild build-for-testing \
  -workspace app/ios/MobileTaskManager.xcworkspace \
  -scheme MobileTaskManager -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro Max' \
  -derivedDataPath app/ios/build/uitests CODE_SIGNING_ALLOWED=NO

xcodebuild test-without-building \
  -workspace app/ios/MobileTaskManager.xcworkspace \
  -scheme MobileTaskManager \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro Max' \
  -derivedDataPath app/ios/build/uitests
```

## Reports

A run writes an `.xcresult` bundle under the derived-data path. Turn the latest
one into a standalone HTML report — a browsable test tree with per-test
durations, pass/fail filtering, and the captured screenshots:

```sh
brew install xctesthtmlreport   # once
npm run ios:test:report         # writes ios-tests/report.html
```

`ios:test:report` uses the most recent `.xcresult` from the last run. On CI the
**XCUITest iOS Tests** workflow generates the same report and uploads it (plus the
raw `.xcresult`) as a downloadable artifact on every run.

## Clean, deterministic state

Each test launches the app with the `-uitest` argument:

```swift
app.launchArguments = ["-uitest"]
```

The app honors this flag by clearing persisted auth and task storage before
hydration, so every test starts from the login screen with no leftover data — no
in-test navigation or teardown is needed to reset state. The app-side hook lives
in [`app/src/testing/uiTestHarness.ts`](../app/src/testing/uiTestHarness.ts).

### Seeded authenticated session

Tests that exercise task CRUD start from the Home screen, not from the login
form. Driving the login UI on every one of those tests is slow and — on CI
simulators — the single flakiest step (see Troubleshooting). Instead they launch
with an extra argument:

```swift
app.launchArguments = ["-uitest", "-uitest-authed"]
```

`-uitest-authed` tells the app-side harness to seed the demo user's session
directly into the auth store after storage is cleared, so the app boots straight
into an authenticated state. `UITestCase.signInToHome()` (and therefore
`createSampleTask()`) relaunches the app with this argument rather than typing
credentials. The real login flow is still exercised end-to-end — but only where
that is the behavior under test, in `AuthFlowUITests`, which continues to type
credentials into the login form.

## Troubleshooting

**"Multiple matching elements found" when resolving a `testID`.**
Some `testID`s legitimately appear twice in a single screen — for example
`task-add-button` renders both in the Home header and in the empty-state
"Create first task" call to action. A plain `descendants(matching: .any)[id]`
query throws when it matches more than one element. `XCUIApplication.element(withId:)`
resolves this with `.firstMatch` (the same semantics WebdriverIO uses in the
Appium suite), which is why all screen objects go through that helper instead of
raw queries.

**Login typing drops characters on CI simulators.**
`typeText` occasionally loses characters on a cold CI simulator, producing the
wrong credentials, a failed auth, and a Home screen that never appears. The
tell-tale sign is that `TC-AUTH-002` (wrong password) passes while
`TC-AUTH-001` fails — any dropped character still counts as an incorrect
password, but a valid login needs the exact string. `LoginScreen` mitigates this
by entering text through `XCUIElement.replaceText`, which clears the field,
types, verifies the field value (length only, for masked fields), and retries up
to three times. CRUD tests avoid the login form altogether via the seeded
session described above.

**A test fails intermittently.**
`run-tests.sh` runs `xcodebuild` with `-retry-tests-on-failure -test-iterations 3`,
Xcode's built-in retry mechanism for flaky UI tests, so a single transient
failure is retried automatically. The exit code is the source of truth: it is `0`
only if every test ultimately passes.

**The verbose `xcodebuild` log looks truncated or misleading.**
The streamed log is buffered and unreliable to read live. Trust the process exit
code, and grep the completed log for `Executed N tests, with 0 failures` and
`TEST EXECUTE SUCCEEDED`.

**`xchtmlreport` produces no report.**
`run-tests.sh report` builds the report from the most recent `.xcresult` under
the derived-data `Logs/Test` directory; on CI the report step is
`continue-on-error` so a reporting hiccup never fails the run. The raw
`.xcresult` is always uploaded as an artifact.

**Tests can't launch the app / hang on a blank screen.**
The Debug build loads its JS bundle from Metro. Make sure Metro is running
(`npm run app:start`) and that `curl -s localhost:8081/status` returns
`packager-status:running` before starting a run. `run-tests.sh` checks this and
fails fast with a clear message when Metro is unreachable (unless
`IOS_TEST_EMBED_BUNDLE=YES`, the CI path, which embeds the bundle instead).

## Project structure

```text
ios-tests/
  README.md
  MobileTaskManagerUITests/
    TestIds.swift                    # generated from the app's testIds.ts
    XCUIApplication+Element.swift    # element(withId:) lookup helper
    XCUIElement+Text.swift           # robust clear + type + verify helper
    UITestCase.swift                 # base case: launch + reset, failure screenshots
    DemoCredentials.swift            # demo login test data
    LoginScreen.swift                # Login screen object
    HomeScreen.swift                 # Home: task list, search, filters, sort
    TaskFormScreen.swift             # Add/Edit task form fields
    TaskDetailsScreen.swift          # Task details actions + delete alert
    SettingsScreen.swift             # Settings: account info, logout
    MobileTaskManagerUITests.swift   # login-screen smoke tests
    AuthFlowUITests.swift            # login / logout / validation / session tests
    TaskCreationUITests.swift        # create-task flow + form validation tests
    TaskEditUITests.swift            # edit-task flow tests
    TaskDeletionUITests.swift        # delete-task flow tests
    TaskCompleteUITests.swift        # complete / reopen (details + list checkbox)
    TaskSearchUITests.swift          # task search tests
    TaskFilterUITests.swift          # status / priority filter tests
  scripts/
    add_xcuitest_target.rb           # idempotent target/scheme setup + source sync
    generate-testids.rb              # TestIds.swift code generation
    run-tests.sh                     # xcodebuild wrapper
```

The Swift sources live in this directory and are referenced by the Xcode target
through a relative path, so the suite stays self-contained outside the app
sources. The product (`MobileTaskManagerUITests.xctest`) is a UI test bundle that
launches `MobileTaskManager` as a separate process.

## Architecture & patterns

- **Screen Objects.** Each screen is a Swift `struct` over `XCUIApplication`
  that exposes element queries and intent-revealing actions
  (`LoginScreen.login(email:password:)`); tests never touch raw selectors.
- **`UITestCase` base class.** Handles the shared launch with the `-uitest`
  reset argument and attaches a screenshot on any failure. Its
  `signInToHome()` / `createSampleTask()` helpers relaunch with the
  `-uitest-authed` seeded-session argument so CRUD tests bypass the login UI.
- **Generated identifiers.** `TestIds.swift` is generated from the app's
  [`testIds.ts`](../app/src/constants/testIds.ts) (`npm run ios:test:testids`),
  so selectors never drift from the app. Re-run it whenever the app's testIDs
  change.
- **Selectors are `testID`s only.** Elements are resolved by accessibility
  identifier — never by label text, index, or XPath-style traversal.
- **Explicit waits.** Use `waitForExistence(timeout:)`; never `sleep`.
- **`continueAfterFailure = false`** so the first failed assertion stops the test
  at the point of failure.

## Conventions

- **No inline code comments.** The code is self-documenting; rationale lives here.
- `TestIds.swift` is generated — do not hand-edit it; run
  `npm run ios:test:testids` after changing the app's `testID`s.
- Selectors mirror
  [`app/src/constants/testIds.ts`](../app/src/constants/testIds.ts), the single
  source of truth for element identity shared with the app.

## Continuous integration

The suite runs as one job of the repository-wide
[**Nightly E2E**](../.github/workflows/nightly-e2e.yml) orchestrator, which drives
every suite (Appium iOS, Appium Android, XCUITest, Espresso) on a shared schedule
and publishes a single combined
[**live report**](https://akogut.github.io/mobile-task-manager-automation/) to
GitHub Pages — the XCUITest results appear under the
[Native iOS](https://akogut.github.io/mobile-task-manager-automation/ios-native/)
card.

The XCUITest logic is a reusable workflow
([`.github/workflows/xcuitest-suite.yml`](../.github/workflows/xcuitest-suite.yml),
`workflow_call`), also exposed as a thin on-demand caller
([`.github/workflows/xcuitest-tests.yml`](../.github/workflows/xcuitest-tests.yml),
`workflow_dispatch`). It boots an available iPhone simulator, builds the app with
its JS bundle embedded (`FORCE_BUNDLING`, so no Metro is needed on CI), runs the
suite via `npm run ios:test`, and uploads the HTML report and the raw `.xcresult`
bundle as artifacts. Only the nightly orchestrator publishes Pages, so on-demand
runs never clobber the shared report.
