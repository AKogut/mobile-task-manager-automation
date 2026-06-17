import fs from 'node:fs';
import path from 'node:path';

import type { Platform } from '../config/wdio.shared.conf';

const SCREENSHOTS_ROOT = path.resolve(process.cwd(), 'screenshots');

export interface ScreenshotCapable {
  saveScreenshot(filepath: string): Promise<Buffer | string>;
}

export async function captureFailureScreenshot(
  driver: ScreenshotCapable,
  testTitle: string,
  platform: Platform,
): Promise<void> {
  const targetDir = path.join(SCREENSHOTS_ROOT, platform);

  fs.mkdirSync(targetDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitized = testTitle
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 100);

  const filepath = path.join(targetDir, `${timestamp}_${sanitized}.png`);

  await driver.saveScreenshot(filepath);

  console.log(`[screenshot] saved -> ${filepath}`);
}
