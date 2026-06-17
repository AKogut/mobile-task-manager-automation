import {
  PRIORITY_FILTER_FIXTURES,
  STATUS_FILTER_FIXTURES,
} from '../../data/taskFixtures';
import { TaskHelper } from '../../helpers/TaskHelper';
import { HomePage } from '../../pages';

describe('Tasks — Status filter', () => {
  const homePage = new HomePage();
  const taskHelper: TaskHelper = new TaskHelper();

  before(async () => {
    await taskHelper.startSession();
    await taskHelper.prepareCleanHome();
    await taskHelper.createTasks([
      STATUS_FILTER_FIXTURES.openOne,
      STATUS_FILTER_FIXTURES.openTwo,
      STATUS_FILTER_FIXTURES.completed,
    ]);
    await taskHelper.completeTaskByTitle(
      STATUS_FILTER_FIXTURES.completed.title,
    );
  });

  beforeEach(async () => {
    await homePage.resetFilters();
  });

  it('TC-FILTER-001 — Status filter "Open" shows only open tasks', async () => {
    await homePage.tapStatusFilter('open');
    await homePage.waitForVisibleTaskCount(2);

    const titles = await homePage.getVisibleTaskTitles();

    expect(titles).toContain(STATUS_FILTER_FIXTURES.openOne.title);
    expect(titles).toContain(STATUS_FILTER_FIXTURES.openTwo.title);
    expect(titles).not.toContain(STATUS_FILTER_FIXTURES.completed.title);
  });

  it('TC-FILTER-002 — Status filter "Done" shows only completed tasks', async () => {
    await homePage.tapStatusFilter('completed');
    await homePage.waitForVisibleTaskCount(1);

    const titles = await homePage.getVisibleTaskTitles();

    expect(titles).toEqual([STATUS_FILTER_FIXTURES.completed.title]);
    expect(titles).not.toContain(STATUS_FILTER_FIXTURES.openOne.title);
    expect(titles).not.toContain(STATUS_FILTER_FIXTURES.openTwo.title);
  });

  it('TC-FILTER-003 — Status filter "All" shows all tasks', async () => {
    await homePage.tapStatusFilter('completed');
    await homePage.waitForVisibleTaskCount(1);

    await homePage.tapStatusFilter('all');
    await homePage.waitForVisibleTaskCount(3);

    expect(await homePage.getVisibleTaskCount()).toBe(3);
  });
});

describe('Tasks — Status filter without completed tasks', () => {
  const homePage = new HomePage();
  const taskHelper: TaskHelper = new TaskHelper();

  before(async () => {
    await taskHelper.startSession();
    await taskHelper.prepareCleanHome();
    await taskHelper.createTasks([
      STATUS_FILTER_FIXTURES.openOne,
      STATUS_FILTER_FIXTURES.openTwo,
    ]);
  });

  it('TC-FILTER-004 — Status filter "Done" with no completed tasks shows the no-results card', async () => {
    await homePage.tapStatusFilter('completed');
    await homePage.waitForVisibleTaskCount(0);

    expect(await homePage.isNoResultsCardVisible()).toBe(true);
  });
});

describe('Tasks — Priority filter', () => {
  const homePage = new HomePage();
  const taskHelper: TaskHelper = new TaskHelper();

  before(async () => {
    await taskHelper.startSession();
    await taskHelper.prepareCleanHome();
    await taskHelper.createTasks([
      PRIORITY_FILTER_FIXTURES.high,
      PRIORITY_FILTER_FIXTURES.medium,
      PRIORITY_FILTER_FIXTURES.low,
    ]);
  });

  beforeEach(async () => {
    await homePage.resetFilters();
  });

  it('TC-FILTER-005 — Priority filter "High" shows only high priority tasks', async () => {
    await homePage.tapPriorityFilter('high');
    await homePage.waitForVisibleTaskCount(1);

    const titles = await homePage.getVisibleTaskTitles();

    expect(titles).toEqual([PRIORITY_FILTER_FIXTURES.high.title]);
    expect(titles).not.toContain(PRIORITY_FILTER_FIXTURES.medium.title);
    expect(titles).not.toContain(PRIORITY_FILTER_FIXTURES.low.title);
  });

  it('TC-FILTER-006 — Priority filter "Medium" shows only medium priority tasks', async () => {
    await homePage.tapPriorityFilter('medium');
    await homePage.waitForVisibleTaskCount(1);

    expect(await homePage.getVisibleTaskTitles()).toEqual([
      PRIORITY_FILTER_FIXTURES.medium.title,
    ]);
  });

  it('TC-FILTER-007 — Priority filter "Low" shows only low priority tasks', async () => {
    await homePage.tapPriorityFilter('low');
    await homePage.waitForVisibleTaskCount(1);

    expect(await homePage.getVisibleTaskTitles()).toEqual([
      PRIORITY_FILTER_FIXTURES.low.title,
    ]);

    await homePage.tapPriorityFilter('all');
    await homePage.waitForVisibleTaskCount(3);

    expect(await homePage.getVisibleTaskCount()).toBe(3);
  });
});
