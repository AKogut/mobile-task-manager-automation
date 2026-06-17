import { BasePage } from './BasePage';

type StatusFilter = 'all' | 'open' | 'completed';
type PriorityFilter = 'all' | 'low' | 'medium' | 'high';
type SortOption = 'dueDate' | 'priority' | 'status' | 'createdAt';

export class HomePage extends BasePage {
  private readonly SCREEN = 'main-screen';
  private readonly SEARCH_INPUT = 'task-search-input';
  private readonly ADD_BUTTON = 'task-add-button';
  private readonly SETTINGS_BUTTON = 'settings-open-button';
  private readonly SETTINGS_SCREEN = 'settings-screen';
  private readonly SETTINGS_TITLE = 'settings-title';
  private readonly SETTINGS_BACK_BUTTON = 'settings-back-button';
  private readonly TASK_TITLE_INPUT = 'task-title-input';
  private readonly ACTIVE_FILTERS_COUNT = 'task-active-filters-count';
  private readonly NO_RESULTS_CARD = 'task-no-results-card';
  private readonly EMPTY_STATE_CARD = 'task-empty-state-card';
  private readonly TASK_LIST_TITLE = 'task-list-title';

  public async isDisplayed(): Promise<boolean> {
    return this.isElementDisplayed(this.SCREEN);
  }

  public async waitForScreen(timeout = 10000): Promise<void> {
    await this.waitForDisplayed(this.SCREEN, timeout);
  }

  public async tapAddButton(): Promise<void> {
    await browser.waitUntil(
      async () => {
        if (await this.isElementDisplayed(this.TASK_TITLE_INPUT)) {
          return true;
        }

        await this.triggerAddTask();

        return this.isElementDisplayed(this.TASK_TITLE_INPUT);
      },
      {
        timeout: 20000,
        interval: 1000,
        timeoutMsg: 'Add task form did not open',
      },
    );
  }

  private async triggerAddTask(): Promise<void> {
    try {
      if (this.isIos()) {
        await this.tapIosAddTaskButton();
      } else {
        await this.tap(this.ADD_BUTTON);
      }
    } catch {
      return;
    }
  }

  private async tapIosAddTaskButton(): Promise<void> {
    const labels = ['Add first task', 'Add task'];

    for (const label of labels) {
      const button = this.elByAccessibilityLabel(label);

      if (!(await button.isExisting())) {
        continue;
      }

      if (!(await button.isDisplayed().catch(() => false))) {
        await button.scrollIntoView().catch(() => undefined);
      }

      await button.click();
      return;
    }

    throw new Error('Add task button not found');
  }

  public async tapSettingsButton(): Promise<void> {
    await this.waitForDisplayed(this.SETTINGS_BUTTON);
    await this.tap(this.SETTINGS_BUTTON);

    await browser.waitUntil(
      async () => {
        if (await this.isSettingsScreenVisible()) {
          return true;
        }

        if (await this.isElementDisplayed(this.SETTINGS_BUTTON)) {
          await this.tap(this.SETTINGS_BUTTON);
        }

        return false;
      },
      { timeout: 20000, interval: 1000 },
    );
  }

  public async isSettingsButtonVisible(): Promise<boolean> {
    return this.isElementDisplayed(this.SETTINGS_BUTTON);
  }

  private async isSettingsScreenVisible(): Promise<boolean> {
    return (
      (await this.isElementDisplayed(this.SETTINGS_SCREEN)) ||
      (await this.isElementDisplayed(this.SETTINGS_TITLE)) ||
      (await this.isElementDisplayed(this.SETTINGS_BACK_BUTTON))
    );
  }

  public async searchFor(query: string): Promise<void> {
    await this.scrollIntoView(this.SEARCH_INPUT);
    await this.typeText(this.SEARCH_INPUT, query);
  }

  public async clearSearch(): Promise<void> {
    if (!(await this.scrollIntoView(this.SEARCH_INPUT))) {
      return;
    }

    const searchInput = this.el(this.SEARCH_INPUT);

    await searchInput.click();
    await searchInput.clearValue();
    await this.dismissKeyboard();
  }

  public async dismissKeyboard(): Promise<void> {
    if (!(await this.isKeyboardShown())) {
      return;
    }

    await browser.hideKeyboard().catch(() => undefined);

    if (await this.isKeyboardShown()) {
      await this.tap(this.TASK_LIST_TITLE).catch(() => undefined);
    }
  }

  private async isKeyboardShown(): Promise<boolean> {
    return browser.isKeyboardShown().catch(() => false);
  }

  public async tapTask(index: number): Promise<void> {
    await this.scrollTaskItemIntoView(index);
    await this.tap(this.taskItemId(index));
  }

  public async toggleTask(index: number): Promise<void> {
    await this.scrollTaskItemIntoView(index);
    await this.tap(this.toggleButtonId(index));
  }

  public async getTaskTitle(index: number): Promise<string> {
    await this.scrollTaskItemIntoView(index);
    return this.getText(this.taskTitleId(index));
  }

  public async getTaskMetadata(index: number): Promise<string> {
    await this.scrollTaskItemIntoView(index);
    return this.getText(this.taskMetadataId(index));
  }

  public async waitForTaskCompleted(
    index: number,
    completed: boolean,
  ): Promise<void> {
    await browser.waitUntil(
      async () => {
        const metadata = await this.getTaskMetadata(index);

        return completed
          ? metadata.includes('Completed')
          : !metadata.includes('Completed');
      },
      {
        timeout: 10000,
        timeoutMsg: `Task ${String(index)} completion did not become ${String(
          completed,
        )}`,
      },
    );
  }

  public async getTaskIndexByTitle(title: string): Promise<number> {
    const index = (await this.getVisibleTaskTitles()).indexOf(title);

    if (index < 0) {
      throw new Error(`Task "${title}" was not found in the task list`);
    }

    return index;
  }

  public async getVisibleTaskTitles(maxItems = 20): Promise<string[]> {
    const titles: string[] = [];

    for (let index = 0; index < maxItems; index += 1) {
      if (!(await this.ensureTaskTitleLocatable(index))) {
        break;
      }

      titles.push(await this.getText(this.taskTitleId(index)));
    }

    return titles;
  }

  private async ensureTaskTitleLocatable(index: number): Promise<boolean> {
    if (this.isIos()) {
      return this.el(this.taskTitleId(index)).isExisting();
    }

    return this.scrollIntoView(this.taskTitleId(index));
  }

  public async getVisibleTaskCount(): Promise<number> {
    await this.scrollToTop(this.TASK_LIST_TITLE);

    const label = await this.getText(this.TASK_LIST_TITLE);
    const match = /(\d+) of/.exec(label);

    return match ? Number(match[1]) : 0;
  }

  public async isTaskTitleVisible(title: string): Promise<boolean> {
    return (await this.getVisibleTaskTitles()).includes(title);
  }

  public async waitForVisibleTaskCount(expected: number): Promise<void> {
    await browser.waitUntil(
      async () => (await this.getVisibleTaskCount()) === expected,
      {
        timeout: 10000,
        timeoutMsg: `Visible task count did not become ${String(expected)}`,
      },
    );
  }

  public async resetFilters(): Promise<void> {
    await this.resetFilterIfPresent(this.statusFilterId('all'));
    await this.resetFilterIfPresent(this.priorityFilterId('all'));
  }

  private async resetFilterIfPresent(testId: string): Promise<void> {
    if (await this.scrollIntoView(testId)) {
      await this.selectSegment(testId);
    }
  }

  public async tapStatusFilter(value: StatusFilter): Promise<void> {
    await this.scrollIntoView(this.statusFilterId(value));
    await this.selectSegment(this.statusFilterId(value));
  }

  public async tapPriorityFilter(value: PriorityFilter): Promise<void> {
    await this.scrollIntoView(this.priorityFilterId(value));
    await this.selectSegment(this.priorityFilterId(value));
  }

  private async selectSegment(testId: string): Promise<void> {
    await browser.waitUntil(
      async () => {
        if (await this.isSegmentSelected(testId)) {
          return true;
        }

        await this.tap(testId);

        return this.isSegmentSelected(testId);
      },
      {
        timeout: 10000,
        interval: 500,
        timeoutMsg: `Filter "${testId}" did not become selected`,
      },
    );
  }

  private async isSegmentSelected(testId: string): Promise<boolean> {
    const selected = await this.el(testId).getAttribute('selected');

    return selected === 'true' || selected === '1';
  }

  public async tapSort(value: SortOption): Promise<void> {
    await this.tap(this.sortButtonId(value));
  }

  public async tapClearFilters(): Promise<void> {
    await this.elByAccessibilityLabel('Clear filters').click();
  }

  public async getActiveFiltersCount(): Promise<string> {
    return this.getText(this.ACTIVE_FILTERS_COUNT);
  }

  public async isActiveFiltersBadgeVisible(): Promise<boolean> {
    return this.isElementDisplayed(this.ACTIVE_FILTERS_COUNT);
  }

  public async isNoResultsCardVisible(): Promise<boolean> {
    if (this.isIos()) {
      return this.el(this.NO_RESULTS_CARD).isExisting();
    }

    await this.scrollIntoView(this.NO_RESULTS_CARD);

    return this.isElementDisplayed(this.NO_RESULTS_CARD);
  }

  public async isEmptyStateVisible(): Promise<boolean> {
    return this.isElementDisplayed(this.EMPTY_STATE_CARD);
  }

  public async isTaskVisible(index: number): Promise<boolean> {
    return this.scrollTaskItemIntoView(index);
  }

  private async scrollTaskItemIntoView(index: number): Promise<boolean> {
    return this.scrollIntoView(this.taskItemId(index));
  }

  private taskItemId(index: number): string {
    return `task-list-item-${String(index)}`;
  }

  private taskTitleId(index: number): string {
    return `task-item-title-${String(index)}`;
  }

  private taskMetadataId(index: number): string {
    return `task-item-metadata-${String(index)}`;
  }

  private toggleButtonId(index: number): string {
    return `task-toggle-button-${String(index)}`;
  }

  private statusFilterId(value: string): string {
    return `task-status-filter-button-${value}`;
  }

  private priorityFilterId(value: string): string {
    return `task-priority-filter-button-${value}`;
  }

  private sortButtonId(value: string): string {
    return `task-sort-button-${value}`;
  }
}
