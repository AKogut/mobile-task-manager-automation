import type { TaskFixture } from '../data/taskFixtures';
import { AuthHelper } from './AuthHelper';
import { HomePage, LoginPage, TaskDetailsPage, TaskFormPage } from '../pages';

export class TaskHelper {
  private readonly authHelper = new AuthHelper();
  private readonly homePage = new HomePage();
  private readonly loginPage = new LoginPage();
  private readonly taskDetailsPage = new TaskDetailsPage();
  private readonly taskFormPage = new TaskFormPage();

  public async startSession(): Promise<void> {
    await browser.waitUntil(
      async () =>
        (await this.loginPage.isDisplayed()) ||
        (await this.homePage.isDisplayed()),
      {
        timeout: 20000,
        timeoutMsg: 'App did not reach Login or Home on launch',
      },
    );

    if (await this.loginPage.isDisplayed()) {
      await this.authHelper.loginWithDemoCredentials();
    }

    await this.homePage.waitForScreen();
  }

  public async returnToCleanHome(): Promise<void> {
    await this.navigateToHome();
    await this.deleteAllTasksFromHome();
  }

  public async createTask(fixture: TaskFixture): Promise<void> {
    await this.homePage.tapAddButton();
    await this.taskFormPage.waitForScreen();
    await this.taskFormPage.fillAndSubmit(fixture);
    await this.taskDetailsPage.waitForScreen();
    await browser.waitUntil(
      async () => (await this.taskDetailsPage.getTitle()) === fixture.title,
      {
        timeout: 10000,
        timeoutMsg: `Task details title "${fixture.title}" not visible`,
      },
    );
  }

  public async openTaskDetails(index: number): Promise<void> {
    await this.homePage.tapTask(index);
    await this.taskDetailsPage.waitForScreen();
  }

  public async createTaskAndOpenEditForm(fixture: TaskFixture): Promise<void> {
    await this.createTask(fixture);
    await this.taskDetailsPage.tapEditButton();
    await this.taskFormPage.waitForScreen();
  }

  private async deleteAllTasksFromHome(): Promise<void> {
    const maxTasksToDelete = 20;

    for (
      let deletedCount = 0;
      deletedCount < maxTasksToDelete;
      deletedCount += 1
    ) {
      if (!(await this.homePage.isTaskVisible(0))) {
        return;
      }

      await this.openTaskDetails(0);
      await this.taskDetailsPage.confirmDelete();
      await this.homePage.waitForScreen();
    }

    throw new Error('Task cleanup exceeded 20 tasks');
  }

  private async navigateToHome(): Promise<void> {
    if (await this.homePage.isDisplayed()) {
      return;
    }

    if (await this.taskFormPage.isDisplayed()) {
      await this.taskFormPage.tapBackButton();
    }

    if (await this.taskDetailsPage.isDisplayed()) {
      await this.taskDetailsPage.tapHomeButton();
    }

    await this.homePage.waitForScreen();
  }
}
