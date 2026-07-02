import XCTest

final class TaskEditUITests: UITestCase {
  @discardableResult
  private func createSampleTask() -> TaskDetailsScreen {
    let home = signInToHome()
    home.tapAddTask()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen())
    form.fillAndSubmit(
      title: "Buy groceries",
      description: "Milk, eggs, and bread",
      priority: "high",
      quickDate: "tomorrow",
    )

    let details = TaskDetailsScreen(app: app)
    XCTAssertTrue(details.waitForScreen())
    return details
  }

  func test_TC_TASK_020_editFormIsPrePopulated() {
    let details = createSampleTask()
    details.tapEdit()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen(), "The edit form should open.")
    XCTAssertEqual(form.titleValue(), "Buy groceries")
    XCTAssertEqual(form.descriptionValue(), "Milk, eggs, and bread")
    XCTAssertFalse(
      form.dueDateValue().isEmpty,
      "The due date should be pre-filled on the edit form.",
    )
  }

  func test_TC_TASK_021_editTitleAndSave() {
    let details = createSampleTask()
    details.tapEdit()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen())
    form.setTitle("Updated task title")
    form.submit()

    XCTAssertTrue(
      details.waitForScreen(),
      "Task details should be shown after saving the edit.",
    )
    XCTAssertEqual(details.title.label, "Updated task title")
  }
}
