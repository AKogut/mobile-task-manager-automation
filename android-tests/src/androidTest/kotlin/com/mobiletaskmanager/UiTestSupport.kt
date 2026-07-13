package com.mobiletaskmanager

import android.content.Intent
import android.view.View
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.PerformException
import androidx.test.espresso.UiController
import androidx.test.espresso.ViewAction
import androidx.test.espresso.ViewInteraction
import androidx.test.espresso.matcher.ViewMatchers.isRoot
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.espresso.util.HumanReadables
import androidx.test.espresso.util.TreeIterables
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.uiautomator.UiDevice
import java.util.concurrent.TimeoutException
import org.hamcrest.Matcher
import org.hamcrest.Matchers.allOf

const val UI_TEST_TIMEOUT_MILLIS = 60_000L

private const val POLL_INTERVAL_MILLIS = 100L

private const val EXTRA_UI_TEST = "uitest"
private const val EXTRA_UI_TEST_AUTHED = "uitest-authed"

fun launchAppForUiTest(): ActivityScenario<MainActivity> = launchApp(authenticated = false)

fun launchHomeForUiTest(): ActivityScenario<MainActivity> {
  val scenario = launchApp(authenticated = true)
  HomeScreen.waitForScreen()
  return scenario
}

private fun launchApp(authenticated: Boolean): ActivityScenario<MainActivity> {
  wakeDevice()

  val intent =
      Intent(ApplicationProvider.getApplicationContext(), MainActivity::class.java)
          .putExtra(EXTRA_UI_TEST, true)
  if (authenticated) {
    intent.putExtra(EXTRA_UI_TEST_AUTHED, true)
  }
  return ActivityScenario.launch(intent)
}

private fun wakeDevice() {
  val device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())
  if (!device.isScreenOn) {
    device.wakeUp()
  }
  device.executeShellCommand("wm dismiss-keyguard")
}

fun waitForTestId(
    testId: String,
    timeoutMillis: Long = UI_TEST_TIMEOUT_MILLIS,
): ViewInteraction {
  onView(isRoot()).perform(waitForMatch(withTestId(testId), timeoutMillis))
  return onView(withTestId(testId))
}

fun waitForTestIdWithText(
    testId: String,
    text: String,
    timeoutMillis: Long = UI_TEST_TIMEOUT_MILLIS,
): ViewInteraction = waitForTestIdMatching(testId, withText(text), timeoutMillis)

fun waitForTestIdMatching(
    testId: String,
    textMatcher: Matcher<View>,
    timeoutMillis: Long = UI_TEST_TIMEOUT_MILLIS,
): ViewInteraction {
  val target = allOf(withTestId(testId), textMatcher)
  onView(isRoot()).perform(waitForMatch(target, timeoutMillis))
  return onView(target)
}

fun waitForView(
    target: Matcher<View>,
    timeoutMillis: Long = UI_TEST_TIMEOUT_MILLIS,
): ViewInteraction {
  onView(isRoot()).perform(waitForMatch(target, timeoutMillis))
  return onView(target)
}

fun waitUntilGone(target: Matcher<View>, timeoutMillis: Long = UI_TEST_TIMEOUT_MILLIS) {
  onView(isRoot()).perform(waitForAbsence(target, timeoutMillis))
}

private fun waitForAbsence(target: Matcher<View>, timeoutMillis: Long): ViewAction =
    object : ViewAction {
      override fun getConstraints(): Matcher<View> = isRoot()

      override fun getDescription(): String = "wait up to $timeoutMillis ms until gone: $target"

      override fun perform(uiController: UiController, view: View) {
        uiController.loopMainThreadUntilIdle()
        val deadline = System.currentTimeMillis() + timeoutMillis

        do {
          val present = TreeIterables.breadthFirstViewTraversal(view).any { target.matches(it) }
          if (!present) {
            return
          }
          uiController.loopMainThreadForAtLeast(POLL_INTERVAL_MILLIS)
        } while (System.currentTimeMillis() < deadline)

        throw PerformException.Builder()
            .withActionDescription(description)
            .withViewDescription(HumanReadables.describe(view))
            .withCause(TimeoutException("Still present: $target"))
            .build()
      }
    }

private fun waitForMatch(target: Matcher<View>, timeoutMillis: Long): ViewAction =
    object : ViewAction {
      override fun getConstraints(): Matcher<View> = isRoot()

      override fun getDescription(): String = "wait up to $timeoutMillis ms for $target"

      override fun perform(uiController: UiController, view: View) {
        uiController.loopMainThreadUntilIdle()
        val deadline = System.currentTimeMillis() + timeoutMillis

        do {
          val found = TreeIterables.breadthFirstViewTraversal(view).any { target.matches(it) }
          if (found) {
            return
          }
          uiController.loopMainThreadForAtLeast(POLL_INTERVAL_MILLIS)
        } while (System.currentTimeMillis() < deadline)

        throw PerformException.Builder()
            .withActionDescription(description)
            .withViewDescription(HumanReadables.describe(view))
            .withCause(TimeoutException("Timed out waiting for $target"))
            .build()
      }
    }
