import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'screenshots');

export interface ScreenshotCapable {
  saveScreenshot(filepath: string): Promise<Buffer | string>;
}

export async function captureFailureScreenshot(
  driver: ScreenshotCapable,
  testTitle: string,
): Promise<void> {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitized = testTitle
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 100);

  const filepath = path.join(SCREENSHOTS_DIR, `${timestamp}_${sanitized}.png`);

  await driver.saveScreenshot(filepath);

  console.log(`[screenshot] saved -> ${filepath}`);
}
