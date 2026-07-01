import XCTest

extension XCUIApplication {
  func element(withId identifier: String) -> XCUIElement {
    descendants(matching: .any)[identifier]
  }
}
