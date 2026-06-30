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
}
