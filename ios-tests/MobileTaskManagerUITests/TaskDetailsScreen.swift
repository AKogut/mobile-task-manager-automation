import XCTest

struct TaskDetailsScreen {
  let app: XCUIApplication

  var screen: XCUIElement { app.element(withId: TestIds.taskDetailsScreen) }
  var title: XCUIElement { app.element(withId: TestIds.taskDetailsTitle) }
  var descriptionText: XCUIElement { app.element(withId: TestIds.taskDetailsDescription) }
  var statusText: XCUIElement { app.element(withId: TestIds.taskDetailsStatusText) }
  var priorityText: XCUIElement { app.element(withId: TestIds.taskDetailsPriorityText) }
  var completeButton: XCUIElement { app.element(withId: TestIds.taskDetailsCompleteButton) }
  var editButton: XCUIElement { app.element(withId: TestIds.taskDetailsEditButton) }
  var deleteButton: XCUIElement { app.element(withId: TestIds.taskDetailsDeleteButton) }
  var homeButton: XCUIElement { app.element(withId: TestIds.taskDetailsHomeButton) }

  @discardableResult
  func waitForScreen(timeout: TimeInterval = 30) -> Bool {
    screen.waitForExistence(timeout: timeout)
  }

  func tapComplete() {
    completeButton.tap()
  }

  func completeButtonText() -> String {
    completeButton.label.lowercased().contains("incomplete")
      ? "Reopen task"
      : "Complete task"
  }

  @discardableResult
  func waitForStatus(_ expected: String, timeout: TimeInterval = 10) -> Bool {
    let predicate = NSPredicate(format: "label == %@", expected)
    let expectation = XCTNSPredicateExpectation(predicate: predicate, object: statusText)
    return XCTWaiter().wait(for: [expectation], timeout: timeout) == .completed
  }

  func tapEdit() {
    editButton.tap()
  }

  func tapHome() {
    homeButton.tap()
  }

  var deleteAlert: XCUIElement {
    app.alerts["Delete task?"]
  }

  var confirmDeleteButton: XCUIElement {
    deleteAlert.buttons["Delete"]
  }

  var cancelDeleteButton: XCUIElement {
    deleteAlert.buttons["Cancel"]
  }

  func tapDelete() {
    deleteButton.tap()
  }

  @discardableResult
  func openDeleteDialog(timeout: TimeInterval = 10) -> Bool {
    tapDelete()
    return deleteAlert.waitForExistence(timeout: timeout)
  }

  func confirmDelete() {
    _ = openDeleteDialog()
    confirmDeleteButton.tap()
  }

  func cancelDelete() {
    _ = openDeleteDialog()
    cancelDeleteButton.tap()
  }
}
