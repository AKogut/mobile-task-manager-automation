import path from 'node:path';
import type { Capabilities, Options } from '@wdio/types';

import { config as sharedConfig } from './wdio.shared.conf';

type AppiumConfig = Options.Testrunner &
  Capabilities.WithRequestedTestrunnerCapabilities;

const DEVICE_NAME = process.env.APPIUM_ANDROID_DEVICE_NAME ?? 'emulator-5554';
const AVD = process.env.APPIUM_ANDROID_AVD ?? 'Pixel_9_Pro_XL_16';
const APP_PATH =
  process.env.APPIUM_ANDROID_APP_PATH ??
  path.resolve(
    __dirname,
    '../../../app/android/app/build/outputs/apk/debug/app-debug.apk',
  );

export const config: AppiumConfig = {
  ...sharedConfig,
  specs: [path.resolve(__dirname, '../tests/**/*.spec.ts')],
  port: 4723,
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': DEVICE_NAME,
      'appium:avd': AVD,
      'appium:app': APP_PATH,
      'appium:appPackage': 'com.mobiletaskmanager',
      'appium:appActivity': '.MainActivity',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 300,
    },
  ],
};

const wdioExports = exports as { config: Options.Testrunner };
wdioExports.config = config;
