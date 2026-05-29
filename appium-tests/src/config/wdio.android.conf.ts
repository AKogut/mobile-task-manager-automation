import path from 'node:path';
import type { Capabilities, Options } from '@wdio/types';

import { config as sharedConfig } from './wdio.shared.conf';

type AppiumConfig = Options.Testrunner &
  Capabilities.WithRequestedTestrunnerCapabilities;

export const config: AppiumConfig = {
  ...sharedConfig,
  port: 4723,
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'emulator-5554',
      'appium:avd': 'Pixel_8_API_35',
      'appium:app': path.resolve(
        __dirname,
        '../../../app/android/app/build/outputs/apk/debug/app-debug.apk',
      ),
      'appium:appPackage': 'com.mobiletaskmanagerautomation',
      'appium:appActivity': '.MainActivity',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 300,
    },
  ],
};

const wdioExports = exports as { config: Options.Testrunner };
wdioExports.config = config;
