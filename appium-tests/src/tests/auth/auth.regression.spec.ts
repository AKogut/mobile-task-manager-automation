import { DEMO_CREDENTIALS } from '../../data/credentials';
import { AuthHelper } from '../../helpers/AuthHelper';
import { HomePage, LoginPage, SettingsPage } from '../../pages';

describe('Authentication — Regression', () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();
  const settingsPage = new SettingsPage();
  const authHelper = new AuthHelper();

  beforeEach(async () => {
    await authHelper.resetToLoginScreen();
  });

  it('TC-AUTH-010 — Settings screen displays correct account info', async () => {
    await authHelper.loginWithDemoCredentials();

    await homePage.tapSettingsButton();
    await settingsPage.waitForScreen();

    expect(await settingsPage.isDisplayed()).toBe(true);
    expect(await settingsPage.getAccountName()).toBe(DEMO_CREDENTIALS.name);
    expect(await settingsPage.getAccountEmail()).toBe(DEMO_CREDENTIALS.email);
  });

  it('TC-AUTH-011 — Session persists after app restart', async () => {
    await authHelper.loginWithDemoCredentials();

    await authHelper.restartApp();
    await homePage.waitForScreen();

    expect(await homePage.isDisplayed()).toBe(true);
    expect(await loginPage.isDisplayed()).toBe(false);
  });

  it('TC-AUTH-012 — Unauthenticated user lands on Login screen', async () => {
    await authHelper.restartApp();
    await loginPage.waitForScreen();

    expect(await loginPage.isDisplayed()).toBe(true);
    expect(await homePage.isDisplayed()).toBe(false);
  });
});
