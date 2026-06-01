import { DEMO_CREDENTIALS } from '../../data/credentials';
import { AuthHelper } from '../../helpers/AuthHelper';
import { HomePage, LoginPage, SettingsPage } from '../../pages';

describe('Authentication — Smoke', () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();
  const settingsPage = new SettingsPage();
  const authHelper = new AuthHelper();

  beforeEach(async () => {
    await authHelper.resetToLoginScreen();
  });

  afterEach(async () => {
    await authHelper.resetToLoginScreen();
  });

  it('TC-AUTH-001 — Successful login with valid credentials', async () => {
    await loginPage.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    await homePage.waitForScreen();

    expect(await homePage.isDisplayed()).toBe(true);
  });

  it('TC-AUTH-009 — Successful logout clears session', async () => {
    await authHelper.loginWithDemoCredentials();

    await homePage.tapSettingsButton();
    await settingsPage.waitForScreen();

    expect(await settingsPage.isDisplayed()).toBe(true);

    await settingsPage.tapLogout();
    await loginPage.waitForScreen();

    expect(await loginPage.isDisplayed()).toBe(true);
  });
});
