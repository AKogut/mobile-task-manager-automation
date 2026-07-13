package com.mobiletaskmanager

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Test
import org.junit.runner.RunWith

private const val STATUS_ALL = "all"
private const val STATUS_OPEN = "open"
private const val STATUS_COMPLETED = "completed"

private const val PRIORITY_HIGH = "high"
private const val PRIORITY_MEDIUM = "medium"
private const val PRIORITY_LOW = "low"

private const val HIGH_TASK = "Ship release notes"
private const val MEDIUM_TASK = "Review pull request"
private const val LOW_TASK = "Water the plants"

private val MIXED_STATUS_TASKS =
    listOf(
        TaskSpec(title = HIGH_TASK, priority = PRIORITY_HIGH),
        TaskSpec(title = MEDIUM_TASK, priority = PRIORITY_MEDIUM),
        TaskSpec(title = LOW_TASK, priority = PRIORITY_LOW, completed = true),
    )

private val MIXED_PRIORITY_TASKS =
    listOf(
        TaskSpec(title = HIGH_TASK, priority = PRIORITY_HIGH),
        TaskSpec(title = MEDIUM_TASK, priority = PRIORITY_MEDIUM),
        TaskSpec(title = LOW_TASK, priority = PRIORITY_LOW),
    )

@RunWith(AndroidJUnit4::class)
class TaskFilterTest {

  @Test
  fun TC_FILTER_001_statusFilterOpenShowsOnlyOpenTasks() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(MIXED_STATUS_TASKS)

      HomeScreen.selectStatusFilter(STATUS_OPEN)

      HomeScreen.assertTaskVisible(HIGH_TASK)
      HomeScreen.assertTaskVisible(MEDIUM_TASK)
      HomeScreen.assertTaskNotVisible(LOW_TASK)
    }
  }

  @Test
  fun TC_FILTER_002_statusFilterDoneShowsOnlyCompletedTasks() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(MIXED_STATUS_TASKS)

      HomeScreen.selectStatusFilter(STATUS_COMPLETED)

      HomeScreen.assertTaskVisible(LOW_TASK)
      HomeScreen.assertTaskNotVisible(HIGH_TASK)
      HomeScreen.assertTaskNotVisible(MEDIUM_TASK)
    }
  }

  @Test
  fun TC_FILTER_003_statusFilterAllShowsAllTasks() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(MIXED_STATUS_TASKS)
      HomeScreen.selectStatusFilter(STATUS_OPEN)
      HomeScreen.assertTaskNotVisible(LOW_TASK)

      HomeScreen.selectStatusFilter(STATUS_ALL)

      HomeScreen.assertTaskVisible(HIGH_TASK)
      HomeScreen.assertTaskVisible(MEDIUM_TASK)
      HomeScreen.assertTaskVisible(LOW_TASK)
    }
  }

  @Test
  fun TC_FILTER_004_statusFilterDoneWithNoCompletedTasksShowsNoResults() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(MIXED_PRIORITY_TASKS)

      HomeScreen.selectStatusFilter(STATUS_COMPLETED)

      HomeScreen.assertNoResultsVisible()
      HomeScreen.assertTaskNotVisible(HIGH_TASK)
      HomeScreen.assertTaskNotVisible(MEDIUM_TASK)
      HomeScreen.assertTaskNotVisible(LOW_TASK)
    }
  }

  @Test
  fun TC_FILTER_005_priorityFilterHighShowsOnlyHighPriorityTasks() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(MIXED_PRIORITY_TASKS)

      HomeScreen.selectPriorityFilter(PRIORITY_HIGH)

      HomeScreen.assertTaskVisible(HIGH_TASK)
      HomeScreen.assertTaskNotVisible(MEDIUM_TASK)
      HomeScreen.assertTaskNotVisible(LOW_TASK)
    }
  }

  @Test
  fun TC_FILTER_006_priorityFilterMediumShowsOnlyMediumPriorityTasks() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(MIXED_PRIORITY_TASKS)

      HomeScreen.selectPriorityFilter(PRIORITY_MEDIUM)

      HomeScreen.assertTaskVisible(MEDIUM_TASK)
      HomeScreen.assertTaskNotVisible(HIGH_TASK)
      HomeScreen.assertTaskNotVisible(LOW_TASK)
    }
  }

  @Test
  fun TC_FILTER_007_priorityFilterLowShowsOnlyLowPriorityTasks() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(MIXED_PRIORITY_TASKS)

      HomeScreen.selectPriorityFilter(PRIORITY_LOW)

      HomeScreen.assertTaskVisible(LOW_TASK)
      HomeScreen.assertTaskNotVisible(HIGH_TASK)
      HomeScreen.assertTaskNotVisible(MEDIUM_TASK)
    }
  }
}
