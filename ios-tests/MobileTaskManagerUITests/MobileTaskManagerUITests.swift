import XCTest

final class MobileTaskManagerUITests: XCTestCase {
  private var app: XCUIApplication!

  override func setUpWithError() throws {
    continueAfterFailure = false
    app = XCUIApplication()
    app.launchArguments = ["-uitest"]
    app.launch()
  }

  override func tearDownWithError() throws {
    app = nil
  }

  private func element(_ identifier: String) -> XCUIElement {
    app.descendants(matching: .any)[identifier]
  }

  func test_TC_AUTH_012_unauthenticatedUserLandsOnLoginScreen() throws {
    XCTAssertTrue(
      element("login-screen").waitForExistence(timeout: 30),
      "A clean -uitest launch should present the login screen.",
    )
    XCTAssertTrue(
      element("login-email-input").exists,
      "testID login-email-input should map to an accessibility identifier.",
    )
    XCTAssertFalse(
      element("main-screen").exists,
      "The home screen must not be shown to an unauthenticated user.",
    )
  }

  func test_TC_AUTH_008_demoCredentialsCardIsVisibleOnLoginScreen() throws {
    XCTAssertTrue(
      element("demo-credentials-card").waitForExistence(timeout: 30),
      "The demo credentials card should be visible on the login screen.",
    )
    XCTAssertTrue(
      element("demo-credentials-email").exists,
      "testID demo-credentials-email should map to an accessibility identifier.",
    )
    XCTAssertTrue(
      element("demo-credentials-password").exists,
      "testID demo-credentials-password should map to an accessibility identifier.",
    )
  }
}
