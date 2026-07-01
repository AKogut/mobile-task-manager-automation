import XCTest

final class TaskCreationUITests: UITestCase {
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
}
