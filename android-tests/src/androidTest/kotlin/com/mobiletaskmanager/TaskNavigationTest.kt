package com.mobiletaskmanager

import androidx.test.ext.junit.runners.AndroidJUnit4
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import org.junit.Test
import org.junit.runner.RunWith

private const val PRIORITY_MEDIUM = "medium"

private const val DATE_TODAY = "today"
private const val DATE_TOMORROW = "tomorrow"

private const val ADD_FORM_TITLE = "Add task"
private const val EDIT_FORM_TITLE = "Edit task"

private const val FIRST_TASK = "Pay rent"
private const val SECOND_TASK = "Call dentist"
private const val NEW_TASK = "Test navigation task"
private const val EDITED_TASK = "Edited navigation task"

private fun dueDate(daysFromToday: Int): String {
  val calendar = Calendar.getInstance()
  calendar.add(Calendar.DAY_OF_YEAR, daysFromToday)
  return SimpleDateFormat("yyyy-MM-dd", Locale.US).format(calendar.time)
}

@RunWith(AndroidJUnit4::class)
class TaskNavigationTest {

  @Test
  fun TC_NAV_001_tappingTaskCardNavigatesToTaskDetails() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(
          listOf(
              TaskSpec(title = FIRST_TASK, quickDate = DATE_TODAY),
              TaskSpec(title = SECOND_TASK, quickDate = DATE_TOMORROW),
          ),
      )
      HomeScreen.assertTaskOrder(FIRST_TASK, SECOND_TASK)

      HomeScreen.openTask(0)

      TaskDetailsScreen.assertDisplayed()
      TaskDetailsScreen.assertTitle(FIRST_TASK)
    }
  }

  @Test
  fun TC_NAV_002_newTaskButtonOnHomeNavigatesToAddTask() {
    launchHomeForUiTest().use {
      HomeScreen.tapAddTask()

      TaskFormScreen.assertDisplayed()
      TaskFormScreen.assertScreenTitle(ADD_FORM_TITLE)
      TaskFormScreen.assertFieldsEmpty()
    }
  }

  @Test
  fun TC_NAV_003_newTaskButtonOnTaskDetailsNavigatesToAddTask() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()

      TaskDetailsScreen.tapNewTask()

      TaskFormScreen.assertDisplayed()
      TaskFormScreen.assertScreenTitle(ADD_FORM_TITLE)
      TaskFormScreen.assertFieldsEmpty()
    }
  }

  @Test
  fun TC_NAV_004_editButtonOnTaskDetailsNavigatesToEditTask() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()

      TaskDetailsScreen.tapEdit()

      TaskFormScreen.assertDisplayed()
      TaskFormScreen.assertScreenTitle(EDIT_FORM_TITLE)
      TaskFormScreen.assertTitleValue(TaskFlows.SAMPLE_TITLE)
      TaskFormScreen.assertDescriptionValue(TaskFlows.SAMPLE_DESCRIPTION)
      TaskFormScreen.assertPrioritySelected(TaskFlows.SAMPLE_PRIORITY)
      TaskFormScreen.assertDueDateValue(dueDate(1))
    }
  }

  @Test
  fun TC_NAV_005_homeButtonOnTaskDetailsNavigatesToHome() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()

      TaskDetailsScreen.tapHome()

      HomeScreen.assertDisplayed()
      HomeScreen.assertTaskOrder(TaskFlows.SAMPLE_TITLE)
    }
  }

  @Test
  fun TC_NAV_006_savingNewTaskNavigatesToTaskDetails() {
    launchHomeForUiTest().use {
      HomeScreen.tapAddTask()

      TaskFormScreen.fillAndSubmit(
          title = NEW_TASK,
          priority = PRIORITY_MEDIUM,
          quickDate = DATE_TODAY,
      )

      TaskDetailsScreen.assertDisplayed()
      HomeScreen.assertNotDisplayed()
      TaskDetailsScreen.assertTitle(NEW_TASK)
    }
  }

  @Test
  fun TC_NAV_007_savingEditedTaskNavigatesToTaskDetails() {
    launchHomeForUiTest().use {
      TaskFlows.createSampleTask()
      TaskDetailsScreen.tapEdit()
      TaskFormScreen.waitForScreen()

      TaskFormScreen.setTitle(EDITED_TASK)
      TaskFormScreen.submit()

      TaskDetailsScreen.assertDisplayed()
      HomeScreen.assertNotDisplayed()
      TaskDetailsScreen.assertTitle(EDITED_TASK)
    }
  }

  @Test
  fun TC_NAV_008_settingsBackButtonReturnsToHome() {
    launchHomeForUiTest().use {
      HomeScreen.openSettings()
      SettingsScreen.assertDisplayed()

      SettingsScreen.tapBack()

      HomeScreen.assertDisplayed()
      SettingsScreen.assertNotDisplayed()
    }
  }
}
