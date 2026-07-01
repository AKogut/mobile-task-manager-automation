import XCTest

final class AuthFlowUITests: UITestCase {
  func test_TC_AUTH_001_validLoginNavigatesToHome() {
    let login = LoginScreen(app: app)
    login.login(email: DemoCredentials.email, password: DemoCredentials.password)

    let home = HomeScreen(app: app)
    XCTAssertTrue(
      home.waitForScreen(),
      "The home screen should appear after a valid login.",
    )
    XCTAssertFalse(
      login.errorBanner.exists,
      "No auth error should be shown after a valid login.",
    )
  }

  func test_TC_AUTH_002_invalidPasswordShowsError() {
    let login = LoginScreen(app: app)
    login.login(email: DemoCredentials.email, password: "WrongPassword!")

    XCTAssertTrue(
      login.errorBanner.waitForExistence(timeout: 10),
      "An auth error banner should appear for an incorrect password.",
    )
    XCTAssertTrue(
      login.screen.exists,
      "The user should remain on the login screen.",
    )
    XCTAssertFalse(
      app.element(withId: TestIds.mainScreen).exists,
      "The home screen must not be shown after a failed login.",
    )
  }

  func test_TC_AUTH_009_logoutReturnsToLogin() {
    let login = LoginScreen(app: app)
    login.login(email: DemoCredentials.email, password: DemoCredentials.password)

    let home = HomeScreen(app: app)
    XCTAssertTrue(home.waitForScreen())

    home.openSettings()
    let settings = SettingsScreen(app: app)
    XCTAssertTrue(settings.waitForScreen(), "The settings screen should open.")

    settings.tapLogout()
    XCTAssertTrue(
      login.waitForScreen(),
      "Logging out should return the user to the login screen.",
    )
  }
}
