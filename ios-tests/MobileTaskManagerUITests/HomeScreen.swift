import XCTest

struct HomeScreen {
  let app: XCUIApplication

  var screen: XCUIElement { app.element(withId: TestIds.mainScreen) }
  var searchField: XCUIElement { app.element(withId: TestIds.taskSearchInput) }
  var addButton: XCUIElement { app.element(withId: TestIds.taskAddButton) }
  var settingsButton: XCUIElement { app.element(withId: TestIds.settingsOpenButton) }
  var taskListTitle: XCUIElement { app.element(withId: TestIds.taskListTitle) }
  var noResultsCard: XCUIElement { app.element(withId: TestIds.taskNoResultsCard) }
  var emptyStateCard: XCUIElement { app.element(withId: TestIds.taskEmptyStateCard) }
  var activeFiltersCount: XCUIElement { app.element(withId: TestIds.taskActiveFiltersCount) }

  @discardableResult
  func waitForScreen(timeout: TimeInterval = 30) -> Bool {
    screen.waitForExistence(timeout: timeout)
  }

  func search(_ query: String) {
    searchField.tap()
    searchField.typeText(query)
  }

  func tapAddTask() {
    addButton.tap()
  }

  func openSettings() {
    settingsButton.tap()
  }

  func selectStatusFilter(_ value: String) {
    app.element(withId: TestIds.testIdForStatusFilter(value)).tap()
  }

  func selectPriorityFilter(_ value: String) {
    app.element(withId: TestIds.testIdForPriorityFilter(value)).tap()
  }

  func selectSort(_ value: String) {
    app.element(withId: TestIds.testIdForTaskSort(value)).tap()
  }

  func taskRow(at index: Int) -> XCUIElement {
    app.element(withId: TestIds.testIdForTask(index))
  }

  func taskTitle(at index: Int) -> XCUIElement {
    app.element(withId: "\(TestIds.taskItemTitle)-\(index)")
  }

  func toggle(at index: Int) -> XCUIElement {
    app.element(withId: "\(TestIds.taskToggleButton)-\(index)")
  }

  func openTask(at index: Int) {
    taskRow(at: index).tap()
  }

  func isTaskVisible(titled title: String) -> Bool {
    app.staticTexts[title].exists
  }

  func visibleTaskCount() -> Int {
    let label = taskListTitle.label
    guard let range = label.range(of: #"\d+ of"#, options: .regularExpression) else {
      return 0
    }
    let digits = label[range].prefix { $0.isNumber }
    return Int(digits) ?? 0
  }
}
