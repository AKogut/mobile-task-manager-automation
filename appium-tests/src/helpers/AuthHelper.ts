import { DEMO_CREDENTIALS } from '../data/credentials';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SettingsPage } from '../pages/SettingsPage';

export class AuthHelper {
  private readonly loginPage = new LoginPage();
  private readonly homePage = new HomePage();
  private readonly settingsPage = new SettingsPage();

  async loginWithDemoCredentials(): Promise<void> {
    await this.loginPage.login(
      DEMO_CREDENTIALS.email,
      DEMO_CREDENTIALS.password,
    );
    await this.homePage.waitForScreen();
  }

  async logout(): Promise<void> {
    await this.homePage.tapSettingsButton();
    await this.settingsPage.waitForScreen();
    await this.settingsPage.tapLogout();
    await this.loginPage.waitForScreen();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.homePage.isDisplayed();
  }

  async resetToLoginScreen(): Promise<void> {
    await browser.waitUntil(
      async () =>
        (await this.loginPage.isDisplayed()) ||
        (await this.settingsPage.isDisplayed()) ||
        (await this.homePage.isDisplayed()),
      { timeout: 20000, timeoutMsg: 'No known screen appeared within 20s' },
    );

    if (await this.loginPage.isDisplayed()) {
      return;
    }

    if (await this.settingsPage.isDisplayed()) {
      await this.settingsPage.tapBack();
      await this.homePage.waitForScreen();
    }

    if (await this.homePage.isDisplayed()) {
      await this.logout();
    }
  }
}
