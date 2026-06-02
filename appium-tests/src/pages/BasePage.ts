import type { ChainablePromiseElement } from 'webdriverio';

export abstract class BasePage {
  protected el(testId: string): ChainablePromiseElement {
    if (this.isAndroid()) {
      return $(`android=new UiSelector().resourceId("${testId}")`);
    }

    return $(`~${testId}`);
  }

  protected elByAccessibilityLabel(label: string): ChainablePromiseElement {
    return $(`~${label}`);
  }

  protected async acceptAlert(): Promise<void> {
    await browser.acceptAlert();
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
    const element = this.el(testId);
    if (text === '') {
      await element.click();
      await element.clearValue();
      return;
    }

    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await element.click();
      await element.clearValue();
      await element.setValue(text);
      if (await this.fieldHasValue(element, text)) {
        return;
      }
    }
    throw new Error(
      `Failed to enter the expected text into "${testId}" after ${String(maxAttempts)} attempts`,
    );
  }

  private async fieldHasValue(
    element: ChainablePromiseElement,
    expected: string,
  ): Promise<boolean> {
    let actual: string;
    try {
      actual = await element.getValue();
    } catch {
      return true;
    }
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
    try {
      return await this.el(testId).isDisplayed();
    } catch {
      return false;
    }
  }

  public abstract isDisplayed(): Promise<boolean>;

  private isAndroid(): boolean {
    return browser.capabilities.platformName === 'Android';
  }
}
