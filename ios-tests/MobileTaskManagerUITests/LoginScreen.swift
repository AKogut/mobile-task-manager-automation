import XCTest

struct LoginScreen {
  let app: XCUIApplication

  var screen: XCUIElement {
    app.descendants(matching: .any)[TestIds.loginScreen]
  }

  var emailField: XCUIElement {
    app.textFields[TestIds.loginEmailInput]
  }

  var passwordField: XCUIElement {
    app.secureTextFields[TestIds.loginPasswordInput]
  }

  var submitButton: XCUIElement {
    app.buttons[TestIds.loginSubmitButton]
  }

  var errorBanner: XCUIElement {
    app.descendants(matching: .any)[TestIds.authErrorBanner]
  }

  var errorMessage: XCUIElement {
    app.descendants(matching: .any)[TestIds.authErrorMessage]
  }

  var demoCredentialsCard: XCUIElement {
    app.descendants(matching: .any)[TestIds.demoCredentialsCard]
  }

  var demoEmail: XCUIElement {
    app.descendants(matching: .any)[TestIds.demoCredentialsEmail]
  }

  var demoPassword: XCUIElement {
    app.descendants(matching: .any)[TestIds.demoCredentialsPassword]
  }

  @discardableResult
  func waitForScreen(timeout: TimeInterval = 30) -> Bool {
    screen.waitForExistence(timeout: timeout)
  }

  func login(email: String, password: String) {
    _ = waitForScreen()
    enter(email, into: emailField)
    enter(password, into: passwordField, masked: true)
    submitButton.tap()
  }

  private func enter(
    _ text: String,
    into field: XCUIElement,
    masked: Bool = false,
  ) {
    _ = field.waitForExistence(timeout: 10)

    for attempt in 1...3 {
      field.tap()
      clear(field)
      field.typeText(text)

      let value = (field.value as? String) ?? ""
      let entered = masked ? value.count == text.count : value == text
      if entered || attempt == 3 {
        return
      }
    }
  }

  private func clear(_ field: XCUIElement) {
    let value = (field.value as? String) ?? ""
    guard !value.isEmpty, value != field.placeholderValue else {
      return
    }
    field.typeText(
      String(repeating: XCUIKeyboardKey.delete.rawValue, count: value.count),
    )
  }

  func isErrorVisible() -> Bool {
    errorBanner.exists
  }

  func errorText() -> String {
    errorMessage.label
  }
}
