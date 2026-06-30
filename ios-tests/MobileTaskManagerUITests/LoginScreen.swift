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
    emailField.tap()
    emailField.typeText(email)
    passwordField.tap()
    passwordField.typeText(password)
    submitButton.tap()
  }

  func isErrorVisible() -> Bool {
    errorBanner.exists
  }

  func errorText() -> String {
    errorMessage.label
  }
}
