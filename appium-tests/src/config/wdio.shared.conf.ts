import type { Options } from '@wdio/types';

import {
  captureFailureScreenshot,
  type ScreenshotCapable,
} from '../utils/ScreenshotHelper';

export const config: Options.Testrunner = {
  framework: 'mocha',
  mochaOpts: {
    timeout: 60000,
    retries: 1,
  },
  reporters: [['spec', { realtimeReporting: true }]],
  specs: ['./src/tests/**/*.spec.ts'],
  maxInstances: 1,
  logLevel: 'info',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  specFileRetries: 2,
  specFileRetriesDelay: 3,
  specFileRetriesDeferred: false,

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
