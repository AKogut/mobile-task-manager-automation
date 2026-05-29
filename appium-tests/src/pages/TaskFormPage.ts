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
  private readonly TITLE_ERROR = 'task-title-error';
  private readonly DUE_DATE_ERROR = 'task-due-date-error';

  public async isDisplayed(): Promise<boolean> {
    return this.isElementDisplayed(this.SCREEN);
  }

  public async waitForScreen(): Promise<void> {
    await this.waitForDisplayed(this.SCREEN);
  }

  public async setTitle(text: string): Promise<void> {
    await this.typeText(this.TITLE_INPUT, text);
  }

  public async clearTitle(): Promise<void> {
    await this.el(this.TITLE_INPUT).clearValue();
  }

  public async setDescription(text: string): Promise<void> {
    await this.typeText(this.DESCRIPTION_INPUT, text);
  }

  public async selectPriority(value: Priority): Promise<void> {
    await this.tap(this.priorityOptionId(value));
  }

  public async selectQuickDate(option: QuickDate): Promise<void> {
    await this.tap(this.quickDateOptionId(option));
  }

  public async getDueDateValue(): Promise<string> {
    return this.getText(this.DUE_DATE_INPUT);
  }

  public async submit(): Promise<void> {
    await this.tap(this.SUBMIT_BUTTON);
  }

  public async isTitleErrorVisible(): Promise<boolean> {
    return this.isElementDisplayed(this.TITLE_ERROR);
  }

  public async isDueDateErrorVisible(): Promise<boolean> {
    return this.isElementDisplayed(this.DUE_DATE_ERROR);
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
}
