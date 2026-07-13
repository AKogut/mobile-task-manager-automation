package com.mobiletaskmanager

import android.view.View
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.ViewInteraction
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.action.ViewActions.closeSoftKeyboard
import androidx.test.espresso.action.ViewActions.replaceText
import androidx.test.espresso.action.ViewActions.scrollTo
import androidx.test.espresso.assertion.ViewAssertions.doesNotExist
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withContentDescription
import androidx.test.espresso.matcher.ViewMatchers.withText
import org.hamcrest.Matcher
import org.hamcrest.Matchers.allOf
import org.hamcrest.Matchers.containsString
import org.hamcrest.Matchers.not

object HomeScreen {

  private const val HEADER_ADD_DESCRIPTION = "Add task"

  fun waitForScreen(): ViewInteraction = waitForTestId(TestIds.mainScreen)

  fun assertDisplayed() {
    waitForScreen().check(matches(isDisplayed()))
  }

  fun assertNotDisplayed() {
    onView(withTestId(TestIds.mainScreen)).check(doesNotExist())
  }

  fun tapAddTask() {
    waitForTestId(TestIds.taskAddButton)
    onView(headerAddButton()).perform(click())
  }

  fun openSettings() {
    onView(withTestId(TestIds.settingsOpenButton)).perform(click())
  }

  fun search(query: String) {
    onView(withTestId(TestIds.taskSearchInput))
        .perform(scrollTo(), replaceText(query), closeSoftKeyboard())
  }

  fun clearSearch() {
    search("")
  }

  fun selectStatusFilter(status: String) {
    onView(withTestId(TestIds.testIdForStatusFilter(status))).perform(scrollTo(), click())
  }

  fun selectPriorityFilter(priority: String) {
    onView(withTestId(TestIds.testIdForPriorityFilter(priority))).perform(scrollTo(), click())
  }

  fun openTask(index: Int) {
    onView(withTestId(TestIds.testIdForTask(index))).perform(scrollTo(), click())
  }

  fun toggleTask(index: Int) {
    onView(withTestId("${TestIds.taskToggleButton}-$index")).perform(scrollTo(), click())
  }

  fun assertSearchValue(query: String) {
    waitForTestIdWithText(TestIds.taskSearchInput, query)
  }

  fun assertTaskTitle(index: Int, title: String) {
    waitForTestIdWithText("${TestIds.taskItemTitle}-$index", title)
  }

  fun assertTaskMetadataContains(index: Int, text: String) {
    waitForTestIdMatching("${TestIds.taskItemMetadata}-$index", withText(containsString(text)))
  }

  fun assertTaskMetadataDoesNotContain(index: Int, text: String) {
    waitForTestIdMatching("${TestIds.taskItemMetadata}-$index", not(withText(containsString(text))))
  }

  fun assertTaskVisible(title: String) {
    waitForView(taskListTitle(title))
  }

  fun assertTaskNotVisible(title: String) {
    waitUntilGone(taskListTitle(title))
  }

  fun assertEmptyStateVisible() {
    waitForTestId(TestIds.taskEmptyStateCard).check(matches(isDisplayed()))
  }

  fun assertEmptyStateNotVisible() {
    waitUntilGone(withTestId(TestIds.taskEmptyStateCard))
  }

  fun assertNoResultsVisible() {
    waitForTestId(TestIds.taskNoResultsCard).check(matches(isDisplayed()))
  }

  fun assertNoResultsNotVisible() {
    waitUntilGone(withTestId(TestIds.taskNoResultsCard))
  }

  private fun taskListTitle(title: String): Matcher<View> =
      allOf(withTestIdStartingWith("${TestIds.taskItemTitle}-"), withText(title))

  private fun headerAddButton(): Matcher<View> =
      allOf(
          withTestId(TestIds.taskAddButton),
          withContentDescription(HEADER_ADD_DESCRIPTION),
          isDisplayed(),
      )
}
