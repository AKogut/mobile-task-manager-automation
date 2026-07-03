import XCTest

final class TaskCompleteUITests: UITestCase {
  func test_TC_TASK_013_completeTaskFromDetails() {
    let details = createSampleTask(
      title: "Buy groceries",
      description: "",
      priority: "medium",
      quickDate: "today",
    )

    XCTAssertEqual(details.statusText.label, "Open")
    XCTAssertEqual(details.completeButtonText(), "Complete task")

    details.tapComplete()
    XCTAssertTrue(details.waitForStatus("Completed"))
    XCTAssertEqual(details.completeButtonText(), "Reopen task")
  }

  func test_TC_TASK_014_reopenTaskFromDetails() {
    let details = createSampleTask(
      title: "Buy groceries",
      description: "",
      priority: "medium",
      quickDate: "today",
    )

    details.tapComplete()
    XCTAssertTrue(details.waitForStatus("Completed"))
    XCTAssertEqual(details.completeButtonText(), "Reopen task")

    details.tapComplete()
    XCTAssertTrue(details.waitForStatus("Open"))
    XCTAssertEqual(details.statusText.label, "Open")
    XCTAssertEqual(details.completeButtonText(), "Complete task")
  }

  func test_TC_TASK_015_completeTaskViaListCheckbox() {
    let details = createSampleTask(
      title: "Buy groceries",
      description: "",
      priority: "medium",
      quickDate: "today",
    )
    details.tapHome()

    let home = HomeScreen(app: app)
    XCTAssertTrue(home.waitForScreen())

    home.toggleTask(at: 0)
    XCTAssertTrue(home.waitForTaskCompleted(at: 0, completed: true))
    XCTAssertTrue(home.taskMetadata(at: 0).label.contains("Completed"))
    XCTAssertEqual(home.taskTitle(at: 0).label, "Buy groceries")
  }

  func test_TC_TASK_016_reopenTaskViaListCheckbox() {
    let details = createSampleTask(
      title: "Buy groceries",
      description: "",
      priority: "medium",
      quickDate: "today",
    )
    details.tapHome()

    let home = HomeScreen(app: app)
    XCTAssertTrue(home.waitForScreen())

    home.toggleTask(at: 0)
    XCTAssertTrue(home.waitForTaskCompleted(at: 0, completed: true))

    home.toggleTask(at: 0)
    XCTAssertTrue(home.waitForTaskCompleted(at: 0, completed: false))
    XCTAssertFalse(home.taskMetadata(at: 0).label.contains("Completed"))
  }
}
