import XCTest

final class TaskEditUITests: UITestCase {
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
