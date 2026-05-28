# TC-SORT — Sort

Sort the task list by due date, priority, status, and creation date.

> **Sort behavior reference**
>
> - `Due date` — ascending (earliest first); **default**
> - `Priority` — High → Medium → Low; ties broken by due date ascending
> - `Status` — Open first, then Completed; ties broken by due date ascending
> - `Created` — newest first (most recently created task at the top)

---

### TC-SORT-001 — Default sort is by due date ascending

| Priority | Type  | Platform       |
| -------- | ----- | -------------- |
| High     | Smoke | Cross-platform |

**Preconditions**

- User is on the Home screen
- Tasks exist:
  - `Task A` due 2026-06-10
  - `Task B` due 2026-06-01
  - `Task C` due 2026-06-20

**Steps**

1. Observe the task list without changing the sort option
2. Verify `task-sort-button-dueDate` is the active selection

**Expected result**

- Task order from top to bottom: `Task B`, `Task A`, `Task C`

---

### TC-SORT-002 — Sort by priority orders High → Medium → Low

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- Tasks exist:
  - `Task A` priority Low
  - `Task B` priority High
  - `Task C` priority Medium

**Steps**

1. Tap `task-sort-button-priority`

**Expected result**

- Task order from top to bottom: `Task B` (High), `Task C` (Medium), `Task A` (Low)

---

### TC-SORT-003 — Sort by status orders Open tasks before Completed

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen with Status filter set to "All"
- Tasks exist:
  - `Task A` completed
  - `Task B` open
  - `Task C` completed

**Steps**

1. Tap `task-sort-button-status`

**Expected result**

- `Task B` (open) appears before `Task A` and `Task C` (completed)

---

### TC-SORT-004 — Sort by created date orders newest first

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- Tasks were created in this order: `Task A` (oldest), `Task B`, `Task C` (newest)

**Steps**

1. Tap `task-sort-button-createdAt`

**Expected result**

- Task order from top to bottom: `Task C`, `Task B`, `Task A`

---

### TC-SORT-005 — Sort selection persists when returning to Home screen

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Regression | Cross-platform |

**Preconditions**

- User has selected `Priority` sort on the Home screen

**Steps**

1. Tap a task card to open Task Details
2. Tap `task-details-home-button` to return to the Home screen

**Expected result**

- `task-sort-button-priority` is still the active sort selection
- Task list remains sorted by priority

---

### TC-SORT-006 — Sort works in combination with an active filter

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- Tasks exist:
  - `Task A` open, priority High
  - `Task B` open, priority Low
  - `Task C` completed, priority High

**Steps**

1. Tap `task-status-filter-button-open` to filter to open tasks
2. Tap `task-sort-button-priority`

**Expected result**

- Only `Task A` (High) and `Task B` (Low) are visible
- `Task A` appears before `Task B`
