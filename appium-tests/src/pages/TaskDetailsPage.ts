import { BasePage } from './BasePage';

export class TaskDetailsPage extends BasePage {
  private readonly SCREEN = 'task-details-screen';
  private readonly HOME_BUTTON = 'task-details-home-button';
  private readonly TITLE = 'task-details-title';
  private readonly DESCRIPTION = 'task-details-description';
  private readonly STATUS_TEXT = 'task-details-status-text';
  private readonly PRIORITY_TEXT = 'task-details-priority-text';
  private readonly EDIT_BUTTON = 'task-details-edit-button';
  private readonly DELETE_BUTTON = 'task-details-delete-button';

  private readonly IOS_ALERT =
    '-ios predicate string:type == "XCUIElementTypeAlert"';
  private readonly ANDROID_ALERT_TITLE =
    'android=new UiSelector().text("Delete task?")';
  private readonly ANDROID_ALERT_MESSAGE =
    'android=new UiSelector().text("This action cannot be undone.")';
  private readonly ANDROID_ALERT_CONFIRM =
    'android=new UiSelector().resourceId("android:id/button1")';
  private readonly ANDROID_ALERT_CANCEL =
    'android=new UiSelector().resourceId("android:id/button2")';

  public async isDisplayed(): Promise<boolean> {
    return (
      (await this.isElementDisplayed(this.SCREEN)) ||
      (await this.isElementDisplayed(this.TITLE))
    );
  }

  public async waitForScreen(): Promise<void> {
    await browser.waitUntil(async () => this.isDisplayed(), {
      timeout: 10000,
      timeoutMsg: `Task details (${this.SCREEN}) not visible`,
    });
  }

  public async getTitle(): Promise<string> {
    return this.getText(this.TITLE);
  }

  public async getDescription(): Promise<string> {
    return this.getText(this.DESCRIPTION);
  }

  public async getStatusText(): Promise<string> {
    return this.getText(this.STATUS_TEXT);
  }

  public async getPriorityText(): Promise<string> {
    return this.getText(this.PRIORITY_TEXT);
  }

  public async tapEditButton(): Promise<void> {
    await this.tap(this.EDIT_BUTTON);
  }

  public async tapDeleteButton(): Promise<void> {
    const button = this.isIos()
      ? this.elByAccessibilityLabel('Delete task')
      : this.el(this.DELETE_BUTTON);

    await button.waitForExist({ timeout: 10000 });
    await button.scrollIntoView();
    await button.click();
  }

  public async getDeleteDialogText(): Promise<string> {
    await this.waitForDeleteDialog();

    if (this.isIos()) {
      return browser.getAlertText();
    }

    const title = await $(this.ANDROID_ALERT_TITLE).getText();
    const message = await $(this.ANDROID_ALERT_MESSAGE).getText();

    return `${title}\n${message}`;
  }

  public async tapHomeButton(): Promise<void> {
    await this.tap(this.HOME_BUTTON);
  }

  public async confirmDelete(): Promise<void> {
    await this.tapDeleteButton();
    await this.acceptDeleteDialog();
  }

  public async cancelDelete(): Promise<void> {
    await this.waitForDeleteDialog();

    if (this.isIos()) {
      await browser.dismissAlert();
      return;
    }

    await $(this.ANDROID_ALERT_CANCEL).click();
  }

  public async acceptDeleteDialog(): Promise<void> {
    await this.waitForDeleteDialog();

    if (this.isIos()) {
      await browser.acceptAlert();
      return;
    }

    await $(this.ANDROID_ALERT_CONFIRM).click();
  }

  private async waitForDeleteDialog(): Promise<void> {
    const selector = this.isIos() ? this.IOS_ALERT : this.ANDROID_ALERT_CONFIRM;

    await $(selector).waitForDisplayed({ timeout: 10000 });
  }

  private isIos(): boolean {
    return browser.capabilities.platformName === 'iOS';
  }
}
