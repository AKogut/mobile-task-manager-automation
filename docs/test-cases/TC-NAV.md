# TC-NAV — Navigation & Persistence

Screen-to-screen navigation flows and data persistence across app restarts.

---

## Navigation

### TC-NAV-001 — Tapping a task card navigates to Task Details

| Priority | Type  | Platform       |
| -------- | ----- | -------------- |
| Critical | Smoke | Cross-platform |

**Preconditions**

- User is on the Home screen
- At least one task exists in the list

**Steps**

1. Tap the first task card (`task-list-item-0`)

**Expected result**

- Task Details screen is displayed (`task-details-screen`)
- Title shown in the details matches the tapped task (`task-details-title`)

---

### TC-NAV-002 — "New task" button on Home navigates to Add Task

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Home screen

**Steps**

1. Tap `task-add-button`

**Expected result**

- Add Task form is displayed (`task-form-screen`)
- All form fields are empty

---

### TC-NAV-003 — "New task" button on Task Details navigates to Add Task

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- Task Details screen is displayed

**Steps**

1. Scroll to the bottom of the screen
2. Tap `task-add-button` (the large accent button at the bottom)

**Expected result**

- Add Task form is displayed (`task-form-screen`)
- All form fields are empty

---

### TC-NAV-004 — "Edit" button on Task Details navigates to Edit Task

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- Task Details screen is displayed

**Steps**

1. Tap `task-details-edit-button`

**Expected result**

- Edit Task form is displayed (`task-form-screen`)
- Form fields are pre-populated with the task's existing values

---

### TC-NAV-005 — "Home" button on Task Details navigates to Home

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- Task Details screen is displayed

**Steps**

1. Tap `task-details-home-button`

**Expected result**

- Home screen is displayed (`main-screen`)
- Task list is visible

---

### TC-NAV-006 — Saving a new task navigates to Task Details (not Home)

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- User is on the Add Task form (`task-form-screen`)

**Steps**

1. Enter `Test navigation task` in `task-title-input`
2. Tap `task-priority-option-medium`
3. Tap `task-due-date-quick-option-today`
4. Tap `task-submit-button`

**Expected result**

- Task Details screen is displayed (`task-details-screen`)
- Home screen is NOT shown immediately
- Details show `Test navigation task`

---

### TC-NAV-007 — Saving an edited task navigates to Task Details (not Home)

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- A task exists and the Edit Task screen is displayed

**Steps**

1. Change the title to `Edited navigation task`
2. Tap `task-submit-button`

**Expected result**

- Task Details screen is displayed
- Home screen is NOT shown
- Title shows `Edited navigation task`

---

### TC-NAV-008 — Settings back button returns to Home

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- User is on the Settings screen (`settings-screen`)

**Steps**

1. Tap `settings-back-button`

**Expected result**

- Home screen is displayed (`main-screen`)

---

## Persistence

### TC-NAV-009 — Tasks persist after app restart

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Regression | Cross-platform |

**Preconditions**

- User has created at least two tasks
- Task titles noted: `Persist task 1`, `Persist task 2`

**Steps**

1. Close the app (background → terminate)
2. Relaunch the app

**Expected result**

- Home screen shows `Persist task 1` and `Persist task 2`
- No tasks are lost

---

### TC-NAV-010 — Task completion state persists after app restart

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Regression | Cross-platform |

**Preconditions**

- A task titled `Persist complete` exists and has been marked as completed
- App is closed and relaunched

**Steps**

1. Close the app
2. Relaunch the app
3. Locate `Persist complete` in the task list (use Status filter "Done" if needed)

**Expected result**

- `Persist complete` is still marked as completed
- Completion state was not reset by the restart
