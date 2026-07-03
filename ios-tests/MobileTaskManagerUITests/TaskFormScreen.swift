import XCTest

struct TaskFormScreen {
  let app: XCUIApplication

  var screen: XCUIElement { app.element(withId: TestIds.taskFormScreen) }
  var titleField: XCUIElement { app.element(withId: TestIds.taskTitleInput) }
  var descriptionField: XCUIElement { app.element(withId: TestIds.taskDescriptionInput) }
  var dueDateField: XCUIElement { app.element(withId: TestIds.taskDueDateInput) }
  var submitButton: XCUIElement { app.element(withId: TestIds.taskSubmitButton) }
  var backButton: XCUIElement { app.element(withId: TestIds.taskFormBackButton) }
  var titleError: XCUIElement { app.element(withId: TestIds.taskTitleError) }
  var dueDateError: XCUIElement { app.element(withId: TestIds.taskDueDateError) }

  @discardableResult
  func waitForScreen(timeout: TimeInterval = 30) -> Bool {
    screen.waitForExistence(timeout: timeout)
  }

  func setTitle(_ text: String) {
    titleField.replaceText(text)
  }

  func setDescription(_ text: String) {
    descriptionField.replaceText(text)
  }

  func titleValue() -> String {
    titleField.value as? String ?? ""
  }

  func descriptionValue() -> String {
    descriptionField.value as? String ?? ""
  }

  func dueDateValue() -> String {
    dueDateField.value as? String ?? ""
  }

  func selectPriority(_ value: String) {
    app.element(withId: TestIds.testIdForPriority(value)).tap()
  }

  func isPrioritySelected(_ value: String) -> Bool {
    app.element(withId: TestIds.testIdForPriority(value)).isSelected
  }

  func isTitleErrorVisible(timeout: TimeInterval = 5) -> Bool {
    guard titleError.waitForExistence(timeout: timeout) else {
      return false
    }
    return !titleError.label.isEmpty
  }

  func isDueDateErrorVisible(timeout: TimeInterval = 5) -> Bool {
    guard dueDateError.waitForExistence(timeout: timeout) else {
      return false
    }
    return !dueDateError.label.isEmpty
  }

  func selectQuickDate(_ option: String) {
    app.element(withId: TestIds.testIdForDueDateOption(option)).tap()
  }

  func submit() {
    submitButton.tap()
  }

  func tapBack() {
    backButton.tap()
  }

  func fillAndSubmit(
    title: String,
    description: String? = nil,
    priority: String,
    quickDate: String,
  ) {
    setTitle(title)
    if let description {
      setDescription(description)
    }
    selectPriority(priority)
    selectQuickDate(quickDate)
    submit()
  }
}
