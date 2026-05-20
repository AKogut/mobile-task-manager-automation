# Build and Run Guide

This guide explains how to build and run the React Native app locally on iOS and Android, including how to target a specific simulator, emulator, or physical device.

## Prerequisites

- Node.js 22.11+
- npm
- Xcode with iOS Simulator runtime installed
- CocoaPods
- Android Studio with Android SDK and emulator
- JDK supported by React Native (17-20)

## Install Dependencies

From the repository root:

```bash
npm install
cd app && npm install
```

Install iOS native dependencies:

```bash
cd app/ios
bundle install
bundle exec pod install
cd ../..
```

## Start Metro

Metro is the JavaScript dev server. Keep it running in a separate terminal:

```bash
npm run app:start
```

If Metro is already running on port `8081`, you do not need to start it again.

## iOS

### Run on the Default Simulator

```bash
npm run app:ios
```

This builds the iOS app with `xcodebuild`, installs it on a simulator, and launches it.

### List Available Simulators

```bash
xcrun simctl list devices available
```

### Run on a Specific Simulator by Name

```bash
npm run app:ios -- --simulator="iPhone 17 Pro"
```

### Run on a Specific Simulator by UDID

```bash
npm run app:ios -- --udid E7C79194-1CBA-4076-92EB-6EA46B60BD0F
```

Using a UDID is the most precise option when multiple simulators have the same name across different iOS versions.

### Boot a Simulator Manually

```bash
xcrun simctl boot E7C79194-1CBA-4076-92EB-6EA46B60BD0F
open -a Simulator
```

Then run:

```bash
npm run app:ios -- --udid E7C79194-1CBA-4076-92EB-6EA46B60BD0F
```

### Build Only

From `app/ios`:

```bash
xcodebuild \
  -workspace MobileTaskManager.xcworkspace \
  -scheme MobileTaskManager \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  build
```

### Important Xcode Notes

- Open `app/ios/MobileTaskManager.xcworkspace`, not `MobileTaskManager.xcodeproj`, when using Xcode UI.
- If `xcodebuild` fails with code `70` and says an iOS platform is missing, install the matching simulator runtime.

Install the latest iOS simulator platform from CLI:

```bash
xcodebuild -downloadPlatform iOS
```

Or use Xcode:

```text
Xcode > Settings > Components > iOS Simulator > Download
```

## Android

### Run on the Default Emulator or Device

Start an Android emulator or connect a physical device first, then run:

```bash
npm run app:android
```

This builds the Android app with Gradle, installs it, and launches it.

### List Connected Devices

```bash
adb devices
```

The output should show at least one device with the `device` status.

### List Available Emulators

```bash
emulator -list-avds
```

### Start a Specific Emulator

```bash
emulator -avd <AVD_NAME>
```

Example:

```bash
emulator -avd Pixel_8_API_36
```

### Run on a Specific Android Device

Use the device ID from `adb devices`:

```bash
cd app
npx react-native run-android --deviceId emulator-5554
```

### Build Only

Debug APK:

```bash
cd app/android
./gradlew assembleDebug
```

Output:

```text
app/android/app/build/outputs/apk/debug/app-debug.apk
```

Install the debug APK manually:

```bash
adb install -r app/android/app/build/outputs/apk/debug/app-debug.apk
```

## Troubleshooting

### Metro Cache

```bash
cd app
npx react-native start --reset-cache
```

### React Native Doctor

```bash
cd app
npx react-native doctor
```

### iOS: Missing Simulator Runtime

If you see:

```text
iOS <version> is not installed. Please download and install the platform from Xcode > Settings > Components.
```

Install the missing runtime:

```bash
xcodebuild -downloadPlatform iOS
```

Then retry:

```bash
npm run app:ios
```

### Android: `buildCMakeDebug[x86_64]` Failed on Apple Silicon

If the emulator is ARM64 (`sdk_gphone64_arm64`) but Gradle builds `x86_64`, limit architectures in `app/android/gradle.properties`:

```properties
reactNativeArchitectures=arm64-v8a
```

Then clean native build cache:

```bash
cd app/android
./gradlew --stop
rm -rf app/.cxx app/build .gradle
./gradlew clean
cd ../..
npm run android
```

### Android: No Devices Found

If `adb devices` is empty:

1. Start an emulator from Android Studio Device Manager, or run `emulator -avd <AVD_NAME>`.
2. Wait until it fully boots.
3. Run `adb devices` again.
4. Retry `npm run app:android`.

### Android: Unsupported JDK

React Native supports **JDK 17** for this project setup. If `react-native doctor` reports an unsupported JDK, or the build fails with:

```text
Execution failed for task ':app:configureCMakeDebug[arm64-v8a]'.
WARNING: A restricted method in java.lang.System has been called
```

your Gradle daemon is likely using JDK 21+ (for example JDK 25).

Fix on macOS:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
cd app/android
./gradlew --stop
./gradlew clean
cd ../..
npm run android
```

This repo also pins JDK 17 in `app/android/gradle.properties` via `org.gradle.java.home`. If your JDK 17 path differs, copy `app/android/local.properties.example` to `local.properties` and update the path.
