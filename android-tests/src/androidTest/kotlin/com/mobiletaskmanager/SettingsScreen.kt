package com.mobiletaskmanager

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.ViewInteraction
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withText

object SettingsScreen {

  fun waitForScreen(): ViewInteraction = waitForTestId(TestIds.settingsScreen)

  fun assertDisplayed() {
    waitForScreen().check(matches(isDisplayed()))
  }

  fun assertAccountName(name: String) {
    onView(withTestId(TestIds.settingsAccountName)).check(matches(withText(name)))
  }

  fun assertAccountEmail(email: String) {
    onView(withTestId(TestIds.settingsAccountEmail)).check(matches(withText(email)))
  }

  fun tapLogout() {
    onView(withTestId(TestIds.logoutButton)).perform(click())
  }
}
