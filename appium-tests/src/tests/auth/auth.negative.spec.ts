import { DEMO_CREDENTIALS } from '../../data/credentials';
import { AuthHelper } from '../../helpers/AuthHelper';
import { HomePage, LoginPage } from '../../pages';

const INVALID_CREDENTIALS = {
  wrongPassword: {
    email: DEMO_CREDENTIALS.email,
    password: 'WrongPassword!',
  },
  unknownEmail: {
    email: 'unknown@example.com',
    password: DEMO_CREDENTIALS.password,
  },
  invalidFormat: {
    email: 'not-an-email',
    password: DEMO_CREDENTIALS.password,
  },
} as const;

describe('Authentication — Negative', () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();
  const authHelper = new AuthHelper();

  beforeEach(async () => {
    await authHelper.resetToLoginScreen();
  });

  afterEach(async () => {
    if (await authHelper.isLoggedIn()) {
      await authHelper.resetToLoginScreen();
    }
  });

  it('TC-AUTH-002 — Login fails with incorrect password', async () => {
    await loginPage.login(
      INVALID_CREDENTIALS.wrongPassword.email,
      INVALID_CREDENTIALS.wrongPassword.password,
    );
    await browser.waitUntil(async () => loginPage.isAuthErrorVisible());

    expect(await loginPage.isAuthErrorVisible()).toBe(true);
    expect(await loginPage.getAuthErrorText()).not.toBe('');
    expect(await loginPage.isDisplayed()).toBe(true);
    expect(await homePage.isDisplayed()).toBe(false);
  });

  it('TC-AUTH-003 — Login fails with unregistered email', async () => {
    await loginPage.login(
      INVALID_CREDENTIALS.unknownEmail.email,
      INVALID_CREDENTIALS.unknownEmail.password,
    );
    await browser.waitUntil(async () => loginPage.isAuthErrorVisible());

    expect(await loginPage.isAuthErrorVisible()).toBe(true);
    expect(await loginPage.isDisplayed()).toBe(true);
  });

  it('TC-AUTH-004 — Login blocked with empty email field', async () => {
    await loginPage.login('', DEMO_CREDENTIALS.password);

    expect(await loginPage.isEmailErrorVisible()).toBe(true);
    expect(await loginPage.isDisplayed()).toBe(true);
  });

  it('TC-AUTH-005 — Login blocked with empty password field', async () => {
    await loginPage.login(DEMO_CREDENTIALS.email, '');

    expect(await loginPage.isPasswordErrorVisible()).toBe(true);
    expect(await loginPage.isDisplayed()).toBe(true);
  });

  it('TC-AUTH-006 — Login blocked with invalid email format', async () => {
    await loginPage.login(
      INVALID_CREDENTIALS.invalidFormat.email,
      INVALID_CREDENTIALS.invalidFormat.password,
    );

    expect(await loginPage.isEmailErrorVisible()).toBe(true);
    expect(await loginPage.isDisplayed()).toBe(true);
  });

  it('TC-AUTH-007 — Error banner disappears when user edits an input', async () => {
    await loginPage.login(
      INVALID_CREDENTIALS.wrongPassword.email,
      INVALID_CREDENTIALS.wrongPassword.password,
    );
    await browser.waitUntil(async () => loginPage.isAuthErrorVisible());

    await loginPage.typeEmail('d');

    expect(await loginPage.isAuthErrorVisible()).toBe(false);
  });

  it('TC-AUTH-008 — Demo credentials card is visible on Login screen', async () => {
    expect(await loginPage.isDemoCredentialsCardVisible()).toBe(true);
    expect(await loginPage.getDemoEmail()).toContain(DEMO_CREDENTIALS.email);
    expect(await loginPage.getDemoPassword()).toContain(
      DEMO_CREDENTIALS.password,
    );
  });

  it.skip('TC-AUTH-013 — Loading indicator shown during login request');
});
