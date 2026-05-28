# TC-SEARCH — Search

Search tasks by title substring.

---

### TC-SEARCH-001 — Search by exact title match returns the correct task

| Priority | Type  | Platform       |
| -------- | ----- | -------------- |
| High     | Smoke | Cross-platform |

**Preconditions**

- User is authenticated and on the Home screen
- Tasks exist: `Buy groceries`, `Call dentist`, `Pay rent`

**Test data**

| Field        | Value      |
| ------------ | ---------- |
| Search query | `Pay rent` |

**Steps**

1. Tap the search input (`task-search-input`)
2. Enter `Pay rent`

**Expected result**

- Task list shows exactly one task with title `Pay rent`
- `Buy groceries` and `Call dentist` are not visible

---

### TC-SEARCH-002 — Search by partial title returns matching tasks

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- Tasks exist: `Buy groceries`, `Buy milk`, `Call dentist`

**Test data**

| Field        | Value |
| ------------ | ----- |
| Search query | `Buy` |

**Steps**

1. Enter `Buy` in `task-search-input`

**Expected result**

- Task list shows `Buy groceries` and `Buy milk`
- `Call dentist` is not visible

---

### TC-SEARCH-003 — Search is case-insensitive

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- Task `Buy groceries` exists

**Test data**

| Field        | Value           |
| ------------ | --------------- |
| Search query | `BUY GROCERIES` |

**Steps**

1. Enter `BUY GROCERIES` in `task-search-input`

**Expected result**

- `Buy groceries` is visible in the task list

---

### TC-SEARCH-004 — Search with no matches shows no-results card

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen with tasks in the list

**Test data**

| Field        | Value        |
| ------------ | ------------ |
| Search query | `zzznomatch` |

**Steps**

1. Enter `zzznomatch` in `task-search-input`

**Expected result**

- No task cards are visible
- No-results card is displayed (`task-no-results-card`)
- Empty state card is NOT shown (`task-empty-state-card` absent)

---

### TC-SEARCH-005 — Clearing the search input restores the full task list

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Regression | Cross-platform |

**Preconditions**

- User has typed a search query that returns a partial list

**Steps**

1. Clear the text in `task-search-input`

**Expected result**

- All tasks are visible again
- No-results card is gone

---

### TC-SEARCH-006 — Search works in combination with an active status filter

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- Tasks exist: open `Buy groceries`, completed `Buy milk`, open `Call dentist`

**Steps**

1. Tap `task-status-filter-button-open`
2. Enter `Buy` in `task-search-input`

**Expected result**

- Only `Buy groceries` is visible (open AND contains "Buy")
- `Buy milk` is excluded (completed)
- `Call dentist` is excluded (no "Buy" in title)
