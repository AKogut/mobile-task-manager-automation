import XCTest

class UITestCase: XCTestCase {
  var app: XCUIApplication!

  override func setUpWithError() throws {
    continueAfterFailure = false
    app = XCUIApplication()
    app.launchArguments = ["-uitest"]
    app.launch()
  }

  func relaunchAuthenticated() {
    app.terminate()
    app.launchArguments = ["-uitest", "-uitest-authed"]
    app.launch()
  }

  func restartApp() {
    app.terminate()
    app.launchArguments = []
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
    relaunchAuthenticated()
    let home = HomeScreen(app: app)
    XCTAssertTrue(
      home.waitForScreen(),
      "Expected the Home screen after signing in.",
      file: file,
      line: line,
    )
    return home
  }

  @discardableResult
  func launchWithSeededTasks(
    _ tasks: [SeededTask],
    file: StaticString = #filePath,
    line: UInt = #line,
  ) throws -> HomeScreen {
    let seed = try JSONEncoder().encode(tasks)
    app.terminate()
    app.launchArguments = [
      "-uitest",
      "-uitest-authed",
      "-uitest-tasks",
      String(decoding: seed, as: UTF8.self),
    ]
    app.launch()

    let home = HomeScreen(app: app)
    XCTAssertTrue(
      home.waitForScreen(),
      "Expected the Home screen after a seeded launch.",
      file: file,
      line: line,
    )
    XCTAssertTrue(
      home.waitForVisibleTaskCount(tasks.count),
      "Expected every seeded task in the list.",
      file: file,
      line: line,
    )
    return home
  }

  @discardableResult
  func createSampleTask(
    title: String = "Buy groceries",
    description: String = "Milk, eggs, and bread",
    priority: String = "high",
    quickDate: String = "tomorrow",
  ) -> TaskDetailsScreen {
    let home = signInToHome()
    return addTaskFromHome(
      home,
      title: title,
      description: description,
      priority: priority,
      quickDate: quickDate,
    )
  }

  @discardableResult
  func addTaskFromHome(
    _ home: HomeScreen,
    title: String,
    description: String? = nil,
    priority: String,
    quickDate: String = "today",
  ) -> TaskDetailsScreen {
    home.tapAddTask()

    let form = TaskFormScreen(app: app)
    XCTAssertTrue(form.waitForScreen())
    form.fillAndSubmit(
      title: title,
      description: description,
      priority: priority,
      quickDate: quickDate,
    )

    let details = TaskDetailsScreen(app: app)
    XCTAssertTrue(details.waitForScreen())
    return details
  }

  @discardableResult
  func seedTasks(_ specs: [TaskSpec]) -> HomeScreen {
    let home = signInToHome()
    for spec in specs {
      let details = addTaskFromHome(
        home,
        title: spec.title,
        priority: spec.priority,
        quickDate: spec.quickDate,
      )
      if spec.completed {
        details.tapComplete()
        XCTAssertTrue(details.waitForStatus("Completed"))
      }
      details.tapHome()
      XCTAssertTrue(home.waitForScreen())
    }
    return home
  }
}

struct TaskSpec {
  let title: String
  let priority: String
  var quickDate: String = "today"
  var completed: Bool = false
}

struct SeededTask: Encodable {
  let id: String
  let title: String
  let description: String
  let priority: String
  let dueDate: String
  let completed: Bool
  let createdAt: String

  init(
    title: String,
    description: String = "",
    priority: String = "medium",
    dueDate: String = "2026-06-01",
    completed: Bool = false,
    createdAt: String = "2026-01-01T09:00:00.000Z",
  ) {
    id = "seed-\(title)"
    self.title = title
    self.description = description
    self.priority = priority
    self.dueDate = dueDate
    self.completed = completed
    self.createdAt = createdAt
  }
}
