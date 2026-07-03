import XCTest

final class TaskSearchUITests: UITestCase {
  private let searchTasks = [
    TaskSpec(title: "Buy groceries", priority: "high"),
    TaskSpec(title: "Buy milk", priority: "medium"),
    TaskSpec(title: "Call dentist", priority: "low"),
    TaskSpec(title: "Pay rent", priority: "medium"),
  ]

  func test_TC_SEARCH_001_exactTitleMatch() {
    let home = seedTasks(searchTasks)

    home.search("Pay rent")
    XCTAssertTrue(home.waitForVisibleTaskCount(1))

    let titles = home.visibleTaskTitles()
    XCTAssertEqual(titles, ["Pay rent"])
    XCTAssertFalse(titles.contains("Buy groceries"))
    XCTAssertFalse(titles.contains("Call dentist"))
  }

  func test_TC_SEARCH_002_partialTitleMatch() {
    let home = seedTasks(searchTasks)

    home.search("Buy")
    XCTAssertTrue(home.waitForVisibleTaskCount(2))

    let titles = home.visibleTaskTitles()
    XCTAssertTrue(titles.contains("Buy groceries"))
    XCTAssertTrue(titles.contains("Buy milk"))
    XCTAssertFalse(titles.contains("Call dentist"))
  }

  func test_TC_SEARCH_003_caseInsensitive() {
    let home = seedTasks(searchTasks)

    home.search("BUY GROCERIES")
    XCTAssertTrue(home.waitForVisibleTaskCount(1))

    XCTAssertTrue(home.isTaskVisible(titled: "Buy groceries"))
  }

  func test_TC_SEARCH_004_noMatchesShowsNoResultsCard() {
    let home = seedTasks(searchTasks)

    home.search("zzznomatch")
    XCTAssertTrue(home.waitForVisibleTaskCount(0))

    XCTAssertTrue(home.isNoResultsCardVisible())
    XCTAssertFalse(home.isEmptyStateVisible())
  }

  func test_TC_SEARCH_005_clearingSearchRestoresList() {
    let home = seedTasks(searchTasks)

    home.search("Buy")
    XCTAssertTrue(home.waitForVisibleTaskCount(2))

    home.clearSearch()
    XCTAssertTrue(home.waitForVisibleTaskCount(4))
    XCTAssertEqual(home.visibleTaskCount(), 4)
  }

  func test_TC_SEARCH_006_searchWithActiveStatusFilter() {
    let home = seedTasks([
      TaskSpec(title: "Buy groceries", priority: "high"),
      TaskSpec(title: "Buy milk", priority: "medium", completed: true),
      TaskSpec(title: "Call dentist", priority: "low"),
    ])

    home.selectStatusFilter("open")
    home.search("Buy")
    XCTAssertTrue(home.waitForVisibleTaskCount(1))

    let titles = home.visibleTaskTitles()
    XCTAssertEqual(titles, ["Buy groceries"])
    XCTAssertFalse(titles.contains("Buy milk"))
    XCTAssertFalse(titles.contains("Call dentist"))
  }
}
