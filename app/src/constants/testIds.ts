export const TestIds = {
  appRoot: 'app-root',
  navigationRoot: 'navigation-root',
  loginKeyboardContainer: 'login-keyboard-container',
  loginScreen: 'login-screen',
  loginHeader: 'login-header',
  loginEyebrow: 'login-eyebrow',
  loginTitle: 'login-title',
  loginSubtitle: 'login-subtitle',
  loginFormCard: 'login-form-card',
  loginEmailLabel: 'login-email-label',
  loginEmailInput: 'login-email-input',
  loginPasswordLabel: 'login-password-label',
  loginPasswordInput: 'login-password-input',
  loginSubmitButton: 'login-submit-button',
  loginSubmitButtonText: 'login-submit-button-text',
  loginSubmitLoading: 'login-submit-loading',
  loginEmailError: 'login-email-error',
  loginPasswordError: 'login-password-error',
  authErrorBanner: 'auth-error-banner',
  authErrorMessage: 'auth-error-message',
  authLoading: 'auth-loading',
  authLoadingIndicator: 'auth-loading-indicator',
  mainScreen: 'main-screen',
  mainHeaderRow: 'main-header-row',
  mainHeader: 'main-header',
  mainEyebrow: 'main-eyebrow',
  mainTitle: 'main-title',
  mainSubtitle: 'main-subtitle',
  settingsOpenButton: 'settings-open-button',
  settingsOpenButtonText: 'settings-open-button-text',
  settingsScreen: 'settings-screen',
  settingsHeader: 'settings-header',
  settingsBackButton: 'settings-back-button',
  settingsBackButtonText: 'settings-back-button-text',
  settingsTitle: 'settings-title',
  settingsSubtitle: 'settings-subtitle',
  settingsAccountCard: 'settings-account-card',
  settingsAccountTitle: 'settings-account-title',
  settingsAccountName: 'settings-account-name',
  settingsAccountEmail: 'settings-account-email',
  settingsSessionCard: 'settings-session-card',
  settingsSessionTitle: 'settings-session-title',
  settingsSessionDescription: 'settings-session-description',
  logoutButton: 'logout-button',
  logoutButtonText: 'logout-button-text',
  mainSessionCard: 'main-session-card',
  mainSessionTitle: 'main-session-title',
  mainHeroUpNextCard: 'main-hero-up-next-card',
  mainHeroUpNextTitle: 'main-hero-up-next-title',
  mainHeroUpNextMeta: 'main-hero-up-next-meta',
  mainSectionTitle: 'main-section-title',
  taskListSection: 'task-list-section',
  taskListTitle: 'task-list-title',
  taskEmptyStateCard: 'task-empty-state-card',
  taskEmptyStateTitle: 'task-empty-state-title',
  taskEmptyStateDescription: 'task-empty-state-description',
  taskAddButton: 'task-add-button',
  taskToggleButton: 'task-toggle-button',
  taskItemTitle: 'task-item-title',
  taskItemMetadata: 'task-item-metadata',
  taskSearchInput: 'task-search-input',
  taskActiveFiltersCount: 'task-active-filters-count',
  taskStatusFilterButton: 'task-status-filter-button',
  taskPriorityFilterButton: 'task-priority-filter-button',
  taskSortButton: 'task-sort-button',
  taskNoResultsCard: 'task-no-results-card',
  taskDetailsScreen: 'task-details-screen',
  taskDetailsBackButton: 'task-details-back-button',
  taskDetailsHomeButton: 'task-details-home-button',
  taskDetailsTitle: 'task-details-title',
  taskDetailsDescription: 'task-details-description',
  taskDetailsStatus: 'task-details-status',
  taskDetailsStatusText: 'task-details-status-text',
  taskDetailsPriority: 'task-details-priority',
  taskDetailsPriorityText: 'task-details-priority-text',
  taskDetailsMetadata: 'task-details-metadata',
  taskDetailsCalendarCard: 'task-details-calendar-card',
  taskDetailsCreatedCard: 'task-details-created-card',
  taskDetailsCompleteButton: 'task-details-complete-button',
  taskDetailsEditButton: 'task-details-edit-button',
  taskDetailsDeleteButton: 'task-details-delete-button',
  taskFormScreen: 'task-form-screen',
  taskFormBackButton: 'task-form-back-button',
  taskFormTitle: 'task-form-title',
  taskTitleInput: 'task-title-input',
  taskDescriptionInput: 'task-description-input',
  taskDueDateInput: 'task-due-date-input',
  taskDueDateCalendarButton: 'task-due-date-calendar-button',
  taskDueDateCalendarPanel: 'task-due-date-calendar-panel',
  taskDueDateCalendarPreview: 'task-due-date-calendar-preview',
  taskDueDateQuickOption: 'task-due-date-quick-option',
  taskPriorityOption: 'task-priority-option',
  taskTitleError: 'task-title-error',
  taskDueDateError: 'task-due-date-error',
  taskSubmitButton: 'task-submit-button',
  taskSubmitButtonText: 'task-submit-button-text',
  demoCredentialsCard: 'demo-credentials-card',
  demoCredentialsTitle: 'demo-credentials-title',
  demoCredentialsEmail: 'demo-credentials-email',
  demoCredentialsPassword: 'demo-credentials-password',
} as const;

export function testIdForFeature(index: number): string {
  return `main-feature-row-${index}`;
}

export function testIdForTask(index: number): string {
  return `task-list-item-${index}`;
}

export function testIdForPriority(priority: string): string {
  return `task-priority-option-${priority}`;
}

export function testIdForDueDateOption(option: string): string {
  return `task-due-date-quick-option-${option}`;
}

export function testIdForStatusFilter(filter: string): string {
  return `task-status-filter-button-${filter}`;
}

export function testIdForPriorityFilter(priority: string): string {
  return `task-priority-filter-button-${priority}`;
}

export function testIdForTaskSort(sort: string): string {
  return `task-sort-button-${sort}`;
}
