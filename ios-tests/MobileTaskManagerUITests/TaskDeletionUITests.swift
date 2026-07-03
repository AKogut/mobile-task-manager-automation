import XCTest

final class TaskDeletionUITests: UITestCase {
  func test_TC_TASK_017_deleteShowsConfirmationDialog() {
    let details = createSampleTask()

    XCTAssertTrue(
      details.openDeleteDialog(),
      "A confirmation dialog should appear when tapping delete.",
    )
    XCTAssertTrue(details.confirmDeleteButton.exists, "The dialog should offer Delete.")
    XCTAssertTrue(details.cancelDeleteButton.exists, "The dialog should offer Cancel.")
    XCTAssertTrue(details.screen.exists, "The task should not be deleted yet.")

    details.cancelDeleteButton.tap()
  }

  func test_TC_TASK_018_confirmingDeleteRemovesTask() {
    let details = createSampleTask()
    details.confirmDelete()

    let home = HomeScreen(app: app)
    XCTAssertTrue(home.waitForScreen(), "Confirming delete should return to the Home screen.")
    XCTAssertFalse(
      home.isTaskVisible(titled: "Buy groceries"),
      "The deleted task should no longer appear in the list.",
    )
  }

  func test_TC_TASK_019_cancellingDeletePreservesTask() {
    let details = createSampleTask()
    details.cancelDelete()

    XCTAssertTrue(details.screen.exists, "The task should remain on the details screen.")
    XCTAssertEqual(details.title.label, "Buy groceries")
  }
}
