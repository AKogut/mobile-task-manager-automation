import { SEARCH_FIXTURES, SEARCH_QUERIES } from '../../data/taskFixtures';
import { TaskHelper } from '../../helpers/TaskHelper';
import { HomePage } from '../../pages';

describe('Tasks — Search', () => {
  const homePage = new HomePage();
  const taskHelper: TaskHelper = new TaskHelper();

  before(async () => {
    await taskHelper.seedTasks([
      SEARCH_FIXTURES.groceries,
      SEARCH_FIXTURES.milk,
      SEARCH_FIXTURES.dentist,
      SEARCH_FIXTURES.rent,
    ]);
  });

  it('TC-SEARCH-001 — Search by exact title match returns the correct task', async () => {
    await homePage.searchFor(SEARCH_QUERIES.exact);
    await homePage.waitForVisibleTaskCount(1);

    const titles = await homePage.getVisibleTaskTitles();

    expect(titles).toEqual(['Pay rent']);
    expect(titles).not.toContain('Buy groceries');
    expect(titles).not.toContain('Call dentist');
  });

  it('TC-SEARCH-002 — Search by partial title returns matching tasks', async () => {
    await homePage.searchFor(SEARCH_QUERIES.partial);
    await homePage.waitForVisibleTaskCount(2);

    const titles = await homePage.getVisibleTaskTitles();

    expect(titles).toContain('Buy groceries');
    expect(titles).toContain('Buy milk');
    expect(titles).not.toContain('Call dentist');
  });

  it('TC-SEARCH-003 — Search is case-insensitive', async () => {
    await homePage.searchFor(SEARCH_QUERIES.caseInsensitive);
    await homePage.waitForVisibleTaskCount(1);

    expect(await homePage.isTaskTitleVisible('Buy groceries')).toBe(true);
  });

  it('TC-SEARCH-004 — Search with no matches shows the no-results card', async () => {
    await homePage.searchFor(SEARCH_QUERIES.noMatch);
    await homePage.waitForVisibleTaskCount(0);

    expect(await homePage.isNoResultsCardVisible()).toBe(true);
    expect(await homePage.isEmptyStateVisible()).toBe(false);
  });

  it('TC-SEARCH-005 — Clearing the search input restores the full task list', async () => {
    await homePage.searchFor(SEARCH_QUERIES.partial);
    await homePage.waitForVisibleTaskCount(2);

    await homePage.clearSearch();
    await homePage.waitForVisibleTaskCount(4);

    expect(await homePage.getVisibleTaskCount()).toBe(4);
  });
});

describe('Tasks — Search with an active status filter', () => {
  const homePage = new HomePage();
  const taskHelper: TaskHelper = new TaskHelper();

  before(async () => {
    await taskHelper.seedTasks(
      [
        SEARCH_FIXTURES.groceries,
        SEARCH_FIXTURES.milk,
        SEARCH_FIXTURES.dentist,
      ],
      { completedTitles: ['Buy milk'] },
    );
  });

  it('TC-SEARCH-006 — Search works in combination with an active status filter', async () => {
    await homePage.tapStatusFilter('open');
    await homePage.searchFor(SEARCH_QUERIES.partial);
    await homePage.waitForVisibleTaskCount(1);

    const titles = await homePage.getVisibleTaskTitles();

    expect(titles).toEqual(['Buy groceries']);
    expect(titles).not.toContain('Buy milk');
    expect(titles).not.toContain('Call dentist');
  });
});
