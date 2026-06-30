import XCTest

final class MobileTaskManagerUITests: UITestCase {
  func test_TC_AUTH_012_unauthenticatedUserLandsOnLoginScreen() {
    let login = LoginScreen(app: app)

    XCTAssertTrue(
      login.waitForScreen(),
      "A clean -uitest launch should present the login screen.",
    )
    XCTAssertTrue(
      login.emailField.exists,
      "testID login-email-input should map to an accessibility identifier.",
    )
    XCTAssertFalse(
      app.descendants(matching: .any)[TestIds.mainScreen].exists,
      "The home screen must not be shown to an unauthenticated user.",
    )
  }

  func test_TC_AUTH_008_demoCredentialsCardIsVisibleOnLoginScreen() {
    let login = LoginScreen(app: app)

    XCTAssertTrue(
      login.demoCredentialsCard.waitForExistence(timeout: 30),
      "The demo credentials card should be visible on the login screen.",
    )
    XCTAssertTrue(
      login.demoEmail.exists,
      "testID demo-credentials-email should map to an accessibility identifier.",
    )
    XCTAssertTrue(
      login.demoPassword.exists,
      "testID demo-credentials-password should map to an accessibility identifier.",
    )
  }
}
