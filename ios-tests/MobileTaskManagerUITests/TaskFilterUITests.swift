import XCTest

final class TaskFilterUITests: UITestCase {
  private let statusTasks = [
    TaskSpec(title: "Plan sprint review", priority: "medium"),
    TaskSpec(title: "Review pull requests", priority: "low"),
    TaskSpec(title: "Ship release notes", priority: "high", completed: true),
  ]

  private let priorityTasks = [
    TaskSpec(title: "High priority task", priority: "high"),
    TaskSpec(title: "Medium priority task", priority: "medium"),
    TaskSpec(title: "Low priority task", priority: "low"),
  ]

  func test_TC_FILTER_001_statusOpenShowsOnlyOpenTasks() {
    let home = seedTasks(statusTasks)

    home.selectStatusFilter("open")
    XCTAssertTrue(home.waitForVisibleTaskCount(2))

    let titles = home.visibleTaskTitles()
    XCTAssertTrue(titles.contains("Plan sprint review"))
    XCTAssertTrue(titles.contains("Review pull requests"))
    XCTAssertFalse(titles.contains("Ship release notes"))
  }

  func test_TC_FILTER_002_statusDoneShowsOnlyCompletedTasks() {
    let home = seedTasks(statusTasks)

    home.selectStatusFilter("completed")
    XCTAssertTrue(home.waitForVisibleTaskCount(1))

    let titles = home.visibleTaskTitles()
    XCTAssertEqual(titles, ["Ship release notes"])
    XCTAssertFalse(titles.contains("Plan sprint review"))
    XCTAssertFalse(titles.contains("Review pull requests"))
  }

  func test_TC_FILTER_003_statusAllShowsAllTasks() {
    let home = seedTasks(statusTasks)

    home.selectStatusFilter("completed")
    XCTAssertTrue(home.waitForVisibleTaskCount(1))

    home.selectStatusFilter("all")
    XCTAssertTrue(home.waitForVisibleTaskCount(3))
    XCTAssertEqual(home.visibleTaskCount(), 3)
  }

  func test_TC_FILTER_004_statusDoneWithNoCompletedShowsNoResultsCard() {
    let home = seedTasks([
      TaskSpec(title: "Plan sprint review", priority: "medium"),
      TaskSpec(title: "Review pull requests", priority: "low"),
    ])

    home.selectStatusFilter("completed")
    XCTAssertTrue(home.waitForVisibleTaskCount(0))

    XCTAssertTrue(home.isNoResultsCardVisible())
  }

  func test_TC_FILTER_005_priorityHighShowsOnlyHighTasks() {
    let home = seedTasks(priorityTasks)

    home.selectPriorityFilter("high")
    XCTAssertTrue(home.waitForVisibleTaskCount(1))

    let titles = home.visibleTaskTitles()
    XCTAssertEqual(titles, ["High priority task"])
    XCTAssertFalse(titles.contains("Medium priority task"))
    XCTAssertFalse(titles.contains("Low priority task"))
  }

  func test_TC_FILTER_006_priorityMediumShowsOnlyMediumTasks() {
    let home = seedTasks(priorityTasks)

    home.selectPriorityFilter("medium")
    XCTAssertTrue(home.waitForVisibleTaskCount(1))

    XCTAssertEqual(home.visibleTaskTitles(), ["Medium priority task"])
  }

  func test_TC_FILTER_007_priorityLowShowsOnlyLowTasks() {
    let home = seedTasks(priorityTasks)

    home.selectPriorityFilter("low")
    XCTAssertTrue(home.waitForVisibleTaskCount(1))
    XCTAssertEqual(home.visibleTaskTitles(), ["Low priority task"])

    home.selectPriorityFilter("all")
    XCTAssertTrue(home.waitForVisibleTaskCount(3))
    XCTAssertEqual(home.visibleTaskCount(), 3)
  }
}
