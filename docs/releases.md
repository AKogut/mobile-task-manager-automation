# GitHub Releases

This project can publish downloadable mobile build artifacts through GitHub Releases.

## What Gets Published

Release workflows build:

```text
MobileTaskManager-debug.apk
MobileTaskManager-ios-simulator.zip
```

These artifacts are intended for local testing on Android emulators/devices and iOS Simulators.

They are not Play Store or App Store production builds.

## Android Debug APK

The CI build includes these Android architectures:

```text
arm64-v8a,x86_64
```

That covers common Apple Silicon ARM emulators and x86_64 emulator images.

### Manual APK Build

From the repository root:

```bash
cd app/android
./gradlew assembleDebug -PreactNativeArchitectures=arm64-v8a,x86_64
```

Output:

```text
app/android/app/build/outputs/apk/debug/app-debug.apk
```

Install manually:

```bash
adb install -r app/android/app/build/outputs/apk/debug/app-debug.apk
```

## iOS Simulator App

The iOS release workflow builds a Simulator `.app` bundle and packages it as:

```text
MobileTaskManager-ios-simulator.zip
```

This artifact works only on **iOS Simulator**. It does not install on a physical iPhone.

### Manual iOS Simulator Build

From the repository root:

```bash
cd app/ios
bundle install
bundle exec pod install

xcodebuild \
  -workspace MobileTaskManager.xcworkspace \
  -scheme MobileTaskManager \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath build/ios-simulator \
  CODE_SIGNING_ALLOWED=NO \
  build
```

Output:

```text
app/ios/build/ios-simulator/Build/Products/Debug-iphonesimulator/MobileTaskManager.app
```

Package manually:

```bash
ditto -c -k --sequesterRsrc --keepParent \
  app/ios/build/ios-simulator/Build/Products/Debug-iphonesimulator/MobileTaskManager.app \
  MobileTaskManager-ios-simulator.zip
```

### Install on iOS Simulator

Unzip the release asset:

```bash
unzip MobileTaskManager-ios-simulator.zip
```

Boot a simulator:

```bash
xcrun simctl boot "iPhone 17 Pro"
open -a Simulator
```

Install the app:

```bash
xcrun simctl install booted MobileTaskManager.app
```

Launch the app:

```bash
xcrun simctl launch booted org.reactjs.native.example.MobileTaskManager
```

If the bundle identifier changes later, check it with:

```bash
/usr/libexec/PlistBuddy -c "Print CFBundleIdentifier" \
  MobileTaskManager.app/Info.plist
```

## Create a GitHub Release

Use a version tag that starts with `v`.

Example:

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions will:

1. Install Node.js 22
2. Build the Android debug APK on Linux
3. Build the iOS Simulator app on macOS
4. Create/update the GitHub Release for the tag
5. Attach `MobileTaskManager-debug.apk`
6. Attach `MobileTaskManager-ios-simulator.zip`

After the workflow finishes, open:

```text
GitHub > Releases > v0.1.0 > Assets
```

Download the needed artifact:

```text
MobileTaskManager-debug.apk
MobileTaskManager-ios-simulator.zip
```

## Manual Workflow Run

You can also run the workflow without creating a tag:

Use either workflow:

- `Android APK Release`
- `iOS Simulator App Release`

Manual runs upload artifacts under:

```text
GitHub > Actions > workflow run > Artifacts
```

Use a tag when you want the APK attached to the public Releases page.

## Versioning Convention

Recommended tag format:

```text
v0.1.0
v0.2.0
v1.0.0
```

Use:

- patch version for small fixes: `v0.1.1`
- minor version for new features: `v0.2.0`
- major version for large milestones: `v1.0.0`

## Notes

- Debug APKs are signed with the default Android debug keystore.
- Do not use this APK for Play Store distribution.
- iOS Simulator `.app` bundles do not require code signing.
- Physical iPhone builds require Apple signing certificates and provisioning profiles.
- Production Android APK/AAB and iOS IPA workflows should be added later with proper signing secrets in GitHub Actions.
