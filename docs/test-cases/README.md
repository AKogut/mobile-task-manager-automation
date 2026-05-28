# Test Cases — Mobile Task Manager

Behavioral test specifications for the Task Manager React Native app.  
These are platform-agnostic — each case is implemented across Appium, XCUITest, and Espresso.

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

| Tag                | Meaning                   |
| ------------------ | ------------------------- |
| **Cross-platform** | Covered by Appium suite   |
| **iOS**            | Covered by XCUITest suite |
| **Android**        | Covered by Espresso suite |

---

## Test suite index

| Suite                    | File                           | Count | Area                                                |
| ------------------------ | ------------------------------ | ----- | --------------------------------------------------- |
| Authentication           | [TC-AUTH.md](./TC-AUTH.md)     | 13    | Login, logout, session, validation                  |
| Task Management          | [TC-TASK.md](./TC-TASK.md)     | 27    | Create, edit, delete, complete tasks                |
| Search                   | [TC-SEARCH.md](./TC-SEARCH.md) | 6     | Search by title                                     |
| Filters                  | [TC-FILTER.md](./TC-FILTER.md) | 12    | Status filter, priority filter, active badge, clear |
| Sort                     | [TC-SORT.md](./TC-SORT.md)     | 6     | Sort by due date, priority, status, created         |
| Navigation & Persistence | [TC-NAV.md](./TC-NAV.md)       | 10    | Screen navigation, data persistence                 |

**Total: 74 test cases**

---

## testID reference

`testID` props are defined in [`app/src/constants/testIds.ts`](../../app/src/constants/testIds.ts).  
React Native maps `testID` to:

- `accessibilityIdentifier` on **iOS** — used by XCUITest and Appium
- `content-description` on **Android** — used by Espresso and Appium

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

| TC            | Title                                      |
| ------------- | ------------------------------------------ |
| TC-AUTH-001   | Successful login with valid credentials    |
| TC-AUTH-009   | Successful logout                          |
| TC-TASK-001   | Create a task with all fields              |
| TC-TASK-010   | Mark a task as completed from Task Details |
| TC-TASK-016   | Delete a task with confirmation            |
| TC-TASK-020   | Edit task title and save                   |
| TC-SEARCH-001 | Search by exact title match                |
| TC-FILTER-001 | Status filter — Open                       |
| TC-SORT-001   | Default sort by due date                   |
| TC-NAV-001    | Tap task card navigates to Task Details    |
