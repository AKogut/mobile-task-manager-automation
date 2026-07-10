package com.mobiletaskmanager

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.ViewInteraction
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.action.ViewActions.closeSoftKeyboard
import androidx.test.espresso.action.ViewActions.replaceText
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withText
import org.hamcrest.Matchers.not

object TaskFormScreen {

  fun waitForScreen(): ViewInteraction = waitForTestId(TestIds.taskFormScreen)

  fun assertDisplayed() {
    waitForScreen().check(matches(isDisplayed()))
  }

  fun setTitle(title: String) {
    onView(withTestId(TestIds.taskTitleInput)).perform(replaceText(title), closeSoftKeyboard())
  }

  fun setDescription(description: String) {
    onView(withTestId(TestIds.taskDescriptionInput))
        .perform(replaceText(description), closeSoftKeyboard())
  }

  fun selectPriority(priority: String) {
    onView(withTestId(TestIds.testIdForPriority(priority))).perform(click())
  }

  fun selectQuickDate(option: String) {
    onView(withTestId(TestIds.testIdForDueDateOption(option))).perform(click())
  }

  fun submit() {
    onView(withTestId(TestIds.taskSubmitButton)).perform(click())
  }

  fun tapBack() {
    onView(withTestId(TestIds.taskFormBackButton)).perform(click())
  }

  fun assertTitleValue(title: String) {
    onView(withTestId(TestIds.taskTitleInput)).check(matches(withText(title)))
  }

  fun assertDescriptionValue(description: String) {
    onView(withTestId(TestIds.taskDescriptionInput)).check(matches(withText(description)))
  }

  fun assertDueDateNotEmpty() {
    onView(withTestId(TestIds.taskDueDateInput)).check(matches(not(withText(""))))
  }

  fun assertTitleErrorVisible() {
    waitForTestId(TestIds.taskTitleError).check(matches(isDisplayed()))
  }

  fun assertDueDateErrorVisible() {
    waitForTestId(TestIds.taskDueDateError).check(matches(isDisplayed()))
  }

  fun fillAndSubmit(
      title: String,
      description: String? = null,
      priority: String,
      quickDate: String,
  ) {
    waitForScreen()
    setTitle(title)
    if (description != null) {
      setDescription(description)
    }
    selectPriority(priority)
    selectQuickDate(quickDate)
    submit()
  }
}
