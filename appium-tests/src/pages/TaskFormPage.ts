import { BasePage } from './BasePage';

type Priority = 'low' | 'medium' | 'high';
type QuickDate = 'today' | 'tomorrow' | 'next-week';

interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  quickDate: QuickDate;
}

export class TaskFormPage extends BasePage {
  private readonly SCREEN = 'task-form-screen';
  private readonly TITLE_INPUT = 'task-title-input';
  private readonly DESCRIPTION_INPUT = 'task-description-input';
  private readonly DUE_DATE_INPUT = 'task-due-date-input';
  private readonly SUBMIT_BUTTON = 'task-submit-button';
  private readonly BACK_BUTTON = 'task-form-back-button';
  private readonly TITLE_ERROR = 'task-title-error';
  private readonly DUE_DATE_ERROR = 'task-due-date-error';

  public async isDisplayed(): Promise<boolean> {
    return (
      (await this.isElementDisplayed(this.SCREEN)) ||
      (await this.isElementDisplayed(this.TITLE_INPUT))
    );
  }

  public async waitForScreen(): Promise<void> {
    await browser.waitUntil(async () => this.isDisplayed(), {
      timeout: 10000,
      timeoutMsg: `Task form (${this.SCREEN}) not visible`,
    });
  }

  public async setTitle(text: string): Promise<void> {
    await this.typeText(this.TITLE_INPUT, text);
  }

  public async clearTitle(): Promise<void> {
    await this.typeText(this.TITLE_INPUT, '');
  }

  public async getTitleValue(): Promise<string> {
    return this.getInputValue(this.TITLE_INPUT);
  }

  public async setDescription(text: string): Promise<void> {
    await this.typeText(this.DESCRIPTION_INPUT, text);
  }

  public async getDescriptionValue(): Promise<string> {
    return this.getInputValue(this.DESCRIPTION_INPUT);
  }

  public async selectPriority(value: Priority): Promise<void> {
    await this.tap(this.priorityOptionId(value));
  }

  public async isPrioritySelected(value: Priority): Promise<boolean> {
    const selected = await this.el(this.priorityOptionId(value)).getAttribute(
      'selected',
    );

    return selected === 'true' || selected === '1';
  }

  public async selectQuickDate(
    option: QuickDate,
    expectedValue?: string,
  ): Promise<void> {
    await this.tap(this.quickDateOptionId(option));
    await browser.waitUntil(
      async () => {
        const dueDate = await this.getDueDateValue();

        return expectedValue === undefined
          ? /^\d{4}-\d{2}-\d{2}$/.test(dueDate)
          : dueDate === expectedValue;
      },
      {
        timeout: 5000,
        timeoutMsg: `Quick date "${option}" did not populate the due date field`,
      },
    );
  }

  public async getDueDateValue(): Promise<string> {
    return this.getInputValue(this.DUE_DATE_INPUT);
  }

  public async tapBackButton(): Promise<void> {
    await this.tap(this.BACK_BUTTON);
  }

  public async submit(): Promise<void> {
    await this.tap(this.SUBMIT_BUTTON);
  }

  public async isTitleErrorVisible(): Promise<boolean> {
    return this.isValidationErrorVisible(this.TITLE_ERROR);
  }

  public async isDueDateErrorVisible(): Promise<boolean> {
    return this.isValidationErrorVisible(this.DUE_DATE_ERROR);
  }

  public async fillAndSubmit(data: TaskFormData): Promise<void> {
    await this.setTitle(data.title);

    if (data.description !== undefined) {
      await this.setDescription(data.description);
    }

    await this.selectPriority(data.priority);
    await this.selectQuickDate(data.quickDate);
    await this.submit();
  }

  private priorityOptionId(value: string): string {
    return `task-priority-option-${value}`;
  }

  private quickDateOptionId(value: string): string {
    return `task-due-date-quick-option-${value}`;
  }

  private async isValidationErrorVisible(testId: string): Promise<boolean> {
    const error = this.el(testId);

    await error.waitForExist({ timeout: 5000 });

    return (await error.getText()).length > 0;
  }
}
