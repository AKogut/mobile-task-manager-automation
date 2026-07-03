import XCTest

struct LoginScreen {
  let app: XCUIApplication

  var screen: XCUIElement { app.element(withId: TestIds.loginScreen) }
  var emailField: XCUIElement { app.textFields[TestIds.loginEmailInput] }
  var passwordField: XCUIElement { app.secureTextFields[TestIds.loginPasswordInput] }
  var submitButton: XCUIElement { app.buttons[TestIds.loginSubmitButton] }
  var errorBanner: XCUIElement { app.element(withId: TestIds.authErrorBanner) }
  var errorMessage: XCUIElement { app.element(withId: TestIds.authErrorMessage) }
  var demoCredentialsCard: XCUIElement { app.element(withId: TestIds.demoCredentialsCard) }
  var demoEmail: XCUIElement { app.element(withId: TestIds.demoCredentialsEmail) }
  var demoPassword: XCUIElement { app.element(withId: TestIds.demoCredentialsPassword) }

  @discardableResult
  func waitForScreen(timeout: TimeInterval = 30) -> Bool {
    screen.waitForExistence(timeout: timeout)
  }

  func login(email: String, password: String) {
    _ = waitForScreen()
    emailField.replaceText(email)
    passwordField.replaceText(password, masked: true)
    submitButton.tap()
  }

  func isErrorVisible() -> Bool {
    errorBanner.exists
  }

  func errorText() -> String {
    errorMessage.label
  }
}
