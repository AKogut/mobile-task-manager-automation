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

  protected async typeText(testId: string, text: string): Promise<void> {
    await this.el(testId).click();
    await this.el(testId).clearValue();

    if (text === '') {
      return;
    }

    await this.el(testId).setValue(text);
    await browser.waitUntil(async () => this.fieldHasValue(testId, text), {
      timeout: 5000,
      timeoutMsg: `Failed to enter the expected text into "${testId}"`,
    });
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
