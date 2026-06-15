import type { ChainablePromiseElement } from 'webdriverio';

export abstract class BasePage {
  protected el(testId: string): ChainablePromiseElement {
    return $(this.testIdSelector(testId));
  }

  private testIdSelector(testId: string): string {
    if (this.isAndroid()) {
      return `android=new UiSelector().resourceId("${testId}")`;
    }

    return `~${testId}`;
  }

  protected elByAccessibilityLabel(label: string): ChainablePromiseElement {
    if (this.isAndroid()) {
      return $(`android=new UiSelector().description("${label}")`);
    }

    return $(`-ios predicate string:label == "${label}"`);
  }

  protected async waitForDisplayed(
    testId: string,
    timeout = 10000,
  ): Promise<void> {
    await this.el(testId).waitForDisplayed({ timeout });
  }

  protected async tap(testId: string): Promise<void> {
    await this.el(testId).click();
  }

  protected async scrollIntoView(
    testId: string,
    maxSwipes = 8,
  ): Promise<boolean> {
    return this.scrollUntilDisplayed(testId, 'up', maxSwipes);
  }

  protected async scrollToTop(testId: string, maxSwipes = 8): Promise<boolean> {
    return this.scrollUntilDisplayed(testId, 'down', maxSwipes);
  }

  private async scrollUntilDisplayed(
    testId: string,
    direction: 'up' | 'down',
    maxSwipes: number,
  ): Promise<boolean> {
    const target = this.el(testId);

    if (!(await target.isExisting())) {
      return false;
    }

    if (await target.isDisplayed()) {
      return true;
    }

    if (this.isAndroid()) {
      return target.isDisplayed();
    }

    for (let swipe = 0; swipe < maxSwipes; swipe += 1) {
      await this.swipe(direction);

      if ((await target.isExisting()) && (await target.isDisplayed())) {
        return true;
      }
    }

    return (await target.isExisting()) && (await target.isDisplayed());
  }

  private async swipe(direction: 'up' | 'down'): Promise<void> {
    const { width, height } = await browser.getWindowRect();
    const x = Math.round(width / 2);
    const farY = Math.round(height * 0.75);
    const nearY = Math.round(height * 0.3);
    const startY = direction === 'up' ? farY : nearY;
    const endY = direction === 'up' ? nearY : farY;

    await browser
      .action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ x, y: startY })
      .down()
      .pause(100)
      .move({ duration: 500, x, y: endY })
      .up()
      .pause(250)
      .perform();
  }

  protected async typeText(testId: string, text: string): Promise<void> {
    await this.el(testId).click();
    await this.el(testId).clearValue();

    if (text === '') {
      return;
    }

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await this.el(testId).setValue(text);

      if (await this.waitForFieldValue(testId, text)) {
        return;
      }

      await this.el(testId).click();
      await this.el(testId).clearValue();
    }

    throw new Error(`Failed to enter the expected text into "${testId}"`);
  }

  private async waitForFieldValue(
    testId: string,
    text: string,
  ): Promise<boolean> {
    try {
      await browser.waitUntil(async () => this.fieldHasValue(testId, text), {
        timeout: 5000,
      });

      return true;
    } catch {
      return false;
    }
  }

  protected async getInputValue(testId: string): Promise<string> {
    if (this.isAndroid()) {
      return this.el(testId).getText();
    }

    return this.el(testId).getValue();
  }

  private async fieldHasValue(
    testId: string,
    expected: string,
  ): Promise<boolean> {
    const element = this.el(testId);
    const actual = this.isAndroid()
      ? await element.getText()
      : await element.getValue();
    if (actual === expected) {
      return true;
    }
    const isMasked = /^[•*]+$/.test(actual);
    return isMasked && actual.length === expected.length;
  }

  protected async getText(testId: string): Promise<string> {
    return this.el(testId).getText();
  }

  protected async isElementDisplayed(testId: string): Promise<boolean> {
    const elements = browser.$$(this.testIdSelector(testId));
    const count = await elements.length;

    if (count === 0) {
      return false;
    }

    return elements[0].isDisplayed();
  }

  public abstract isDisplayed(): Promise<boolean>;

  private isAndroid(): boolean {
    return browser.capabilities.platformName === 'Android';
  }
}
