import XCTest

final class NavigationUITests: UITestCase {
  private let sampleTask = SeededTask(
    title: "Plan sprint review",
    description: "Agenda and demo order",
    priority: "high",
    dueDate: "2026-06-15",
  )

  func test_TC_NAV_001_tappingTaskCardNavigatesToTaskDetails() throws {
    let home = try launchWithSeededTasks([
      sampleTask,
      SeededTask(title: "Review pull requests", dueDate: "2026-06-20"),
    ])
    let tappedTitle = home.taskTitle(at: 0).label
    XCTAssertEqual(tappedTitle, "Plan sprint review")

    home.openTask(at: 0)

    let details = TaskDetailsScreen(app: app)
    XCTAssertTrue(details.waitForScreen())
    XCTAssertEqual(details.title.label, tappedTitle)
  }

  func test_TC_NAV_002_newTaskButtonOnHomeNavigatesToAddTask() {
    let home = signInToHome()

    home.tapAddTask()

    assertEmptyAddTaskForm()
  }

  func test_TC_NAV_003_newTaskButtonOnTaskDetailsNavigatesToAddTask() throws {
    let details = try openDetailsOfSampleTask()

    details.tapAddTask()

    assertEmptyAddTaskForm()
  }

  func test_TC_NAV_004_editButtonOnTaskDetailsNavigatesToEditTask() throws {
    let details = try openDetailsOfSampleTask()

    details.tapEdit()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen())
    XCTAssertEqual(form.formTitle.label, "Edit task")
    XCTAssertEqual(form.titleValue(), "Plan sprint review")
    XCTAssertEqual(form.descriptionValue(), "Agenda and demo order")
    XCTAssertEqual(form.dueDateValue(), "2026-06-15")
    XCTAssertTrue(form.isPrioritySelected("high"))
  }

  func test_TC_NAV_005_homeButtonOnTaskDetailsNavigatesToHome() throws {
    let details = try openDetailsOfSampleTask()
    let home = HomeScreen(app: app)
    XCTAssertTrue(home.screen.waitForNonExistence(timeout: 10))

    details.tapHome()

    XCTAssertTrue(home.waitForScreen())
    XCTAssertTrue(home.taskListTitle.exists)
    XCTAssertTrue(home.waitForTaskTitles(["Plan sprint review"]))
  }

  func test_TC_NAV_006_savingNewTaskNavigatesToTaskDetails() {
    let home = signInToHome()

    let details = addTaskFromHome(
      home,
      title: "Test navigation task",
      priority: "medium",
      quickDate: "today",
    )

    XCTAssertTrue(home.screen.waitForNonExistence(timeout: 10))
    XCTAssertEqual(details.title.label, "Test navigation task")
  }

  func test_TC_NAV_007_savingEditedTaskNavigatesToTaskDetails() throws {
    let details = try openDetailsOfSampleTask()
    details.tapEdit()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen())
    form.setTitle("Edited navigation task")
    form.submit()

    XCTAssertTrue(form.screen.waitForNonExistence(timeout: 10))
    XCTAssertTrue(details.waitForScreen())
    XCTAssertTrue(HomeScreen(app: app).screen.waitForNonExistence(timeout: 10))
    XCTAssertEqual(details.title.label, "Edited navigation task")
  }

  func test_TC_NAV_008_settingsBackButtonReturnsToHome() {
    let home = signInToHome()
    home.openSettings()

    let settings = SettingsScreen(app: app)
    XCTAssertTrue(settings.waitForScreen())
    XCTAssertTrue(home.screen.waitForNonExistence(timeout: 10))

    settings.tapBack()

    XCTAssertTrue(home.waitForScreen())
    XCTAssertTrue(settings.screen.waitForNonExistence(timeout: 10))
  }

  func test_TC_NAV_009_tasksPersistAfterAppRestart() {
    let home = seedTasks([
      TaskSpec(title: "Persist task 1", priority: "medium"),
      TaskSpec(title: "Persist task 2", priority: "high"),
    ])
    XCTAssertTrue(home.waitForVisibleTaskCount(2))

    restartApp()

    XCTAssertTrue(home.waitForScreen())
    XCTAssertTrue(home.waitForVisibleTaskCount(2))
    XCTAssertEqual(
      Set(home.visibleTaskTitles()),
      ["Persist task 1", "Persist task 2"],
    )
  }

  func test_TC_NAV_010_taskCompletionStatePersistsAfterAppRestart() throws {
    let home = try launchWithSeededTasks([
      SeededTask(title: "Persist complete"),
    ])
    home.toggleTask(at: 0)
    XCTAssertTrue(home.waitForTaskCompleted(at: 0, completed: true))

    restartApp()

    XCTAssertTrue(home.waitForScreen())
    home.selectStatusFilter("completed")
    XCTAssertTrue(home.waitForTaskTitles(["Persist complete"]))
    XCTAssertTrue(home.waitForTaskCompleted(at: 0, completed: true))
  }

  private func openDetailsOfSampleTask() throws -> TaskDetailsScreen {
    let home = try launchWithSeededTasks([sampleTask])
    home.openTask(at: 0)

    let details = TaskDetailsScreen(app: app)
    XCTAssertTrue(details.waitForScreen())
    return details
  }

  private func assertEmptyAddTaskForm(
    file: StaticString = #filePath,
    line: UInt = #line,
  ) {
    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen(), file: file, line: line)
    XCTAssertEqual(form.formTitle.label, "Add task", file: file, line: line)
    XCTAssertEqual(form.titleValue(), "", file: file, line: line)
    XCTAssertEqual(form.descriptionValue(), "", file: file, line: line)
    XCTAssertEqual(form.dueDateValue(), "", file: file, line: line)
  }
}
