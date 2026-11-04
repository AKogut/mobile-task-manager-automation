import XCTest

extension XCUIElement {
  var enteredText: String {
    let raw = (value as? String) ?? ""
    return raw == placeholderValue ? "" : raw
  }

  func replaceText(_ text: String, masked: Bool = false) {
    _ = waitForExistence(timeout: 10)

    for attempt in 1...4 {
      tap()
      clearText()
      for character in text {
        typeText(String(character))
      }

      if hasEntered(text, masked: masked) || attempt == 4 {
        return
      }
    }
  }

  private func hasEntered(_ text: String, masked: Bool) -> Bool {
    let current = enteredText
    return masked ? current.count == text.count : current == text
  }

  private func clearText() {
    let current = enteredText
    guard !current.isEmpty else {
      return
    }
    typeText(String(repeating: XCUIKeyboardKey.delete.rawValue, count: current.count))
  }
}
