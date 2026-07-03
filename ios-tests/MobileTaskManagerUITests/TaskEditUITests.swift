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

  func test_TC_TASK_022_editPriorityAndSave() {
    let details = createSampleTask(
      title: "Low priority task",
      description: "",
      priority: "low",
      quickDate: "today",
    )
    details.tapEdit()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen())
    form.selectPriority("high")
    form.submit()

    XCTAssertTrue(details.waitForScreen())
    XCTAssertEqual(details.priorityText.label, "High priority")
  }

  func test_TC_TASK_023_editDescriptionAndSave() {
    let details = createSampleTask(
      title: "No description task",
      description: "",
      priority: "medium",
      quickDate: "today",
    )
    details.tapEdit()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen())
    form.setDescription("Added after creation")
    form.submit()

    XCTAssertTrue(details.waitForScreen())
    XCTAssertEqual(details.descriptionText.label, "Added after creation")
  }

  func test_TC_TASK_024_editedTaskReflectsInList() {
    let details = createSampleTask(
      title: "Old title",
      description: "",
      priority: "high",
      quickDate: "today",
    )
    details.tapEdit()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen())
    form.setTitle("New title")
    form.submit()

    XCTAssertTrue(details.waitForScreen())
    details.tapHome()

    let home = HomeScreen(app: app)
    XCTAssertTrue(home.waitForScreen())
    XCTAssertTrue(
      home.isTaskVisible(titled: "New title"),
      "The edited task should appear with its new title.",
    )
    XCTAssertFalse(
      home.isTaskVisible(titled: "Old title"),
      "The old title should no longer appear in the list.",
    )
  }

  func test_TC_TASK_025_editBlockedWhenTitleCleared() {
    let details = createSampleTask()
    details.tapEdit()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen())
    form.setTitle("")
    form.submit()

    XCTAssertTrue(
      form.isTitleErrorVisible(),
      "A title validation error should be shown when the title is cleared.",
    )
    XCTAssertTrue(form.screen.exists, "The user should remain on the edit form.")
    XCTAssertFalse(
      app.element(withId: TestIds.taskDetailsScreen).exists,
      "The edit should not be saved.",
    )
  }
}
