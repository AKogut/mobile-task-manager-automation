package com.mobiletaskmanager

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Test
import org.junit.runner.RunWith

private const val SORT_DUE_DATE = "dueDate"
private const val SORT_PRIORITY = "priority"
private const val SORT_STATUS = "status"
private const val SORT_CREATED_AT = "createdAt"

private const val STATUS_ALL = "all"
private const val STATUS_OPEN = "open"

private const val PRIORITY_HIGH = "high"
private const val PRIORITY_MEDIUM = "medium"
private const val PRIORITY_LOW = "low"

private const val DATE_TODAY = "today"
private const val DATE_TOMORROW = "tomorrow"
private const val DATE_NEXT_WEEK = "next-week"

private const val TASK_A = "Task A"
private const val TASK_B = "Task B"
private const val TASK_C = "Task C"

private val MIXED_PRIORITY_TASKS =
    listOf(
        TaskSpec(title = TASK_A, priority = PRIORITY_LOW, quickDate = DATE_TODAY),
        TaskSpec(title = TASK_B, priority = PRIORITY_HIGH, quickDate = DATE_NEXT_WEEK),
        TaskSpec(title = TASK_C, priority = PRIORITY_MEDIUM, quickDate = DATE_TOMORROW),
    )

@RunWith(AndroidJUnit4::class)
class TaskSortTest {

  @Test
  fun TC_SORT_001_defaultSortIsByDueDateAscending() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(
          listOf(
              TaskSpec(title = TASK_A, quickDate = DATE_TOMORROW),
              TaskSpec(title = TASK_B, quickDate = DATE_TODAY),
              TaskSpec(title = TASK_C, quickDate = DATE_NEXT_WEEK),
          ),
      )

      HomeScreen.assertSortSelected(SORT_DUE_DATE)
      HomeScreen.assertTaskOrder(TASK_B, TASK_A, TASK_C)
    }
  }

  @Test
  fun TC_SORT_002_sortByPriorityOrdersHighMediumLow() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(MIXED_PRIORITY_TASKS)
      HomeScreen.assertTaskOrder(TASK_A, TASK_C, TASK_B)

      HomeScreen.selectSort(SORT_PRIORITY)

      HomeScreen.assertSortSelected(SORT_PRIORITY)
      HomeScreen.assertTaskOrder(TASK_B, TASK_C, TASK_A)
    }
  }

  @Test
  fun TC_SORT_003_sortByStatusOrdersOpenBeforeCompleted() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(
          listOf(
              TaskSpec(title = TASK_A, quickDate = DATE_TODAY, completed = true),
              TaskSpec(title = TASK_B, quickDate = DATE_NEXT_WEEK),
              TaskSpec(title = TASK_C, quickDate = DATE_TOMORROW, completed = true),
          ),
      )
      HomeScreen.selectStatusFilter(STATUS_ALL)
      HomeScreen.assertTaskOrder(TASK_A, TASK_C, TASK_B)

      HomeScreen.selectSort(SORT_STATUS)

      HomeScreen.assertSortSelected(SORT_STATUS)
      HomeScreen.assertTaskOrder(TASK_B, TASK_A, TASK_C)
    }
  }

  @Test
  fun TC_SORT_004_sortByCreatedDateOrdersNewestFirst() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(
          listOf(
              TaskSpec(title = TASK_A, quickDate = DATE_TODAY),
              TaskSpec(title = TASK_B, quickDate = DATE_TOMORROW),
              TaskSpec(title = TASK_C, quickDate = DATE_NEXT_WEEK),
          ),
      )
      HomeScreen.assertTaskOrder(TASK_A, TASK_B, TASK_C)

      HomeScreen.selectSort(SORT_CREATED_AT)

      HomeScreen.assertSortSelected(SORT_CREATED_AT)
      HomeScreen.assertTaskOrder(TASK_C, TASK_B, TASK_A)
    }
  }

  @Test
  fun TC_SORT_005_sortSelectionPersistsWhenReturningToHome() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(MIXED_PRIORITY_TASKS)
      HomeScreen.selectSort(SORT_PRIORITY)
      HomeScreen.assertTaskOrder(TASK_B, TASK_C, TASK_A)

      HomeScreen.openTask(0)
      TaskDetailsScreen.waitForScreen()
      TaskDetailsScreen.tapHome()

      HomeScreen.waitForScreen()
      HomeScreen.assertSortSelected(SORT_PRIORITY)
      HomeScreen.assertTaskOrder(TASK_B, TASK_C, TASK_A)
    }
  }

  @Test
  fun TC_SORT_006_sortCombinesWithActiveFilter() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(
          listOf(
              TaskSpec(title = TASK_A, priority = PRIORITY_HIGH, quickDate = DATE_NEXT_WEEK),
              TaskSpec(title = TASK_B, priority = PRIORITY_LOW, quickDate = DATE_TODAY),
              TaskSpec(
                  title = TASK_C,
                  priority = PRIORITY_HIGH,
                  quickDate = DATE_TOMORROW,
                  completed = true,
              ),
          ),
      )

      HomeScreen.selectStatusFilter(STATUS_OPEN)
      HomeScreen.assertTaskOrder(TASK_B, TASK_A)

      HomeScreen.selectSort(SORT_PRIORITY)

      HomeScreen.assertTaskOrder(TASK_A, TASK_B)
      HomeScreen.assertTaskNotVisible(TASK_C)
    }
  }
}
