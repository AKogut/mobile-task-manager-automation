import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  framework: 'mocha',
  mochaOpts: {
    timeout: 60000,
  },
  reporters: [['spec', { realtimeReporting: true }]],
  specs: ['./src/tests/**/*.spec.ts'],
  maxInstances: 1,
  logLevel: 'info',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
};

const wdioExports = exports as { config: Options.Testrunner };
wdioExports.config = config;
