# Android UI Tests (Espresso)

Native Android UI automation written in **Kotlin** using **Espresso**.

## Planned structure

```text
android-tests/
└── app/src/
    ├── androidTest/java/.../pageobjects/
    └── androidTest/java/.../flows/
```

## Integration

- Instrumentation tests run against the debug APK from `app/android`
- Share content descriptions / `testTag` values with React Native `testID` props
- Execute via Gradle: `./gradlew connectedDebugAndroidTest`

## Status

Scaffolding is in place. Gradle module and Kotlin test sources will be added in the **Android automation** milestone.
