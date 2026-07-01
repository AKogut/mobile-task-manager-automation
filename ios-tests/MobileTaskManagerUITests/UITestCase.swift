import XCTest

class UITestCase: XCTestCase {
  var app: XCUIApplication!

  override func setUpWithError() throws {
    continueAfterFailure = false
    app = XCUIApplication()
    app.launchArguments = ["-uitest"]
    app.launch()
  }

  override func tearDownWithError() throws {
    if let testRun, testRun.failureCount > 0 {
      let attachment = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
      attachment.lifetime = .keepAlways
      add(attachment)
    }
    app = nil
  }

  @discardableResult
  func signInToHome(
    file: StaticString = #filePath,
    line: UInt = #line,
  ) -> HomeScreen {
    LoginScreen(app: app).login(
      email: DemoCredentials.email,
      password: DemoCredentials.password,
    )
    let home = HomeScreen(app: app)
    XCTAssertTrue(
      home.waitForScreen(),
      "Expected the Home screen after signing in.",
      file: file,
      line: line,
    )
    return home
  }
}
