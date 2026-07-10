package com.mobiletaskmanager

import androidx.test.ext.junit.runners.AndroidJUnit4
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import org.junit.Test
import org.junit.runner.RunWith

private const val PRIORITY_LOW = "low"
private const val PRIORITY_MEDIUM = "medium"
private const val PRIORITY_HIGH = "high"

private const val DATE_TODAY = "today"
private const val DATE_TOMORROW = "tomorrow"
private const val DATE_NEXT_WEEK = "next-week"

private const val NO_DESCRIPTION = "No description provided."
private const val TITLE_REQUIRED_ERROR = "Title is required."
private const val TITLE_TOO_LONG_ERROR = "Title must be 80 characters or less."
private const val DUE_DATE_REQUIRED_ERROR = "Due date is required."
private val TITLE_OVER_LIMIT = "a".repeat(81)

private fun dueDate(daysFromToday: Int): String {
  val calendar = Calendar.getInstance()
  calendar.add(Calendar.DAY_OF_YEAR, daysFromToday)
  return SimpleDateFormat("yyyy-MM-dd", Locale.US).format(calendar.time)
}

@RunWith(AndroidJUnit4::class)
class TaskCreationTest {

  @Test
  fun TC_TASK_001_createTaskWithAllFields() {
    launchHomeForUiTest().use {
      TaskFlows.createTask(
          title = "Buy groceries",
          description = "Milk, eggs, and bread",
          priority = PRIORITY_HIGH,
          quickDate = DATE_TOMORROW,
      )

      TaskDetailsScreen.assertTitle("Buy groceries")
      TaskDetailsScreen.assertDescription("Milk, eggs, and bread")
      TaskDetailsScreen.assertPriority("High priority")
      TaskDetailsScreen.assertStatus(TaskDetailsScreen.STATUS_OPEN)
    }
  }

  @Test
  fun TC_TASK_002_createTaskWithMinimumRequiredFields() {
    launchHomeForUiTest().use {
      TaskFlows.createTask(
          title = "Minimal task",
          priority = PRIORITY_LOW,
          quickDate = DATE_TODAY,
      )

      TaskDetailsScreen.assertTitle("Minimal task")
      TaskDetailsScreen.assertDescription(NO_DESCRIPTION)
      TaskDetailsScreen.assertPriority("Low priority")
    }
  }

  @Test
  fun TC_TASK_003_newlyCreatedTaskAppearsInTaskList() {
    launchHomeForUiTest().use {
      TaskFlows.createTask(
          title = "New list task",
          priority = PRIORITY_MEDIUM,
          quickDate = DATE_NEXT_WEEK,
      )

      TaskDetailsScreen.tapHome()

      HomeScreen.waitForScreen()
      HomeScreen.assertTaskTitle(index = 0, title = "New list task")
      HomeScreen.assertTaskMetadataContains(index = 0, text = "Medium")
    }
  }

  @Test
  fun TC_TASK_004_creationBlockedWhenTitleIsEmpty() {
    launchHomeForUiTest().use {
      HomeScreen.tapAddTask()
      TaskFormScreen.waitForScreen()

      TaskFormScreen.selectPriority(PRIORITY_MEDIUM)
      TaskFormScreen.selectQuickDate(DATE_TODAY)
      TaskFormScreen.submit()

      TaskFormScreen.assertTitleValue("")
      TaskFormScreen.assertTitleErrorVisible(TITLE_REQUIRED_ERROR)
      TaskFormScreen.assertDisplayed()
    }
  }

  @Test
  fun TC_TASK_005_creationBlockedWhenTitleExceedsCharacterLimit() {
    launchHomeForUiTest().use {
      HomeScreen.tapAddTask()
      TaskFormScreen.waitForScreen()

      TaskFormScreen.setTitle(TITLE_OVER_LIMIT)
      TaskFormScreen.selectPriority(PRIORITY_LOW)
      TaskFormScreen.selectQuickDate(DATE_TODAY)
      TaskFormScreen.submit()

      TaskFormScreen.assertTitleValue(TITLE_OVER_LIMIT)
      TaskFormScreen.assertTitleErrorVisible(TITLE_TOO_LONG_ERROR)
      TaskFormScreen.assertDisplayed()
    }
  }

  @Test
  fun TC_TASK_006_creationBlockedWhenNoDueDateIsSelected() {
    launchHomeForUiTest().use {
      HomeScreen.tapAddTask()
      TaskFormScreen.waitForScreen()

      TaskFormScreen.setTitle("No date task")
      TaskFormScreen.selectPriority(PRIORITY_MEDIUM)
      TaskFormScreen.submit()

      TaskFormScreen.assertDueDateValue("")
      TaskFormScreen.assertDueDateErrorVisible(DUE_DATE_REQUIRED_ERROR)
      TaskFormScreen.assertDisplayed()
    }
  }

  @Test
  fun TC_TASK_007_quickSelectTodaySetsCurrentDate() {
    launchHomeForUiTest().use {
      HomeScreen.tapAddTask()
      TaskFormScreen.waitForScreen()

      TaskFormScreen.selectQuickDate(DATE_TODAY)

      TaskFormScreen.assertDueDateValue(dueDate(0))
    }
  }

  @Test
  fun TC_TASK_008_quickSelectTomorrowSetsNextDate() {
    launchHomeForUiTest().use {
      HomeScreen.tapAddTask()
      TaskFormScreen.waitForScreen()

      TaskFormScreen.selectQuickDate(DATE_TOMORROW)

      TaskFormScreen.assertDueDateValue(dueDate(1))
    }
  }

  @Test
  fun TC_TASK_009_quickSelectNextWeekSetsDateSevenDaysAhead() {
    launchHomeForUiTest().use {
      HomeScreen.tapAddTask()
      TaskFormScreen.waitForScreen()

      TaskFormScreen.selectQuickDate(DATE_NEXT_WEEK)

      TaskFormScreen.assertDueDateValue(dueDate(7))
    }
  }
}
