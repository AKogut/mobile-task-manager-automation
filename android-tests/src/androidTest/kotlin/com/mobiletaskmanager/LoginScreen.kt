package com.mobiletaskmanager

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.ViewInteraction
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.action.ViewActions.closeSoftKeyboard
import androidx.test.espresso.action.ViewActions.replaceText
import androidx.test.espresso.assertion.ViewAssertions.doesNotExist
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withText
import org.hamcrest.Matchers.containsString

object LoginScreen {

  fun waitForScreen(): ViewInteraction = waitForTestId(TestIds.loginScreen)

  fun login(email: String, password: String) {
    waitForScreen()
    typeEmail(email)
    typePassword(password)
    submit()
  }

  fun typeEmail(email: String) {
    onView(withTestId(TestIds.loginEmailInput)).perform(replaceText(email), closeSoftKeyboard())
  }

  fun typePassword(password: String) {
    onView(withTestId(TestIds.loginPasswordInput))
        .perform(replaceText(password), closeSoftKeyboard())
  }

  fun submit() {
    onView(withTestId(TestIds.loginSubmitButton)).perform(click())
  }

  fun assertDisplayed() {
    waitForScreen().check(matches(isDisplayed()))
  }

  fun assertEmailValue(email: String) {
    onView(withTestId(TestIds.loginEmailInput)).check(matches(withText(email)))
  }

  fun assertAuthErrorVisible(message: String? = null) {
    waitForTestId(TestIds.authErrorBanner).check(matches(isDisplayed()))
    if (message != null) {
      onView(withTestId(TestIds.authErrorMessage)).check(matches(withText(message)))
    }
  }

  fun assertAuthErrorNotVisible() {
    onView(withTestId(TestIds.authErrorBanner)).check(doesNotExist())
  }

  fun assertEmailErrorVisible() {
    waitForTestId(TestIds.loginEmailError).check(matches(isDisplayed()))
  }

  fun assertPasswordErrorVisible() {
    waitForTestId(TestIds.loginPasswordError).check(matches(isDisplayed()))
  }

  fun assertDemoCredentials() {
    waitForTestId(TestIds.demoCredentialsCard).check(matches(isDisplayed()))
    onView(withTestId(TestIds.demoCredentialsEmail))
        .check(matches(withText(containsString(DemoCredentials.EMAIL))))
    onView(withTestId(TestIds.demoCredentialsPassword))
        .check(matches(withText(containsString(DemoCredentials.PASSWORD))))
  }
}
