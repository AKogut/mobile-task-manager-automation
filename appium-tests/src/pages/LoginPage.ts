import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly SCREEN = 'login-screen';
  private readonly EMAIL_INPUT = 'login-email-input';
  private readonly PASSWORD_INPUT = 'login-password-input';
  private readonly SUBMIT_BUTTON = 'login-submit-button';
  private readonly AUTH_ERROR_BANNER = 'auth-error-banner';
  private readonly AUTH_ERROR_MESSAGE = 'auth-error-message';
  private readonly DEMO_CREDENTIALS_CARD = 'demo-credentials-card';
  private readonly DEMO_CREDENTIALS_EMAIL = 'demo-credentials-email';
  private readonly DEMO_CREDENTIALS_PASSWORD = 'demo-credentials-password';

  public async isDisplayed(): Promise<boolean> {
    return this.isElementDisplayed(this.SCREEN);
  }

  public async login(email: string, password: string): Promise<void> {
    await this.waitForDisplayed(this.SCREEN);
    await this.typeText(this.EMAIL_INPUT, email);
    await this.typeText(this.PASSWORD_INPUT, password);
    await this.tap(this.SUBMIT_BUTTON);
  }

  public async isAuthErrorVisible(): Promise<boolean> {
    return this.isElementDisplayed(this.AUTH_ERROR_BANNER);
  }

  public async getAuthErrorText(): Promise<string> {
    return this.getText(this.AUTH_ERROR_MESSAGE);
  }

  public async isDemoCredentialsCardVisible(): Promise<boolean> {
    return this.isElementDisplayed(this.DEMO_CREDENTIALS_CARD);
  }

  public async getDemoEmail(): Promise<string> {
    return this.getText(this.DEMO_CREDENTIALS_EMAIL);
  }

  public async getDemoPassword(): Promise<string> {
    return this.getText(this.DEMO_CREDENTIALS_PASSWORD);
  }

  public async tapEmailInput(): Promise<void> {
    await this.tap(this.EMAIL_INPUT);
  }

  public async typeEmail(email: string): Promise<void> {
    await this.typeText(this.EMAIL_INPUT, email);
  }
}
