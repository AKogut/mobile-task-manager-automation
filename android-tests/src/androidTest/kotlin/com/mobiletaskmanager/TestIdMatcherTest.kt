package com.mobiletaskmanager

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.assertion.ViewAssertions.doesNotExist
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withContentDescription
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class TestIdMatcherTest {

  @Test
  fun resolvesReactNativeTestIdsOnTheLoginScreen() {
    launchAppForUiTest().use {
      waitForTestId(TestIds.loginScreen).check(matches(isDisplayed()))

      onView(withTestId(TestIds.loginEmailInput)).check(matches(isDisplayed()))
      onView(withTestId(TestIds.loginPasswordInput)).check(matches(isDisplayed()))
      onView(withTestId(TestIds.loginSubmitButton)).check(matches(isDisplayed()))
    }
  }

  @Test
  fun reactNativeTestIdsAreNotExposedAsContentDescriptions() {
    launchAppForUiTest().use {
      waitForTestId(TestIds.loginEmailInput)

      onView(withContentDescription(TestIds.loginEmailInput)).check(doesNotExist())
    }
  }
}
