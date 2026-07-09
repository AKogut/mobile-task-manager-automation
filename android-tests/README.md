# Android UI Tests (Espresso)

Native Android UI automation written in **Kotlin** using **Espresso**, running against the React Native app in `app/android`.

## Structure

```text
android-tests/
└── src/androidTest/kotlin/com/mobiletaskmanager/
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

## Running

```bash
npm run android:test
```

Equivalent to `./gradlew connectedDebugAndroidTest` from `app/android`, and requires a connected device or a booted emulator (`adb devices`).

Tests that exercise the UI need the Metro bundler running (`npm run app:start`) for debug builds. The current smoke test asserts the instrumentation target only, so it runs without Metro.

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

React Native maps the `testID` prop to the view's **resource id** (`viewIdResourceName`), not to `contentDescription` — `contentDescription` carries `accessibilityLabel` instead. Espresso has no built-in matcher for a string resource id, so element lookup uses a custom matcher that reads the tag React Native sets on the view. It is introduced together with the screen objects.

`testID` values are defined once in `app/src/constants/testIds.ts` and shared across the Appium, XCUITest, and Espresso suites.

## Status

Espresso is configured and a placeholder instrumentation test passes on device. Screen objects and the auth, task CRUD, filter, and search flows follow in the **Android automation** milestone.
