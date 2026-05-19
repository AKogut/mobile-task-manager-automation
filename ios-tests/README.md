# iOS UI Tests (XCUITest)

Native iOS UI automation written in **Swift** using **XCUITest**.

## Planned structure

```text
ios-tests/
└── MobileTaskManagerUITests/
    ├── Helpers/           # Waits, launch arguments, test data
    ├── PageObjects/       # XCUIElementQuery wrappers
    └── Flows/             # Login, task CRUD, settings
```

## Integration

- UI tests target the `MobileTaskManager` app built from `app/ios`
- Mirror `testID` values used by React Native screens and Appium page objects
- Run from Xcode or `xcodebuild test` in CI on macOS runners

## Status

Scaffolding is in place. Test targets and Swift packages will be added in the **iOS automation** milestone.
