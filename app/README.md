# Task Manager — React Native App

React Native 0.85 task manager for iOS and Android, written in TypeScript.
Built as the app under test for the Appium, XCUITest, and Espresso automation suites in this repository.

## Stack

| Layer       | Library                                       |
| ----------- | --------------------------------------------- |
| Framework   | React Native 0.85, React 19                   |
| Language    | TypeScript (strict)                           |
| Navigation  | React Navigation 7 — native stack             |
| State       | Zustand 5                                     |
| Persistence | AsyncStorage 3 via Zustand persist middleware |
| Forms       | React Hook Form 7 + Zod 4                     |
| Testing     | Jest 29, react-test-renderer                  |

## Getting started

```bash
# Install JS dependencies
yarn install

# iOS — install native dependencies first
cd ios && bundle exec pod install && cd ..
yarn ios

# Android
yarn android

# Metro bundler (standalone)
yarn start
```

Node >= 22.11.0 required (see `.nvmrc` at repo root).

## Project structure

```
app/src/
├── components/
│   └── SegmentedControl.tsx      # Reusable segmented control used for filters and sort
├── constants/
│   ├── auth.ts                   # Demo credentials and auth storage key
│   ├── tasks.ts                  # Tasks storage key
│   └── testIds.ts                # All testID values — source of truth for automation
├── features/
│   ├── auth/
│   │   ├── authStore.ts          # Zustand auth store (login, logout, hydration)
│   │   ├── authTypes.ts          # AuthSession, LoginCredentials, AuthError
│   │   ├── fakeAuthService.ts    # Simulated auth with 400ms delay
│   │   └── loginSchema.ts        # Zod schema for login form
│   └── tasks/
│       ├── TaskForm.tsx          # Shared form component for Add and Edit screens
│       ├── taskDates.ts          # Date formatting and calendar utilities
│       ├── taskIds.ts            # Task ID generation
│       ├── taskPriority.ts       # Priority labels and palette colors
│       ├── taskSchema.ts         # Zod schema for task form
│       ├── taskStore.ts          # Zustand task store (CRUD, toggle, persist)
│       └── taskTypes.ts          # Task and TaskPriority types
├── navigation/
│   └── RootNavigator.tsx         # Root + authenticated stack navigators
├── screens/
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── AddTaskScreen.tsx
│   ├── EditTaskScreen.tsx
│   ├── TaskDetailsScreen.tsx
│   └── SettingsScreen.tsx
└── theme/
    └── palette.ts                # Light and dark color palette
```

## Screens

### LoginScreen

Email and password form. Validates with Zod on submit. Shows a demo credentials card for easy testing. Auth state is persisted via AsyncStorage — the app re-opens authenticated.

### HomeScreen

Main task list with:

- **Hero card** — greeting, "Up next" (earliest open task), task stats (total / open / done)
- **Search** — filter by title substring
- **Sort** — Due date / Priority / Status / Created
- **Filters** — Status (All / Open / Done) and Priority (All / Low / Medium / High)
- **Active filter badge** — shows count of non-default filters
- **Clear filters** — resets search, status, and priority (does not reset sort)
- Task cards with completion checkbox and tap-to-details

### AddTaskScreen / EditTaskScreen

Task form (title, description, priority, due date) with calendar picker and quick-select options. Validates via Zod. On save, navigates directly to TaskDetailsScreen via `replace`.

### TaskDetailsScreen

Full task view showing status chip, priority chip, due date card, and created date card. Actions: Complete / Reopen, Edit, Delete (with confirmation alert), New task.

### SettingsScreen

Account info (name, email) and logout.

## Task model

```ts
type Task = {
  id: string; // UUID, auto-generated on creation
  title: string; // Required, max 80 characters
  description: string; // Optional, max 240 characters
  priority: 'low' | 'medium' | 'high';
  dueDate: string; // YYYY-MM-DD format
  completed: boolean;
  createdAt: string; // ISO 8601 timestamp, auto-set on creation
};
```

`id` and `createdAt` are excluded from `TaskDraft` — set automatically by the store, never provided by the form.

## Demo credentials

```
Email:    demo@example.com
Password: Password123!
```

The fake auth service simulates a 400ms network delay and returns a fixed session token. There is no real backend.

## Scripts

```bash
yarn start        # Start Metro bundler
yarn ios          # Run on iOS simulator
yarn android      # Run on Android emulator
yarn test         # Run Jest test suite
yarn lint         # ESLint with zero-warning policy
yarn typecheck    # TypeScript compiler check (no emit)
```

## Tests

```bash
yarn test                                    # All 6 suites
yarn jest --testPathPattern=taskScreens      # Screen integration tests
yarn jest --testPathPattern=taskStore        # Store unit tests
```

| Suite                     | Coverage                                                             |
| ------------------------- | -------------------------------------------------------------------- |
| `taskScreens.test.tsx`    | Create, edit, complete, delete, search, filters, sort, clear filters |
| `taskStore.test.ts`       | CRUD operations and state mutations                                  |
| `taskSchema.test.ts`      | Zod validation for task form fields                                  |
| `authStore.test.ts`       | Login, logout, hydration                                             |
| `loginSchema.test.ts`     | Zod validation for login form                                        |
| `fakeAuthService.test.ts` | Auth success and error paths                                         |

Tests use `react-test-renderer` with a mocked `FlatList` and mocked navigation. No snapshots — all assertions target rendered element props and store state.

## testID system

Every interactive and assertion-target element has a `testID` prop. The complete map lives in [`src/constants/testIds.ts`](src/constants/testIds.ts).

React Native maps `testID` to:

- `accessibilityIdentifier` on iOS — used by XCUITest and Appium
- `content-description` on Android — used by Espresso and Appium

### Key testIDs by screen

**Login**

| testID string               | Constant                          |
| --------------------------- | --------------------------------- |
| `login-screen`              | `TestIds.loginScreen`             |
| `login-email-input`         | `TestIds.loginEmailInput`         |
| `login-password-input`      | `TestIds.loginPasswordInput`      |
| `login-submit-button`       | `TestIds.loginSubmitButton`       |
| `demo-credentials-email`    | `TestIds.demoCredentialsEmail`    |
| `demo-credentials-password` | `TestIds.demoCredentialsPassword` |
| `auth-error-banner`         | `TestIds.authErrorBanner`         |

**Home / task list**

| testID string               | Constant / helper                    |
| --------------------------- | ------------------------------------ |
| `main-screen`               | `TestIds.mainScreen`                 |
| `task-search-input`         | `TestIds.taskSearchInput`            |
| `task-add-button`           | `TestIds.taskAddButton`              |
| `task-list-item-{n}`        | `testIdForTask(n)`                   |
| `task-item-title-{n}`       | `TestIds.taskItemTitle + '-' + n`    |
| `task-toggle-button-{n}`    | `TestIds.taskToggleButton + '-' + n` |
| `task-no-results-card`      | `TestIds.taskNoResultsCard`          |
| `task-empty-state-card`     | `TestIds.taskEmptyStateCard`         |
| `task-active-filters-count` | `TestIds.taskActiveFiltersCount`     |

**Filters and sort** — generated by helper functions:

```ts
testIdForStatusFilter('all'); // task-status-filter-button-all
testIdForStatusFilter('open'); // task-status-filter-button-open
testIdForStatusFilter('completed'); // task-status-filter-button-completed

testIdForPriorityFilter('all'); // task-priority-filter-button-all
testIdForPriorityFilter('low');
testIdForPriorityFilter('medium');
testIdForPriorityFilter('high');

testIdForTaskSort('dueDate'); // task-sort-button-dueDate
testIdForTaskSort('priority');
testIdForTaskSort('status');
testIdForTaskSort('createdAt');
```

**Task form (Add / Edit)**

| testID string                 | Constant / helper              |
| ----------------------------- | ------------------------------ |
| `task-form-screen`            | `TestIds.taskFormScreen`       |
| `task-title-input`            | `TestIds.taskTitleInput`       |
| `task-description-input`      | `TestIds.taskDescriptionInput` |
| `task-due-date-input`         | `TestIds.taskDueDateInput`     |
| `task-priority-option-low`    | `testIdForPriority('low')`     |
| `task-priority-option-medium` | `testIdForPriority('medium')`  |
| `task-priority-option-high`   | `testIdForPriority('high')`    |
| `task-submit-button`          | `TestIds.taskSubmitButton`     |

**Task details**

| testID string                  | Constant                            |
| ------------------------------ | ----------------------------------- |
| `task-details-screen`          | `TestIds.taskDetailsScreen`         |
| `task-details-home-button`     | `TestIds.taskDetailsHomeButton`     |
| `task-details-title`           | `TestIds.taskDetailsTitle`          |
| `task-details-description`     | `TestIds.taskDetailsDescription`    |
| `task-details-status`          | `TestIds.taskDetailsStatus`         |
| `task-details-priority`        | `TestIds.taskDetailsPriority`       |
| `task-details-calendar-card`   | `TestIds.taskDetailsCalendarCard`   |
| `task-details-metadata`        | `TestIds.taskDetailsMetadata`       |
| `task-details-created-card`    | `TestIds.taskDetailsCreatedCard`    |
| `task-details-complete-button` | `TestIds.taskDetailsCompleteButton` |
| `task-details-edit-button`     | `TestIds.taskDetailsEditButton`     |
| `task-details-delete-button`   | `TestIds.taskDetailsDeleteButton`   |
| `task-add-button`              | `TestIds.taskAddButton` (New task)  |

**Settings**

| testID string            | Constant                       |
| ------------------------ | ------------------------------ |
| `settings-screen`        | `TestIds.settingsScreen`       |
| `settings-account-name`  | `TestIds.settingsAccountName`  |
| `settings-account-email` | `TestIds.settingsAccountEmail` |
| `logout-button`          | `TestIds.logoutButton`         |
