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
}
