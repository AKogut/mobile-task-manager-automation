import { BasePage } from './BasePage';

export class TaskDetailsPage extends BasePage {
  private readonly SCREEN = 'task-details-screen';
  private readonly HOME_BUTTON = 'task-details-home-button';
  private readonly TITLE = 'task-details-title';
  private readonly DESCRIPTION = 'task-details-description';
  private readonly STATUS_TEXT = 'task-details-status-text';
  private readonly PRIORITY_TEXT = 'task-details-priority-text';
  private readonly CALENDAR_CARD = 'task-details-calendar-card';
  private readonly CREATED_CARD = 'task-details-created-card';
  private readonly COMPLETE_BUTTON = 'task-details-complete-button';
  private readonly EDIT_BUTTON = 'task-details-edit-button';
  private readonly DELETE_BUTTON = 'task-details-delete-button';
  private readonly NEW_TASK_BUTTON = 'task-add-button';

  public async isDisplayed(): Promise<boolean> {
    return this.isElementDisplayed(this.SCREEN);
  }

  public async waitForScreen(): Promise<void> {
    await this.waitForDisplayed(this.SCREEN);
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

  public async tapCompleteButton(): Promise<void> {
    await this.tap(this.COMPLETE_BUTTON);
  }

  public async tapEditButton(): Promise<void> {
    await this.tap(this.EDIT_BUTTON);
  }

  public async tapDeleteButton(): Promise<void> {
    await this.tap(this.DELETE_BUTTON);
  }

  public async tapHomeButton(): Promise<void> {
    await this.tap(this.HOME_BUTTON);
  }

  public async tapNewTaskButton(): Promise<void> {
    await this.tap(this.NEW_TASK_BUTTON);
  }

  public async isCalendarCardVisible(): Promise<boolean> {
    return this.isElementDisplayed(this.CALENDAR_CARD);
  }

  public async isCreatedCardVisible(): Promise<boolean> {
    return this.isElementDisplayed(this.CREATED_CARD);
  }

  public async getCompleteButtonText(): Promise<string> {
    return this.getText(this.COMPLETE_BUTTON);
  }

  public async confirmDelete(): Promise<void> {
    await this.tapDeleteButton();
    await this.acceptAlert();
  }
}
