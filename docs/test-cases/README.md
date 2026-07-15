# Test Cases — Mobile Task Manager

Behavioral test specifications for the Task Manager React Native app.  
Each case is written platform-agnostically; the **Automation** line on a case records where it is implemented (Appium, XCUITest, Espresso). Some cases are documented as specifications ahead of automation.

## Convention

### Test ID format

```
TC-{AREA}-{NNN}
```

| Segment | Meaning                           |
| ------- | --------------------------------- |
| `TC`    | Test Case                         |
| `AREA`  | Functional area (see table below) |
| `NNN`   | Zero-padded sequential number     |

### Priority

| Level        | Meaning                                   |
| ------------ | ----------------------------------------- |
| **Critical** | Core flow — app is broken without it      |
| **High**     | Primary feature users interact with daily |
| **Medium**   | Secondary or supporting feature           |
| **Low**      | Edge case, boundary, or visual detail     |

### Type

| Type           | Meaning                                 |
| -------------- | --------------------------------------- |
| **Smoke**      | Fastest verification a feature is alive |
| **Functional** | Full behavior verification              |
| **Regression** | Run after changes to catch regressions  |

### Platform

| Tag                | Meaning                                                  |
| ------------------ | -------------------------------------------------------- |
| **Cross-platform** | Behavior applies to both platforms; automated via Appium |
| **iOS**            | iOS coverage via the XCUITest suite                      |
| **Android**        | Android coverage via the Espresso suite                  |

Applicability and automation are distinct: a case may be cross-platform in scope while its **Automation** line records exactly which suites implement it today.

---

## Test suite index

| Suite                    | File                           | Count | Area                                                |
| ------------------------ | ------------------------------ | ----- | --------------------------------------------------- |
| Authentication           | [TC-AUTH.md](./TC-AUTH.md)     | 13    | Login, logout, session, validation                  |
| Task Management          | [TC-TASK.md](./TC-TASK.md)     | 27    | Create, edit, delete, complete tasks                |
| Search                   | [TC-SEARCH.md](./TC-SEARCH.md) | 6     | Search by title                                     |
| Filters                  | [TC-FILTER.md](./TC-FILTER.md) | 14    | Status filter, priority filter, active badge, clear |
| Sort                     | [TC-SORT.md](./TC-SORT.md)     | 6     | Sort by due date, priority, status, created         |
| Navigation & Persistence | [TC-NAV.md](./TC-NAV.md)       | 10    | Screen navigation, data persistence                 |

**Total: 76 test cases**

---

## testID reference

`testID` props are defined in [`app/src/constants/testIds.ts`](../../app/src/constants/testIds.ts).  
React Native maps `testID` to:

- `accessibilityIdentifier` on **iOS** — used by both XCUITest and Appium
- the view's **resource-id** on **Android** (`viewIdResourceName`) — Appium matches it via `resourceId`, and Espresso reads the React test-id view tag through a custom `withTestId()` matcher. Note it is **not** `content-description`, which carries `accessibilityLabel`.

### Helper functions

```ts
testIdForTask(n); // task-list-item-{n}
testIdForStatusFilter(value); // task-status-filter-button-{value}
testIdForPriorityFilter(value); // task-priority-filter-button-{value}
testIdForTaskSort(value); // task-sort-button-{value}
testIdForPriority(value); // task-priority-option-{value}
testIdForDueDateOption(value); // task-due-date-quick-option-{value}
```

---

## Demo credentials

```
Email:    demo@example.com
Password: Password123!
```

The fake auth service simulates a 400 ms network delay and accepts only the demo credentials.

---

## Smoke suite

Run this subset before every release or automation session to verify the app is healthy:

| TC            | Title                                                |
| ------------- | ---------------------------------------------------- |
| TC-AUTH-001   | Successful login with valid credentials              |
| TC-AUTH-009   | Successful logout clears session                     |
| TC-TASK-001   | Create a task with all fields                        |
| TC-TASK-013   | Complete a task from Task Details                    |
| TC-TASK-017   | Delete task shows confirmation dialog                |
| TC-TASK-020   | Edit task form is pre-populated with current values  |
| TC-SEARCH-001 | Search by exact title match returns the correct task |
| TC-FILTER-001 | Status filter "Open" shows only open tasks           |
| TC-SORT-001   | Default sort is by due date ascending                |
| TC-NAV-001    | Tapping a task card navigates to Task Details        |
