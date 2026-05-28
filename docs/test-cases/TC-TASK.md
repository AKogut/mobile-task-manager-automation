# TC-TASK — Task Management

Create, edit, delete, and complete tasks.

---

## Create

### TC-TASK-001 — Create a task with all fields

| Priority | Type  | Platform       |
| -------- | ----- | -------------- |
| Critical | Smoke | Cross-platform |

**Preconditions**

- User is authenticated and on the Home screen

**Test data**

| Field       | Value                   |
| ----------- | ----------------------- |
| Title       | `Buy groceries`         |
| Description | `Milk, eggs, and bread` |
| Priority    | High                    |
| Due date    | Tomorrow (quick select) |

**Steps**

1. Tap the add button (`task-add-button`)
2. Verify the task form is displayed (`task-form-screen`)
3. Enter `Buy groceries` in the title input (`task-title-input`)
4. Enter `Milk, eggs, and bread` in the description input (`task-description-input`)
5. Tap the **High** priority option (`task-priority-option-high`)
6. Tap the **Tomorrow** quick-select option (`task-due-date-quick-option-tomorrow`)
7. Tap the submit button (`task-submit-button`)

**Expected result**

- Task Details screen is displayed (`task-details-screen`)
- Title shows `Buy groceries` (`task-details-title`)
- Description shows `Milk, eggs, and bread` (`task-details-description`)
- Priority chip shows `High priority` (`task-details-priority-text`)
- Status chip shows `Open` (`task-details-status-text`)

---

### TC-TASK-002 — Create a task with minimum required fields

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is authenticated and on the Home screen

**Test data**

| Field    | Value                |
| -------- | -------------------- |
| Title    | `Minimal task`       |
| Priority | Low                  |
| Due date | Today (quick select) |

**Steps**

1. Tap `task-add-button`
2. Enter `Minimal task` in `task-title-input`
3. Leave description empty
4. Tap `task-priority-option-low`
5. Tap `task-due-date-quick-option-today`
6. Tap `task-submit-button`

**Expected result**

- Task Details screen is displayed
- Title shows `Minimal task`
- Description area shows `No description provided.`
- Priority chip shows `Low priority`

---

### TC-TASK-003 — Newly created task appears in the task list

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is authenticated and on the Home screen

**Test data**

| Field    | Value                    |
| -------- | ------------------------ |
| Title    | `New list task`          |
| Priority | Medium                   |
| Due date | Next week (quick select) |

**Steps**

1. Tap `task-add-button`
2. Enter `New list task` in `task-title-input`
3. Tap `task-priority-option-medium`
4. Tap `task-due-date-quick-option-next-week`
5. Tap `task-submit-button`
6. Tap `task-details-home-button` to return to the Home screen

**Expected result**

- Task list contains `New list task`
- Task card shows `Medium` priority in the subtitle

---

### TC-TASK-004 — Task creation blocked when title is empty

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Add Task screen (`task-form-screen`)

**Steps**

1. Leave `task-title-input` empty
2. Tap `task-priority-option-medium`
3. Tap `task-due-date-quick-option-today`
4. Tap `task-submit-button`

**Expected result**

- Title validation error is displayed (`task-title-error`)
- No task is created
- User remains on the Add Task screen

---

### TC-TASK-005 — Task creation blocked when title exceeds 80 characters

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- User is on the Add Task screen

**Test data**

| Field | Value                                                                                                    |
| ----- | -------------------------------------------------------------------------------------------------------- |
| Title | 81-character string: `AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA` |

**Steps**

1. Enter the 81-character string in `task-title-input`
2. Tap `task-priority-option-low`
3. Tap `task-due-date-quick-option-today`
4. Tap `task-submit-button`

**Expected result**

- Title validation error is displayed (`task-title-error`)
- No task is created

---

### TC-TASK-006 — Task creation blocked when no due date is selected

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- User is on the Add Task screen

**Steps**

1. Enter `No date task` in `task-title-input`
2. Tap `task-priority-option-medium`
3. Do not select a due date
4. Tap `task-submit-button`

**Expected result**

- Due date validation error is displayed (`task-due-date-error`)
- No task is created
- User remains on the Add Task screen

---

### TC-TASK-007 — Quick select "Today" sets due date to current date

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- User is on the Add Task screen

**Steps**

1. Tap `task-due-date-quick-option-today`
2. Observe the due date input field (`task-due-date-input`)

**Expected result**

- Due date input reflects today's date in `YYYY-MM-DD` format

---

### TC-TASK-008 — Quick select "Tomorrow" sets due date to tomorrow

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- User is on the Add Task screen

**Steps**

1. Tap `task-due-date-quick-option-tomorrow`
2. Observe `task-due-date-input`

**Expected result**

- Due date input reflects tomorrow's date in `YYYY-MM-DD` format

---

### TC-TASK-009 — Quick select "Next week" sets due date 7 days ahead

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- User is on the Add Task screen

**Steps**

1. Tap `task-due-date-quick-option-next-week`
2. Observe `task-due-date-input`

**Expected result**

- Due date input reflects a date 7 days from today in `YYYY-MM-DD` format

---

## Task Details

### TC-TASK-010 — Task details screen shows all task fields

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- At least one task exists in the list
- User is on the Home screen

**Steps**

1. Tap the first task card (`task-list-item-0`)

**Expected result**

- Task Details screen is displayed (`task-details-screen`)
- Title is visible (`task-details-title`)
- Description is visible (`task-details-description`)
- Status chip is visible (`task-details-status`)
- Priority chip is visible (`task-details-priority`)
- Due date calendar card is visible (`task-details-calendar-card`)
- Created date calendar card is visible (`task-details-created-card`)

---

### TC-TASK-011 — Open task shows "Open" status chip

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- An open (incomplete) task exists and its details screen is displayed

**Steps**

1. Observe the status chip (`task-details-status`)

**Expected result**

- Status chip text reads `Open` (`task-details-status-text`)

---

### TC-TASK-012 — Completed task shows "Completed" status chip

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- A completed task exists and its details screen is displayed

**Steps**

1. Observe the status chip (`task-details-status`)

**Expected result**

- Status chip text reads `Completed` (`task-details-status-text`)

---

## Complete / Reopen

### TC-TASK-013 — Complete a task from Task Details

| Priority | Type  | Platform       |
| -------- | ----- | -------------- |
| Critical | Smoke | Cross-platform |

**Preconditions**

- An open task exists and its details screen is displayed
- Complete button label reads `Complete task`

**Steps**

1. Tap the complete button (`task-details-complete-button`)

**Expected result**

- Button label changes to `Reopen task`
- Status chip changes to `Completed` (`task-details-status-text`)
- Title shows strikethrough styling

---

### TC-TASK-014 — Reopen a completed task from Task Details

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- A completed task exists and its details screen is displayed
- Complete button label reads `Reopen task`

**Steps**

1. Tap `task-details-complete-button`

**Expected result**

- Button label changes to `Complete task`
- Status chip changes to `Open` (`task-details-status-text`)
- Strikethrough styling is removed from title

---

### TC-TASK-015 — Complete a task via checkbox on the task list

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- At least one open task is visible in the task list

**Steps**

1. Locate an open task at index 0
2. Tap the toggle checkbox (`task-toggle-button-0`)

**Expected result**

- Task card shows completed styling (strikethrough title)
- Task stats in the hero card update (completed count increments)

---

### TC-TASK-016 — Reopen a completed task via checkbox on the task list

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- At least one completed task is visible in the task list (e.g., with "Done" status filter)

**Steps**

1. Tap the toggle checkbox of a completed task (`task-toggle-button-0`)

**Expected result**

- Task card reverts to open styling
- Hero card stats update (open count increments)

---

## Delete

### TC-TASK-017 — Delete task shows confirmation dialog

| Priority | Type  | Platform       |
| -------- | ----- | -------------- |
| Critical | Smoke | Cross-platform |

**Preconditions**

- A task exists and its details screen is displayed

**Steps**

1. Tap the delete button (`task-details-delete-button`)

**Expected result**

- A native confirmation dialog appears with title `Delete task?`
- Dialog contains **Cancel** and **Delete** options
- Task is not deleted yet

---

### TC-TASK-018 — Confirming delete removes the task

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Critical | Functional | Cross-platform |

**Preconditions**

- A task exists and its details screen is displayed
- Confirmation dialog is open (from TC-TASK-017)

**Steps**

1. Tap **Delete** in the confirmation dialog

**Expected result**

- Task is deleted from the store
- User is navigated to the Home screen (`main-screen`)
- Deleted task no longer appears in the task list

---

### TC-TASK-019 — Cancelling delete preserves the task

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- A task exists and its details screen is displayed
- Confirmation dialog is open

**Steps**

1. Tap **Cancel** in the confirmation dialog

**Expected result**

- Dialog dismisses
- Task remains on the Task Details screen
- Task is still present in the task store

---

## Edit

### TC-TASK-020 — Edit task form is pre-populated with current values

| Priority | Type  | Platform       |
| -------- | ----- | -------------- |
| High     | Smoke | Cross-platform |

**Preconditions**

- A task with title `Buy groceries`, description `Milk, eggs, and bread`, priority High exists
- Task Details screen is displayed

**Steps**

1. Tap the edit button (`task-details-edit-button`)
2. Observe the task form fields

**Expected result**

- Task form is displayed (`task-form-screen`)
- `task-title-input` contains `Buy groceries`
- `task-description-input` contains `Milk, eggs, and bread`
- High priority option is selected (`task-priority-option-high`)
- `task-due-date-input` contains the existing due date

---

### TC-TASK-021 — Edit task title and save

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- A task exists and the Edit Task screen is displayed

**Test data**

| Field | New value            |
| ----- | -------------------- |
| Title | `Updated task title` |

**Steps**

1. Clear `task-title-input`
2. Enter `Updated task title`
3. Tap `task-submit-button`

**Expected result**

- Task Details screen is displayed
- Title shows `Updated task title` (`task-details-title`)

---

### TC-TASK-022 — Edit task priority and save

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- A task with priority `Low` exists and the Edit Task screen is displayed

**Steps**

1. Tap `task-priority-option-high`
2. Tap `task-submit-button`

**Expected result**

- Task Details screen is displayed
- Priority chip shows `High priority` (`task-details-priority-text`)

---

### TC-TASK-023 — Edit task description and save

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- A task with no description exists and the Edit Task screen is displayed

**Test data**

| Field       | Value                  |
| ----------- | ---------------------- |
| Description | `Added after creation` |

**Steps**

1. Enter `Added after creation` in `task-description-input`
2. Tap `task-submit-button`

**Expected result**

- Task Details screen shows `Added after creation` in `task-details-description`

---

### TC-TASK-024 — Edited task reflects changes in the task list

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Regression | Cross-platform |

**Preconditions**

- A task titled `Old title` exists

**Steps**

1. Open the task details for `Old title`
2. Tap `task-details-edit-button`
3. Clear `task-title-input` and enter `New title`
4. Tap `task-submit-button`
5. Tap `task-details-home-button`

**Expected result**

- Task list shows the task card with title `New title`
- Old title `Old title` is not visible

---

### TC-TASK-025 — Edit task blocked when title is cleared

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- A task exists and the Edit Task screen is displayed

**Steps**

1. Clear `task-title-input` completely
2. Tap `task-submit-button`

**Expected result**

- Title validation error is displayed (`task-title-error`)
- Task is not saved
- User remains on the Edit Task screen

---

### TC-TASK-026 — Task Details home button navigates to Home screen

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

### TC-TASK-027 — New task button on Task Details navigates to Add Task

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- Task Details screen is displayed

**Steps**

1. Tap `task-add-button` (New task button at the bottom of the screen)

**Expected result**

- Add Task form is displayed (`task-form-screen`)
- All fields are empty
