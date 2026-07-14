import fs from 'node:fs';
import path from 'node:path';
import type { Options } from '@wdio/types';

import {
  captureFailureScreenshot,
  type ScreenshotCapable,
} from '../utils/ScreenshotHelper';

export type Platform = 'android' | 'ios';

export interface SharedConfigOptions {
  platform: Platform;
  environment: Record<string, string>;
}

function resultsDirFor(platform: Platform): string {
  return path.resolve(__dirname, '../../allure-results', platform);
}

function writeAllureEnvironment(
  platform: Platform,
  environment: Record<string, string>,
): void {
  const resultsDir = resultsDirFor(platform);

  fs.mkdirSync(resultsDir, { recursive: true });

  const content = Object.entries(environment)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(path.join(resultsDir, 'environment.properties'), content);
}

export function createSharedConfig({
  platform,
  environment,
}: SharedConfigOptions): Options.Testrunner {
  return {
    framework: 'mocha',
    mochaOpts: {
      timeout: 300000,
      retries: 1,
    },
    reporters: [
      ['spec', { realtimeReporting: true }],
      [
        'allure',
        {
          outputDir: resultsDirFor(platform),
          disableWebdriverStepsReporting: true,
          disableWebdriverScreenshotsReporting: false,
        },
      ],
    ],
    specs: [path.resolve(__dirname, '../tests/**/*.spec.ts')],
    maxInstances: 1,
    logLevel: 'info',
    waitforTimeout: 10000,
    connectionRetryTimeout: 300000,
    connectionRetryCount: 0,
    specFileRetries: 1,
    specFileRetriesDeferred: true,

    onPrepare: () => {
      writeAllureEnvironment(platform, environment);
    },

    afterTest: async (test, _context, result) => {
      if (result.error === undefined) {
        return;
      }

      try {
        const driver = (global as unknown as { browser: ScreenshotCapable })
          .browser;
        await captureFailureScreenshot(driver, test.title, platform);
      } catch (screenshotError) {
        console.warn('[screenshot] failed to capture:', screenshotError);
      }
    },
  };
}
