import XCTest

struct SettingsScreen {
  let app: XCUIApplication

  var screen: XCUIElement { app.element(withId: TestIds.settingsScreen) }
  var title: XCUIElement { app.element(withId: TestIds.settingsTitle) }
  var accountName: XCUIElement { app.element(withId: TestIds.settingsAccountName) }
  var accountEmail: XCUIElement { app.element(withId: TestIds.settingsAccountEmail) }
  var logoutButton: XCUIElement { app.element(withId: TestIds.logoutButton) }
  var backButton: XCUIElement { app.element(withId: TestIds.settingsBackButton) }

  @discardableResult
  func waitForScreen(timeout: TimeInterval = 30) -> Bool {
    screen.waitForExistence(timeout: timeout)
  }

  func tapLogout() {
    logoutButton.tap()
  }

  func tapBack() {
    backButton.tap()
  }
}
