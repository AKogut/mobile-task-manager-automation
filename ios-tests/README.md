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

| Test case                                    | XCUITest method                                              | Verifies                                            |
| -------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| [TC-AUTH-012](../docs/test-cases/TC-AUTH.md) | `test_TC_AUTH_012_unauthenticatedUserLandsOnLoginScreen`     | Clean launch lands on Login, Home is not shown      |
| [TC-AUTH-008](../docs/test-cases/TC-AUTH.md) | `test_TC_AUTH_008_demoCredentialsCardIsVisibleOnLoginScreen` | Demo credentials card and its `testID`s are exposed |
| [TC-AUTH-001](../docs/test-cases/TC-AUTH.md) | `test_TC_AUTH_001_validLoginNavigatesToHome`                 | Valid login navigates to the Home screen            |
| [TC-AUTH-002](../docs/test-cases/TC-AUTH.md) | `test_TC_AUTH_002_invalidPasswordShowsError`                 | Wrong password shows the auth error, stays on Login |
| [TC-AUTH-009](../docs/test-cases/TC-AUTH.md) | `test_TC_AUTH_009_logoutReturnsToLogin`                      | Logout from Settings returns to the Login screen    |
| [TC-TASK-001](../docs/test-cases/TC-TASK.md) | `test_TC_TASK_001_createTaskWithAllFields`                   | Create a task with all fields, details screen shown |
| [TC-TASK-003](../docs/test-cases/TC-TASK.md) | `test_TC_TASK_003_newTaskAppearsInList`                      | A newly created task appears in the Home list       |
| [TC-TASK-020](../docs/test-cases/TC-TASK.md) | `test_TC_TASK_020_editFormIsPrePopulated`                    | The edit form opens pre-populated with task values  |
| [TC-TASK-021](../docs/test-cases/TC-TASK.md) | `test_TC_TASK_021_editTitleAndSave`                          | Editing the title and saving updates task details   |
| [TC-TASK-017](../docs/test-cases/TC-TASK.md) | `test_TC_TASK_017_deleteShowsConfirmationDialog`             | Delete shows the native confirmation dialog         |
| [TC-TASK-018](../docs/test-cases/TC-TASK.md) | `test_TC_TASK_018_confirmingDeleteRemovesTask`               | Confirming delete removes the task from the list    |
| [TC-TASK-019](../docs/test-cases/TC-TASK.md) | `test_TC_TASK_019_cancellingDeletePreservesTask`             | Cancelling delete keeps the task                    |

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
one into a standalone HTML report:

```sh
brew install xcresultparser   # once
npm run ios:test:report       # writes ios-tests/report.html
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

**`xcresultparser` errors ("root ID is missing") or produces no report.**
The parser is finicky about newer Xcode `.xcresult` formats and about bundles
written with `-resultBundlePath`. `run-tests.sh report` builds the report from
the `.xcresult` under the derived-data `Logs/Test` directory; on CI the report
step is `continue-on-error` so a parser hiccup never fails the run. The raw
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
    AuthFlowUITests.swift            # login / logout flow tests
    TaskCreationUITests.swift        # create-task flow tests
    TaskEditUITests.swift            # edit-task flow tests
    TaskDeletionUITests.swift        # delete-task flow tests
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

The **XCUITest iOS Tests** workflow
([`.github/workflows/xcuitest-tests.yml`](../.github/workflows/xcuitest-tests.yml))
runs on a macOS runner nightly and on demand (`workflow_dispatch`), mirroring the
Appium E2E workflow's cadence. It boots an available iPhone simulator, builds the
app with its JS bundle embedded (`FORCE_BUNDLING`, so no Metro is needed on CI),
runs the suite via `npm run ios:test`, and uploads the HTML report and the raw
`.xcresult` bundle as artifacts.
