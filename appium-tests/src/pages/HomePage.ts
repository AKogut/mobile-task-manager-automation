import { BasePage } from './BasePage';

type StatusFilter = 'all' | 'open' | 'completed';
type PriorityFilter = 'all' | 'low' | 'medium' | 'high';
type SortOption = 'dueDate' | 'priority' | 'status' | 'createdAt';

export class HomePage extends BasePage {
  private readonly SCREEN = 'main-screen';
  private readonly SEARCH_INPUT = 'task-search-input';
  private readonly ADD_BUTTON = 'task-add-button';
  private readonly SETTINGS_BUTTON = 'settings-open-button';
  private readonly ACTIVE_FILTERS_COUNT = 'task-active-filters-count';
  private readonly NO_RESULTS_CARD = 'task-no-results-card';
  private readonly EMPTY_STATE_CARD = 'task-empty-state-card';

  public async isDisplayed(): Promise<boolean> {
    return this.isElementDisplayed(this.SCREEN);
  }

  public async waitForScreen(): Promise<void> {
    await this.waitForDisplayed(this.SCREEN);
  }

  public async tapAddButton(): Promise<void> {
    await this.tap(this.ADD_BUTTON);
  }

  public async tapSettingsButton(): Promise<void> {
    await this.tap(this.SETTINGS_BUTTON);
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
    await this.tap(this.taskItemId(index));
  }

  public async toggleTask(index: number): Promise<void> {
    await this.tap(this.toggleButtonId(index));
  }

  public async getTaskTitle(index: number): Promise<string> {
    return this.getText(this.taskTitleId(index));
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
    return this.isElementDisplayed(this.taskItemId(index));
  }

  private taskItemId(index: number): string {
    return `task-list-item-${String(index)}`;
  }

  private taskTitleId(index: number): string {
    return `task-item-title-${String(index)}`;
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
