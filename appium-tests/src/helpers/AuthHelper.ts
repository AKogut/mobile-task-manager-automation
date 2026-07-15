import { DEMO_CREDENTIALS } from '../data/credentials';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TaskDetailsPage } from '../pages/TaskDetailsPage';
import { TaskFormPage } from '../pages/TaskFormPage';
import { isIos } from '../utils/platform';

const IOS_BUNDLE_ID = 'org.reactjs.native.example.MobileTaskManager';
const ANDROID_APP_ID = 'com.mobiletaskmanager';

export class AuthHelper {
  private readonly loginPage = new LoginPage();
  private readonly homePage = new HomePage();
  private readonly settingsPage = new SettingsPage();
  private readonly taskDetailsPage = new TaskDetailsPage();
  private readonly taskFormPage = new TaskFormPage();

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

  async restartApp(): Promise<void> {
    const appId = isIos() ? IOS_BUNDLE_ID : ANDROID_APP_ID;

    await driver.terminateApp(appId);
    await driver.activateApp(appId);
  }

  async relaunchIosWithState(options: {
    authed?: boolean;
    tasksJson?: string;
  }): Promise<void> {
    const launchArguments = ['-uitest'];

    if (options.authed === true) {
      launchArguments.push('-uitest-authed');
    }

    if (options.tasksJson !== undefined && options.tasksJson.length > 0) {
      launchArguments.push('-uitest-tasks', options.tasksJson);
    }

    await driver.execute('mobile: terminateApp', { bundleId: IOS_BUNDLE_ID });
    await driver.execute('mobile: launchApp', {
      bundleId: IOS_BUNDLE_ID,
      arguments: launchArguments,
    });
  }

  async resetToLoginScreen(): Promise<void> {
    await browser.waitUntil(
      async () =>
        (await this.loginPage.isDisplayed()) ||
        (await this.settingsPage.isDisplayed()) ||
        (await this.homePage.isDisplayed()) ||
        (await this.taskDetailsPage.isDisplayed()) ||
        (await this.taskFormPage.isDisplayed()),
      { timeout: 20000, timeoutMsg: 'No known screen appeared within 20s' },
    );

    if (await this.loginPage.isDisplayed()) {
      return;
    }

    if (await this.settingsPage.isDisplayed()) {
      await this.settingsPage.tapBack();
      await this.homePage.waitForScreen();
    }

    if (await this.taskFormPage.isDisplayed()) {
      await this.taskFormPage.tapBackButton();
    }

    if (await this.taskDetailsPage.isDisplayed()) {
      await this.taskDetailsPage.tapHomeButton();
      await this.homePage.waitForScreen();
    }

    if (await this.homePage.isDisplayed()) {
      await this.logout();
    }
  }
}
