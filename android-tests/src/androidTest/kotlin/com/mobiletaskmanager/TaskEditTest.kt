package com.mobiletaskmanager

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Test
import org.junit.runner.RunWith

private const val PRIORITY_LOW = "low"
private const val PRIORITY_HIGH = "high"

private const val TITLE_REQUIRED_ERROR = "Title is required."

@RunWith(AndroidJUnit4::class)
class TaskEditTest {

  @Test
  fun TC_TASK_020_editFormIsPrePopulatedWithCurrentValues() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()

      TaskDetailsScreen.tapEdit()

      TaskFormScreen.assertDisplayed()
      TaskFormScreen.assertTitleValue(TaskFlows.SAMPLE_TITLE)
      TaskFormScreen.assertDescriptionValue(TaskFlows.SAMPLE_DESCRIPTION)
      TaskFormScreen.assertPrioritySelected(TaskFlows.SAMPLE_PRIORITY)
      TaskFormScreen.assertDueDateNotEmpty()
    }
  }

  @Test
  fun TC_TASK_021_editTitleAndSave() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()
      TaskDetailsScreen.tapEdit()
      TaskFormScreen.waitForScreen()

      TaskFormScreen.setTitle("Updated task title")
      TaskFormScreen.submit()

      TaskDetailsScreen.assertDisplayed()
      TaskDetailsScreen.assertTitle("Updated task title")
    }
  }

  @Test
  fun TC_TASK_022_editPriorityAndSave() {
    launchHomeForUiTest().use {
      TaskFlows.createTask(title = "Low priority task", priority = PRIORITY_LOW)
      TaskDetailsScreen.assertPriority("Low priority")
      TaskDetailsScreen.tapEdit()
      TaskFormScreen.waitForScreen()

      TaskFormScreen.selectPriority(PRIORITY_HIGH)
      TaskFormScreen.submit()

      TaskDetailsScreen.assertDisplayed()
      TaskDetailsScreen.assertPriority("High priority")
    }
  }

  @Test
  fun TC_TASK_023_editDescriptionAndSave() {
    launchHomeForUiTest().use {
      TaskFlows.createTask(title = "Task without description")
      TaskDetailsScreen.tapEdit()
      TaskFormScreen.waitForScreen()

      TaskFormScreen.setDescription("Added after creation")
      TaskFormScreen.submit()

      TaskDetailsScreen.assertDisplayed()
      TaskDetailsScreen.assertDescription("Added after creation")
    }
  }

  @Test
  fun TC_TASK_024_editedTaskReflectsChangesInTaskList() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(listOf(TaskSpec(title = "Old title")))

      HomeScreen.openTask(0)
      TaskDetailsScreen.tapEdit()
      TaskFormScreen.waitForScreen()

      TaskFormScreen.setTitle("New title")
      TaskFormScreen.submit()

      TaskDetailsScreen.waitForScreen()
      TaskDetailsScreen.tapHome()

      HomeScreen.waitForScreen()
      HomeScreen.assertTaskTitle(index = 0, title = "New title")
      HomeScreen.assertTaskNotVisible("Old title")
    }
  }

  @Test
  fun TC_TASK_025_editBlockedWhenTitleIsCleared() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()
      TaskDetailsScreen.tapEdit()
      TaskFormScreen.waitForScreen()

      TaskFormScreen.setTitle("")
      TaskFormScreen.submit()

      TaskFormScreen.assertTitleValue("")
      TaskFormScreen.assertTitleErrorVisible(TITLE_REQUIRED_ERROR)
      TaskFormScreen.assertDisplayed()
    }
  }
}
