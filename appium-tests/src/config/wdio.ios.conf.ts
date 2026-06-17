import path from 'node:path';
import type { Capabilities, Options } from '@wdio/types';

import { createSharedConfig } from './wdio.shared.conf';

type AppiumConfig = Options.Testrunner &
  Capabilities.WithRequestedTestrunnerCapabilities;

const DEVICE_NAME = process.env.APPIUM_IOS_DEVICE_NAME ?? 'iPhone 17 Pro Max';
const PLATFORM_VERSION = process.env.APPIUM_IOS_PLATFORM_VERSION ?? '26.5';
const UDID = process.env.APPIUM_IOS_UDID;
const APP_PATH =
  process.env.APPIUM_IOS_APP_PATH ??
  path.resolve(
    __dirname,
    '../../../app/ios/build/Build/Products/Debug-iphonesimulator/MobileTaskManager.app',
  );

const WDA_DERIVED_DATA = process.env.WDA_DERIVED_DATA;

export const config: AppiumConfig = {
  ...createSharedConfig({
    platform: 'ios',
    environment: {
      Platform: 'iOS',
      Device: DEVICE_NAME,
      PlatformVersion: PLATFORM_VERSION,
      Automation: 'XCUITest',
    },
  }),
  port: 4723,
  capabilities: [
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': DEVICE_NAME,
      ...(UDID === undefined ? {} : { 'appium:udid': UDID }),
      'appium:platformVersion': PLATFORM_VERSION,
      'appium:app': APP_PATH,
      'appium:bundleId': 'org.reactjs.native.example.MobileTaskManager',
      'appium:newCommandTimeout': 300,
      ...(WDA_DERIVED_DATA !== undefined
        ? {
            'appium:usePrebuiltWDA': true,
            'appium:derivedDataPath': WDA_DERIVED_DATA,
          }
        : {}),
      ...({ 'appium:wdaLaunchTimeout': 300000 } as Record<string, unknown>),
    },
  ],
};

const wdioExports = exports as { config: Options.Testrunner };
wdioExports.config = config;
