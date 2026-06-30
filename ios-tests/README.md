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

A run writes an `.xcresult` bundle (under the derived-data path locally, or to a
fixed path on CI). Turn it into a standalone HTML report:

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

## Project structure

```text
ios-tests/
  README.md
  MobileTaskManagerUITests/
    TestIds.swift                    # generated from the app's testIds.ts
    UITestCase.swift                 # base case: launch + reset, failure screenshots
    LoginScreen.swift                # Login screen object
    MobileTaskManagerUITests.swift   # test cases
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
  reset argument and attaches a screenshot on any failure.
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
