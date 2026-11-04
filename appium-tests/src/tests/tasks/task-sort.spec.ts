import {
  SORT_FILTER_FIXTURES,
  SORT_FIXTURES,
  SORT_STATUS_FIXTURES,
} from '../../data/taskFixtures';
import { TaskHelper } from '../../helpers/TaskHelper';
import { HomePage, TaskDetailsPage } from '../../pages';

describe('Tasks — Sort', () => {
  const homePage = new HomePage();
  const taskDetailsPage = new TaskDetailsPage();
  const taskHelper: TaskHelper = new TaskHelper();

  const dueDateOrder = ['Task B', 'Task A', 'Task C'];
  const priorityOrder = ['Task B', 'Task C', 'Task A'];
  const createdOrder = ['Task C', 'Task B', 'Task A'];

  before(async () => {
    await taskHelper.seedTasks([
      SORT_FIXTURES.taskA,
      SORT_FIXTURES.taskB,
      SORT_FIXTURES.taskC,
    ]);
  });

  beforeEach(async () => {
    await taskHelper.startSession();
  });

  it('TC-SORT-001 — Default sort is by due date ascending', async () => {
    await homePage.waitForTaskOrder(dueDateOrder);

    expect(await homePage.isSortSelected('dueDate')).toBe(true);
    expect(await homePage.getVisibleTaskTitles()).toEqual(dueDateOrder);
  });

  it('TC-SORT-002 — Sort by priority orders High → Medium → Low', async () => {
    await homePage.waitForTaskOrder(dueDateOrder);

    await homePage.sortBy('priority');
    await homePage.waitForTaskOrder(priorityOrder);

    expect(await homePage.getVisibleTaskTitles()).toEqual(priorityOrder);
  });

  it('TC-SORT-004 — Sort by created date orders newest first', async () => {
    await homePage.waitForTaskOrder(dueDateOrder);

    await homePage.sortBy('createdAt');
    await homePage.waitForTaskOrder(createdOrder);

    expect(await homePage.getVisibleTaskTitles()).toEqual(createdOrder);
  });

  it.skip('TC-SORT-005 — Sort selection persists when returning to Home screen', async () => {
    await homePage.sortBy('priority');
    await homePage.waitForTaskOrder(priorityOrder);

    await taskHelper.openTaskDetails(0);
    await taskDetailsPage.tapHomeButton();
    await homePage.waitForScreen();

    expect(await homePage.isSortSelected('priority')).toBe(true);
    expect(await homePage.isSortSelected('dueDate')).toBe(false);
    expect(await homePage.getVisibleTaskTitles()).toEqual(priorityOrder);
  });
});

describe('Tasks — Sort by status', () => {
  const homePage = new HomePage();
  const taskHelper: TaskHelper = new TaskHelper();

  beforeEach(async () => {
    await taskHelper.seedTasks(
      [
        SORT_STATUS_FIXTURES.completedFirst,
        SORT_STATUS_FIXTURES.open,
        SORT_STATUS_FIXTURES.completedSecond,
      ],
      {
        completedTitles: [
          SORT_STATUS_FIXTURES.completedFirst.title,
          SORT_STATUS_FIXTURES.completedSecond.title,
        ],
      },
    );
  });

  it('TC-SORT-003 — Sort by status orders Open tasks before Completed', async () => {
    await homePage.tapStatusFilter('all');
    await homePage.waitForTaskOrder(['Task A', 'Task C', 'Task B']);

    await homePage.sortBy('status');
    await homePage.waitForTaskOrder(['Task B', 'Task A', 'Task C']);

    expect(await homePage.getVisibleTaskTitles()).toEqual([
      'Task B',
      'Task A',
      'Task C',
    ]);
  });
});

describe('Tasks — Sort with an active filter', () => {
  const homePage = new HomePage();
  const taskHelper: TaskHelper = new TaskHelper();

  beforeEach(async () => {
    await taskHelper.seedTasks(
      [
        SORT_FILTER_FIXTURES.openHigh,
        SORT_FILTER_FIXTURES.openLow,
        SORT_FILTER_FIXTURES.completedHigh,
      ],
      { completedTitles: [SORT_FILTER_FIXTURES.completedHigh.title] },
    );
  });

  it('TC-SORT-006 — Sort works in combination with an active filter', async () => {
    await homePage.tapStatusFilter('open');
    await homePage.waitForVisibleTaskCount(2);
    await homePage.waitForTaskOrder(['Task B', 'Task A']);

    await homePage.sortBy('priority');
    await homePage.waitForTaskOrder(['Task A', 'Task B']);

    const titles = await homePage.getVisibleTaskTitles();

    expect(titles).toEqual(['Task A', 'Task B']);
    expect(titles).not.toContain('Task C');
  });
});
