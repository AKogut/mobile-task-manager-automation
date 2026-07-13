package com.mobiletaskmanager

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class TaskDeletionTest {

  @Test
  fun TC_TASK_017_deleteShowsConfirmationDialog() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()

      TaskDetailsScreen.tapDelete()

      TaskDetailsScreen.assertDeleteDialogVisible()
      TaskDetailsScreen.assertDeleteDialogOptions()
    }
  }

  @Test
  fun TC_TASK_018_confirmingDeleteRemovesTask() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()
      TaskDetailsScreen.openDeleteDialog()

      TaskDetailsScreen.confirmDelete()

      HomeScreen.assertDisplayed()
      HomeScreen.assertTaskNotVisible(TaskFlows.SAMPLE_TITLE)
      HomeScreen.assertEmptyStateVisible()
    }
  }

  @Test
  fun TC_TASK_019_cancellingDeletePreservesTask() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()
      TaskDetailsScreen.openDeleteDialog()

      TaskDetailsScreen.cancelDelete()

      TaskDetailsScreen.assertDeleteDialogNotVisible()
      TaskDetailsScreen.assertDisplayed()
      TaskDetailsScreen.assertTitle(TaskFlows.SAMPLE_TITLE)

      TaskDetailsScreen.tapHome()

      HomeScreen.waitForScreen()
      HomeScreen.assertTaskTitle(index = 0, title = TaskFlows.SAMPLE_TITLE)
    }
  }
}
