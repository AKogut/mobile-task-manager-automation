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

  func test_TC_AUTH_003_unregisteredEmailShowsError() {
    let login = LoginScreen(app: app)
    login.login(email: "unknown@example.com", password: DemoCredentials.password)

    XCTAssertTrue(
      login.errorBanner.waitForExistence(timeout: 10),
      "An auth error banner should appear for an unregistered email.",
    )
    XCTAssertTrue(
      login.screen.exists,
      "The user should remain on the login screen.",
    )
  }

  func test_TC_AUTH_004_emptyEmailIsBlocked() {
    let login = LoginScreen(app: app)
    login.login(email: "", password: DemoCredentials.password)

    XCTAssertTrue(
      login.emailError.waitForExistence(timeout: 10),
      "An email validation error should be shown when the email is empty.",
    )
    XCTAssertTrue(login.screen.exists, "The user should remain on the login screen.")
    XCTAssertFalse(
      app.element(withId: TestIds.mainScreen).exists,
      "The home screen must not be shown.",
    )
  }

  func test_TC_AUTH_005_emptyPasswordIsBlocked() {
    let login = LoginScreen(app: app)
    login.login(email: DemoCredentials.email, password: "")

    XCTAssertTrue(
      login.passwordError.waitForExistence(timeout: 10),
      "A password validation error should be shown when the password is empty.",
    )
    XCTAssertTrue(login.screen.exists, "The user should remain on the login screen.")
    XCTAssertFalse(
      app.element(withId: TestIds.mainScreen).exists,
      "The home screen must not be shown.",
    )
  }

  func test_TC_AUTH_006_invalidEmailFormatIsBlocked() {
    let login = LoginScreen(app: app)
    login.login(email: "not-an-email", password: DemoCredentials.password)

    XCTAssertTrue(
      login.emailError.waitForExistence(timeout: 10),
      "An email validation error should be shown for an invalid email format.",
    )
    XCTAssertTrue(login.screen.exists, "The user should remain on the login screen.")
  }

  func test_TC_AUTH_007_errorBannerClearsOnEdit() {
    let login = LoginScreen(app: app)
    login.login(email: DemoCredentials.email, password: "WrongPassword!")

    XCTAssertTrue(
      login.errorBanner.waitForExistence(timeout: 10),
      "An auth error banner should appear for a wrong password.",
    )

    login.typeEmail("d")

    let banner = login.errorBanner
    let predicate = NSPredicate(format: "exists == false")
    let expectation = XCTNSPredicateExpectation(predicate: predicate, object: banner)
    XCTAssertEqual(
      XCTWaiter().wait(for: [expectation], timeout: 10),
      .completed,
      "The auth error banner should disappear once the user edits an input.",
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

  func test_TC_AUTH_010_settingsShowsAccountInfo() {
    let home = signInToHome()

    home.openSettings()
    let settings = SettingsScreen(app: app)
    XCTAssertTrue(settings.waitForScreen(), "The settings screen should open.")
    XCTAssertTrue(settings.accountName.exists, "The account name should be displayed.")
    XCTAssertEqual(
      settings.accountEmail.label,
      DemoCredentials.email,
      "The settings screen should show the demo account email.",
    )
  }

  func test_TC_AUTH_011_sessionPersistsAfterRestart() {
    let login = LoginScreen(app: app)
    login.login(email: DemoCredentials.email, password: DemoCredentials.password)

    let home = HomeScreen(app: app)
    XCTAssertTrue(home.waitForScreen(), "A valid login should reach the home screen.")

    app.terminate()
    app.launchArguments = []
    app.launch()

    XCTAssertTrue(
      home.waitForScreen(),
      "A previously authenticated session should persist across an app restart.",
    )
    XCTAssertFalse(
      login.screen.exists,
      "The login screen should not be shown to a persisted session.",
    )
  }
}
