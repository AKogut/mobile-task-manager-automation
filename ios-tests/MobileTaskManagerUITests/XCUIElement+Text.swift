import XCTest

extension XCUIElement {
  func replaceText(_ text: String, masked: Bool = false) {
    _ = waitForExistence(timeout: 10)

    for attempt in 1...4 {
      tap()
      clearText()
      if attempt <= 2 {
        typeText(text)
      } else {
        for character in text {
          typeText(String(character))
        }
      }

      if hasEntered(text, masked: masked) || attempt == 4 {
        return
      }
    }
  }

  private func hasEntered(_ text: String, masked: Bool) -> Bool {
    let raw = (value as? String) ?? ""
    let current = raw == placeholderValue ? "" : raw
    return masked ? current.count == text.count : current == text
  }

  private func clearText() {
    let current = (value as? String) ?? ""
    guard !current.isEmpty, current != placeholderValue else {
      return
    }
    typeText(String(repeating: XCUIKeyboardKey.delete.rawValue, count: current.count))
  }
}
