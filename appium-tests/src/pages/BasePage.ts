import type { ChainablePromiseElement } from 'webdriverio';

export abstract class BasePage {
  protected el(testId: string): ChainablePromiseElement {
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

    await element.clearValue();
    await element.setValue(text);
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
}
