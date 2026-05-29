import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
  private readonly SCREEN = 'settings-screen';
  private readonly ACCOUNT_NAME = 'settings-account-name';
  private readonly ACCOUNT_EMAIL = 'settings-account-email';
  private readonly LOGOUT_BUTTON = 'logout-button';
  private readonly BACK_BUTTON = 'settings-back-button';

  public async isDisplayed(): Promise<boolean> {
    return this.isElementDisplayed(this.SCREEN);
  }

  public async waitForScreen(): Promise<void> {
    await this.waitForDisplayed(this.SCREEN);
  }

  public async getAccountName(): Promise<string> {
    return this.getText(this.ACCOUNT_NAME);
  }

  public async getAccountEmail(): Promise<string> {
    return this.getText(this.ACCOUNT_EMAIL);
  }

  public async tapLogout(): Promise<void> {
    await this.tap(this.LOGOUT_BUTTON);
  }

  public async tapBack(): Promise<void> {
    await this.tap(this.BACK_BUTTON);
  }
}
