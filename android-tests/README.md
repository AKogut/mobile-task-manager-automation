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
- A connected device or a booted emulator — confirm with `adb devices`

The suite builds the **debug** APK, which loads JavaScript from Metro at runtime rather than from a bundled asset. Any test that launches the app therefore needs Metro running.

### Full run

```bash
npm run app:start                       # terminal 1: Metro
adb reverse tcp:8081 tcp:8081           # physical devices only
npm run android:test                    # terminal 2
```

`npm run android:test` is `./gradlew connectedDebugAndroidTest` from `app/android`.

`SmokeInstrumentationTest` asserts the instrumentation target without launching the app, so it is the one test that passes without Metro.

### A single class or test

```bash
cd app/android

./gradlew :app:connectedDebugAndroidTest \
  -Pandroid.testInstrumentationRunnerArguments.class=com.mobiletaskmanager.TestIdMatcherTest

./gradlew :app:connectedDebugAndroidTest \
  -Pandroid.testInstrumentationRunnerArguments.class=com.mobiletaskmanager.TestIdMatcherTest#resolvesReactNativeTestIdsOnTheLoginScreen
```

### Results

Gradle exits non-zero when any test fails, so the exit code is authoritative. Full results land in:

```text
app/android/app/build/reports/androidTests/connected/debug/index.html   # HTML report
app/android/app/build/outputs/androidTest-results/connected/debug/      # JUnit XML + per-test logcat
```

The per-test logcat files are the fastest way to diagnose a failure — they capture React Native's own output, including the `initialProps` the app was launched with.

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

`launchAppForUiTest()` passes `uitest`, so every test starts from a clean, logged-out app. The shared harness that consumes these props is `app/src/testing/uiTestHarness.ts`.

## Troubleshooting

**`NoActivityResumedException: No activities in stage RESUMED`**
The device screen is off or locked — an Activity cannot resume behind a dark screen. `launchAppForUiTest()` wakes the device and dismisses the keyguard, so this should only appear if a test launches the app some other way. Confirm with `adb shell dumpsys power | grep mWakefulness`.

**Tests time out waiting for a view, logcat shows `Unable to load script` or `Loading from localhost:8081`**
Metro is not reachable. Start it with `npm run app:start`, and on a physical device run `adb reverse tcp:8081 tcp:8081`.

**`npm run lint` fails after an instrumentation run**
Gradle writes a JavaScript report under `app/android/app/build`. It is excluded in `app/.eslintrc.js`; if a new native build path appears, add it there too.

**`withContentDescription` finds nothing**
That is correct behaviour — see [Selecting React Native elements](#selecting-react-native-elements). Use `withTestId`.

**A `testID` matches more than one view**
React Native renders some ids twice, such as `task-add-button` in the empty state. `onView` then throws `AmbiguousViewMatcherException`; narrow the match with `isDisplayed()` or a parent matcher.

## Status

Espresso is configured, element lookup by `testID` is verified against the running app, and the launch hook is exercised end to end. Screen objects and the auth, task CRUD, filter, and search flows follow in the **Android automation** milestone.
