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
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': 'iPhone 16',
      'appium:platformVersion': '18.4',
      'appium:app': path.resolve(
        __dirname,
        '../../../app/ios/build/Build/Products/Debug-iphonesimulator/MobileTaskManagerAutomation.app',
      ),
      'appium:bundleId':
        'org.reactjs.native.example.MobileTaskManagerAutomation',
      'appium:newCommandTimeout': 300,
      'appium:autoAcceptAlerts': true,
    },
  ],
};

const wdioExports = exports as { config: Options.Testrunner };
wdioExports.config = config;
