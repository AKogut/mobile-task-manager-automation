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
    searchField.replaceText(query)
  }

  func clearSearch() {
    searchField.replaceText("")
  }

  func tapAddTask() {
    addButton.tap()
  }

  func openSettings() {
    settingsButton.tap()
  }

  func statusFilter(_ value: String) -> XCUIElement {
    app.element(withId: TestIds.testIdForStatusFilter(value))
  }

  func priorityFilter(_ value: String) -> XCUIElement {
    app.element(withId: TestIds.testIdForPriorityFilter(value))
  }

  func selectStatusFilter(_ value: String) {
    selectSegment(statusFilter(value))
  }

  func selectPriorityFilter(_ value: String) {
    selectSegment(priorityFilter(value))
  }

  private func selectSegment(_ element: XCUIElement) {
    _ = element.waitForExistence(timeout: 10)
    for _ in 0..<5 {
      if element.isSelected {
        return
      }
      element.tap()
    }
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

  func taskMetadata(at index: Int) -> XCUIElement {
    app.element(withId: "\(TestIds.taskItemMetadata)-\(index)")
  }

  func toggleTask(at index: Int) {
    toggle(at: index).tap()
  }

  func openTask(at index: Int) {
    taskRow(at: index).tap()
  }

  @discardableResult
  func waitForTaskCompleted(at index: Int, completed: Bool, timeout: TimeInterval = 10) -> Bool {
    let deadline = Date().addingTimeInterval(timeout)
    while Date() < deadline {
      let metadata = taskMetadata(at: index).label
      if metadata.contains("Completed") == completed {
        return true
      }
      usleep(300_000)
    }
    return false
  }

  func isTaskVisible(titled title: String) -> Bool {
    app.staticTexts[title].exists
  }

  func visibleTaskTitles(maxItems: Int = 20) -> [String] {
    var titles: [String] = []
    for index in 0..<maxItems {
      let element = taskTitle(at: index)
      guard element.exists else {
        break
      }
      titles.append(element.label)
    }
    return titles
  }

  func visibleTaskCount() -> Int {
    let label = taskListTitle.label
    guard let range = label.range(of: #"\d+ of"#, options: .regularExpression) else {
      return 0
    }
    let digits = label[range].prefix { $0.isNumber }
    return Int(digits) ?? 0
  }

  @discardableResult
  func waitForVisibleTaskCount(_ expected: Int, timeout: TimeInterval = 20) -> Bool {
    let deadline = Date().addingTimeInterval(timeout)
    while Date() < deadline {
      if visibleTaskCount() == expected {
        return true
      }
      usleep(400_000)
    }
    return visibleTaskCount() == expected
  }

  func isNoResultsCardVisible() -> Bool {
    noResultsCard.exists
  }

  func isEmptyStateVisible() -> Bool {
    emptyStateCard.exists
  }

  func activeFiltersCountText() -> String {
    activeFiltersCount.label
  }

  func isActiveFiltersBadgeVisible() -> Bool {
    activeFiltersCount.exists
  }
}
