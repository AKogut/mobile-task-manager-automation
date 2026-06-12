import { TASK_FIXTURES } from '../../data/taskFixtures';
import { TaskHelper } from '../../helpers/TaskHelper';
import { HomePage, TaskDetailsPage } from '../../pages';

describe('Tasks — Delete', () => {
  const homePage = new HomePage();
  const taskDetailsPage = new TaskDetailsPage();
  const taskHelper: TaskHelper = new TaskHelper();

  before(async () => {
    await taskHelper.startSession();
  });

  beforeEach(async () => {
    await taskHelper.returnToCleanHome();
  });

  it('TC-TASK-017 — Delete task shows confirmation dialog', async () => {
    await taskHelper.createTask(TASK_FIXTURES.simple);

    await taskDetailsPage.tapDeleteButton();
    const dialogText = await taskDetailsPage.getDeleteDialogText();

    expect(dialogText).toContain('Delete task?');
    expect(dialogText).toContain('This action cannot be undone.');

    await taskDetailsPage.cancelDelete();

    expect(await taskDetailsPage.isDisplayed()).toBe(true);
    expect(await taskDetailsPage.getTitle()).toBe('Buy groceries');
  });

  it('TC-TASK-018 — Confirming delete removes the task', async () => {
    await taskHelper.createTask(TASK_FIXTURES.simple);

    await taskDetailsPage.tapDeleteButton();
    await taskDetailsPage.acceptDeleteDialog();
    await homePage.waitForScreen();

    expect(await homePage.isDisplayed()).toBe(true);
    expect(await homePage.isTaskVisible(0)).toBe(false);
  });

  it('TC-TASK-019 — Cancelling delete preserves the task', async () => {
    await taskHelper.createTask(TASK_FIXTURES.simple);

    await taskDetailsPage.tapDeleteButton();
    expect(await taskDetailsPage.getDeleteDialogText()).toContain(
      'Delete task?',
    );
    await taskDetailsPage.cancelDelete();

    expect(await taskDetailsPage.isDisplayed()).toBe(true);
    expect(await taskDetailsPage.getTitle()).toBe('Buy groceries');

    await taskDetailsPage.tapHomeButton();
    await homePage.waitForScreen();

    expect(await homePage.isTaskVisible(0)).toBe(true);
    expect(await homePage.getTaskTitle(0)).toBe('Buy groceries');
  });
});
