import type { Options } from '@wdio/types';

import {
  captureFailureScreenshot,
  type ScreenshotCapable,
} from '../utils/ScreenshotHelper';

export const config: Options.Testrunner = {
  framework: 'mocha',
  mochaOpts: {
    timeout: 180000,
    retries: 0,
  },
  reporters: [
    ['spec', { realtimeReporting: true }],
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
  specs: ['./src/tests/**/*.spec.ts'],
  maxInstances: 1,
  logLevel: 'info',
  waitforTimeout: 10000,
  // 5 min: covers app install (~1.5 min) + WDA startup on first session.
  connectionRetryTimeout: 300000,
  // No retries: each retry spawns a new WDA xcodebuild that competes for
  // port 8100 with the previous (still-running) one, causing ECONNREFUSED.
  connectionRetryCount: 0,

  specFileRetries: 0,

  afterTest: async (test, _context, result) => {
    if (result.error !== undefined) {
      try {
        const driver = (global as unknown as { browser: ScreenshotCapable })
          .browser;
        await captureFailureScreenshot(driver, test.title);
      } catch (screenshotError) {
        console.warn('[screenshot] failed to capture:', screenshotError);
      }
    }
  },
};

const wdioExports = exports as { config: Options.Testrunner };
wdioExports.config = config;
