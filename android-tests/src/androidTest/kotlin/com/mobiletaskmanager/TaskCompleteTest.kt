package com.mobiletaskmanager

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Test
import org.junit.runner.RunWith

private const val COMPLETE_LABEL = "Complete task"
private const val REOPEN_LABEL = "Reopen task"
private const val COMPLETED_METADATA = "Completed"

@RunWith(AndroidJUnit4::class)
class TaskCompleteTest {

  @Test
  fun TC_TASK_013_completeTaskFromDetails() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()

      TaskDetailsScreen.assertStatus(TaskDetailsScreen.STATUS_OPEN)
      TaskDetailsScreen.assertCompleteButtonLabel(COMPLETE_LABEL)

      TaskDetailsScreen.tapComplete()

      TaskDetailsScreen.assertStatus(TaskDetailsScreen.STATUS_COMPLETED)
      TaskDetailsScreen.assertCompleteButtonLabel(REOPEN_LABEL)
    }
  }

  @Test
  fun TC_TASK_014_reopenTaskFromDetails() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()

      TaskDetailsScreen.tapComplete()
      TaskDetailsScreen.assertStatus(TaskDetailsScreen.STATUS_COMPLETED)
      TaskDetailsScreen.assertCompleteButtonLabel(REOPEN_LABEL)

      TaskDetailsScreen.tapComplete()

      TaskDetailsScreen.assertStatus(TaskDetailsScreen.STATUS_OPEN)
      TaskDetailsScreen.assertCompleteButtonLabel(COMPLETE_LABEL)
    }
  }

  @Test
  fun TC_TASK_015_completeTaskViaListCheckbox() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()
      TaskDetailsScreen.tapHome()
      HomeScreen.waitForScreen()

      HomeScreen.toggleTask(0)

      HomeScreen.assertTaskMetadataContains(index = 0, text = COMPLETED_METADATA)
      HomeScreen.assertTaskTitle(index = 0, title = TaskFlows.SAMPLE_TITLE)
    }
  }

  @Test
  fun TC_TASK_016_reopenTaskViaListCheckbox() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()
      TaskDetailsScreen.tapHome()
      HomeScreen.waitForScreen()

      HomeScreen.toggleTask(0)
      HomeScreen.assertTaskMetadataContains(index = 0, text = COMPLETED_METADATA)

      HomeScreen.toggleTask(0)

      HomeScreen.assertTaskMetadataDoesNotContain(index = 0, text = COMPLETED_METADATA)
      HomeScreen.assertTaskTitle(index = 0, title = TaskFlows.SAMPLE_TITLE)
    }
  }
}
