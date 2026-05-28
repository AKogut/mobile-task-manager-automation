# TC-FILTER — Filters

Status filter, priority filter, active filter count badge, and clear filters.

---

## Status filter

### TC-FILTER-001 — Status filter "Open" shows only open tasks

| Priority | Type  | Platform       |
| -------- | ----- | -------------- |
| High     | Smoke | Cross-platform |

**Preconditions**

- User is on the Home screen
- Tasks exist: 2 open tasks, 1 completed task

**Steps**

1. Tap `task-status-filter-button-open`

**Expected result**

- Only the 2 open tasks are visible
- Completed task is not visible

---

### TC-FILTER-002 — Status filter "Done" shows only completed tasks

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- Tasks exist: 2 open tasks, 1 completed task

**Steps**

1. Tap `task-status-filter-button-completed`

**Expected result**

- Only the completed task is visible
- Open tasks are not visible

---

### TC-FILTER-003 — Status filter "All" shows all tasks

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User has "Open" or "Done" status filter active
- Tasks exist: 2 open tasks, 1 completed task

**Steps**

1. Tap `task-status-filter-button-all`

**Expected result**

- All 3 tasks are visible

---

### TC-FILTER-004 — Status filter "Done" with no completed tasks shows no-results card

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- All tasks in the list are open (none completed)

**Steps**

1. Tap `task-status-filter-button-completed`

**Expected result**

- No task cards are visible
- No-results card is displayed (`task-no-results-card`)

---

## Priority filter

### TC-FILTER-005 — Priority filter "High" shows only high priority tasks

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- Tasks exist: 1 high, 1 medium, 1 low priority task

**Steps**

1. Tap `task-priority-filter-button-high`

**Expected result**

- Only the high priority task is visible
- Medium and low priority tasks are not visible

---

### TC-FILTER-006 — Priority filter "Medium" shows only medium priority tasks

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- Tasks exist: 1 high, 1 medium, 1 low priority task

**Steps**

1. Tap `task-priority-filter-button-medium`

**Expected result**

- Only the medium priority task is visible

---

### TC-FILTER-007 — Priority filter "Low" shows only low priority tasks

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- Tasks exist: 1 high, 1 medium, 1 low priority task

**Steps**

1. Tap `task-priority-filter-button-low`

**Expected result**

- Only the low priority task is visible

---

### TC-FILTER-008 — Status and priority filters applied together

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- Tasks exist:
  - Open + High priority: `Task A`
  - Open + Low priority: `Task B`
  - Completed + High priority: `Task C`

**Steps**

1. Tap `task-status-filter-button-open`
2. Tap `task-priority-filter-button-high`

**Expected result**

- Only `Task A` is visible (open AND high priority)
- `Task B` is excluded (wrong priority)
- `Task C` is excluded (completed)

---

## Active filter badge

### TC-FILTER-009 — Active filter badge shows count when one filter is active

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen with no filters active

**Steps**

1. Tap `task-status-filter-button-open`
2. Observe the active filters badge

**Expected result**

- Active filters badge is visible (`task-active-filters-count`)
- Badge displays `1`

---

### TC-FILTER-010 — Active filter badge shows count when two filters are active

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen with no filters active

**Steps**

1. Tap `task-status-filter-button-open`
2. Tap `task-priority-filter-button-high`
3. Observe the active filters badge

**Expected result**

- Active filters badge displays `2` (`task-active-filters-count`)

---

### TC-FILTER-011 — Active filter badge is hidden when no filters are active

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen
- Status filter is set to "All", priority filter is set to "All"

**Steps**

1. Observe the filter controls area

**Expected result**

- Active filters badge (`task-active-filters-count`) is not visible

---

## Clear filters

### TC-FILTER-012 — Clear filters resets status and priority to "All"

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- Status filter is set to `Open`
- Priority filter is set to `High`

**Steps**

1. Tap the **Clear filters** button

**Expected result**

- `task-status-filter-button-all` is selected
- `task-priority-filter-button-all` is selected
- All tasks are visible again
- Active filter badge is not visible

---

### TC-FILTER-013 — Clear filters resets the search input

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- A search query is entered in `task-search-input` (e.g., `Buy`)

**Steps**

1. Tap the **Clear filters** button

**Expected result**

- `task-search-input` is empty
- Full task list is restored

---

### TC-FILTER-014 — Clear filters does not reset the sort selection

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Regression | Cross-platform |

**Preconditions**

- User has changed the sort to `Priority` (`task-sort-button-priority`)
- At least one filter is active

**Steps**

1. Tap **Clear filters**

**Expected result**

- Filters and search are reset
- Sort button `task-sort-button-priority` remains selected
- Task list is sorted by priority
