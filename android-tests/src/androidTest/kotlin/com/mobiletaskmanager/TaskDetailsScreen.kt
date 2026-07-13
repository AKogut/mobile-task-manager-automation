package com.mobiletaskmanager

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.ViewInteraction
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.doesNotExist
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.RootMatchers.isDialog
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withText

object TaskDetailsScreen {

  const val STATUS_OPEN = "Open"
  const val STATUS_COMPLETED = "Completed"

  private const val DELETE_DIALOG_TITLE = "Delete task?"
  private const val DELETE_CONFIRM = "Delete"
  private const val DELETE_CANCEL = "Cancel"

  fun waitForScreen(): ViewInteraction = waitForTestId(TestIds.taskDetailsScreen)

  fun assertDisplayed() {
    waitForScreen().check(matches(isDisplayed()))
  }

  fun assertTitle(title: String) {
    onView(withTestId(TestIds.taskDetailsTitle)).check(matches(withText(title)))
  }

  fun assertDescription(description: String) {
    onView(withTestId(TestIds.taskDetailsDescription)).check(matches(withText(description)))
  }

  fun assertStatus(status: String) {
    onView(withTestId(TestIds.taskDetailsStatusText)).check(matches(withText(status)))
  }

  fun assertPriority(priority: String) {
    onView(withTestId(TestIds.taskDetailsPriorityText)).check(matches(withText(priority)))
  }

  fun tapComplete() {
    onView(withTestId(TestIds.taskDetailsCompleteButton)).perform(click())
  }

  fun tapEdit() {
    onView(withTestId(TestIds.taskDetailsEditButton)).perform(click())
  }

  fun tapHome() {
    onView(withTestId(TestIds.taskDetailsHomeButton)).perform(click())
  }

  fun tapDelete() {
    onView(withTestId(TestIds.taskDetailsDeleteButton)).perform(click())
  }

  fun openDeleteDialog() {
    tapDelete()
    assertDeleteDialogVisible()
  }

  fun assertDeleteDialogVisible() {
    onView(withText(DELETE_DIALOG_TITLE)).inRoot(isDialog()).check(matches(isDisplayed()))
  }

  fun assertDeleteDialogOptions() {
    onView(withText(DELETE_CANCEL)).inRoot(isDialog()).check(matches(isDisplayed()))
    onView(withText(DELETE_CONFIRM)).inRoot(isDialog()).check(matches(isDisplayed()))
  }

  fun assertDeleteDialogNotVisible() {
    onView(withText(DELETE_DIALOG_TITLE)).check(doesNotExist())
  }

  fun confirmDelete() {
    onView(withText(DELETE_CONFIRM)).inRoot(isDialog()).perform(click())
  }

  fun cancelDelete() {
    onView(withText(DELETE_CANCEL)).inRoot(isDialog()).perform(click())
  }
}
