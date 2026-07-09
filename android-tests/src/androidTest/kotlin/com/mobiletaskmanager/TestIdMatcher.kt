package com.mobiletaskmanager

import android.view.View
import org.hamcrest.Description
import org.hamcrest.Matcher
import org.hamcrest.TypeSafeMatcher

fun withTestId(testId: String): Matcher<View> =
    object : TypeSafeMatcher<View>() {
      override fun matchesSafely(view: View): Boolean =
          view.getTag(com.facebook.react.R.id.react_test_id) == testId

      override fun describeTo(description: Description) {
        description.appendText("with React Native testID: $testId")
      }
    }
