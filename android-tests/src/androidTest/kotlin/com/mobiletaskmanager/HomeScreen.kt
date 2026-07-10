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

object HomeScreen {

  private const val HEADER_ADD_DESCRIPTION = "Add task"

  fun waitForScreen(): ViewInteraction = waitForTestId(TestIds.mainScreen)

  fun assertDisplayed() {
    waitForScreen().check(matches(isDisplayed()))
  }

  fun tapAddTask() {
    waitForTestId(TestIds.taskAddButton)
    onView(headerAddButton()).perform(click())
  }

  fun openSettings() {
    onView(withTestId(TestIds.settingsOpenButton)).perform(click())
  }

  fun search(query: String) {
    onView(withTestId(TestIds.taskSearchInput)).perform(replaceText(query), closeSoftKeyboard())
  }

  fun clearSearch() {
    search("")
  }

  fun selectStatusFilter(status: String) {
    onView(withTestId(TestIds.testIdForStatusFilter(status))).perform(click())
  }

  fun selectPriorityFilter(priority: String) {
    onView(withTestId(TestIds.testIdForPriorityFilter(priority))).perform(click())
  }

  fun selectSort(sort: String) {
    onView(withTestId(TestIds.testIdForTaskSort(sort))).perform(click())
  }

  fun waitForTask(index: Int): ViewInteraction = waitForTestId(TestIds.testIdForTask(index))

  fun openTask(index: Int) {
    onView(withTestId(TestIds.testIdForTask(index))).perform(scrollTo(), click())
  }

  fun toggleTask(index: Int) {
    onView(withTestId("${TestIds.taskToggleButton}-$index")).perform(scrollTo(), click())
  }

  fun assertTaskTitle(index: Int, title: String) {
    onView(withTestId("${TestIds.taskItemTitle}-$index")).check(matches(withText(title)))
  }

  fun assertTaskMetadataContains(index: Int, text: String) {
    onView(withTestId("${TestIds.taskItemMetadata}-$index"))
        .check(matches(withText(containsString(text))))
  }

  fun assertTaskVisible(title: String) {
    onView(allOf(withText(title), isDisplayed())).check(matches(isDisplayed()))
  }

  fun assertTaskNotVisible(title: String) {
    onView(allOf(withText(title), isDisplayed())).check(doesNotExist())
  }

  fun assertTaskListSummary(text: String) {
    onView(withTestId(TestIds.taskListTitle)).check(matches(withText(containsString(text))))
  }

  fun assertEmptyStateVisible() {
    waitForTestId(TestIds.taskEmptyStateCard).check(matches(isDisplayed()))
  }

  fun assertNoResultsVisible() {
    waitForTestId(TestIds.taskNoResultsCard).check(matches(isDisplayed()))
  }

  private fun headerAddButton(): Matcher<View> =
      allOf(
          withTestId(TestIds.taskAddButton),
          withContentDescription(HEADER_ADD_DESCRIPTION),
          isDisplayed(),
      )
}
