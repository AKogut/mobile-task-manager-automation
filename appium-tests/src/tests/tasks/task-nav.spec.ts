import {
  NAVIGATION_EDIT_VALUES,
  NAVIGATION_FIXTURES,
  PERSISTENCE_FIXTURES,
} from '../../data/taskFixtures';
import { resolveDueDate } from '../../data/taskSeed';
import { AuthHelper } from '../../helpers/AuthHelper';
import { TaskHelper } from '../../helpers/TaskHelper';
import {
  HomePage,
  SettingsPage,
  TaskDetailsPage,
  TaskFormPage,
} from '../../pages';

describe('Navigation', () => {
  const homePage = new HomePage();
  const settingsPage = new SettingsPage();
  const taskDetailsPage = new TaskDetailsPage();
  const taskFormPage = new TaskFormPage();
  const taskHelper: TaskHelper = new TaskHelper();

  async function expectEmptyAddTaskForm(): Promise<void> {
    await taskFormPage.waitForScreen();

    expect(await taskFormPage.getScreenTitle()).toBe('Add task');
    expect(await taskFormPage.isTitleEmpty()).toBe(true);
    expect(await taskFormPage.isDescriptionEmpty()).toBe(true);
    expect(await taskFormPage.isDueDateEmpty()).toBe(true);
  }

  before(async () => {
    await taskHelper.seedTasks([NAVIGATION_FIXTURES.existing]);
  });

  beforeEach(async () => {
    await taskHelper.startSession();
  });

  it('TC-NAV-001 — Tapping a task card navigates to Task Details', async () => {
    const tappedTitle = await homePage.getTaskTitle(0);

    await homePage.tapTask(0);
    await taskDetailsPage.waitForScreen();

    expect(await taskDetailsPage.isDisplayed()).toBe(true);
    expect(await taskDetailsPage.getTitle()).toBe(tappedTitle);
    expect(tappedTitle).toBe(NAVIGATION_FIXTURES.existing.title);
  });

  it('TC-NAV-002 — "New task" button on Home navigates to Add Task', async () => {
    await homePage.tapAddButton();

    await expectEmptyAddTaskForm();
  });

  it('TC-NAV-003 — "New task" button on Task Details navigates to Add Task', async () => {
    await taskHelper.openTaskDetails(0);

    await taskDetailsPage.tapAddButton();

    await expectEmptyAddTaskForm();
  });

  it('TC-NAV-004 — "Edit" button on Task Details navigates to Edit Task', async () => {
    await taskHelper.openTaskDetails(0);

    await taskDetailsPage.tapEditButton();
    await taskFormPage.waitForScreen();

    expect(await taskFormPage.getScreenTitle()).toBe('Edit task');
    expect(await taskFormPage.getTitleValue()).toBe(
      NAVIGATION_FIXTURES.existing.title,
    );
    expect(await taskFormPage.getDescriptionValue()).toBe(
      NAVIGATION_FIXTURES.existing.description,
    );
    expect(
      await taskFormPage.isPrioritySelected(
        NAVIGATION_FIXTURES.existing.priority,
      ),
    ).toBe(true);
    expect(await taskFormPage.getDueDateValue()).toBe(
      resolveDueDate(NAVIGATION_FIXTURES.existing.quickDate),
    );
  });

  it('TC-NAV-005 — "Home" button on Task Details navigates to Home', async () => {
    await taskHelper.openTaskDetails(0);
    await homePage.waitForScreenHidden();

    await taskDetailsPage.tapHomeButton();
    await homePage.waitForScreen();

    expect(await homePage.isDisplayed()).toBe(true);
    expect(await homePage.isTaskVisible(0)).toBe(true);
    expect(await homePage.getTaskTitle(0)).toBe(
      NAVIGATION_FIXTURES.existing.title,
    );
  });

  it('TC-NAV-008 — Settings back button returns to Home', async () => {
    await homePage.tapSettingsButton();
    await settingsPage.waitForScreen();
    await homePage.waitForScreenHidden();

    await settingsPage.tapBack();
    await homePage.waitForScreen();

    expect(await homePage.isDisplayed()).toBe(true);
  });
});

describe('Navigation — Saving a task', () => {
  const homePage = new HomePage();
  const taskDetailsPage = new TaskDetailsPage();
  const taskFormPage = new TaskFormPage();
  const taskHelper: TaskHelper = new TaskHelper();

  beforeEach(async () => {
    await taskHelper.seedTasks([NAVIGATION_FIXTURES.existing]);
  });

  it('TC-NAV-006 — Saving a new task navigates to Task Details (not Home)', async () => {
    await homePage.tapAddButton();
    await taskFormPage.waitForScreen();

    await taskFormPage.fillAndSubmit(NAVIGATION_FIXTURES.created);
    await taskDetailsPage.waitForScreen();

    expect(await taskDetailsPage.isDisplayed()).toBe(true);
    expect(await homePage.isDisplayed()).toBe(false);
    expect(await taskDetailsPage.getTitle()).toBe(
      NAVIGATION_FIXTURES.created.title,
    );
  });

  it('TC-NAV-007 — Saving an edited task navigates to Task Details (not Home)', async () => {
    await taskHelper.openTaskDetails(0);
    await taskDetailsPage.tapEditButton();
    await taskFormPage.waitForScreen();

    await taskFormPage.setTitle(NAVIGATION_EDIT_VALUES.editedTitle);
    await taskFormPage.submit();
    await taskDetailsPage.waitForScreen();

    expect(await taskDetailsPage.isDisplayed()).toBe(true);
    expect(await homePage.isDisplayed()).toBe(false);
    expect(await taskDetailsPage.getTitle()).toBe(
      NAVIGATION_EDIT_VALUES.editedTitle,
    );
  });
});

describe('Persistence', () => {
  const authHelper = new AuthHelper();
  const homePage = new HomePage();
  const taskHelper: TaskHelper = new TaskHelper();

  it('TC-NAV-009 — Tasks persist after app restart', async () => {
    await taskHelper.seedTasks([]);
    await taskHelper.createTasks([
      PERSISTENCE_FIXTURES.first,
      PERSISTENCE_FIXTURES.second,
    ]);
    await homePage.waitForVisibleTaskCount(2);

    await authHelper.restartApp();
    await homePage.waitForScreen(20000);
    await homePage.waitForVisibleTaskCount(2);

    const titles = await homePage.getVisibleTaskTitles();

    expect(titles).toHaveLength(2);
    expect(titles).toContain(PERSISTENCE_FIXTURES.first.title);
    expect(titles).toContain(PERSISTENCE_FIXTURES.second.title);
  });

  it('TC-NAV-010 — Task completion state persists after app restart', async () => {
    await taskHelper.seedTasks([PERSISTENCE_FIXTURES.completed]);
    await taskHelper.completeTaskByTitle(PERSISTENCE_FIXTURES.completed.title);

    await authHelper.restartApp();
    await homePage.waitForScreen(20000);
    await homePage.waitForVisibleTaskCount(1);

    const index = await homePage.getTaskIndexByTitle(
      PERSISTENCE_FIXTURES.completed.title,
    );

    expect(await homePage.getTaskMetadata(index)).toContain('Completed');

    await homePage.tapStatusFilter('completed');
    await homePage.waitForVisibleTaskCount(1);

    expect(await homePage.getVisibleTaskTitles()).toEqual([
      PERSISTENCE_FIXTURES.completed.title,
    ]);
  });
});
