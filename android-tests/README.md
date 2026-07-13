# Android UI Tests (Espresso)

Native Android UI automation written in **Kotlin** using **Espresso**, running against the React Native app in `app/android`.

## Structure

```text
android-tests/
├── scripts/
│   └── generate-testids.mjs
└── src/androidTest/kotlin/com/mobiletaskmanager/
    ├── TestIds.kt                  (generated)
    ├── TestIdMatcher.kt
    ├── UiTestSupport.kt
    ├── DemoCredentials.kt
    ├── LoginScreen.kt
    ├── HomeScreen.kt
    ├── TaskFormScreen.kt
    ├── TaskDetailsScreen.kt
    ├── SettingsScreen.kt
    ├── TaskFlows.kt
    ├── AuthFlowTest.kt
    ├── TaskCreationTest.kt
    ├── TaskEditTest.kt
    ├── TaskDeletionTest.kt
    ├── TaskCompleteTest.kt
    ├── TaskFilterTest.kt
    ├── TaskSearchTest.kt
    ├── LoginScreenTest.kt
    ├── TestIdMatcherTest.kt
    └── SmokeInstrumentationTest.kt
```

Sources live here rather than inside the app module, keeping this suite a self-contained sub-project alongside `appium-tests/` and `ios-tests/`. The app module wires them in through an `androidTest` source set:

```groovy
sourceSets {
    androidTest {
        java.srcDirs += file("$rootDir/../../android-tests/src/androidTest/kotlin")
    }
}
```

## Running the tests

### Prerequisites

- JDK 17 and the Android SDK, with `ANDROID_HOME` set
- App dependencies installed: `npm run setup:android`
- A booted emulator — confirm with `adb devices`

The suite targets emulators. No Metro bundler and no `adb reverse` are needed: instrumentation runs against the `uitest` build type, which ships the JavaScript bundle inside the APK.

### Full run

```bash
emulator -avd Pixel_9_Pro_15 &
npm run android:test
```

`npm run android:test` is `./gradlew :app:connectedAndroidTest` from `app/android`.

### A single class or test

```bash
cd app/android

./gradlew :app:connectedAndroidTest \
  -Pandroid.testInstrumentationRunnerArguments.class=com.mobiletaskmanager.LoginScreenTest

./gradlew :app:connectedAndroidTest \
  -Pandroid.testInstrumentationRunnerArguments.class=com.mobiletaskmanager.LoginScreenTest#TC_AUTH_008_demoCredentialsCardIsVisible
```

### Results

Gradle exits non-zero when any test fails, so the exit code is authoritative. Full results land in:

```text
app/android/app/build/reports/androidTests/connected/uitest/index.html   # HTML report
app/android/app/build/outputs/androidTest-results/connected/uitest/      # JUnit XML + per-test logcat
```

The per-test logcat files are the fastest way to diagnose a failure — they capture React Native's own output, including the `initialProps` the app was launched with.

## The `uitest` build type

Instrumentation runs against a dedicated build type rather than `debug`:

```groovy
uitest {
    initWith debug
    matchingFallbacks = ["debug"]
    buildConfigField "boolean", "USE_DEV_SUPPORT", "false"
}
```

`MainApplication` passes `BuildConfig.USE_DEV_SUPPORT` to `getDefaultReactHost`, so the app loads `assets/index.android.bundle` instead of connecting to Metro. React Native's Gradle plugin bundles JavaScript for every variant outside `debuggableVariants`, so the `uitest` APK gets the bundle for free.

The variant is still `debuggable`, so instrumentation works as usual. Dropping the dev server also makes the suite roughly 2.5× faster — an app-launching test takes about 1.6 s rather than 5.8 s.

The `debug` build type is untouched: `npm run app:android` still uses Metro and Fast Refresh.

## Test isolation

Instrumentation runs under **AndroidX Test Orchestrator** with `clearPackageData` enabled, so every test executes in a fresh process against wiped app storage:

```groovy
testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
testInstrumentationRunnerArguments clearPackageData: "true"
testOptions {
    execution "ANDROIDX_TEST_ORCHESTRATOR"
    animationsDisabled = true
}
```

Animations are disabled because Espresso's synchronisation does not account for them.

## Selecting React Native elements

React Native does **not** map the `testID` prop to `contentDescription` — that carries `accessibilityLabel`. `BaseViewManager.setTestId` stores the value as a view tag and surfaces it to the accessibility tree as a resource id, which is why Appium selects Android elements with `resourceId(...)`.

Espresso has no built-in matcher for a string resource id, so `withTestId` reads the tag directly:

```kotlin
onView(withTestId(TestIds.loginSubmitButton)).perform(click())
```

`TestIdMatcherTest` pins both halves of this behaviour: `withTestId` resolves, and `withContentDescription` does not.

Espresso only synchronises with the UI thread and knows nothing about the React Native bridge, so views appear asynchronously. Wait for a screen before asserting on it:

```kotlin
waitForTestId(TestIds.loginScreen).check(matches(isDisplayed()))
```

`launchAppForUiTest()` wakes the device, dismisses the keyguard, and starts `MainActivity` with the `uitest` extra, so each test begins from cleared storage.

### Generating `TestIds.kt`

`testID` values are defined once in `app/src/constants/testIds.ts` and shared across the Appium, XCUITest, and Espresso suites. Regenerate the Kotlin constants after changing them:

```bash
npm run android:test:testids
```

## Resetting state

`MainActivity.getLaunchOptions()` forwards two Intent extras to JavaScript as root props, mirroring the `-uitest` launch arguments of the XCUITest suite:

| Intent extra    | Root prop        | Effect                               |
| --------------- | ---------------- | ------------------------------------ |
| `uitest`        | `isUITest`       | Clears persisted auth and task state |
| `uitest-authed` | `isUITestAuthed` | Starts on Home with the demo session |

`launchAppForUiTest()` passes `uitest`, so every test starts from a clean, logged-out app. `launchHomeForUiTest()` passes both extras and waits for Home, letting task flows skip the UI login. The shared harness that consumes these props is `app/src/testing/uiTestHarness.ts`.

## Troubleshooting

**`NoActivityResumedException: No activities in stage RESUMED`**
The device screen is off or locked — an Activity cannot resume behind a dark screen. `launchAppForUiTest()` wakes the device and dismisses the keyguard, so this should only appear if a test launches the app some other way. Confirm with `adb shell dumpsys power | grep mWakefulness`.

**Tests time out waiting for a view, logcat shows `Loading from localhost:8081`**
The app was built with dev support on, so it is trying to reach Metro. Check that the run used the `uitest` build type rather than `debug`.

**`npm run lint` fails after an instrumentation run**
Gradle writes a JavaScript report under `app/android/app/build`. It is excluded in `app/.eslintrc.js`; if a new native build path appears, add it there too.

**`Fatal signal 11 (SIGSEGV)` in thread `mqt_v_js`**
A native crash on React Native's JavaScript thread. Observed only on a physical Pixel 3 running Android 12, on both build types, roughly once every ten app launches. It has not reproduced on emulators, which are what this suite targets.

**`withContentDescription` finds nothing**
That is correct behaviour — see [Selecting React Native elements](#selecting-react-native-elements). Use `withTestId`.

**A `testID` matches more than one view**
React Native renders some ids twice, such as `task-add-button` in the empty state. `onView` then throws `AmbiguousViewMatcherException`. Narrow the match with `isDisplayed()` and, if both views are visible, with `withContentDescription` on the element's `accessibilityLabel` — the header button is `Add task`, the empty-state call to action is `Add first task`.

Do not reach for `isDescendantOfA` or `hasDescendant`: React Native flattens views, so JSX nesting is not native view nesting. A `uiautomator dump` shows the empty-state call to action as a _sibling_ of `task-empty-state-card`, not a descendant.

**`click()` fails with "does not match one or more of the following constraints"**
Espresso only clicks views that are at least 90% visible. Task rows sit below the hero cards, so `openTask` and `toggleTask` call `scrollTo()` first.

**A text field is set but the app does not react**
`replaceText` with the value the field already holds does not fire React Native's `onChangeText`, so state derived from it never updates. Type a genuinely different value, and assert the new value to prove the edit happened.

**An assertion right after a tap reads a stale value**
Espresso synchronises with the UI thread but knows nothing about the React Native bridge, so a tap that updates JavaScript state has not necessarily re-rendered the view by the time the next line runs. Asserting immediately is a race: it may pass on a fast machine and fail on a slow one. Use `waitForTestIdWithText(testId, expected)` rather than an immediate `check(matches(withText(...)))` whenever the value is a consequence of a tap.

A green run — even several in a row — does not prove such a race is absent. Treat any assert-straight-after-tap as suspect.

**Asserting an app view while a dialog is open**
With a dialog on screen, Espresso's default root is the dialog window, so app views are not found and `NoMatchingViewException` is thrown. Assert app state before opening the dialog, or after dismissing it.

**`isDisplayed()` is the wrong tool for "is this task in the list?"**
`isDisplayed()` requires the view to be on screen, so a task that is merely scrolled below the fold fails it just as a filtered-out task does. The two states are different and a filter test must tell them apart. Assert presence in the view hierarchy instead, scoped to list rows.

Scoping matters: the hero "Up next" card renders `nextTask.title`, the same string as the row. Matching on the text alone would keep finding a task that the filter had removed from the list. `HomeScreen` therefore matches `withTestIdStartingWith("task-item-title-")` together with the text, so only list rows can satisfy it.

## Coverage

The suite executes **46 of the 47 cases** that the Appium and XCUITest suites execute, across authentication, task CRUD, completion, filters and search.

| Suite   | Executing cases |
| ------- | --------------- |
| Appium  | 47              |
| iOS     | 47              |
| Android | 46              |

| Test case   | Name                                           | Class            |
| ----------- | ---------------------------------------------- | ---------------- |
| TC-TASK-001 | Create a task with all fields                  | TaskCreationTest |
| TC-TASK-002 | Create a task with minimum required fields     | TaskCreationTest |
| TC-TASK-003 | Newly created task appears in the task list    | TaskCreationTest |
| TC-TASK-004 | Creation blocked when title is empty           | TaskCreationTest |
| TC-TASK-005 | Creation blocked when title exceeds 80 chars   | TaskCreationTest |
| TC-TASK-006 | Creation blocked when no due date is selected  | TaskCreationTest |
| TC-TASK-007 | Quick select "Today" sets the current date     | TaskCreationTest |
| TC-TASK-008 | Quick select "Tomorrow" sets tomorrow          | TaskCreationTest |
| TC-TASK-009 | Quick select "Next week" sets 7 days ahead     | TaskCreationTest |
| TC-TASK-017 | Delete shows a confirmation dialog             | TaskDeletionTest |
| TC-TASK-018 | Confirming delete removes the task             | TaskDeletionTest |
| TC-TASK-019 | Cancelling delete preserves the task           | TaskDeletionTest |
| TC-TASK-020 | Edit form is pre-populated with current values | TaskEditTest     |
| TC-TASK-021 | Edit task title and save                       | TaskEditTest     |
| TC-TASK-022 | Edit task priority and save                    | TaskEditTest     |
| TC-TASK-023 | Edit task description and save                 | TaskEditTest     |
| TC-TASK-024 | Edited task reflects changes in the list       | TaskEditTest     |
| TC-TASK-025 | Edit blocked when title is cleared             | TaskEditTest     |
| TC-TASK-013 | Complete a task from Task Details              | TaskCompleteTest |
| TC-TASK-014 | Reopen a completed task from Task Details      | TaskCompleteTest |
| TC-TASK-015 | Complete a task via the list checkbox          | TaskCompleteTest |
| TC-TASK-016 | Reopen a task via the list checkbox            | TaskCompleteTest |

| Test case     | Name                                        | Class          |
| ------------- | ------------------------------------------- | -------------- |
| TC-FILTER-001 | Status filter "Open" shows only open tasks  | TaskFilterTest |
| TC-FILTER-002 | Status filter "Done" shows only completed   | TaskFilterTest |
| TC-FILTER-003 | Status filter "All" shows all tasks         | TaskFilterTest |
| TC-FILTER-004 | "Done" with none completed shows no-results | TaskFilterTest |
| TC-FILTER-005 | Priority filter "High"                      | TaskFilterTest |
| TC-FILTER-006 | Priority filter "Medium"                    | TaskFilterTest |
| TC-FILTER-007 | Priority filter "Low"                       | TaskFilterTest |

| Test case     | Name                                         | Class          |
| ------------- | -------------------------------------------- | -------------- |
| TC-SEARCH-001 | Search by exact title                        | TaskSearchTest |
| TC-SEARCH-002 | Search by partial title                      | TaskSearchTest |
| TC-SEARCH-003 | Search is case-insensitive                   | TaskSearchTest |
| TC-SEARCH-004 | No matches shows the no-results card         | TaskSearchTest |
| TC-SEARCH-005 | Clearing search restores the full list       | TaskSearchTest |
| TC-SEARCH-006 | Search combines with an active status filter | TaskSearchTest |

| Test case   | Name                                    | Class           |
| ----------- | --------------------------------------- | --------------- |
| TC-AUTH-001 | Successful login with valid credentials | AuthFlowTest    |
| TC-AUTH-002 | Login fails with incorrect password     | AuthFlowTest    |
| TC-AUTH-003 | Login fails with unregistered email     | AuthFlowTest    |
| TC-AUTH-004 | Login blocked with empty email field    | LoginScreenTest |
| TC-AUTH-005 | Login blocked with empty password field | LoginScreenTest |
| TC-AUTH-006 | Login blocked with invalid email format | LoginScreenTest |
| TC-AUTH-007 | Error banner disappears on input edit   | LoginScreenTest |
| TC-AUTH-008 | Demo credentials card is visible        | LoginScreenTest |
| TC-AUTH-009 | Successful logout clears session        | AuthFlowTest    |
| TC-AUTH-010 | Settings screen displays account info   | AuthFlowTest    |
| TC-AUTH-012 | Unauthenticated user lands on Login     | LoginScreenTest |

Two cases are deliberately not automated here:

- **TC-AUTH-011 (session persists after app restart)** — Espresso runs inside the application process, so it cannot stop and relaunch that process; `am force-stop` would kill the test run. Recreating the Activity is not a substitute: the JavaScript stores are module singletons that survive it, so the assertion would pass even if persistence were broken. The Appium suite covers this case, driving the app out of process.
- **TC-AUTH-013 (loading indicator during login)** — skipped in the Appium suite as well; observing a transient indicator is inherently racy.

## Status

The suite is complete. It covers authentication, task CRUD, completion, filters and search — 46 of the 47 cases the Appium and XCUITest suites execute, the exception being TC-AUTH-011, which Espresso cannot reach.
