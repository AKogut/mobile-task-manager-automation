package com.mobiletaskmanager

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.ViewInteraction
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.action.ViewActions.closeSoftKeyboard
import androidx.test.espresso.action.ViewActions.replaceText
import androidx.test.espresso.action.ViewActions.scrollTo
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.isSelected
import androidx.test.espresso.matcher.ViewMatchers.withText
import org.hamcrest.Matchers.not

object TaskFormScreen {

  fun waitForScreen(): ViewInteraction = waitForTestId(TestIds.taskFormScreen)

  fun assertDisplayed() {
    waitForScreen().check(matches(isDisplayed()))
  }

  fun setTitle(title: String) {
    onView(withTestId(TestIds.taskTitleInput))
        .perform(scrollTo(), replaceText(title), closeSoftKeyboard())
  }

  fun setDescription(description: String) {
    onView(withTestId(TestIds.taskDescriptionInput))
        .perform(scrollTo(), replaceText(description), closeSoftKeyboard())
  }

  fun selectPriority(priority: String) {
    onView(withTestId(TestIds.testIdForPriority(priority))).perform(scrollTo(), click())
  }

  fun selectQuickDate(option: String) {
    onView(withTestId(TestIds.testIdForDueDateOption(option))).perform(scrollTo(), click())
  }

  fun submit() {
    onView(withTestId(TestIds.taskSubmitButton)).perform(scrollTo(), click())
  }

  fun assertTitleValue(title: String) {
    onView(withTestId(TestIds.taskTitleInput)).check(matches(withText(title)))
  }

  fun assertDescriptionValue(description: String) {
    onView(withTestId(TestIds.taskDescriptionInput)).check(matches(withText(description)))
  }

  fun assertDueDateValue(dueDate: String) {
    waitForTestIdWithText(TestIds.taskDueDateInput, dueDate)
  }

  fun assertDueDateNotEmpty() {
    onView(withTestId(TestIds.taskDueDateInput)).check(matches(not(withText(""))))
  }

  fun assertPrioritySelected(priority: String) {
    onView(withTestId(TestIds.testIdForPriority(priority))).check(matches(isSelected()))
  }

  fun assertTitleErrorVisible(message: String? = null) {
    waitForTestId(TestIds.taskTitleError).check(matches(isDisplayed()))
    if (message != null) {
      onView(withTestId(TestIds.taskTitleError)).check(matches(withText(message)))
    }
  }

  fun assertDueDateErrorVisible(message: String? = null) {
    waitForTestId(TestIds.taskDueDateError).check(matches(isDisplayed()))
    if (message != null) {
      onView(withTestId(TestIds.taskDueDateError)).check(matches(withText(message)))
    }
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
