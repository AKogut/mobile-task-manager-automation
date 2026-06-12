import { TASK_FIXTURES } from '../../data/taskFixtures';
import { TaskHelper } from '../../helpers/TaskHelper';
import { HomePage, TaskDetailsPage, TaskFormPage } from '../../pages';

function formatDateOffset(daysFromToday: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

describe('Tasks — Creation', () => {
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

  async function openAddTaskForm(): Promise<void> {
    await homePage.tapAddButton();
    await taskFormPage.waitForScreen();
  }

  it('TC-TASK-001 — Create a task with all fields', async () => {
    await taskHelper.createTask(TASK_FIXTURES.allFields);

    expect(await taskDetailsPage.isDisplayed()).toBe(true);
    expect(await taskDetailsPage.getTitle()).toBe('Buy groceries');
    expect(await taskDetailsPage.getDescription()).toBe(
      'Milk, eggs, and bread',
    );
    expect(await taskDetailsPage.getPriorityText()).toBe('High priority');
    expect(await taskDetailsPage.getStatusText()).toBe('Open');
  });

  it('TC-TASK-002 — Create a task with minimum required fields', async () => {
    await taskHelper.createTask(TASK_FIXTURES.minimumRequired);

    expect(await taskDetailsPage.isDisplayed()).toBe(true);
    expect(await taskDetailsPage.getTitle()).toBe('Minimal task');
    expect(await taskDetailsPage.getDescription()).toBe(
      'No description provided.',
    );
    expect(await taskDetailsPage.getPriorityText()).toBe('Low priority');
  });

  it('TC-TASK-003 — Newly created task appears in the task list', async () => {
    await taskHelper.createTask(TASK_FIXTURES.listTask);
    await taskDetailsPage.tapHomeButton();
    await homePage.waitForScreen();

    expect(await homePage.isTaskVisible(0)).toBe(true);
    expect(await homePage.getTaskTitle(0)).toBe('New list task');
    expect(await homePage.getTaskMetadata(0)).toContain('Medium');
  });

  it('TC-TASK-004 — Task creation blocked when title is empty', async () => {
    await openAddTaskForm();

    await taskFormPage.selectPriority('medium');
    await taskFormPage.selectQuickDate('today');
    await taskFormPage.submit();

    expect(await taskFormPage.isTitleErrorVisible()).toBe(true);
    expect(await taskFormPage.isDisplayed()).toBe(true);
    expect(await taskDetailsPage.isDisplayed()).toBe(false);
  });

  it('TC-TASK-005 — Task creation blocked when title exceeds 80 characters', async () => {
    await openAddTaskForm();

    await taskFormPage.setTitle(TASK_FIXTURES.longTitle.title);
    await taskFormPage.selectPriority('low');
    await taskFormPage.selectQuickDate('today');
    await taskFormPage.submit();

    expect(await taskFormPage.isTitleErrorVisible()).toBe(true);
    expect(await taskFormPage.isDisplayed()).toBe(true);
    expect(await taskDetailsPage.isDisplayed()).toBe(false);
  });

  it('TC-TASK-006 — Task creation blocked when no due date is selected', async () => {
    await openAddTaskForm();

    await taskFormPage.setTitle(TASK_FIXTURES.noDateValidation.title);
    await taskFormPage.selectPriority('medium');
    await taskFormPage.submit();

    expect(await taskFormPage.isDueDateErrorVisible()).toBe(true);
    expect(await taskFormPage.isDisplayed()).toBe(true);
    expect(await taskDetailsPage.isDisplayed()).toBe(false);
  });

  it('TC-TASK-007 — Quick select "Today" sets due date to current date', async () => {
    await openAddTaskForm();
    const expectedDate = formatDateOffset(0);

    await taskFormPage.selectQuickDate('today', expectedDate);

    expect(await taskFormPage.getDueDateValue()).toBe(expectedDate);
  });

  it('TC-TASK-008 — Quick select "Tomorrow" sets due date to tomorrow', async () => {
    await openAddTaskForm();
    const expectedDate = formatDateOffset(1);

    await taskFormPage.selectQuickDate('tomorrow', expectedDate);

    expect(await taskFormPage.getDueDateValue()).toBe(expectedDate);
  });

  it('TC-TASK-009 — Quick select "Next week" sets due date 7 days ahead', async () => {
    await openAddTaskForm();
    const expectedDate = formatDateOffset(7);

    await taskFormPage.selectQuickDate('next-week', expectedDate);

    expect(await taskFormPage.getDueDateValue()).toBe(expectedDate);
  });
});
