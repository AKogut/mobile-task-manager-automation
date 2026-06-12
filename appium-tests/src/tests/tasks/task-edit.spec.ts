import { TASK_EDIT_VALUES, TASK_FIXTURES } from '../../data/taskFixtures';
import { TaskHelper } from '../../helpers/TaskHelper';
import { HomePage, TaskDetailsPage, TaskFormPage } from '../../pages';

describe('Tasks — Edit', () => {
  const homePage = new HomePage();
  const taskDetailsPage = new TaskDetailsPage();
  const taskFormPage = new TaskFormPage();
  const taskHelper: TaskHelper = new TaskHelper();

  before(async () => {
    await taskHelper.startSession();
  });

  beforeEach(async () => {
    await taskHelper.returnToCleanHome();
  });

  it('TC-TASK-020 — Edit task form is pre-populated with current values', async () => {
    await taskHelper.createTaskAndOpenEditForm(TASK_FIXTURES.allFields);

    expect(await taskFormPage.isDisplayed()).toBe(true);
    expect(await taskFormPage.getTitleValue()).toBe('Buy groceries');
    expect(await taskFormPage.getDescriptionValue()).toBe(
      'Milk, eggs, and bread',
    );
    expect(await taskFormPage.isPrioritySelected('high')).toBe(true);
    expect(await taskFormPage.getDueDateValue()).not.toBe('');
  });

  it('TC-TASK-021 — Edit task title and save', async () => {
    await taskHelper.createTaskAndOpenEditForm(TASK_FIXTURES.allFields);

    await taskFormPage.clearTitle();
    await taskFormPage.setTitle(TASK_EDIT_VALUES.updatedTitle);
    await taskFormPage.submit();
    await taskDetailsPage.waitForScreen();

    expect(await taskDetailsPage.isDisplayed()).toBe(true);
    expect(await taskDetailsPage.getTitle()).toBe(
      TASK_EDIT_VALUES.updatedTitle,
    );
  });

  it('TC-TASK-022 — Edit task priority and save', async () => {
    await taskHelper.createTaskAndOpenEditForm(TASK_FIXTURES.editLowPriority);

    await taskFormPage.selectPriority('high');
    await taskFormPage.submit();
    await taskDetailsPage.waitForScreen();

    expect(await taskDetailsPage.isDisplayed()).toBe(true);
    expect(await taskDetailsPage.getPriorityText()).toBe('High priority');
  });

  it('TC-TASK-023 — Edit task description and save', async () => {
    await taskHelper.createTaskAndOpenEditForm(TASK_FIXTURES.editNoDescription);

    await taskFormPage.setDescription(TASK_EDIT_VALUES.addedDescription);
    await taskFormPage.submit();
    await taskDetailsPage.waitForScreen();

    expect(await taskDetailsPage.isDisplayed()).toBe(true);
    expect(await taskDetailsPage.getDescription()).toBe(
      TASK_EDIT_VALUES.addedDescription,
    );
  });

  it('TC-TASK-024 — Edited task reflects changes in the task list', async () => {
    await taskHelper.createTaskAndOpenEditForm(TASK_FIXTURES.editListBefore);

    await taskFormPage.clearTitle();
    await taskFormPage.setTitle(TASK_EDIT_VALUES.newListTitle);
    await taskFormPage.submit();
    await taskDetailsPage.waitForScreen();
    await taskDetailsPage.tapHomeButton();
    await homePage.waitForScreen();

    expect(await homePage.isTaskVisible(0)).toBe(true);
    expect(await homePage.getTaskTitle(0)).toBe(TASK_EDIT_VALUES.newListTitle);
    expect(await homePage.getTaskTitle(0)).not.toBe('Old title');
  });

  it('TC-TASK-025 — Edit task blocked when title is cleared', async () => {
    await taskHelper.createTaskAndOpenEditForm(TASK_FIXTURES.allFields);

    await taskFormPage.clearTitle();
    await taskFormPage.submit();

    expect(await taskFormPage.isTitleErrorVisible()).toBe(true);
    expect(await taskFormPage.isDisplayed()).toBe(true);
    expect(await taskDetailsPage.isDisplayed()).toBe(false);
  });
});
