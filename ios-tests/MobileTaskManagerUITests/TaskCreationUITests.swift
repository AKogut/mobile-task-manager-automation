import XCTest

final class TaskCreationUITests: UITestCase {
  private func formattedDate(daysFromToday: Int) -> String {
    let calendar = Calendar.current
    let date = calendar.date(byAdding: .day, value: daysFromToday, to: Date())!
    let formatter = DateFormatter()
    formatter.calendar = calendar
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter.string(from: date)
  }

  private func openAddTaskForm() -> TaskFormScreen {
    let home = signInToHome()
    home.tapAddTask()
    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen(), "The task form should open.")
    return form
  }

  func test_TC_TASK_001_createTaskWithAllFields() {
    let home = signInToHome()
    home.tapAddTask()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen(), "The task form should open.")
    form.fillAndSubmit(
      title: "Buy groceries",
      description: "Milk, eggs, and bread",
      priority: "high",
      quickDate: "tomorrow",
    )

    let details = TaskDetailsScreen(app: app)
    XCTAssertTrue(
      details.waitForScreen(),
      "Task details should be shown after submitting the form.",
    )
    XCTAssertEqual(details.title.label, "Buy groceries")
    XCTAssertEqual(details.descriptionText.label, "Milk, eggs, and bread")
    XCTAssertEqual(details.priorityText.label, "High priority")
    XCTAssertEqual(details.statusText.label, "Open")
  }

  func test_TC_TASK_003_newTaskAppearsInList() {
    let home = signInToHome()
    home.tapAddTask()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen())
    form.fillAndSubmit(
      title: "New list task",
      priority: "medium",
      quickDate: "next-week",
    )

    let details = TaskDetailsScreen(app: app)
    XCTAssertTrue(details.waitForScreen())
    details.tapHome()

    XCTAssertTrue(home.waitForScreen(), "Should return to the Home screen.")
    XCTAssertTrue(
      home.isTaskVisible(titled: "New list task"),
      "The newly created task should appear in the list.",
    )
  }

  func test_TC_TASK_002_createTaskWithMinimumRequiredFields() {
    let home = signInToHome()
    home.tapAddTask()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen())
    form.fillAndSubmit(
      title: "Minimal task",
      priority: "low",
      quickDate: "today",
    )

    let details = TaskDetailsScreen(app: app)
    XCTAssertTrue(details.waitForScreen())
    XCTAssertEqual(details.title.label, "Minimal task")
    XCTAssertEqual(details.descriptionText.label, "No description provided.")
    XCTAssertEqual(details.priorityText.label, "Low priority")
  }

  func test_TC_TASK_004_creationBlockedWhenTitleIsEmpty() {
    let form = openAddTaskForm()

    form.selectPriority("medium")
    form.selectQuickDate("today")
    form.submit()

    XCTAssertTrue(
      form.isTitleErrorVisible(),
      "A title validation error should be shown when the title is empty.",
    )
    XCTAssertTrue(form.screen.exists, "The user should remain on the task form.")
    XCTAssertFalse(
      app.element(withId: TestIds.taskDetailsScreen).exists,
      "No task details should be shown.",
    )
  }

  func test_TC_TASK_005_creationBlockedWhenTitleExceeds80Characters() {
    let form = openAddTaskForm()

    form.setTitle(String(repeating: "A", count: 81))
    form.selectPriority("low")
    form.selectQuickDate("today")
    form.submit()

    XCTAssertTrue(
      form.isTitleErrorVisible(),
      "A title validation error should be shown for an over-long title.",
    )
    XCTAssertTrue(form.screen.exists, "The user should remain on the task form.")
    XCTAssertFalse(
      app.element(withId: TestIds.taskDetailsScreen).exists,
      "No task details should be shown.",
    )
  }

  func test_TC_TASK_006_creationBlockedWhenNoDueDate() {
    let form = openAddTaskForm()

    form.setTitle("No date task")
    form.selectPriority("medium")
    form.submit()

    XCTAssertTrue(
      form.isDueDateErrorVisible(),
      "A due date validation error should be shown when no due date is selected.",
    )
    XCTAssertTrue(form.screen.exists, "The user should remain on the task form.")
    XCTAssertFalse(
      app.element(withId: TestIds.taskDetailsScreen).exists,
      "No task details should be shown.",
    )
  }

  func test_TC_TASK_007_quickSelectTodaySetsDueDate() {
    let form = openAddTaskForm()
    let expected = formattedDate(daysFromToday: 0)

    form.selectQuickDate("today")

    XCTAssertEqual(form.dueDateValue(), expected)
  }

  func test_TC_TASK_008_quickSelectTomorrowSetsDueDate() {
    let form = openAddTaskForm()
    let expected = formattedDate(daysFromToday: 1)

    form.selectQuickDate("tomorrow")

    XCTAssertEqual(form.dueDateValue(), expected)
  }

  func test_TC_TASK_009_quickSelectNextWeekSetsDueDate() {
    let form = openAddTaskForm()
    let expected = formattedDate(daysFromToday: 7)

    form.selectQuickDate("next-week")

    XCTAssertEqual(form.dueDateValue(), expected)
  }
}
