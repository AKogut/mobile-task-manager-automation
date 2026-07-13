package com.mobiletaskmanager

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Test
import org.junit.runner.RunWith

private const val STATUS_OPEN = "open"

private const val BUY_GROCERIES = "Buy groceries"
private const val BUY_MILK = "Buy milk"
private const val CALL_DENTIST = "Call dentist"
private const val PAY_RENT = "Pay rent"

private const val NO_MATCH_QUERY = "zzznomatch"

private val THREE_TASKS =
    listOf(
        TaskSpec(title = BUY_GROCERIES),
        TaskSpec(title = CALL_DENTIST),
        TaskSpec(title = PAY_RENT),
    )

private val BUY_TASKS =
    listOf(
        TaskSpec(title = BUY_GROCERIES),
        TaskSpec(title = BUY_MILK),
        TaskSpec(title = CALL_DENTIST),
    )

@RunWith(AndroidJUnit4::class)
class TaskSearchTest {

  @Test
  fun TC_SEARCH_001_searchByExactTitleReturnsMatchingTask() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(THREE_TASKS)

      HomeScreen.search(PAY_RENT)

      HomeScreen.assertSearchValue(PAY_RENT)
      HomeScreen.assertTaskVisible(PAY_RENT)
      HomeScreen.assertTaskNotVisible(BUY_GROCERIES)
      HomeScreen.assertTaskNotVisible(CALL_DENTIST)
    }
  }

  @Test
  fun TC_SEARCH_002_searchByPartialTitleReturnsMatchingTasks() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(BUY_TASKS)

      HomeScreen.search("Buy")

      HomeScreen.assertTaskVisible(BUY_GROCERIES)
      HomeScreen.assertTaskVisible(BUY_MILK)
      HomeScreen.assertTaskNotVisible(CALL_DENTIST)
    }
  }

  @Test
  fun TC_SEARCH_003_searchIsCaseInsensitive() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(THREE_TASKS)

      HomeScreen.search("BUY GROCERIES")

      HomeScreen.assertTaskVisible(BUY_GROCERIES)
      HomeScreen.assertTaskNotVisible(CALL_DENTIST)
    }
  }

  @Test
  fun TC_SEARCH_004_searchWithNoMatchesShowsNoResultsCard() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(THREE_TASKS)

      HomeScreen.search(NO_MATCH_QUERY)

      HomeScreen.assertNoResultsVisible()
      HomeScreen.assertEmptyStateNotVisible()
      HomeScreen.assertTaskNotVisible(BUY_GROCERIES)
    }
  }

  @Test
  fun TC_SEARCH_005_clearingSearchRestoresFullTaskList() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(THREE_TASKS)
      HomeScreen.search(PAY_RENT)
      HomeScreen.assertTaskNotVisible(BUY_GROCERIES)

      HomeScreen.clearSearch()

      HomeScreen.assertTaskVisible(BUY_GROCERIES)
      HomeScreen.assertTaskVisible(CALL_DENTIST)
      HomeScreen.assertTaskVisible(PAY_RENT)
      HomeScreen.assertNoResultsNotVisible()
    }
  }

  @Test
  fun TC_SEARCH_006_searchCombinesWithActiveStatusFilter() {
    launchHomeForUiTest().use {
      TaskFlows.seedTasks(
          listOf(
              TaskSpec(title = BUY_GROCERIES),
              TaskSpec(title = BUY_MILK, completed = true),
              TaskSpec(title = CALL_DENTIST),
          ),
      )

      HomeScreen.selectStatusFilter(STATUS_OPEN)
      HomeScreen.search("Buy")

      HomeScreen.assertTaskVisible(BUY_GROCERIES)
      HomeScreen.assertTaskNotVisible(BUY_MILK)
      HomeScreen.assertTaskNotVisible(CALL_DENTIST)
    }
  }
}
