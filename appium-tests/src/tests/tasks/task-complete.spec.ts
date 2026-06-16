import { TASK_FIXTURES } from '../../data/taskFixtures';
import { TaskHelper } from '../../helpers/TaskHelper';
import { HomePage, TaskDetailsPage } from '../../pages';

describe('Tasks — Complete / Reopen', () => {
  const homePage = new HomePage();
  const taskDetailsPage = new TaskDetailsPage();
  const taskHelper: TaskHelper = new TaskHelper();

  before(async () => {
    await taskHelper.startSession();
  });

  beforeEach(async () => {
    await taskHelper.returnToCleanHome();
  });

  it('TC-TASK-013 — Complete a task from Task Details', async () => {
    await taskHelper.createTask(TASK_FIXTURES.simple);

    expect(await taskDetailsPage.getStatusText()).toBe('Open');
    expect(await taskDetailsPage.getCompleteButtonText()).toBe('Complete task');

    await taskDetailsPage.tapCompleteButton();
    await taskDetailsPage.waitForStatus('Completed');

    expect(await taskDetailsPage.getStatusText()).toBe('Completed');
    expect(await taskDetailsPage.getCompleteButtonText()).toBe('Reopen task');
  });

  it('TC-TASK-014 — Reopen a completed task from Task Details', async () => {
    await taskHelper.createTask(TASK_FIXTURES.simple);

    await taskDetailsPage.tapCompleteButton();
    await taskDetailsPage.waitForStatus('Completed');

    expect(await taskDetailsPage.getCompleteButtonText()).toBe('Reopen task');

    await taskDetailsPage.tapCompleteButton();
    await taskDetailsPage.waitForStatus('Open');

    expect(await taskDetailsPage.getStatusText()).toBe('Open');
    expect(await taskDetailsPage.getCompleteButtonText()).toBe('Complete task');
  });

  it('TC-TASK-015 — Complete a task via checkbox on the task list', async () => {
    await taskHelper.createTask(TASK_FIXTURES.simple);
    await taskDetailsPage.tapHomeButton();
    await homePage.waitForScreen();

    await homePage.toggleTask(0);
    await homePage.waitForTaskCompleted(0, true);

    expect(await homePage.getTaskMetadata(0)).toContain('Completed');
    expect(await homePage.getTaskTitle(0)).toBe('Buy groceries');
  });

  it('TC-TASK-016 — Reopen a completed task via checkbox on the task list', async () => {
    await taskHelper.createTask(TASK_FIXTURES.simple);
    await taskDetailsPage.tapHomeButton();
    await homePage.waitForScreen();

    await homePage.toggleTask(0);
    await homePage.waitForTaskCompleted(0, true);

    await homePage.toggleTask(0);
    await homePage.waitForTaskCompleted(0, false);

    expect(await homePage.getTaskMetadata(0)).not.toContain('Completed');
  });
});
