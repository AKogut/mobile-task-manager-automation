import XCTest

extension XCUIElement {
  func replaceText(_ text: String, masked: Bool = false) {
    _ = waitForExistence(timeout: 10)

    for attempt in 1...3 {
      tap()
      clearText()
      typeText(text)

      let current = (value as? String) ?? ""
      let entered = masked ? current.count == text.count : current == text
      if entered || attempt == 3 {
        return
      }
    }
  }

  private func clearText() {
    let current = (value as? String) ?? ""
    guard !current.isEmpty, current != placeholderValue else {
      return
    }
    typeText(String(repeating: XCUIKeyboardKey.delete.rawValue, count: current.count))
  }
}
