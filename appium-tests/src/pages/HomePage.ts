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

  public async isDisplayed(): Promise<boolean> {
    return this.isElementDisplayed(this.SCREEN);
  }

  public async waitForScreen(timeout = 10000): Promise<void> {
    await this.waitForDisplayed(this.SCREEN, timeout);
  }

  public async tapAddButton(): Promise<void> {
    if (browser.capabilities.platformName === 'iOS') {
      await this.tapIosAddTaskButton();
    } else {
      await this.tap(this.ADD_BUTTON);
    }

    await this.waitForDisplayed(this.TASK_TITLE_INPUT);
  }

  private async tapIosAddTaskButton(): Promise<void> {
    const labels = ['Add first task', 'Add task'];

    for (const label of labels) {
      const button = this.elByAccessibilityLabel(label);

      if (!(await button.isExisting())) {
        continue;
      }

      await button.scrollIntoView();
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
      { timeout: 15000, interval: 2000 },
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
    await this.typeText(this.SEARCH_INPUT, query);
  }

  public async clearSearch(): Promise<void> {
    const searchInput = this.el(this.SEARCH_INPUT);

    await searchInput.click();
    await searchInput.clearValue();
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

  public async tapStatusFilter(value: StatusFilter): Promise<void> {
    await this.tap(this.statusFilterId(value));
  }

  public async tapPriorityFilter(value: PriorityFilter): Promise<void> {
    await this.tap(this.priorityFilterId(value));
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
